// components/room-grid.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DoorOpen, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function RoomGrid() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/room/all")
      .then(res => res.json())
      .then(data => {
        setRooms(data.messages?.rooms || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load rooms");
        setLoading(false);
      });
  }, []);

  const handleLeaveRoom = async (roomId: string) => {
    try {
      const res = await fetch("/api/room/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      
      if (res.ok) {
        setRooms(prev => prev.filter(room => room.roomId !== roomId));
        toast.success("Left room successfully");
      }
    } catch (error) {
      toast.error("Failed to leave room");
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[150px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <motion.div
          key={room.roomId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow h-full flex flex-col justify-between bg-opacity-50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  {room.slug}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{room.noOfParticipants} members</span>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = `/room/${room.roomId}`}
              >
                Open
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => handleLeaveRoom(room.roomId)}
              >
                <DoorOpen className="mr-2 h-4 w-4" />
                Leave
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
