'use client'

import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'
import { ModeToggle } from './mode-toggle'
import { usePathname } from 'next/navigation'

function SiteHeader() {
    const pathname = usePathname();
    const path = pathname.split('/')[1];
    const name = path.charAt(0).toUpperCase() + path.slice(1);
    return (
        <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width, height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
            <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
                <SidebarTrigger className='-ml-1' />
                <Separator
                    orientation='vertical'
                    className='mx-2 data-[orientation=vertical]:h-5' />
                <h1 className='text-base font-medium'>{name}</h1>
                <div className='ml-auto flex items-center gap-2'>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}

export default SiteHeader