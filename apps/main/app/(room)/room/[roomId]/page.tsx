"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PendingGuests from "./pending/page";

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [roomStatus, setRoomStatus] = useState<{
    isAdmin: boolean;
    isMember: boolean;
    isPending: boolean;
  } | null>(null);

  useEffect(() => {
    if (status === "loading" || !session) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/room/${roomId}/status`);
        const data = await res.json();

        if (data.error) {
          router.push("/");
          return;
        }

        setRoomStatus({
          isAdmin: data.isAdmin,
          isMember: data.isMember,
          isPending: data.isPending,
        });

        if (!data.isMember && !data.isAdmin && !data.isPending) {
          await fetch(`/api/room/${roomId}/pending`, { method: "POST" });
        }
      } catch (error) {
        console.error("Room status check failed:", error);
      }
    };

    checkStatus();
  }, [roomId, session, status, router]);

  if (status === "loading") return <Skeleton className="h-[100px] w-full" />;

  if (roomStatus?.isPending && !roomStatus.isAdmin) {
    return (
      <Alert variant="default">
        <AlertDescription>
          Waiting for admin approval to join this room
        </AlertDescription>
      </Alert>
    );
  }
  

  return roomStatus && roomStatus.isPending ? (
    <AlertDescription>
      Waiting for admin approval to join this room
    </AlertDescription>
  ) : (
    <>
      {roomStatus && roomStatus.isAdmin ? (
        <PendingGuests />
      ) : null }
      <h1>Here IS The Canvas</h1>
    </>
  );
}
