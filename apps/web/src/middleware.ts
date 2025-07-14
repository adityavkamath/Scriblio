import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Configuration
const publicPaths = ['/signin', '/signup', '/api/auth']
const protectedPaths = ['/home', '/home/']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isPathProtected = protectedPaths.some(path =>pathname === path || pathname.startsWith('/home/'))
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  

  const token = await getToken({ 
    req: request, 
    secret: process.env.AUTH_SECRET 
  })
  
  if (isPathProtected && !token) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(url)
  }
  
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/home', request.url))
  }
  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes that aren't /api/auth/* (for Next-Auth)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. Static files (.ico, .png, etc.)
     */
    '/((?!api/(?!auth)|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}