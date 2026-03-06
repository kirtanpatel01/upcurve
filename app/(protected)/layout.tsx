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
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ReactQueryClientProvider>
  );
}

export default layout;
