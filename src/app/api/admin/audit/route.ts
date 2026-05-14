import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const role = req.headers.get('x-user-role');
  
  if (role !== 'ORIENTADOR') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const actionFilter = searchParams.get('actionFilter');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (actionFilter && actionFilter !== 'all') {
      where.action = actionFilter;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Fetch actor names and target user names
    const actorIds = [...new Set(logs.map(l => l.actorId))];
    const targetIds = [...new Set(logs.filter(l => l.targetUserId).map(l => l.targetUserId as string))];
    
    const users = await prisma.user.findMany({
      where: { id: { in: [...actorIds, ...targetIds] } },
      select: { id: true, fullName: true },
    });
    
    const userMap = new Map(users.map(u => [u.id, u.fullName]));

    const logsWithNames = logs.map(log => ({
      ...log,
      actorName: userMap.get(log.actorId) || 'Sistema',
      targetName: log.targetUserId ? (userMap.get(log.targetUserId) || 'Desconhecido') : '-',
    }));

    return NextResponse.json({
      success: true,
      data: {
        logs: logsWithNames,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar logs de auditoria' }, { status: 500 });
  }
}
