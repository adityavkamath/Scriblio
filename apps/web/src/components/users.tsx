"use client";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
export const Users = ({ id }: { id: string }) => {
    const handleSubmit = async (id: string) => {
        axios.post("/api/room/", {
            id
        })
    }
    const [users, setUsers] = useState([]);
    const [showAll,setShowAll]=useState(false);

    const fetchUsers = async () => {
        try {
            const result = await axios.get("/api/room", { params: { id } });
            setUsers(result.data.users);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [id]);

    return (
        <div className="flex items-center">
            <div className="flex -space-x-4">
            {users.slice(0, 3).map((u, idx) => (
                <button
                key={u.id}
                onClick={() => handleSubmit(u.id)}
                className="cursor-pointer border-2 border-white rounded-full focus:outline-none"
                style={{ zIndex: users.length - idx }}
                >
                <Avatar>
                    <AvatarImage src={`https://robohash.org/${u.id}?size=400x300`} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                </button>
            ))}
            {users.length > 3 && (
                <button
                onClick={() => setShowAll(true)}
                className="cursor-pointer border-2 border-white rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center text-sm font-semibold"
                style={{ zIndex: 0 }}
                >
                +{users.length - 3}
                </button>
            )}
            </div>
            {/* Modal or dropdown for showing all users */}
            {showAll && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <div className="flex flex-wrap gap-2">
                    {users.map(u => (
                    <button
                        key={u.id}
                        onClick={() => handleSubmit(u.id)}
                        className="cursor-pointer"
                    >
                        <Avatar>
                        <AvatarImage src={`https://robohash.org/${u.id}?size=400x300`} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </button>
                    ))}
                </div>
                <button
                    className="mt-4 px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setShowAll(false)}
                >
                    Close
                </button>
                </div>
            </div>
            )}
        </div>
    );
};
