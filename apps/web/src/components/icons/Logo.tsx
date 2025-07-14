"use client"
import React from 'react'
import { redirect } from 'next/navigation'
export const Logo = () => {
    return (
        <button onClick={()=>{
            redirect("/home");
        }}>
            <img
                src="/logo.png"
                alt="Excalidraw logo featuring a hand-drawn style pencil icon on a white background, conveying a creative and welcoming atmosphere"
                srcSet=""
                className='w-36 bg-blue-300 rounded-md'
            />
        </button>
    )
}
