'use client'

import { useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { UserProfile } from '@/types/next-auth-d'
import { toast } from 'sonner'
import ProfileForm from '@/components/profile/profile-form'

function Page() {
  const params = useParams()
  const userId = params?.id as string
  const { user, loading } = useAuth()

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    if (!loading && user) {
      setIsAuthenticated(userId === user.$id)
    }
  }, [userId, user, loading])

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await axios.get(`/api/profile?userId=${userId}`)
        if (!res.data.userProfile) {
          toast.error('Profile not found for given user ID')
        } else {
          setUserProfile(res.data.userProfile)
        }
      } catch (error) {
        console.log("Error while fetching user profile: ", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) getUserProfile()
  }, [userId])

  if (isLoading || loading) return <div>Loading...</div>

  return (
    <>
      {userProfile && (
        <ProfileForm
          isAuthenticated={!!isAuthenticated}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />
      )}
    </>
  )
}

export default Page
