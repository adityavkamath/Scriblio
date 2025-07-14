"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Permission = "VIEW" | "WRITE";

interface PendingGuest {
  id: string;
  name: string;
  email?: string | null;
}

interface RoomUser {
  id: string;
  name: string;
  email?: string | null;
  permission: Permission;
}

interface SidebarProps {
  ws: WebSocket | null;
  roomId: string;
  pendingUsers: PendingGuest[];
  users: RoomUser[];
}

export default function Sidebar({
  ws,
  roomId,
  pendingUsers,
  users,
}: SidebarProps) {
  const [open, setOpen] = useState(false);

  const handleApprove = (guestId: string, permission: Permission) => {
    ws?.send(
      JSON.stringify({
        type: "approve_guest",
        roomId,
        guestId,
        approve: true,
        permission,
      })
    );
    toast.success("User approved");
  };

  const handleReject = (guestId: string) => {
    ws?.send(
      JSON.stringify({
        type: "approve_guest",
        roomId,
        guestId,
        approve: false,
      })
    );
    toast.error("User rejected");
  };

  const handlePermissionChange = (userId: string, permission: Permission) => {
    ws?.send(
      JSON.stringify({
        type: "change_permission",
        roomId,
        userId,
        permission,
      })
    );
    toast.success("Permission updated");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } group`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ width: 320 }}
    >
      <div className="bg-white dark:bg-gray-900 shadow-lg h-full flex flex-col border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b font-bold text-lg">Room Admin Panel</div>
        <ScrollArea className="flex-1 p-4">
          <div>
            <div className="font-semibold mb-2">Pending Guests</div>
            {pendingUsers.length === 0 && (
              <div className="text-sm text-muted-foreground mb-4">
                No pending guests
              </div>
            )}
            {pendingUsers.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between mb-2"
              >
                <div>
                  <div className="font-medium">{guest.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {guest.email}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprove(guest.id, "WRITE")}
                  >
                    Approve (Write)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprove(guest.id, "VIEW")}
                  >
                    Approve (View)
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(guest.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div>
            <div className="font-semibold mb-2">All Users</div>
            {users.length === 0 && (
              <div className="text-sm text-muted-foreground">No users</div>
            )}
            {users.map((user) => (
              <div
                key={user.id}
                className="mb-2 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                  <div className="text-xs">
                    Permission:{" "}
                    <span className="font-semibold">{user.permission}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={
                      user.permission === "WRITE" ? "default" : "outline"
                    }
                    onClick={() => handlePermissionChange(user.id, "WRITE")}
                  >
                    Write
                  </Button>
                  <Button
                    size="sm"
                    variant={user.permission === "VIEW" ? "default" : "outline"}
                    onClick={() => handlePermissionChange(user.id, "VIEW")}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 text-xs text-center text-muted-foreground">
          Hover to left edge to open
        </div>
      </div>
      {!open && (
        <div className="absolute top-0 left-full h-full w-2 cursor-pointer bg-transparent" />
      )}
    </div>
  );
}
