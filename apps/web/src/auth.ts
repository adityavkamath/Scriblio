import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import dbClient from "@repo/database/dbclient"
import { verifyPassword } from "./lib/server/util"
import { signInSchema } from "@repo/schemas/userschema"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google,
    Credentials({
      credentials: {
        email: { type: "email", label: "Email" },
        password: { type: "password", label: "Password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)
          const user = await dbClient.user.findUnique({ where: { email } })
          if (!user || !user.password) return null

          const isValid = await verifyPassword(password, user.password)
          if (!isValid) return null
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
          }
        } catch (error) {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await dbClient.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          await dbClient.user.create({
            data: {
              email: user.email!,
              name: user.name ?? "",
              image: user.image ?? "",
              emailVerified: (profile as any)?.email_verified ?? false,
            },
          })
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if(user && user.email){
        const userId=await dbClient.user.findUnique({
          where:{
            email:user.email
          }
        })
        token.id = userId?.id
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
