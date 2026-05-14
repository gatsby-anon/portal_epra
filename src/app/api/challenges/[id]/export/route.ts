import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
    }
    
    const token = authHeader.slice(7);
    const user = await verifyToken(token);
    
    if (!user || user.role !== 'ORIENTADOR') {
      return NextResponse.json({ success: false, error: 'Permissão insuficiente' }, { status: 403 });
    }
    
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    
    if (!challenge) {
      return NextResponse.json({ success: false, error: 'Desafio não encontrado' }, { status: 404 });
    }
    
    const submissions = await prisma.submission.findMany({
      where: { challengeId },
      orderBy: { createdAt: 'desc' },
    });
    
    const userIds = [...new Set(submissions.map(s => s.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true, email: true, course: true },
    });
    const userMap = new Map(users.map(u => [u.id, u]));
    
    const headers = ['Nome', 'Curso', 'Email', 'URL GitHub', 'Data de Submissão'];
    const rows = submissions.map(s => {
      const u = userMap.get(s.userId);
      return [
        u?.fullName || 'Desconhecido',
        u?.course || 'Não informado',
        u?.email || 'N/A',
        s.urlGithub,
        new Date(s.createdAt).toLocaleString('pt-BR'),
      ];
    });
    
    const csv = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="desafio-${challenge.titulo.replace(/[^a-z0-9]/gi, '-')}-submissoes.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json({ success: false, error: 'Erro ao exportar CSV' }, { status: 500 });
  }
}