"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateRoomPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    const res = await fetch("/api/room/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Room created!");
      router.push(`/room/${data.roomId}`);
    } else {
      toast.error(data.message || "Error creating room");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold text-center">Create Room</h2>
      <Input
        placeholder="Enter room name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button className="w-full" onClick={handleCreate}>
        Create
      </Button>
    </div>
  );
}
