import React from 'react'
import { Session } from 'next-auth'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from './ui/sidebar'
import { ListTodo, Dumbbell, ChartSpline } from 'lucide-react'
import Link from 'next/link'
import NavUser from './nav-user'
import { Button } from './ui/button'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    session: Session | null
}

export default function AppSidebar(
    { session, ...props }: AppSidebarProps) {
    const items = [
        // { to: "/dashboard", title: 'Dashboard' },
        { url: "/habits", title: 'Habits', icon: ListTodo },
        { url: "/exercise", title: 'Exercise', icon: Dumbbell },
    ]

    return (
        <Sidebar collapsible='offcanvas' {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <Link href="/">
                                <ChartSpline className="!size-5" />
                                <span className="text-base font-semibold">Upcurve</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} >
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {
                    session
                    ? <NavUser />
                    : <Link href={'/auth/login'}><Button className='w-full cursor-pointer'>Login</Button></Link> 
                }

            </SidebarFooter>
        </Sidebar>
    )
}