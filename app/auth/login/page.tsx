"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Image from "next/image"
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"
import SubmitBtn from "@/components/submit-btn"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { account } from "@/lib/appwrite"
import { OAuthProvider } from "appwrite"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(16),
})

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: '',
    },
  })

  const handleGoogleLogin = async () => {
    console.log(account)
    account.createOAuth2Session(
      OAuthProvider.Google,
      "http://localhost:3000",           // success URL
      "http://localhost:3000/auth/login" // failure URL
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('email', values.email)
    formData.append('password', values.password);

    try {
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const res = await axios.post('/api/auth/login', {
        email: values.email,
        password: values.password,
      });
      console.log(res)
      if (res.status === 200) {
        console.log(res.data.message)
        toast.success(res.data.message);
        router.push('/')
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Server responded with an error");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <Breadcrumb className="absolute top-4 left-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Login</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="max-w-96 w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Login Page</CardTitle>
          <CardDescription>Heyy, welcome to the my world!</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full m-0">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Link href={'/auth/login/forgot-password'}>
                <Button
                  type="button"
                  variant='link'
                  className="flex place-self-end cursor-pointer px-1 mb-4">
                  Forgot password ?
                </Button>
              </Link>

              <SubmitBtn isLoading={isLoading} text="Login" loadingText="Loggin in..." />
            </form>
          </Form>

          <div className="text-center text-sm my-4">
            Don&apos;t have an account ?{" "}
            <Link className="underline underline-offset-2 text-primary" href={'/auth/register'}>Register</Link>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-4">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          <Button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full border border-border bg-background text-foreground  cursor-pointer hover:bg-background"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Redirecting...
              </>
            ) : (
              <>
                <Image
                  src={'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg'}
                  alt="google-logo"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                Login with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}