import { NextResponse } from 'next/server';
import { LoginPayload } from '@/types/user';
import { prisma } from '@/lib/db';
import { generateToken, ROLE_REDIRECTS } from '@/lib/auth-utils';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-at-least-32-chars-long-!!'
);

export async function POST(request: Request) {
  try {
    const body: LoginPayload = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    // Find user in REAL database
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password with BCRYPT
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check account status
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account deactivated' },
        { status: 403 }
      );
    }

    // Generate REAL JWT session
    const token = await new SignJWT({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });

    // Determine redirect based on role
    const redirectTo = ROLE_REDIRECTS[user.role] || '/';

    // Omit sensitive data
    const { password: _, activationToken: __, ...userWithoutSensitiveData } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutSensitiveData,
      redirectTo
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

