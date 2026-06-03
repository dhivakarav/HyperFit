import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        if (pathname.startsWith('/account') || pathname.startsWith('/admin')) {
          return !!token
        }
        if (pathname === '/checkout') {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/checkout'],
}
