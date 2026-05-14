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
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      return NextResponse.json({ success: false, error: 'Vaga não encontrada' }, { status: 404 });
    }

    const applications = await prisma.application.findMany({
      where: { opportunityId: id },
      orderBy: { createdAt: 'desc' },
    });

    const csvRows = [
      'nome,email,curso,semestre,linkedInUrl,pdfUrl',
      ...applications.map(app => 
        `${app.nome},${app.email},${app.curso},${app.semestre},${app.linkedInUrl || ''},${app.pdfUrl}`
      ),
    ];

    const csv = csvRows.join('\n');
    const date = new Date().toISOString().split('T')[0];
    const filename = `candidaturas-${opportunity.titulo.replace(/[^a-zA-Z0-9]/g, '-')}-${date}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao exportar candidaturas' }, { status: 500 });
  }
}