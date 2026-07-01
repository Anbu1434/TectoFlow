import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, signJWT } from '@/lib/crypto';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    // Prioritize PBKDF2 hash, fall back to legacy plaintext, and finally default to 'admin'
    const storedHashOrPassword = process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD || 'admin';

    const isValid = await verifyPassword(password, storedHashOrPassword);

    if (isValid) {
      // Create a signed JWT payload
      const token = await signJWT({ role: 'admin' });
      const response = NextResponse.json({ success: true });
      
      // Set secure cookie with the JWT token
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return response;
    }

    // Mitigation: Artificial delay of 2 seconds for failed login attempts to prevent brute-force automated attacks
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Login auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  // Logout
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
