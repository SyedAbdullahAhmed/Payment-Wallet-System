import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const jwtConfig = {
  secret: new TextEncoder().encode('secret'),
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicPaths = ['/signin', '/signup'];
  const isPublic = publicPaths.includes(pathname);

  // Get JWT token from cookies
  const token = request.cookies.get('token')?.value;

  // If no token and route is protected, redirect to /signin
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  let decoded: any = null;
  let name, email, _id, payment;

  if (token) {
    try {
      const verified = await jose.jwtVerify(token, jwtConfig.secret);
      console.log('JWT verified:', verified.payload);
      decoded = verified.payload;
      name = decoded.name;
      email = decoded.email;
      _id = decoded._id;
      payment = decoded.payment;
    } catch (err) {
      console.error('JWT verification failed:', err);
      // If token is invalid, redirect to /signin
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  const isAuthenticated = name && email && _id;

  // Handle access to public routes
  if (isPublic) {
    if (isAuthenticated) {
      // If user is already logged in and visits /signin or /signup
      if (payment === false || payment === 'false') {
        return NextResponse.redirect(new URL('/paymentform', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Special case for /paymentform - allow access if payment is false
  if (pathname === '/paymentform' || pathname.startsWith('/paymentform')) {
    if (isAuthenticated) {
      if (payment === false || payment === 'false') {
        // Allow access to payment form if payment is false
        return NextResponse.next();
      } else {
        // Redirect to dashboard if payment is already completed
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // Handle access to other protected routes
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // User is authenticated, route is protected
  if (payment === false || payment === 'false') {
    return NextResponse.redirect(new URL('/paymentform', request.url));
  }
  
  // Allow access to dashboard and other protected routes when payment is completed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/paymentform/:path*',
    '/signin',
    '/signup',
    '/',
  ],
}