"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LeaveRoomPage from "./leave/page";

export default function RoomPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`/api/room/${id}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages))
      .catch(() => toast.error("Failed to fetch messages"));
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-xl font-bold">Room: {id}</h1>
      <div className="space-y-2">
        {messages.map((msg: any) => (
          <p key={msg.id} className="p-2 bg-gray-100 rounded">
            {msg.message}
          </p>
        ))}
        <button>
          Leave Room <LeaveRoomPage />
        </button>
      </div>
    </div>
  );
}
