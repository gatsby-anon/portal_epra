import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { opportunitySchema } from '@/lib/validation';

export async function GET() {
  try {
    const opportunities = await prisma.opportunity.findMany({
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const opportunitiesWithStatus = opportunities.map(opp => ({
      ...opp,
      applicationCount: opp._count.applications,
      isOpen: opp.status === 'Open',
    }));

    return NextResponse.json({ success: true, data: opportunitiesWithStatus });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar vagas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = request.headers.get('x-user-role');
  if (!role || role !== 'ORIENTADOR') {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = opportunitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        ...parsed.data,
        dataLimite: parsed.data.dataLimite ? new Date(parsed.data.dataLimite) : null,
      },
    });

    return NextResponse.json({ success: true, data: opportunity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao criar vaga' }, { status: 500 });
  }
}