import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma/prisma";
const bcrypt = require("bcryptjs"); // Use ES6 import for consistency

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        // Fetch user from the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Verify the user's credentials (password check)
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        }

        // Return null if user data is not found or password is invalid
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID || " ",
      clientSecret: process.env.GOOGLE_SECRET || " ",
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Ensure id from the database is passed here
        token.email = user.email;
        token.name = user.name; // Ensure name is passed here
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; // Use the id from the token
        session.user.email = token.email;
        session.user.name = token.name; // Pass name from token to session
      }
      console.log(session); // For debugging
      return session;
    },

    async signIn({ user, account }) {
      // Handle user creation and sign-in for Google provider
      if (!account) {
        return false;
      }
      if (account.provider === "google" && user?.email) {
        if (user) {
          // Check if user exists in the database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Generate a random password (not used for authentication)
            const randomPassword = Math.random().toString(36).slice(-8);

            // Create new user in the database
            const newUser = await prisma.user.create({
              data: {
                email: user.email || "",
                name: user.name || "New User",
                password: await bcrypt.hash(randomPassword, 10), // Hash the random password
              },
            });
            user.id = `${newUser.id}`; // Ensure the user object includes the database id
          } else {
            user.id = `${existingUser.id}`; // Use existing user's id
          }
        }
      }
      return true; // Return true to allow sign-in
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};
