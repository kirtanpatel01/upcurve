"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

// const formSchema = z.object({
//   email: z.email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters long"),
// })

// type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  // const [showPassword, setShowPassword] = useState(false);
  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);

  // const form = useForm<FormValues>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   },
  // })

  // const onSubmit = async (values: FormValues) => {
  //   await authClient.signIn.email({
  //     email: values.email,
  //     password: values.password,
  //     callbackURL: "/dashboard",
  //   }, {
  //     onSuccess: () => {
  //       toast.success("User logged in successfully!");
  //     },
  //     onError: (error) => {
  //       console.error(error)
  //       toast.error(error.error.message)
  //     }
  //   })
  // };

  const handleGoogleLogin = async () => {
    try {
      setGoogleSignInLoading(true)
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/auth/login",
      }, {
        onSuccess: () => {
          // toast.success("User logged in successfully!");
        },
        onError: (error) => {
          console.error(error)
          toast.error(error.error.message)
        }
      })
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!")
    } finally {
      setGoogleSignInLoading(false)
    }
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
              <Button
                type="button"
                variant={"outline"}
                className="cursor-pointer"
                disabled={googleSignInLoading}
                onClick={handleGoogleLogin}
              >
                {googleSignInLoading ? <Spinner /> : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </>
                )}
              </Button>
          {/* <form onSubmit={form.handleSubmit(onSubmit)} id="login-form">
            <FieldGroup>
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
          </form> */}
        </CardContent>
        {/* <CardFooter className="flex flex-col gap-4">
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
        </CardFooter> */}
      </Card>
    </div>
  );
}
