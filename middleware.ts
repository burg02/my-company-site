import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

  // Protect admin routes
  if (isAdminRoute && !token) {
    return NextResponse.redirect(
      new URL('/auth/login', request.url)
    )
  }

  // Prevent logged-in users from accessing login page
  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL('/admin', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}