"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateRoomPage() {
  const [name, setName] = useState("");
  const [shareLink, setShareLink] = useState("");
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
      const link = `${window.location.origin}/room/${data.roomId}`;
      setShareLink(link);
    } else {
      toast.error(data.message || "Error creating room");
    }
  };
  return (
    <div className="flex flex-col items-center space-y-4 ">
      <input className='p-2 font-bold hover:border-2 border-black' value={name} onChange={e => setName(e.target.value)} placeholder="Enter Room Name" />
      <Button className='cursor-pointer' onClick={handleCreate}>Create Room</Button>
      {shareLink && (
        <div className="flex flex-row items-center space-y-2">
          <input value={shareLink} readOnly className="mr-2 p-2 w-[320px] text-blue-600 font-bold text-lg"/>
          <Button className='cursor-pointer' onClick={() => navigator.clipboard.writeText(shareLink)}>Copy Link</Button>
        </div>
      )}
    </div>
  );
}
