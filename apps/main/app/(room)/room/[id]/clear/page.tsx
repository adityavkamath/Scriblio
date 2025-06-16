"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ClearChatPage() {
  const { id } = useParams();
  const handleClear = async () => {
    try {
      const res = await fetch(`/api/room/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Chat cleared successfully");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Failed to clear chat");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center space-y-4">
      <h2 className="text-lg font-bold">Clear Chat for Room: {id}</h2>
      <Button onClick={handleClear}>Clear Chat</Button>
    </div>
  );
}
