import { v4 as uuid } from "uuid";
import prisma from "./prisma";
import { getResetTokenByEmail } from "./verify-token";
export const generateToken = async (email) => {
  const token = uuid();
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
  // const expiresAt = Date.now();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
      emailVerified: { not: null },
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  const existingToken = await getResetTokenByEmail(email);

  if (existingToken?.expires < Date.now()) {
    console.log("Existing token expired. Deleting...");
    await prisma.resetToken.delete({
      where: {
        token: existingToken.token,
      },
    });
  }

  await prisma.resetToken.create({
    data: {
      identifier: email,
      token: token,
      expires: new Date(expiresAt),
    },
  });

  console.log("Verification token generated:", token);

  return { token, expiresAt };
};
