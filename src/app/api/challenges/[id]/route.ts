import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { challengeSchema } from '@/lib/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        _count: { select: { submissions: true } },
      },
    });
    
    if (!challenge) {
      return NextResponse.json({ success: false, error: 'Desafio não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { ...challenge, isOpen: new Date(challenge.dataLimite) > new Date() } 
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar desafio' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let token = req.headers.get('authorization')?.slice(7);
    
    if (!token) {
      const cookieHeader = req.headers.get('cookie');
      const tokenMatch = cookieHeader?.match(/auth-token=([^;]+)/);
      token = tokenMatch?.[1];
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
    }
    
    const user = await verifyToken(token);
    
    if (!user || (user.role !== 'ALUNO_INTERNO' && user.role !== 'ORIENTADOR')) {
      return NextResponse.json({ success: false, error: 'Permissão insuficiente' }, { status: 403 });
    }
    
    const body = await req.json();
    const validation = challengeSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Dados inválidos',
        details: validation.error.issues 
      }, { status: 400 });
    }
    
    const challenge = await prisma.challenge.update({
      where: { id },
      data: {
        titulo: body.titulo,
        descricao: body.descricao,
        dataLimite: new Date(body.dataLimite),
        urlGithub: body.urlGithub || null,
        instrutor: body.instrutor,
      },
    });
    
    return NextResponse.json({ success: true, data: challenge });
  } catch (error) {
    console.error('Error updating challenge:', error);
    return NextResponse.json({ success: false, error: 'Erro ao atualizar desafio' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let token = req.headers.get('authorization')?.slice(7);
    
    if (!token) {
      const cookieHeader = req.headers.get('cookie');
      const tokenMatch = cookieHeader?.match(/auth-token=([^;]+)/);
      token = tokenMatch?.[1];
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
    }
    
    const user = await verifyToken(token);
    
    if (!user || user.role !== 'ORIENTADOR') {
      return NextResponse.json({ success: false, error: 'Permissão insuficiente' }, { status: 403 });
    }
    
    await prisma.challenge.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    return NextResponse.json({ success: false, error: 'Erro ao excluir desafio' }, { status: 500 });
  }
}