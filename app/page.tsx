import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";import GoogleAuth from "@/components/google-auth";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default async function page() {
  const user = await getUser();
  const isLoggedIn = !!user;

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
    <BackgroundBeamsWithCollision className="min-h-screen flex flex-col items-center justify-center p-4">
      <ModeToggle />
      <div className="space-y-8 text-center">
        <header className="space-y-4">
          <h1 className="text-5xl font-bold text-primary">
            Upcurve
          </h1>
          <p className="text-muted-foreground text-lg">
            Track habits, manage todos, and log your workouts — all in one!
          </p>
        </header>

        {isLoggedIn ? (
          <Link href="/dashboard">
            <Button className="cursor-pointer">Dashboard</Button>
          </Link>
        ) : (
          <GoogleAuth />
        )}
      </div>
    </BackgroundBeamsWithCollision>
  );
}
