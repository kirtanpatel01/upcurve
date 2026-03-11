import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";import GoogleAuth from "@/components/google-auth";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { CheckCircle2, Dumbbell, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function page() {
  const user = await getUser();
  const isLoggedIn = !!user;

  const features = [
    {
      title: "Todos",
      desc: "Clean, minimal task management.",
      icon: <CheckCircle2 size={18} />,
      color: "text-primary",
    },
    {
      title: "Habits",
      desc: "Build streaks and stay consistent.",
      icon: <Flame size={18} />,
      color: "text-orange-500",
    },
    {
      title: "Exercise",
      desc: "Log workouts and track progress.",
      icon: <Dumbbell size={18} />,
      color: "text-blue-500",
    },
  ];

  return (
    <BackgroundBeamsWithCollision className="min-h-screen flex flex-col items-center justify-center p-4">
        <ModeToggle />
      <div className="max-w-3xl w-full space-y-12 text-center z-10">
        <header className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
            Upcurve
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Personal growth and productivity, unified. Habit tracking, tasks, and fitness in one minimal interface.
          </p>
        </header>

        <div className="flex flex-col items-center justify-center gap-6">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="lg" className="cursor-pointer">
                Dashboard
              </Button>
            </Link>
          ) : (
            <div className="space-y-4">
              <GoogleAuth />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center text-center p-5 bg-card border border-border/50 rounded-2xl transition-all hover:bg-muted/10 hover:border-border"
            >
              <div className={cn(
                "p-2.5 rounded-xl bg-muted/50 mb-4 transition-colors group-hover:bg-muted",
                feature.color
              )}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">{feature.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed px-2">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
