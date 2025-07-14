import React from 'react'
import { SignUp } from '@/components/signup'
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
const page = async () => {
    const session = await auth();
    if (session) {
        redirect("/home")
    }
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <SignUp />
        </div>
    )
}

export default page