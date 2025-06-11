// lib/actinos.ts

"use server"

import { signIn } from "@/auth"

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: '/habits?loggedIn=google' });
}

export async function loginAction(formData: FormData) {
  try {
    await signIn('credentials', formData);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === 'NEXT_REDIRECT') {
        return { success: true };
      }
      return { error: err.message || 'Login failed' };
    }

    return { error: 'Login failed due to an unknown error' };
  }
}
