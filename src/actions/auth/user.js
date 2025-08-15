"use server";
import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/token";
import { getResetTokenByEmail } from "@/lib/verify-token";
import { sendEmail } from "@/app/services/forgotPasswordMailer";
import bcrypt from "bcryptjs";

const registerUser = async (formdata) => {
  try {
    // Validate form data
    const fname = formdata.get("fname");
    const lname = formdata.get("lname");
    const email = formdata.get("email");
    const password = formdata.get("password");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email is already verified
    const userVerify = await prisma.verificationToken.findFirst({
      where: { identifier: email },
    });

    if (userVerify && userVerify.expires > new Date()) {
      console.log("Please verify your email");
      return { error: "Please verify your email" };
    } else if (userVerify) {
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });
      return { success: "Token expired" };
    }

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (userExists?.emailVerified) {
      return { error: "User already exists" };
    }

    // Delete existing unverified user if exists
    if (userExists) {
      await prisma.user.deleteMany({
        where: { email: email },
      });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        fname: fname,
        lname: lname,
        email: email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return { error: "Failed to create user" };
    }

    // Generate verification token
    // const verificationToken = await generateToken(email);
    // await nodemail(email, verificationToken.token);

    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "An error occurred during registration",
    };
  }
};

const resetPassword = async (formData) => {
  const email = formData.get("email");

  const { token } = await generateToken(email);

  if (!token) {
    return {
      error: "User not found",
    };
  }

  const resetToken = await getResetTokenByEmail(email);

  console.log(resetToken);

  await sendEmail(resetToken.identifier, "Password Reset", token);

  return {
    success: "Password reset token generated successfully",
  };
};

const updatePassword = async (formData) => {
  try {
    console.log(formData);

    const password = formData.get("password");
    const token = formData.get("token");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("hashed Password", hashedPassword);

    const resetToken = await prisma.resetToken.findFirst({
      where: { token: token },
    });

    if (!resetToken) {
      return {
        error: "Invalid token",
      };
    }

    if (resetToken.expires > Date.now()) {
      await prisma.user.update({
        where: { email: resetToken.identifier },
        data: { password: hashedPassword },
      });

      await prisma.resetToken.delete({
        where: { token: token },
      });
      return {
        success: "Password updated successfully",
      };
    } else {
      return {
        error: "Token expired",
      };
    }
  } catch (error) {
    console.error("Update password error:", error);
    return {
      error: "An error occurred while updating the password",
    };
  }
};

export { registerUser, resetPassword, updatePassword };
