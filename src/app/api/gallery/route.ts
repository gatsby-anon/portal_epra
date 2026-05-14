import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar imagens da galeria' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = request.headers.get('x-user-role');
  
  if (!role || (role !== 'ALUNO_INTERNO' && role !== 'ORIENTADOR')) {
    return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { url, alt } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL da imagem é obrigatória' }, { status: 400 });
    }

    const image = await prisma.galleryImage.create({
      data: { url, alt: alt || 'Imagem da galeria EPRA' },
    });

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({ success: false, error: 'Erro ao adicionar imagem' }, { status: 500 });
  }
}
