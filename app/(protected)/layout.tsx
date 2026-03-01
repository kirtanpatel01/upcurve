import React from "react";
import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import ReactQueryClientProvider from "@/components/query-client-provider";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ReactQueryClientProvider>
  );
}

export default layout;
