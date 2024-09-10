// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

// Extending the Session type to include userId and role
declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      /** The user's unique ID */
      id: string;
      /** The user's role */
      role?: string;
    } & DefaultSession["user"]; // Include default fields like `email`, `name`, etc.
  }

  interface User {
    name: string;
    /** The user's unique ID */
    id: string;
    /** The user's role */
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's unique ID */
    name: string;
    id: string;
    /** The user's role */
    role?: string;
  }
}
