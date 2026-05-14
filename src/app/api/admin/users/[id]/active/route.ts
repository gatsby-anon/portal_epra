import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AuditAction } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = req.headers.get('x-user-role');
  const actorId = req.headers.get('x-user-id');
  
  if (role !== 'ORIENTADOR' || !actorId) {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id: targetUserId } = await params;
    const { isActive } = await req.json();

    const action = isActive ? AuditAction.USER_REACTIVATION : AuditAction.USER_DEACTIVATION;

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: targetUserId },
        data: { isActive },
      }),
      prisma.auditLog.create({
        data: {
          action,
          actorId,
          targetUserId,
          details: isActive ? 'Usuário reativado' : 'Usuário desativado',
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ success: false, error: 'Erro ao atualizar status do usuário' }, { status: 500 });
  }
}
