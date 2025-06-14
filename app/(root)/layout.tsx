import AppSidebar from "@/components/app-sidebar";
import SiteHeader from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing)*50)",
                        "--header-height": "calc(var(--spacing)*12)"
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant='inset' />
                <SidebarInset>
                    <SiteHeader />
                    <main className="flex p-4 sm:p-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    );
}