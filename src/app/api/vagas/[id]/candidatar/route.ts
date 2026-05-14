import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { applicationSchema } from '@/lib/validation';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      return NextResponse.json({ success: false, error: 'Vaga não encontrada' }, { status: 404 });
    }

    if (opportunity.status !== 'Open') {
      return NextResponse.json({ success: false, error: 'Vaga encerrada' }, { status: 400 });
    }

    const userId = request.headers.get('x-user-id') || undefined;

    if (userId) {
      const existingApp = await prisma.application.findUnique({
        where: {
          userId_opportunityId: {
            userId,
            opportunityId: id,
          },
        },
      });

      if (existingApp) {
        return NextResponse.json({ success: false, error: 'Você já se candidatou a esta vaga' }, { status: 400 });
      }
    }

    const application = await prisma.application.create({
      data: {
        nome: parsed.data.nome,
        email: parsed.data.email,
        curso: parsed.data.curso,
        semestre: parsed.data.semestre,
        linkedInUrl: parsed.data.linkedInUrl || null,
        pdfUrl: parsed.data.pdfUrl,
        opportunityId: id,
        userId: userId || null,
      },
    });

    sendConfirmationEmail(parsed.data.email, opportunity.titulo).catch(console.error);

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    console.error('[CANDIDATAR] Error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao enviar candidatura' }, { status: 500 });
  }
}