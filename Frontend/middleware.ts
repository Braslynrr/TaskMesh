import { NextRequest, NextResponse } from "next/server"

const AUTH_ROUTES = ["/login", "/register"]
const PROTECTED_PREFIXES = ["/taskboards"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = req.cookies.get("auth_token")?.value

  const isAuthenticated = Boolean(token)

  // Usuario NO autenticado intentando acceder a rutas protegidas
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return redirectToLogin(req)
  }

  // Usuario autenticado intentando acceder a login/register
  if (isAuthenticated && isAuthRoute(pathname)) {
    return redirectToApp(req)
  }

  return NextResponse.next()
}

/* helpers */
function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone()
  url.pathname = "/login"
  return NextResponse.redirect(url)
}

function redirectToApp(req: NextRequest) {
  const url = req.nextUrl.clone()
  url.pathname = "/taskboards"
  return NextResponse.redirect(url)
}

/* matcher */
export const config = {
  matcher: [
    "/login",
    "/register",
    "/taskboards/:path*",
  ],
}