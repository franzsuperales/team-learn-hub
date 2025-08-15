import prisma from "./prisma";

export const getResetTokenByEmail = async (email) => {
  try {
    const resetToken = await prisma.resetToken.findFirst({
      where: {
        identifier: email,
      },
    });
    return resetToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
