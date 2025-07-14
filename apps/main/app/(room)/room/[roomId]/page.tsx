"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Sidebar from "./Sidebar";

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [roomStatus, setRoomStatus] = useState<{
    isAdmin: boolean;
    isMember: boolean;
    isPending: boolean;
    permission?: string | null;
  } | null>(null);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const wsRef = useRef<WebSocket | null>(null);

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
          permission: data.permission,
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

  useEffect(() => {
    if (!roomId || status !== "authenticated") return;
    const getTokenAndConnect = async () => {
      try {

        const data = await res.json();
        console.log("Token data:", data);
        if (!data.token) {
          toast.error("Failed to get auth token");
          return;
        }

        wsRef.current = ws;

        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "join_room", roomId }));
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.type === "approval") {
            toast.success(
              msg.status === "approved"
                ? "You are approved!"
                : "You are rejected!"
            );
          }
          if (msg.type === "pending_update") setPendingUsers(msg.pendingUsers);
          if (msg.type === "users_update") setUsers(msg.users);
        };

        return () => {
          ws.send(JSON.stringify({ type: "leave_room", roomId }));
          ws.close();
        };
      } catch (err) {
        toast.error("WebSocket connection failed");
      }
    };
    getTokenAndConnect();
  }, [roomId, status]);

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

  return (
    <div className="relative h-screen flex">
      {roomStatus?.isAdmin && (
        <Sidebar
          ws={wsRef.current}
          roomId={roomId as string}
          pendingUsers={pendingUsers}
          users={users}
        />
      )}
      <main className="flex-1 flex items-center justify-center">
        <h1>Here IS The Canvas</h1>
      </main>
    </div>
  );
}
