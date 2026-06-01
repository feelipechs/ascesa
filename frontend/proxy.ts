import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export default async function proxy(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  const url = new URL(req.url)
  const isLoggedIn = !!session
  const isAdminRoute = url.pathname.startsWith('/admin')
  const isLoginPage = url.pathname === '/login'

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', url))
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
