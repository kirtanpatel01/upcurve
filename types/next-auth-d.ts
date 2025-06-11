// types/next-auth.d.ts or just next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
    } & DefaultSession["user"]
  }

  interface User {
    id?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
}

export interface Habit {
  $id: string;
  title: string;
  isCompleted: boolean;
};

export interface FormSchema {
  items: string[];
};

