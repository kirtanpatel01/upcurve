"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  type SubmitEvent =
    | React.FormEvent<HTMLFormElement>
    | React.MouseEvent<HTMLButtonElement>;

  interface SubmitHandler {
    (e: SubmitEvent): void;
  }

  const handleSubmit: SubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      setError("Confirm password should be same as password!");
      return;
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    toast.success("Your password has been updated!")
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>
            Enter your new password, make sure it&apos;s not same as previous!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => handleSubmit(e)}>
            <FieldGroup>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    placeholder="abc@1234"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    placeholder="Re-enter password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              {error && (
                <span className="w-fit text-red-600 text-sm px-4 py-2 rounded-md bg-error/15 border border-error/50">
                  {error}
                </span>
              )}

              <Button type="submit" onClick={handleSubmit} className="cursor-pointer">
                {loading ? <Spinner /> : "Update"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
