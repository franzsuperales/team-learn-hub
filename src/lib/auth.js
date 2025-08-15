import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Nodemailer from "next-auth/providers/nodemailer";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 60 * 60, // 1 hour,
      pages: {
        error: "/auth/error", // Custom error page route
        verifyRequest: "/auth/verify-request", // Custom verify request page
      },
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // console.log("Credentials:", credentials);

        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user || !user.emailVerified) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials?.password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        // console.log("User:", user);
        return user;
      },
    }),
  ],
  callbacks: {
    // JWT callback: Runs when JWT is created (sign in) or updated (when session is accessed)
    // Used to add custom fields to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fname = user.fname;
        token.lname = user.lname;
        token.role = user.role;
        token.bio = user.bio;
      }
      return token;
    },
    // Session callback: Runs whenever a session is checked
    // Used to pass properties to the client-side session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.fname = token.fname;
      session.user.lname = token.lname;
      session.user.role = token.role;
      session.user.bio = token.bio;
      return session;
    },
  },
});
