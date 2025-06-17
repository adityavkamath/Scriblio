"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function JoinRoomPage() {
  const [roomId, setRoomId] = useState("");

  const handleJoin = async () => {
    try {
      const res = await fetch(`/api/room/check/${roomId}`);
      const data = await res.json();
      if (res.ok) {
        console.log("Room exists:", data);
        toast.success(data.message);
      } else {
        toast.error(data.message);
        console.error("Error joining room:", data);
      }
    } catch (e) {
      toast.error("Failed to join room");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 ">
      <Input
        className="p-2 font-bold hover:border-2 border-black"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <Button className='cursor-pointer' onClick={handleJoin}>Join Room</Button>
    </div>
  );
}