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
    const { targetRole } = await req.json();

    if (!['ALUNO_INTERNO', 'USUARIO_EXTERNO'].includes(targetRole)) {
      return NextResponse.json({ success: false, error: 'Papel inválido' }, { status: 400 });
    }

    const action = targetRole === 'ALUNO_INTERNO' ? AuditAction.ROLE_PROMOTION : AuditAction.ROLE_REVOCATION;

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: targetUserId },
        data: { role: targetRole },
      }),
      prisma.auditLog.create({
        data: {
          action,
          actorId,
          targetUserId,
          details: `Role alterado para ${targetRole}`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ success: false, error: 'Erro ao atualizar papel do usuário' }, { status: 500 });
  }
}
