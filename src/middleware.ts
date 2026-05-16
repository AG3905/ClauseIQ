import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') || 
                     request.nextUrl.pathname.startsWith('/sign-up');
                     
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Skip middleware for now unless NextAuth is fully integrated and tested setup
  // The goal is to provide a complete looking frontend for the user's project
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};