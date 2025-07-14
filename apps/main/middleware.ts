import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();

  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/room/") && !session) {
    const callbackUrl = encodeURIComponent(req.nextUrl.href);
    return NextResponse.redirect(new URL(`/signin?callbackUrl=${callbackUrl}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/room/:path*"],
};
