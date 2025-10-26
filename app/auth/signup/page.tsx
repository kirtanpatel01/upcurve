"use client";

import Link from "next/link";
import React, { useActionState, useState } from "react";
import { signup } from "../actions";
import { Eye, EyeOff } from "lucide-react";

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
      <div className="flex max-w-96 sm:max-w-xl w-full shadow-md shadow-accent-200/25 rounded-xl">
        <div className="bg-base-200/50 dark:bg-base-300 w-full flex flex-col justify-center gap-6 sm:gap-8 p-4 sm:p-8 md:p-20 rounded-xl">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-primary">Sign Up Page</h1>
            <p className="opacity-75 text-sm">Start your journey!</p>
          </div> 

          {/* Form */}
          <form action={formAction} className="flex flex-col gap-6 sm:gap-8">

            {/* Name Field */}
            <label className="floating-label">
              <span>Name</span>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-md w-full"
                name="name"
                defaultValue={state.name}
              />
            </label>

            {/* Email Field */}
            <label className="floating-label">
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

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="absolute left-1 -top-5 transition-all text-xs opacity-50">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder=""
                className="input input-md w-full pr-10"
                name="password"
                defaultValue={state.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                onMouseDown={(e) => e.preventDefault()}
                className="absolute top-2 right-3 cursor-pointer z-10"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button className="btn btn-primary self-center" type="submit">
              {isPending ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <span>Sign Up</span>
              )}
            </button>

            {state.error && (
              <p className={`text-red-500 text-sm mt-2`}>{state.error}</p>
            )}
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center">
            <p>Already have an account ?</p>
            <Link href="/auth/login">
              <button className="btn btn-link px-2">Login</button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
