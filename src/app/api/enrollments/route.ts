import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { enrollmentSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Autenticação necessária' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = enrollmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: parsed.data.courseId },
      include: { _count: { select: { enrollments: true } } },
    });

    if (!course) {
      return NextResponse.json({ success: false, error: 'Curso não encontrado' }, { status: 404 });
    }

    // ENRL-02: Check deadline
    if (new Date(course.dataLimite) <= new Date()) {
      return NextResponse.json({ success: false, error: 'Este curso não está mais disponível' }, { status: 400 });
    }

    // ENRL-03: Check vacancies
    if (course._count.enrollments >= course.vagas) {
      return NextResponse.json({ success: false, error: 'Este curso não está mais disponível' }, { status: 400 });
    }

    // ENRL-04: Check duplicate (also enforced by @@unique constraint)
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: parsed.data.courseId } },
    });

    if (existingEnrollment) {
      return NextResponse.json({ success: false, error: 'Você já está inscrito neste curso' }, { status: 409 });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId: parsed.data.courseId },
    });

    return NextResponse.json({ success: true, data: enrollment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao processar inscrição' }, { status: 500 });
  }
}
