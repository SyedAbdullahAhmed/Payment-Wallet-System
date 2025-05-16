import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes
  const publicPaths = ['/signin', '/signup']
  const isPublic = publicPaths.includes(pathname)

  // Get cookies
  const name = request.cookies.get('name')?.value
  const email = request.cookies.get('email')?.value
  const id = request.cookies.get('_id')?.value
  const payment = request.cookies.get('payment')?.value

  const isAuthenticated = name && email && id && payment !== undefined

  // If route is public, allow
  if (isPublic) {
    if (isAuthenticated) {
      // Already logged in
      if (payment === 'false') {
        return NextResponse.redirect(new URL('/paymentForm', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // If payment not done
  if (payment === 'false') {
    return NextResponse.redirect(new URL('/paymentForm', request.url))
  }

  // Allow access
  return NextResponse.next()
}

// This configuration prevents middleware from running on the redirected routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     * - Add other routes as needed
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}