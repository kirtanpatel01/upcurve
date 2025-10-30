"use client";

import Link from "next/link";
import React, { useActionState, useState } from "react";
import { signup } from "../actions";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const initialState = {
  error: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Page() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <Card className="max-w-96 w-full">
        <CardHeader>
          <CardTitle>Sign Up Page</CardTitle>
          <CardDescription>Start your journey!</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  defaultValue={state.name}
                />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="text"
                  placeholder="mail@site.com"
                  name="email"
                  defaultValue={state.email}
                />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    name="password"
                    defaultValue={state.confirmPassword}
                  />
                  <InputGroupAddon align={"inline-end"}>
                    <InputGroupButton
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                      size={"icon-xs"}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              <Field>
                <Button type="submit">
                  {isPending ? <Spinner /> : "Sign Up"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account ?
                  <Link href="/auth/login" className="ml-2">Login</Link>
                </FieldDescription>
              </Field>

              {state.error && (
                <p className={`text-red-500 text-sm mt-2`}>{state.error}</p>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
