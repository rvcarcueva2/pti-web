import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // For now, let the client-side authentication handle the redirects
  // This middleware can be enhanced later with proper Supabase middleware integration
  
  // Just pass through all requests and let the layout components handle auth
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/user-dashboard/:path*',
    '/profile/:path*',
  ]
}
