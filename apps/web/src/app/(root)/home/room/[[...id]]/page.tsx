"use client";

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState("");
    const [socket, setSocket] = useState<WebSocket>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const joinRoom = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const tokenRes = await axios.get('/api/getoken')
                setToken(tokenRes.data.token);
                setError(null);
                const socket = new WebSocket(`ws://localhost:8080/ws?token=${tokenRes.data.token}`);
                setSocket(socket);
                socket.onopen = () => {
                    socket.send(JSON.stringify({ type: 'join-Room', roomId: id }));
                    console.log("Request sent")
                };

                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket message:', data);
                };

                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                socket.onclose = () => {
                    console.log('WebSocket disconnected');
                };
                return () => {
                    socket.close();
                };
            } catch (err: any) {
                console.error('Error joining room:', err);
                setError(err.response?.data?.error || 'Failed to join room');
            } finally {
                setLoading(false);
            }
        };

        joinRoom();
    }, [id]);

    if (loading) {
        return (
            <div className="text-white flex justify-center items-center min-h-[200px]">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-white">
                <p>Error: {error}</p>
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => router.push('/home')}
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className="text-white">
            {id ? (
                <div>
                    <h1 className="text-xl font-bold mb-4">Room: {id}</h1>
                </div>
            ) : (
                <div>
                    <h1 className="text-xl font-bold mb-4">Home Page</h1>
                    <p>Create a new room or join an existing one.</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
