import { ModeToggle } from "@/components/mode-toggle";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ModeToggle />
      {children}
    </div>
  );
}

export default layout;
