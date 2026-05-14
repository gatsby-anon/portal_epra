import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { activationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 400 }
      );
    }

    if (user.activationExpires && user.activationExpires < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Token expired' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailConfirmed: true,
        activationToken: null,
        activationExpires: null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Account activated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ACTIVATE-V2]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}