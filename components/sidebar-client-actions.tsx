'use client'

import {
  SidebarMenuButton,
} from "./ui/sidebar";
import { ModeToggle } from "./mode-toggle";

function SidebarClientActions() {
  return (
    <SidebarMenuButton variant={"outline"}>
      <ModeToggle asChild size={16} />
    </SidebarMenuButton>
  );
}

export default SidebarClientActions;
