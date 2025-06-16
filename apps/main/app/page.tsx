import { GoogleSignOut } from "@/components/GoogleSignOut";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import CreateRoomPage from "./(room)/create-room/page";
import JoinRoomPage from "./(room)/join-room/page";
import RoomPage from "./(room)/room/[id]/page";
import AllRoomsPage from "./(room)/rooms/page";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Scriblio</h1>
      <p className="text-lg mb-2">You are signed in as:</p>
      <h1 className="font-bold text-xl mb-2 ">{session?.user?.name}</h1>
      <CreateRoomPage />
      <JoinRoomPage />
      <RoomPage />
      <AllRoomsPage />
      <GoogleSignOut />
    </div>
  );
}
