import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = request.headers.get('x-user-role');
  if (!role || role !== 'ORIENTADOR') {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const applications = await prisma.application.findMany({
      where: { opportunityId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: { applications, total: applications.length },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar candidaturas' }, { status: 500 });
  }
}