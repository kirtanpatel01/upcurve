// context/AuthContext.tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import axios from "axios";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
        setUser(user)

        const res = await axios.get(`/api/profile?userId=${user?.$id}`)
        if(!res.data.exists) {
          await axios.post('/api/profile', {
            userId: user.$id,
            email: user.email,
            avatar: fallbackAvatar,
            name: user.name,
          })
          console.log('Profile created for google user')
        } else {
          console.log('Profile already exists')
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    // account.get()
    //   .then(setUser)
    //   .catch(() => setUser(null))
    //   .finally(() => setLoading(false));

    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


