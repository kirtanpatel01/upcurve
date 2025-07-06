// context/AuthContext.tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import axios from "axios";

interface UserType {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  profileId: string;
}

interface AuthContexType {
  user: UserType | null;
  setUser: (user: any) => void;
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContexType>({
  user: null,
  setUser: () => { },
  loading: true,
  logout: async () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedUser = localStorage.getItem("upcurve_user")
    if (cachedUser) {
      setUser(JSON.parse(cachedUser))
      setLoading(false)
    }
    const getUser = async () => {
      try {
        const user = await account.get()
        let avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

        let profileId = "";
        let username = "";
        const res = await axios.get(`/api/profile?userId=${user?.$id}`)
        if (!res.data.exists) {
          const newProfile = await axios.post('/api/profile', {
            userId: user.$id,
            email: user.email,
            avatar: avatar,
            name: user.name,
          })
          profileId = newProfile.data.userProfile.$id
        } else {
          profileId = res.data.userProfile.$id
          avatar = res.data.userProfile.avatar
          username = res.data.userProfile.username
        }

        const newUser = {
          id: user.$id,
          name: user.name,
          username,
          email: user.email,
          avatar: avatar,
          profileId: profileId
        }

        localStorage.setItem("upcurve_user", JSON.stringify(newUser))
        setUser(newUser)

      } catch (error) {
        console.error("Auth check failed: ", error)
        localStorage.removeItem('upcurve_user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser();
  }, []);

  const logout = async () => {
    setLoading(true)
    await account.deleteSession("current")
    localStorage.removeItem("upcurve_user")
    setUser(null)
    setLoading(false)
    // window.location.href = "/auth/login" // or use next/router
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


