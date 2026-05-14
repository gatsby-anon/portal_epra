import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');

    const where = categoria ? { categoria } : {};

    const resources = await prisma.libraryResource.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: resources });
  } catch (error) {
    console.error('Error fetching library resources:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar recursos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = request.headers.get('x-user-role');
  const userId = request.headers.get('x-user-id');

  // D-20: Require ALUNO_INTERNO or ORIENTADOR role
  if (!role || (role !== 'ALUNO_INTERNO' && role !== 'ORIENTADOR')) {
    return NextResponse.json({ success: false, error: 'Permissão negada. Apenas alunos internos ou orientadores podem criar recursos.' }, { status: 403 });
  }

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Usuário não autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { titulo, descricao, categoria, linguagem, tags, link } = body;

    // Validation
    if (!titulo || !descricao || !categoria || !link) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios: título, descrição, categoria e link' }, { status: 400 });
    }

    // Validate categoria
    const validCategories = ['codigos', 'bibliotecas', 'materiais'];
    if (!validCategories.includes(categoria)) {
      return NextResponse.json({ success: false, error: 'Categoria inválida. Use: codigos, bibliotecas ou materiais' }, { status: 400 });
    }

    const resource = await prisma.libraryResource.create({
      data: {
        titulo,
        descricao,
        categoria,
        linguagem: linguagem || null,
        tags: tags || [],
        link,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: resource }, { status: 201 });
  } catch (error) {
    console.error('Error creating library resource:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar recurso' }, { status: 500 });
  }
}