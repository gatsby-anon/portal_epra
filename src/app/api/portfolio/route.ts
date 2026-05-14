import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const items = await prisma.portfolioItem.findMany({
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar itens do portfólio' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = request.headers.get('x-user-role');
  const userId = request.headers.get('x-user-id');

  // D-20: Require ALUNO_INTERNO or ORIENTADOR role
  if (!role || (role !== 'ALUNO_INTERNO' && role !== 'ORIENTADOR')) {
    return NextResponse.json({ success: false, error: 'Permissão negada. Apenas alunos internos ou orientadores podem criar itens de portfólio.' }, { status: 403 });
  }

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Usuário não autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, images, technologies, repositoryLink } = body;

    // Validation
    if (!title || !description || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios: título, descrição e pelo menos uma imagem' }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check for unique slug
    const existing = await prisma.portfolioItem.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const item = await prisma.portfolioItem.create({
      data: {
        title,
        slug: finalSlug,
        description,
        images,
        technologies: technologies || [],
        repositoryLink: repositoryLink || null,
        authorId: userId,
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

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar item do portfólio' }, { status: 500 });
  }
}
