// app/(root)/layout.tsx
import ClientProtectedLayout from "@/components/protected-route"
import AppSidebar from "@/components/app-sidebar"
import SiteHeader from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProtectedLayout>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing)*50)",
            "--header-height": "calc(var(--spacing)*12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ClientProtectedLayout>
  )
}
