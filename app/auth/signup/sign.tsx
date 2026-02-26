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
  FieldError,
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
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      callbackURL: "/dashboard"
    }, {
      onSuccess: () => {
        toast.success("User registered successfully!")
        router.push("/dashboard");
      },
      onError: (error) => {
        console.error(error)
        toast.error(error.error.message)
      }
    })
  };

  const handleGoogleLogin = () => {
    toast.info("Google auth login clicked!");
  }
  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <Card className="max-w-96 w-full">
        <CardHeader>
          <CardTitle>Sign Up Page</CardTitle>
          <CardDescription>Start your journey!</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} id="signup-form">
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="John Doe"
                      aria-invalid={invalid}
                    />
                    {invalid && <FieldError errors={[error]} />}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="mail@site.com"
                      aria-invalid={invalid}
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
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        aria-invalid={invalid}
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

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        aria-invalid={invalid}
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <InputGroupButton
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          onMouseDown={(e) => e.preventDefault()}
                          size={"icon-xs"}
                          className="cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {invalid && <FieldError errors={[error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Field orientation={"horizontal"}>
            <Button type="button" variant={"outline"} onClick={() => form.reset()} className="cursor-pointer">
              Reset
            </Button>
            <Button type="submit" form="signup-form" disabled={form.formState.isSubmitting} className="cursor-pointer">
              {form.formState.isSubmitting ? <Spinner /> : "Sign Up"}
            </Button>
          </Field>

          <Separator className="my-4" />

          <span className="text-sm">
            Already have an account ?
            <Link href="/auth/login">
              <Button variant={"link"} className="cursor-pointer">Login</Button>
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
