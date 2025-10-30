"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/utils/supabase/client";
import { MailIcon, Send } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState<boolean | undefined>(true);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  type SubmitEvent =
    | React.FormEvent<HTMLFormElement>
    | React.MouseEvent<HTMLButtonElement>;

  interface SubmitHandler {
    (e: SubmitEvent): void;
  }

  const handleSubmit: SubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_WEB_URL}/auth/update-password`,
      });
      if (!error) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      setSuccess(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <Card className={`${success ? "max-w-xl" : "max-w-96"} w-full`}>
        <CardHeader>
          <CardTitle>{success ? "Success!" : "Reset Password"}</CardTitle>
          <CardDescription>
            {success
              ? "Successfully sent an email."
              : "Enter your email for which you want to change the password."}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          {success ? (
            <p className="flex flex-wrap justify-center items-center leading-10">
              A mail has sent to your entered email, please check and click on
              the{" "}
              <Badge variant={"outline"} className="mx-1.5">Reset Password</Badge>{" "}
              button. It&apos;ll redirect you to the{" "}
              <Badge variant={"outline"} className="mx-1.5">
                Update Password Page
              </Badge>
              .
            </p>
          ) : (
            <form onSubmit={(e) => handleSubmit(e)}>
              <FieldGroup>
                <Field>
                  <InputGroup>
                    <InputGroupInput
                      type="email"
                      placeholder="mail@site.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputGroupAddon>
                      <MailIcon />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <Button
                    type="submit"
                    disabled={!email}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Send</span>
                        <Send className="size-5" />
                      </div>
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
