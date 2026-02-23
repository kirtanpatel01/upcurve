"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: FormValues) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
    })
  };

  const handleGoogleLogin = () => {
    toast.info("Google auth login clicked!")
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <Card className="w-full max-w-96">
        <CardHeader>
          <CardTitle>Login Page</CardTitle>
          <CardDescription>
            Login to upcurve and resume your journey!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} id="login-form">
            <FieldGroup>
              <Button
                type="button"
                variant={"outline"}
                className="cursor-pointer"
                onClick={handleGoogleLogin}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or Continue with
              </FieldSeparator>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="mail@site.com"
                    />
                    {invalid && <FieldError errors={[error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type={showPassword ? "text" : "password"}
                        id={field.name}
                        placeholder="Enter Password"
                        name={field.name}
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <InputGroupButton
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(e) => e.preventDefault()}
                          size={"icon-xs"}
                          className="cursor-pointer"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {invalid && <FieldError errors={[error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <Link href="/auth/reset-password">
              <div className="w-full text-xs text-right underline-offset-4 hover:underline mt-2 hover:text-primary transition-color duration-300">Forgot password ?</div>
            </Link>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Field orientation={"horizontal"}>
            <Button type="button" variant={"outline"} className="cursor-pointer" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={form.formState.isSubmitting} form="login-form">
              {form.formState.isSubmitting ? <Spinner /> : "Login"}
            </Button>
          </Field>

          <Separator />

          <span className="text-center">
            Don&apos;t have an account ?
            <Link href="/auth/signup">
              <Button type="button" variant="link" className="cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
