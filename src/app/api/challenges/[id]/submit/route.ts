import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { submissionSchema } from '@/lib/validation';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: challengeId } = await params;
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Faça login para submeter' }, { status: 401 });
    }
    
    const token = authHeader.slice(7);
    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }
    
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    
    if (!challenge) {
      return NextResponse.json({ success: false, error: 'Desafio não encontrado' }, { status: 404 });
    }
    
    if (new Date(challenge.dataLimite) <= new Date()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Prazo para submissão encerrado' 
      }, { status: 400 });
    }
    
    const body = await req.json();
    const validation = submissionSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: validation.error.issues[0].message 
      }, { status: 400 });
    }
    
    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        challengeId,
        urlGithub: body.githubUrl,
      },
    });
    
    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ 
        success: false, 
        error: 'Você já submeteu uma solução para este desafio' 
      }, { status: 409 });
    }
    
    console.error('Error submitting solution:', error);
    return NextResponse.json({ success: false, error: 'Erro ao submeter solução' }, { status: 500 });
  }
}