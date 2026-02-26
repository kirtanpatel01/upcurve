'use client'

import {
  Brain,
  ChartSpline,
  Dumbbell,
  Home,
  ListTodo,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function AppSidebar() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/')
          }
        }
      })
      toast.success("Successfully logout.");
    } catch (error) {
      console.error(error)
      toast.error("Failed to logout.");
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Todos",
      url: "/todos",
      icon: ListTodo,
    },
    {
      title: "Habits",
      url: "/habits",
      icon: Brain,
    },
    {
      title: "Exercise",
      url: "/exercise",
      icon: Dumbbell,
    },
  ];

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/"}>
              <SidebarMenuButton className="cursor-pointer">
                <ChartSpline className="text-primary" />
                <span className="text-base font-bold">Upcurve</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="flex items-center">
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="cursor-pointer">
                <ModeToggle asChild />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleLogout}
                className="bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive cursor-pointer">
                {loading ? <Spinner /> : (
                  <span className="flex justify-start items-center gap-2">
                    <LogOut size={16} />
                    Logout
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
