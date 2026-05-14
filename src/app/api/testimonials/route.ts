import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const testimonials = await prisma.testimonial.findMany({
      where: all ? {} : { status: 'APPROVED' },
      include: {
        user: {
          select: { id: true, fullName: true, course: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('[GET_TESTIMONIALS]', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { text, photoUrl, lgpdConsent } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!lgpdConsent) {
      return NextResponse.json(
        { error: 'LGPD consent is required' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || request.headers.get('remote-addr') 
      || 'unknown';

    const testimonial = await prisma.testimonial.create({
      data: {
        userId: user.id,
        text: text.trim(),
        photoUrl: photoUrl || null,
        status: 'PENDING',
        lgpdConsent,
        consentTimestamp: new Date(),
        ipAddress,
      },
    });

    return NextResponse.json(
      { success: true, testimonial },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST_TESTIMONIALS]', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}