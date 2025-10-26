"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(user) {
        setIsLoggedIn(true)
        console.log(user)
      }
    }
    getUser();
  }, [])

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center px-6 text-center text-base-content transition-colors pt-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Build Better Days with Upcurve
        </h1>
        <p className="mt-4 text-base-content/70 text-lg">
          Track habits, manage todos, and log your workouts — all in one smooth, responsive dashboard.
        </p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-12 grid gap-6 sm:grid-cols-3 max-w-4xl w-full"
      >
        {[
          {
            title: "Habits",
            desc: "Create daily routines and stay consistent with visual streaks.",
          },
          {
            title: "Todos",
            desc: "Keep track of your day-to-day tasks with a clean, minimal interface.",
          },
          {
            title: "Exercise",
            desc: "Set targets for sets and reps, and log your progress each day.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl bg-base-200 border border-base-300 p-6 shadow-sm hover:shadow-md hover:bg-base-300/40 transition-all duration-200"
          >
            <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
            <p className="mt-2 text-sm text-base-content/70">{feature.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12"
      >
        {isLoggedIn ? (
          <Link href="/dashboard">
            <button className="btn btn-primary px-8 text-white">
              Go to Dashboard
            </button>
          </Link>
        ) : (
          <Link href="/auth/login">
            <button className="btn btn-primary px-8 text-white">
              Get Started
            </button>
          </Link>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-base-content/60">
        © {new Date().getFullYear()} Upcurve. All rights reserved.
      </footer>
    </div>
  );
}
