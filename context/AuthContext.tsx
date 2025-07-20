"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { account } from "@/lib/appwrite"
import axios from "axios"
import { AuthContexType, UserType } from "@/types/auth"
import { useRouter } from "next/navigation"

const AuthContext = createContext<AuthContexType>({
  user: null,
  loading: true,
  logout: async () => { },
  isLoggingOut: false,
  startLogin: async () => { },
  loadingMsg: "Validating...",
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState("Validating...")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  async function validateSession() {
    try {
      console.log("validating session....")
      const user = await account.get()
      console.log(user)
      const res = await axios.get(`/api/profile?userId=${user?.$id}`)
      let avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
      let profileId = ""
      let username = ""

      if (!res.data.exists) {
        const newProfile = await axios.post('/api/profile', {
          userId: user?.$id,
          email: user?.email,
          avatar,
          name: user?.name,
        })
        profileId = newProfile.data.userProfile?.$id
      } else {
        profileId = res.data.userProfile?.$id
        avatar = res.data.userProfile.avatar
        username = res.data.userProfile.username
      }

      const newUser = {
        id: user.$id,
        name: user.name,
        username,
        email: user.email,
        avatar,
        profileId,
      }

      localStorage.setItem("upcurve_user", JSON.stringify(newUser))
      setUser(newUser)
    } catch (err) {
      console.log("Session invalid or expired:", err)
      localStorage.removeItem("upcurve_user")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cachedUser = localStorage.getItem("upcurve_user")
    if(cachedUser) {
      setUser(JSON.parse(cachedUser))
      setLoading(false)
    } else {
      validateSession()
    }
  }, [])

  const logout = async () => {
  try {
    setLoadingMsg("Logging out...")
    setIsLoggingOut(true)
    await account.deleteSession("current")
    localStorage.removeItem("upcurve_user")
    setUser(null)

    // Wait for the context to fully reset before redirect
    setTimeout(() => {
      router.replace("/auth/login")
    }, 100) // small delay to allow state flush
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    setIsLoggingOut(false)
  }
}


  const startLogin = async () => {
    setLoadingMsg("Logging in...")
    await validateSession()
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoggingOut,
      loadingMsg,
      logout,
      startLogin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)