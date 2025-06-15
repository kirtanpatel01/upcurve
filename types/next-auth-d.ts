// types/next-auth.d.ts or just next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { z } from "zod"

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

export interface UserProfile {
  $id: string | null
  username: string | null;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

export const profileFormSchema = z.object({
  username: z.string().toLowerCase(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
