import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    let metrics = await prisma.impactMetrics.findUnique({
      where: { id: 'singleton' },
    });

    if (!metrics) {
      metrics = {
        id: 'singleton',
        totalStudents: 0,
        projectsCompleted: 0,
        hardwareKits: 0,
        communityReach: 0,
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('[GET_METRICS]', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
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

    if (user.role !== 'ORIENTADOR' && user.role !== 'ALUNO_INTERNO') {
      return NextResponse.json(
        { error: 'Forbidden: Only orientadores and alunos internos can update metrics' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { totalStudents, projectsCompleted, hardwareKits, communityReach } = body;

    const metrics = await prisma.impactMetrics.upsert({
      where: { id: 'singleton' },
      update: {
        totalStudents: typeof totalStudents === 'number' ? totalStudents : undefined,
        projectsCompleted: typeof projectsCompleted === 'number' ? projectsCompleted : undefined,
        hardwareKits: typeof hardwareKits === 'number' ? hardwareKits : undefined,
        communityReach: typeof communityReach === 'number' ? communityReach : undefined,
      },
      create: {
        id: 'singleton',
        totalStudents: totalStudents || 0,
        projectsCompleted: projectsCompleted || 0,
        hardwareKits: hardwareKits || 0,
        communityReach: communityReach || 0,
      },
    });

    return NextResponse.json({ success: true, metrics });
  } catch (error) {
    console.error('[POST_METRICS]', error);
    return NextResponse.json(
      { error: 'Failed to update metrics' },
      { status: 500 }
    );
  }
}