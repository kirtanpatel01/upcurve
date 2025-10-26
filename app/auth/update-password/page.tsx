"use client";

import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const supabase = createClient();
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
      setSuccess(false);
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: confirmPassword,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      setSuccess(false);
      return;
    }

    setSuccess(true);
    router.push("/auth/login");
    console.log(data.user);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="bg-base-200 border border-base-300/25 shadow-md shadow-base-300/25 rounded-xl p-4 sm:p-12 flex flex-col justify-center">
        <h1>Update Password</h1>
        <p className="opacity-70 mt-2">
          Enter your new password, make sure it&apos;s not same as previous!
        </p>

        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-8 mt-4 sm:mt-12 rounded-lg"
        >
          <label className="input relative">
            <span className="text-xs opacity-50 absolute -top-5 left-1">
              Password
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="abc@1234"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              onMouseDown={(e) => e.preventDefault()}
              className="absolute top-2 right-3 cursor-pointer z-10"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </label>

          <label className="input relative">
            <span className="text-xs opacity-50 absolute -top-5 left-1">
              Confirm Password
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              onMouseDown={(e) => e.preventDefault()}
              className="absolute top-2 right-3 cursor-pointer z-10"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </label>

          {error && (
            <span className="w-fit text-red-600 text-sm px-4 py-2 rounded-md bg-error/15 border border-error/50">
              {error}
            </span>
          )}

          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary max-w-24"
          >
            <span className="font-semibold">
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <span>Update</span>
              )}
            </span>
          </button>
        </form>
      </div>

      {success && (
        <div className="toast">
          <div className="alert alert-info">
            <span>Your password has updated!</span>
          </div>
        </div>
      )}
    </div>
  );
}
