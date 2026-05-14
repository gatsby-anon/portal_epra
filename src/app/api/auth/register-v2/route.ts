import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import prisma from '@/lib/db';
import { registerSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth';
import { sendActivationEmail } from '@/lib/email';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1m'),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, error: Object.values(errors)[0]?.[0] || 'Validation failed' },
        { status: 400 }
      );
    }

    const { fullName, email, password, course, consentGiven } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const activationToken = crypto.randomUUID();
    const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'USUARIO_EXTERNO',
        course,
        isEmailConfirmed: false,
        activationToken,
        activationExpires,
        consentGiven: true,
        consentTimestamp: new Date(),
      },
    });

    sendActivationEmail(email, activationToken).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please check your email to activate your account.',
        requiresEmailActivation: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER-V2]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}