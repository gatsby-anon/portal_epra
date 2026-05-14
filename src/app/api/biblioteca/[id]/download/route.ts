import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // D-19: Download requires authentication
  // The middleware ensures only authenticated users reach this route
  // (not in PUBLIC_GET_ROUTES, so middleware requires auth for POST)

  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');

  // Double-check authentication (defensive)
  if (!userId || !userRole) {
    return NextResponse.json(
      { success: false, error: 'auth_required', redirectUrl: '/register' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    // Find resource by id
    const resource = await prisma.libraryResource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json({ success: false, error: 'Recurso não encontrado' }, { status: 404 });
    }

    // Atomic increment of download counter
    const updatedResource = await prisma.libraryResource.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 },
      },
    });

    // Return success with external URL
    return NextResponse.json({
      success: true,
      data: {
        externalUrl: resource.link,
        downloadCount: updatedResource.downloadCount,
      },
    });
  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json({ success: false, error: 'Erro ao processar download' }, { status: 500 });
  }
}