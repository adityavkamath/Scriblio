import React from 'react'
import Link from 'next/link'
const Home = () => {
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
        <div className='border-2 border-white text-white w-54 flex rounded-md p-5 justify-around'>
            <button className='border-1 p-2 rounded-md'>
                <Link href={"/signin"}>
                SignIn
                </Link>
            </button>
            <button className='border-1 p-2 rounded-md'>
                <Link href={"/signup"}>
                SignUp
                </Link>
            </button>
        </div>
    </div>
  )
}

export default Home