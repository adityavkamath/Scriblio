"use client"
import React from 'react'
import { Add } from './icons/Add'
import { Close } from './icons/close';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const CreateRoom = () => {
    const handleSubmit = async () => {
        try {
            console.log("hi")
            const result = await axios.post("/api/room", { name: room });
            const sharetoken = result.data.shareToken;
            window.location.href = `/home/room/${sharetoken}`;
            toast.success("Room created successfully!!")
            setToggle(false)
            setRoom("")
        }
        catch (err) {
            console.log(err)
            toast.error("unable to create Room")
        }
    }
    const [room, setRoom] = useState('');
    const [toggle, setToggle] = useState(false);
    return (
        <div>
            <button className='w-auto rounded-lg p-3 flex items-center justify-between text-center text-white bg-blue-600 cursor-pointer' onClick={() => setToggle(!toggle)}>
                <Add />
                <span>
                    create-room
                </span>
            </button>
            {toggle && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-70" onClick={() => setToggle(!toggle)}></div>
                    <div className="relative min-h-48 rounded-lg p-4 bg-blue-600 z-10">
                        <div className='w-full'>
                            <button onClick={() => setToggle(!toggle)}><Close /></button>
                        </div>
                        <div className='w-full flex flex-col p-4 gap-y-2'>
                            <input type="text" placeholder='Enter Room Name' value={room} className='text-white border-2 p-4 rounded-md' onChange={(e) => setRoom(e.target.value)} />
                            <div className='w-full flex justify-center'>
                                <button className='bg-white px-3 p-2 rounded w-fit' onClick={handleSubmit}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
