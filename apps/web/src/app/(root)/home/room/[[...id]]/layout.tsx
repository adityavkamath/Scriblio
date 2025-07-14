import React from 'react'
import { Toaster, toast } from "react-hot-toast"
import { signOut } from '@/auth'
import { Logout } from "@/components/icons/logout"
import { ShareButton } from '@/components/ShareButton'
import { Users } from '@/components/users'
import { Logo } from '@/components/icons/Logo'

const Layout = async ({ children, params }: { children: React.ReactNode, params: Promise<{ id: String }> }) => {
    const id = (await params).id as string;
    return (
        <div className='relative w-full flex flex-col justify-center'>
            <div className='top-2 absolute w-full flex justify-between items-center p-4 '>
                <div className='w-1/5'>
                    <Logo />
                </div>
                <div className='  w-2/5 h-14 rounded-md bg-gray-600 p-5 text-white flex justify-around '>
                </div>
                <div className='w-1/5 flex justify-between items-center'>
                    <div>
                        <Users id={id} />
                    </div>
                    <ShareButton />
                    <form action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}>
                        <button type='submit' className='text-white flex p-3 bg-red-500 rounded'><Logout /><span>Logout</span></button>
                    </form>
                </div>
            </div>
            <Toaster position='bottom-right' />
            <div className='pt-30'>{children}</div>
        </div>
    )
}

export default Layout