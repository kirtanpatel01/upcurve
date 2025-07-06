'use client'

import { Form, FormField } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import axios from "axios"
import { useEffect } from "react"
import AvatarUploader from "./avatar-uploader"
import { UserProfile } from "@/types/next-auth-d"
import { useAuth } from "@/context/AuthContext"

const formSchema = z.object({
  username: z.string().toLowerCase(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
})

const fields: { name: 'name' | 'username' | 'email'; placeholder: string }[] = [
  { name: 'name', placeholder: 'Enter your name' },
  { name: 'username', placeholder: 'Choose unique username' },
  { name: 'email', placeholder: 'Enter your email' },
]

function ProfileForm({
  isAuthenticated,
  userProfile,
  setUserProfile,
}: {
  isAuthenticated: boolean,
  userProfile: UserProfile,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}) {
  const { user } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      name: '',
      email: '',
      avatar: '',
    }
  })

  useEffect(() => {
    if (userProfile) {
      form.reset({
        username: userProfile.username || '',
        name: userProfile.name || '',
        email: userProfile.email || '',
        avatar: userProfile.avatar || '',
      })
    }
  }, [userProfile, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios.put(`/api/profile/${user?.profileId}`, values)
      if (res.status === 200) {
        toast.success("Profile updated successfully!")
        setUserProfile(res.data.updatedProfile)
      } else {
        toast.error("Failed to update profile.")
      }
    } catch (err) {
      console.error("Update error:", err)
      toast.error("Something went wrong while updating profile.")
    }
  }

  return (
    <Card className='w-full sm:w-fit'>
      <CardHeader>
        <CardTitle>{isAuthenticated ? "Your" : ""} Profile Info:</CardTitle>
        <CardDescription>You {isAuthenticated ? "can" : "can't"} change the profile info.</CardDescription>
      </CardHeader>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <CardContent className='flex flex-col sm:flex-row sm:items-center gap-6'>
            <div className='min-w-72 space-y-6'>
              {fields.map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <Input {...field} disabled={!isAuthenticated} placeholder={item.placeholder} />
                  )}
                />
              ))}
            </div>
            <AvatarUploader form={form} isAuthenticated={isAuthenticated} />
          </CardContent>
          {isAuthenticated && (
            <CardFooter className='flex flex-col items-center justify-center gap-6'>
              <Separator />
              <Button type='submit'>Update</Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  )
}

export default ProfileForm
