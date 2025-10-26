"use client";

import Link from "next/link";
import React, { useActionState, useState } from "react";
import { login } from "../actions";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginBtn from "@/components/google-login-btn";

const initialState = { error: "", email: "", password: "" };

export default function Page() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="flex max-w-96 sm:max-w-lg w-full shadow-md shadow-accent-200/25 rounded-xl">
        <div className="bg-base-200/50 dark:bg-black w-full flex flex-col justify-center p-4 sm:p-8 md:p-20 rounded-xl">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-primary">Login Page</h1>
            <p className="opacity-75 text-sm">
              Login to upcurve and resume your journey!
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="flex flex-col mt-8">
            {/* Email Field */}
            <label className="floating-label mb-8">
              <span>Email</span>
              <input
                type="text"
                placeholder="mail@site.com"
                className="input input-md w-full"
                name="email"
                defaultValue={state.email}
              />
            </label>

            {/* Password Field */}
            <div className="relative">
              <label className="absolute left-1 -top-5 transition-all text-xs opacity-50">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                className="input input-md w-full pr-10"
                name="password"
                defaultValue={state.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                onMouseDown={(e) => e.preventDefault()}
                className="absolute top-2 right-3 cursor-pointer z-10"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Link href="/auth/reset-password" className="btn btn-link self-end">
                Forgot password ?
            </Link>

            {/* Submit Button */}
            <button
              className="btn btn-primary self-center mt-4 sm:mt-8"
              type="submit"
            >
              {isPending ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <span>Login</span>
              )}
            </button>

            {state.error && (
              <p className="text-red-500 text-sm mt-2">{state.error}</p>
            )}
          </form>

          <div className="divider"></div>

          <GoogleLoginBtn />

          <div className="flex flex-col sm:flex-row items-center justify-center mt-8">
            <p>Don&apos;t have an account ?</p>
            <Link href="/auth/signup">
              <button className="btn btn-link px-2">Create new account</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
