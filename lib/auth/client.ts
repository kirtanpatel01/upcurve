'use server'

import { createAuthClient } from "better-auth/react"
import { headers } from "next/headers"
import { auth } from ".";
export const authClient = createAuthClient()

export async function getUser() {
  const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return null;
    const { user } = session;
    return user;
}