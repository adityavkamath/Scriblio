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
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-bold">Join Room</h1>
      <Input
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <Button onClick={handleJoin}>Join Room</Button>
    </div>
  );
}