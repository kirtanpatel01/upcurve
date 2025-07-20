"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { account } from "@/lib/appwrite"
import axios from "axios"
import { AuthContexType, UserType } from "@/types/auth"

const AuthContext = createContext<AuthContexType>({
  user: null,
  loading: true,
  logout: async () => { },
  isLoggingOut: false,
  startLogin: () => { },
  loadingMsg: "Validating...",
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState("Validating...")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const validateSession = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    validateSession()
  }, [validateSession])

  const logout = async () => {
    try {
      setLoadingMsg("Logging out...")
      setIsLoggingOut(true)
      await account.deleteSession("current")
      localStorage.removeItem("upcurve_user")
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const startLogin = () => {
    validateSession()
    setLoadingMsg("Logging in...")
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