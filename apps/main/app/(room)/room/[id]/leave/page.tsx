"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LeaveRoomPage() {
  const { id } = useParams();
  const router = useRouter();

  const leaveRoom = async () => {
    try {
      const res = await fetch(`/api/room/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        router.push("/rooms");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Failed to leave room");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center space-y-4">
      <h2 className="text-lg font-bold">Leave Room: {id}</h2>
      <Button onClick={leaveRoom} variant="destructive">
        Confirm Leave
      </Button>
    </div>
  );
}