import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow the request to proceed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Public paths that don't require authentication
        const publicPaths = [
          "/",
          "/about",
          "/features",
          "/pricing",
          "/demo",
          "/contact",
          "/blog",
          "/terms",
          "/privacy",
          "/cookie-policy",
          "/cancellation-policy",
          "/delivery-policy",
          "/refund-policy",
          "/components",
          "/auth/signin",
          "/auth/signup",
          "/auth/error",
        ]

        // Check if path starts with any public path
        const isPublicPath = publicPaths.some(
          (publicPath) =>
            path === publicPath ||
            path.startsWith(publicPath + "/") ||
            path.startsWith("/blog/")
        )

        // API routes for authentication don't require auth
        const isAuthApiRoute =
          path.startsWith("/api/auth") ||
          path === "/api/newsletter/subscribe"

        // Allow public paths and auth API routes
        if (isPublicPath || isAuthApiRoute) {
          return true
        }

        // All other paths require authentication
        return !!token
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)

// Protect these routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/specialist/:path*",
    "/api/audios/:path*",
    "/api/voices/:path*",
    "/api/projects/:path*",
    "/api/users/:path*",
    "/api/suno/:path*",
  ],
}
