import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { challengeSchema } from '@/lib/validation';

export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { submissions: true } },
      },
    });
    
    const challengesWithStatus = challenges.map(c => ({
      ...c,
      isOpen: new Date(c.dataLimite) > new Date(),
    }));
    
    return NextResponse.json({ success: true, data: challengesWithStatus });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar desafios' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
    
    const challenge = await prisma.challenge.create({
      data: {
        titulo: body.titulo,
        descricao: body.descricao,
        dataLimite: new Date(body.dataLimite),
        urlGithub: body.urlGithub || null,
        instrutor: body.instrutor,
      },
    });
    
    return NextResponse.json({ success: true, data: challenge }, { status: 201 });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar desafio' }, { status: 500 });
  }
}