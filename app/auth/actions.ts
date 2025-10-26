'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(state: { error: string, email: string , password: string}, formData: FormData) {
  const supabase = await createClient()
  console.log(formData)

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  console.log(error)

  if (error) {
    return { error: error.message, email: data.email, password: data.password }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(state: { error: string, name: string, email: string, password: string, confirmPassword: string }, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get("confirmPassword") as string;

  if(confirmPassword !== password) {
    return { error: "Confirm password should be same!", name, email, password, confirmPassword }
  }

  const { error } = await supabase.auth.signUp({
    email, 
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_WEB_URL}/auth/login`
    }
  })

  if (error) {
    return { error: error.message, name, email, password, confirmPassword }
  }

  revalidatePath('/', 'layout')
  redirect('/auth/confirm-email')
}