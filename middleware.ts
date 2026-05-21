import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Check all cookies for any supabase auth token
  let isAuthenticated = false
  const cookies = request.cookies.getAll()

  for (const cookie of cookies) {
    if (
      (cookie.name.includes('auth-token') || cookie.name.includes('access-token')) &&
      cookie.value &&
      cookie.value.length > 20
    ) {
      isAuthenticated = true
      break
    }
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}