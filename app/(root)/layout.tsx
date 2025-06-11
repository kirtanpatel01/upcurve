import { auth } from "@/auth";
import AppSidebar from "@/components/app-sidebar";
import SiteHeader from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { SessionProvider } from "next-auth/react"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    return (
        <SessionProvider>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing)*50)",
                        "--header-height": "calc(var(--spacing)*12)"
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant='inset' session={session} />
                <SidebarInset>
                    <SiteHeader />
                    <main className="flex p-4 sm:p-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </SessionProvider>
    );
}