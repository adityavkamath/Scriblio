import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { signIn } from "@/auth"
import { Form } from "./form"

export function SignUp() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="flex flex-col justify-center items-center">
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                    Enter your email below to signUp to join
                </CardDescription>
                <CardAction>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Form />
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
                    Already have an Account?
                    <Link href={"/signin"}>
                        <Button variant="link" >
                            SignIn
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
