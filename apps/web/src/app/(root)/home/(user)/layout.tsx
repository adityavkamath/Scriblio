import React from 'react'
import { Toaster} from "react-hot-toast"
import { signOut } from '@/auth'
import { Logout } from "@/components/icons/logout"
import { Rooms } from '@/components/Rooms'
import { CreateRoom } from '@/components/CreateRoom'
import { Logo } from '@/components/icons/Logo'

const Layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex w-full'>
            <div className='relative w-12/13 flex flex-col justify-center items bg-center p-10'>
                <div className='top-5 absolute w-full flex justify-between items-center'>
                    <div className='w-2/3'>
                        <Logo />
                    </div>
                    <div className='flex w-1/3 justify-between'>
                        <Rooms />
                        <CreateRoom />
                        <div className='flex justify-between items-center'>
                            <form action={async () => {
                                "use server"
                                await signOut({ redirectTo: "/" })
                            }}>
                                <button type='submit' className='text-white flex p-3 bg-red-500 rounded'><Logout /><span>Logout</span></button>
                            </form>
                        </div>
                    </div>
                </div>
                <Toaster position='bottom-right' />
            </div>
            <div>{children}</div>
        </div>
    )
}

export default Layout