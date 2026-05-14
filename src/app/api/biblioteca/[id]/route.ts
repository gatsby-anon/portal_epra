import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resource = await prisma.libraryResource.findUnique({
      where: { id },
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

    if (!resource) {
      return NextResponse.json({ success: false, error: 'Recurso não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: resource });
  } catch (error) {
    console.error('Error fetching library resource:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar recurso' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = request.headers.get('x-user-role');
  const userId = request.headers.get('x-user-id');

  // D-20: Require ALUNO_INTERNO or ORIENTADOR role
  if (!role || (role !== 'ALUNO_INTERNO' && role !== 'ORIENTADOR')) {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Usuário não autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if resource exists
    const existingResource = await prisma.libraryResource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      return NextResponse.json({ success: false, error: 'Recurso não encontrado' }, { status: 404 });
    }

    // D-20: Allow update only if createdBy matches user.id or user.role === ORIENTADOR
    if (existingResource.createdById !== userId && role !== 'ORIENTADOR') {
      return NextResponse.json({ success: false, error: 'Você só pode editar recursos que criou' }, { status: 403 });
    }

    const { titulo, descricao, categoria, linguagem, tags, link } = body;

    // Validate categoria if provided
    if (categoria) {
      const validCategories = ['codigos', 'bibliotecas', 'materiais'];
      if (!validCategories.includes(categoria)) {
        return NextResponse.json({ success: false, error: 'Categoria inválida. Use: codigos, bibliotecas ou materiais' }, { status: 400 });
      }
    }

    const updatedResource = await prisma.libraryResource.update({
      where: { id },
      data: {
        ...(titulo && { titulo }),
        ...(descricao && { descricao }),
        ...(categoria && { categoria }),
        ...(linguagem !== undefined && { linguagem }),
        ...(tags && { tags }),
        ...(link && { link }),
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

    return NextResponse.json({ success: true, data: updatedResource });
  } catch (error) {
    console.error('Error updating library resource:', error);
    return NextResponse.json({ success: false, error: 'Erro ao atualizar recurso' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = request.headers.get('x-user-role');
  const userId = request.headers.get('x-user-id');

  // D-20: Require ALUNO_INTERNO or ORIENTADOR role
  if (!role || (role !== 'ALUNO_INTERNO' && role !== 'ORIENTADOR')) {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Usuário não autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check if resource exists
    const existingResource = await prisma.libraryResource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      return NextResponse.json({ success: false, error: 'Recurso não encontrado' }, { status: 404 });
    }

    // D-20: Allow delete only if createdBy matches user.id or user.role === ORIENTADOR
    if (existingResource.createdById !== userId && role !== 'ORIENTADOR') {
      return NextResponse.json({ success: false, error: 'Você só pode excluir recursos que criou' }, { status: 403 });
    }

    await prisma.libraryResource.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting library resource:', error);
    return NextResponse.json({ success: false, error: 'Erro ao excluir recurso' }, { status: 500 });
  }
}