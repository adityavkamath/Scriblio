import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signIn } from "@/auth"
import Link from "next/link"

export function SignIn() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            "use server"
            await signIn("credentials", formData)
          }}
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input name="password" type="password" required />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4">
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <form action={async () => {
          "use server"
          await signIn("google")
        }} className="w-full">

          <Button variant="outline" className="w-full" type="submit">
            Login with Google
          </Button>
        </form>
        <div className="flex justify-center items-center">
          Dont have an Account?
          <Link href={"/signup"}>
            <Button variant="link" >
              SignUp
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
