"use client"
import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import { Close } from './icons/close'
import { useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"

export const Rooms = () => {
    const router = useRouter();
    const [rooms, setRooms] = useState<rooms[]>([]);
    const [Loader, setLoading] = useState(false);
    const [toggle, setToggle] = useState(false);
    const fetchRooms = async () => {
        try {
            setLoading(true);
            const result = await axios.get("/api/user");
            setRooms(result.data.rooms)
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }
    interface rooms {
        id: string;
        shareToken: string;
        slug: string;
        createdAt: Date;
        adminId: string;
    }
    useEffect(() => {
        fetchRooms()
    }, [])
    const handleRouting = (RoomId: string) => {
        router.push(`/home/room/${RoomId}`)
    }
    return (
        <div>
            <button
                className="w-auto rounded-lg p-3 flex items-center justify-between text-center text-white bg-blue-600"
                onClick={() => setToggle(!toggle)}
            >
                <span>My-rooms</span>
            </button>
            {toggle && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-70" onClick={() => setToggle(!toggle)}></div>
                    <div className="relative w-56 min-h-48 rounded-lg p-4 bg-blue-600 z-10">
                        <div className='w-full'>
                            <button onClick={() => setToggle(!toggle)}><Close /></button>
                        </div>
                        <div className='flex flex-col gap-y-1.5'>
                            {
                                Loader ? (<>
                                    <Skeleton className="h-10 w-full rounded-xl opacity-95" />
                                    <Skeleton className="h-10 w-full rounded-xl opacity-75" />
                                    <Skeleton className="h-10 w-full rounded-xl opacity-75" />
                                </>)
                                    : (<>{
                                        rooms.length > 0 ? rooms.map((r) => (
                                            <div className='w-full border-1 rounded-md p-2 text-white cursor-pointer ' key={r.id}>
                                                <button className='w-full text-start cursor-pointer' onClick={() => handleRouting(r.shareToken)}>
                                                    {r.slug}
                                                </button>
                                            </div>
                                        ))
                                            : (
                                                <div className='text-white flex w-full justify-center text-lg font-bold pt-5'>You have no Rooms</div>
                                            )
                                    }
                                    </>
                                    )
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
