import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const item = await prisma.portfolioItem.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ success: false, error: 'Portfólio não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar portfólio' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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
    const { slug } = await params;
    const body = await request.json();

    // Check if item exists
    const existingItem = await prisma.portfolioItem.findUnique({
      where: { slug },
    });

    if (!existingItem) {
      return NextResponse.json({ success: false, error: 'Portfólio não encontrado' }, { status: 404 });
    }

    // D-20: Allow update only if authorId matches user.id or user.role === ORIENTADOR
    if (existingItem.authorId !== userId && role !== 'ORIENTADOR') {
      return NextResponse.json({ success: false, error: 'Você só pode editar portfólios que criou' }, { status: 403 });
    }

    const { title, description, images, technologies, repositoryLink } = body;

    let newSlug = existingItem.slug;
    if (title && title !== existingItem.title) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const existingWithSlug = await prisma.portfolioItem.findUnique({ where: { slug: generatedSlug } });
      newSlug = existingWithSlug && generatedSlug !== existingItem.slug 
        ? `${generatedSlug}-${Date.now().toString().slice(-4)}` 
        : generatedSlug;
    }

    const updatedItem = await prisma.portfolioItem.update({
      where: { slug },
      data: {
        ...(title && { title, slug: newSlug }),
        ...(description && { description }),
        ...(images && { images }),
        ...(technologies && { technologies }),
        ...(repositoryLink !== undefined && { repositoryLink }),
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json({ success: false, error: 'Erro ao atualizar portfólio' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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
    const { slug } = await params;

    // Check if item exists
    const existingItem = await prisma.portfolioItem.findUnique({
      where: { slug },
    });

    if (!existingItem) {
      return NextResponse.json({ success: false, error: 'Portfólio não encontrado' }, { status: 404 });
    }

    // D-20: Allow delete only if authorId matches user.id or user.role === ORIENTADOR
    if (existingItem.authorId !== userId && role !== 'ORIENTADOR') {
      return NextResponse.json({ success: false, error: 'Você só pode excluir portfólios que criou' }, { status: 403 });
    }

    await prisma.portfolioItem.delete({ where: { slug } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json({ success: false, error: 'Erro ao excluir portfólio' }, { status: 500 });
  }
}
