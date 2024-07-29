import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const pathname = request.nextUrl.pathname;

  const publicPaths = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/error'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!session && !isPublicPath && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    if (pathname !== '/') {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    } 
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}; 