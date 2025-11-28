import {
  Brain,
  ChartSpline,
  Dumbbell,
  // Home,
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
  SidebarMenuSkeleton,
} from "./ui/sidebar";
import { Suspense } from "react";
import { Spinner } from "./ui/spinner";
import SignoutBtn from "./signout-btn";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";

export default function AppSidebar() {
  const items = [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: Home,
    // },
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
      <SidebarHeader className="bg-secondary rounded-md mb-2">
        <SidebarMenu>
          <SidebarMenuItem className="w-full flex justify-center">
            <SidebarMenuButton asChild>
              <Link href={"/"}>
                <Image src={"/favicon.svg"} alt="logo" height={32} width={32} />
                <span className="text-base font-semibold">Upcurve</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="bg-secondary/60 rounded-md">
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="flex items-center">
                    <item.icon className="text-primary" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="bg-secondary/60 rounded-md">
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton variant={"outline"}>
                <ModeToggle asChild size={16} />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton variant={"outline"}>
                <SignoutBtn />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
