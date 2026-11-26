import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('pkr_admin_token')?.value;

  // 1. ALWAYS allow the login page to load.
  if (pathname.includes('/admin/login')) {
    // If they are already logged in (have a cookie), send them to the dashboard
    if (token) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    // If they don't have a token, let them see the login page
    return NextResponse.next();
  }

  // 2. For all other /admin routes, if there is no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // 3. Allow access if token exists
  return NextResponse.next();
}

export const config = {
  // NOTE: '/admin/:path*' does NOT match '/admin' (bare route).
  // We must list '/admin' explicitly AND the wildcard for sub-routes.
  matcher: ['/admin', '/admin/:path*'],
};