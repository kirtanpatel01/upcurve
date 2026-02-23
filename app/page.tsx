import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function page() {
  // TODO: For testing and demo purposes, isLoggedIn is set to false. Remove it later.
  const isLoggedIn = false;

  const features: { title: string; desc: string }[] = [
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
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center text-base-content transition-colors pt-16">
      <ModeToggle />
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-primary">
          Build Better Days with Upcurve
        </h1>
        <p className="mt-4 text-base-content/70 text-lg">
          Track habits, manage todos, and log your workouts — all in one smooth,
          responsive dashboard.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3 max-w-4xl w-full">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12">
        {isLoggedIn ? (
          <Link href="/todos">
            <Button className="cursor-pointer">Go to website</Button>
          </Link>
        ) : (
          <Link href="/auth/login">
            <Button className="cursor-pointer">Get Started</Button>
          </Link>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-base-content/60">
        © {new Date().getFullYear()} Upcurve. All rights reserved.
      </footer>
    </div>
  );
}
