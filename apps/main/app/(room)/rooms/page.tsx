"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AllRoomsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/room/all")
      .then((res) => res.json())
      .then((d) => setData(d.messages))
      .catch(() => toast.error("Failed to fetch rooms"));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-xl font-bold">Your Rooms</h1>
      {data ? (
        <div className="space-y-4">
          {data.rooms.map((room: any) => (
            <div
              key={room.roomId}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{room.slug}</p>
                <p className="text-sm text-muted-foreground">
                  Participants: {room.participants.join(", ")}
                </p>
              </div>
              <a
                href={`/room/${room.roomId}`}
                className="text-blue-600 hover:underline"
              >
                Open
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}