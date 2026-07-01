import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/crypto';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Paths requiring protection
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApiPath = pathname.startsWith('/api/admin') && pathname !== '/api/admin/auth';

  if (isAdminPath || isAdminApiPath) {
    const sessionCookie = req.cookies.get('admin_session')?.value;
    
    // Verify JWT payload
    const session = sessionCookie ? await verifyJWT(sessionCookie) : null;

    if (!session) {
      if (isAdminApiPath) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Redirect to login page
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
