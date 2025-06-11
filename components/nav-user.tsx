import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { ChevronUp, LogOut, UserRound } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '@/auth'
import { auth } from '@/auth'
import Image from 'next/image'

export default async function NavUser() {
    const session = await auth();
    const username = session?.user?.name;
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                        >
                            <Avatar className='w-8 h-8 rounded-lg'>
                                <Image
                                    src={session?.user?.image || '/profile.svg'}
                                    alt={username || "profile"}
                                    width={64}
                                    height={64}
                                    className='rounded-full' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='grid flex-1 text-left text-sm leading-tight'>
                                <span className='truncate font-medium'>{username || "User"}</span>
                            </div>
                            <ChevronUp className='ml-auto size-4' />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-(--radix-dropdown-menu-trigger-width) min-w-40'
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <Link href='/profile'>
                                <DropdownMenuItem className='cursor-pointer'>
                                    <UserRound />
                                    Profile
                                </DropdownMenuItem>
                            </Link>
                            <form
                                action={async () => {
                                    "use server"
                                    await signOut()
                                }}
                            >
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
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
