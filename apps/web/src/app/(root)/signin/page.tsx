import { SignIn } from "@/components/SignIn";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = await auth();
  if (session) {
    redirect("/home")
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <SignIn />
    </div>
  );
}
