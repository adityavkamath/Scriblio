import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

const GoogleSignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button className="w-full hover:border-2 border-black cursor-pointer hover:bg-green-300" variant="outline">
        <FaGoogle />
        Continue with Google
      </Button>
    </form>
  );
};

export { GoogleSignIn };
