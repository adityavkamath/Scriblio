import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GoogleSignOut } from "@/components/GoogleSignOut";
import JoinRoomPage from "./(room)/join-room/page";
import CreateRoomPage from "./(room)/create-room/page";
import logo from "@/public/logo.jpeg";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/signin");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div className="flex items-center space-x-2">
          <img src={logo.src} alt="SparkStudy Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold">Scriblio</h1>
        </div>
        <div className="space-x-3 flex flex-row items-end justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="cursor-pointer">
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <h2 className="text-lg font-semibold mb-2">Create a Room</h2>
              <CreateRoomPage />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="cursor-pointer">
                Join Room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <h2 className="text-lg font-semibold mb-2">Join a Room</h2>
              <JoinRoomPage />
            </DialogContent>
          </Dialog>

          <a href="/rooms">
            <Button variant="outline" className="cursor-pointer">
              All Rooms
            </Button>
          </a>

          <GoogleSignOut />
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-2">
          Welcome, {session.user?.name}
        </h2>
        <p className="text-gray-700 mb-8">{session.user?.email}</p>
        <div className="bg-white border rounded-xl p-10 shadow-lg w-full max-w-3xl">
          <p className="text-xl text-gray-500">Canvas will appear here...</p>
        </div>
      </main>
    </div>
  );
}
