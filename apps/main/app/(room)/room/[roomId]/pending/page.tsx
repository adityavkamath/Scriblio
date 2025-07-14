"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PendingGuests() {
  const { roomId } = useParams();
  const [guests, setGuests] = useState<any[]>([]);

  const fetchGuests = async () => {
    const res = await fetch(`/api/room/${roomId}/pending/list`);
    const data = await res.json();
    setGuests(data.guests || []);
  };

  const handleApproval = async (guestId: string, approve: boolean) => {
    try {
      const res = await fetch(`/api/room/${roomId}/pending/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, approve }),
      });

      if (res.ok) {
        toast.success(approve ? "Guest approved" : "Guest rejected");
        fetchGuests();
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [roomId]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Requested At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow key={guest.id}>
            <TableCell>{guest.name}</TableCell>
            <TableCell>{guest.email}</TableCell>
            <TableCell>
              {new Date(guest.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApproval(guest.id, true)}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleApproval(guest.id, false)}
              >
                Reject
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
