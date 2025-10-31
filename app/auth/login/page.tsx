"use client";

import Link from "next/link";
import React, { useActionState, useState } from "react";
import { login } from "../actions";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const initialState = { error: "", email: "", password: "" };

export default function Page() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const redirectTo = `${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000"}/dashboard`;

  const supabase = createClient();
  const handleSumbit = async () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo
      }
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <Card className="w-full max-w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login Page</CardTitle>
          <CardDescription>
            Login to upcurve and resume your journey!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={handleSumbit}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or Continue with
              </FieldSeparator>
              <Field className="flex">
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="text"
                  placeholder="mail@site.com"
                  name="email"
                  defaultValue={state.email}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/auth/reset-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot password ?
                  </Link>
                </div>
                <InputGroup>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter Password"
                    name="password"
                    defaultValue={state.password}
                  />
                  <InputGroupAddon align={"inline-end"}>
                    <InputGroupButton
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                      size={"icon-xs"}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type="submit">
                  {isPending ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    <span>Login</span>
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account ?{" "}
                  <Link href="/auth/signup">Sign Up</Link>
                </FieldDescription>
              </Field>
              {state.error && (
                <p className="text-red-500 text-sm mt-2">{state.error}</p>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
