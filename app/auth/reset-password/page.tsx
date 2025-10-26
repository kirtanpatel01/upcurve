"use client";

import { createClient } from "@/utils/supabase/client";
import { Send } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
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
      <div className="bg-base-200 border border-base-300/25 shadow-md shadow-base-300/25 rounded-xl p-4 sm:p-12 flex flex-col justify-center">
        {success ? (
          <>
            <p className="max-w-xl flex flex-wrap items-center justify-center leading-10">
              A mail has sent to your entered email, please check and click on
              the
              <span className="mx-2 px-3 py-2 text-sm tracking-wider font-medium rounded-full border border-secondary/10 bg-yellow-300/5 flex w-fit">
                Reset Password
              </span>
              button. It&apos;ll redirect you to the{" "}
              <span className="font-medium text-accent ml-2">
                &apos;Update Password Page&apos;
              </span>
              .
            </p>
          </>
        ) : (
          <>
            <h1>Reset Password</h1>
            <p className="opacity-70 mt-2">
              Enter your email for which you want to change the password.
            </p>

            <form
              onSubmit={(e) => handleSubmit(e)}
              className="w-full max-w-72 flex flex-col mt-4 sm:mt-8 rounded-lg"
            >
              <label className="input validator">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  type="email"
                  placeholder="mail@site.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>

              <button
                type="submit"
                disabled={!email}
                onClick={handleSubmit}
                className="btn btn-primary mt-4 max-w-24"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Send</span>
                    <Send className="size-5" />
                  </div>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
