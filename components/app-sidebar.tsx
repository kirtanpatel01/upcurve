import {
  Brain,
  ChartSpline,
  Dumbbell,
  // Home,
  ListTodo,
  Notebook,
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
import SidebarClientActions from "./sidebar-client-actions";
import { Suspense } from "react";
import { Spinner } from "./ui/spinner";
import SignoutBtn from "./signout-btn";
import { ModeToggle } from "./mode-toggle";

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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"}>
                <ChartSpline />
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
                <Suspense fallback={<Spinner />}>
                  <SignoutBtn />
                </Suspense>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
