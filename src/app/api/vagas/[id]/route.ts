import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { opportunitySchema } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: { _count: { select: { applications: true } } },
    });

    if (!opportunity) {
      return NextResponse.json({ success: false, error: 'Vaga não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...opportunity,
        applicationCount: opportunity._count.applications,
        isOpen: opportunity.status === 'Open',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar vaga' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = request.headers.get('x-user-role');
  if (!role || role !== 'ORIENTADOR') {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = opportunitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.dataLimite) {
      updateData.dataLimite = new Date(parsed.data.dataLimite);
    }

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: opportunity });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar vaga' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = request.headers.get('x-user-role');
  if (!role || role !== 'ORIENTADOR') {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.opportunity.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao excluir vaga' }, { status: 500 });
  }
}