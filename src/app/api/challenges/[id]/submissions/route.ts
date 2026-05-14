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
    
    if (!user || (user.role !== 'ALUNO_INTERNO' && user.role !== 'ORIENTADOR')) {
      return NextResponse.json({ success: false, error: 'Permissão insuficiente' }, { status: 403 });
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
    
    const submissionsWithUser = submissions.map(s => ({
      ...s,
      user: userMap.get(s.userId),
    }));
    
    return NextResponse.json({ success: true, data: submissionsWithUser });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar submissões' }, { status: 500 });
  }
}