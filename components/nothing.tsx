"use client";

import { Button } from "@/components/ui/button";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default function Nothing() {
  return (
    <BackgroundBeamsWithCollision className="min-h-screen flex justify-center items-center p-4 sm:p-6">
      <ModeToggle />
      Nothing is here! Go to <Link href="/"><Button variant={"link"} className="cursor-pointer">Home</Button></Link>
    </BackgroundBeamsWithCollision>
  );
}
