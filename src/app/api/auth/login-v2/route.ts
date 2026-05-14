import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import prisma from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { verifyPassword, signJWT } from '@/lib/auth';
import { ROLE_REDIRECTS } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1m'),
});

export async function POST(request: Request) {
  // Temporarily bypass rate limiter
  /*
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  */

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.isEmailConfirmed) {
      return NextResponse.json(
        { success: false, error: 'Email not activated. Check your inbox.' },
        { status: 403 }
      );
    }

    const token = await signJWT({ userId: user.id, email: user.email, role: user.role });

    const redirectTo = ROLE_REDIRECTS[user.role] || '/dashboard';

    const response = NextResponse.json(
      {
        success: true,
        user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, course: user.course },
        redirectTo,
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 15 * 60,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('[LOGIN-V2]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}