'use client'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Avatar } from './ui/avatar'
import { ChevronUp, LogOut, UserRound } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { Button } from './ui/button'

export default function NavUser() {
  const { user, logout } = useAuth()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {!user ? (
          <Link href="/auth/login">
            <Button className="w-full">Login</Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className='py-7' asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='w-10 h-10 rounded-lg'>
                  <Image
                    src={user.avatar || './profile.svg'}
                    alt={user.name || "profile"}
                    width={64}
                    height={64}
                    className='rounded-full object-cover'
                    unoptimized
                  />
                  {/* <AvatarFallback>CN</AvatarFallback> */}
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.username || user.name}</span>
                </div>
                <ChevronUp className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-40'
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <Link href={`/profile/${user?.id}`}>
                  <DropdownMenuItem className='cursor-pointer'>
                    <UserRound />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <button onClick={logout} className='w-full'>
                  <DropdownMenuItem variant='destructive' className='cursor-pointer'>
                    <LogOut className='text-red-500' />
                    Logout
                  </DropdownMenuItem>
                </button>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
