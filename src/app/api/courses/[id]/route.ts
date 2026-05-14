import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { courseSchema } from '@/lib/validation';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { _count: { select: { enrollments: true } } },
  });

  if (!course) {
    return NextResponse.json({ success: false, error: 'Curso não encontrado' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      ...course,
      enrollmentCount: course._count.enrollments,
      isOpen: new Date(course.dataLimite) > new Date() && course._count.enrollments < course.vagas,
    },
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = request.headers.get('x-user-role');
  if (!role || !['ALUNO_INTERNO', 'ORIENTADOR'].includes(role)) {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = courseSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const dataToUpdate = { ...parsed.data };
    if (dataToUpdate.dataLimite) {
      dataToUpdate.dataLimite = new Date(dataToUpdate.dataLimite).toISOString();
    }

    const course = await prisma.course.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar curso' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = request.headers.get('x-user-role');
  if (!role || !['ALUNO_INTERNO', 'ORIENTADOR'].includes(role)) {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao deletar curso' }, { status: 500 });
  }
}
