"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"

export default function ClientProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isLoggingOut, loadingMsg } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user && !isLoggingOut) {
      router.replace("/auth/login")
    }
  }, [loading, user, isLoggingOut, router])

  console.log(loading, user)

  if (loading || isLoggingOut || !user) {
    const message = loadingMsg || "Loading..."
    return (
      <div className="h-screen w-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        {message}
      </div>
    )
  }

  return <>{children}</>
}