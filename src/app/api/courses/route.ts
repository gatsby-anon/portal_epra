import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { courseSchema } from '@/lib/validation';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const coursesWithAvailability = courses.map(course => ({
      ...course,
      enrollmentCount: course._count.enrollments,
      isOpen: new Date(course.dataLimite) > new Date() && course._count.enrollments < course.vagas,
    }));

    return NextResponse.json({ success: true, data: coursesWithAvailability });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar cursos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = request.headers.get('x-user-role');
  if (!role || !['ALUNO_INTERNO', 'ORIENTADOR'].includes(role)) {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        ...parsed.data,
        dataLimite: new Date(parsed.data.dataLimite),
      },
    });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao criar curso' }, { status: 500 });
  }
}
