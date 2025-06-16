import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { SigninSchema } from "@repo/common/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@repo/db/client";
import bcrypt from "bcryptjs";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth }: any = NextAuth({
  adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsedCredentials = SigninSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error(parsedCredentials.error.message);
        }
        const { email, password } = parsedCredentials.data;
        const user = await db.user.findFirst({
          where: { email },
        });
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
         console.log("JWT USER:", user);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || user.email;
        token.image = user.image || null;
      }
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
