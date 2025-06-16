import { GoogleSignIn } from "@/components/GoogleSignIn";
import { GoogleSignOut } from "@/components/GoogleSignOut";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const SignUpPage = async () => {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="border-2 p-4 shadow-2xl w-full max-w-sm mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        <GoogleSignIn />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
        <form
          className="space-y-4"
          action={async (formData) => {
            "use server";
            const res = await signUp(formData);
            if (res.success) {
              redirect("/signin");
            }
          }}
        >
          <Input
            name="name"
            placeholder="Name"
            type="text"
            required
            autoComplete="name"
          />
          <Input
            name="email"
            placeholder="Email"
            type="email"
            required
            autoComplete="email"
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            required
            autoComplete="current-password"
          />
          <Button className="w-full cursor-pointer" type="submit">
            Sign Up
          </Button>
        </form>

        <div className="text-center">
          <Button asChild variant="link">
            <Link href="/signin">Already have an account? Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
