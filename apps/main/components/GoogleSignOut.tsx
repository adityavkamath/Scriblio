"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

const GoogleSignOut = () => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex justify-center">
      <Button className='cursor-pointer' variant="destructive" onClick={handleSignOut}>
        <FaSignOutAlt />
        Sign Out
      </Button>
    </div>
  );
};

export { GoogleSignOut };
