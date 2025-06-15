'use client'

import React, { useEffect, useState } from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar } from './ui/avatar'
import { ChevronUp, LogOut, UserRound } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { account } from '@/lib/appwrite'
import { Button } from './ui/button'
import { NavUserSkeleton } from './skeletons/nav-user-skeleton'
import axios from 'axios'
import { toast } from 'sonner'

export default function NavUser() {
  const { user, loading } = useAuth()
  const fullName = user?.name
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=random`
  const [url, setUrl] = useState(fallbackAvatar)

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await axios.get(`/api/profile?userId=${user?.$id}`)
        if (!res.data.userProfile) {
          toast.error('Profile not found for given user ID')
        } else {
          setUrl(res.data.userProfile.avatar)
        }
      } catch (error) {
        console.log("Error while fetching user profile: ", error)
      }
    }

    if (user) getUserProfile()
  }, [user])

  if (loading) return <NavUserSkeleton />

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {!user ? (
          <Link href="/auth/login">
            <Button className="w-full">Login</Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='w-8 h-8 rounded-lg'>
                  <Image
                    src={url || '/profile.svg'}
                    alt={fullName || "profile"}
                    width={64}
                    height={64}
                    className='rounded-full object-cover'
                  />
                  {/* <AvatarFallback>CN</AvatarFallback> */}
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{fullName || "User"}</span>
                </div>
                <ChevronUp className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-40'
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <Link href={`/profile/${user?.$id}`}>
                  <DropdownMenuItem className='cursor-pointer'>
                    <UserRound />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <form onSubmit={async () => await account.deleteSession('current')}>
                  <button type="submit" className='w-full'>
                    <DropdownMenuItem variant='destructive' className='cursor-pointer'>
                      <LogOut className='text-red-500' />
                      Logout
                    </DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
