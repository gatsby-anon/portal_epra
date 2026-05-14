import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

const PUBLIC_ROUTES = [
  '/api/auth/register-v2',
  '/api/auth/login-v2',
  '/api/auth/activate-v2',
  '/api/auth/register',
  '/api/auth/login',
];

const PUBLIC_GET_ROUTES = [
  '/api/courses',
  '/api/challenges',
  '/api/testimonials',
  '/api/metrics',
  '/api/vagas',
  '/api/biblioteca',
  '/api/portfolio',
  '/api/gallery',
];


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isPublicGetRoute = PUBLIC_GET_ROUTES.some(route => pathname.startsWith(route));
  const isPublicCourseRead = pathname.startsWith('/api/courses') && request.method === 'GET';
  const isPublicVagasRead = pathname.startsWith('/api/vagas') && request.method === 'GET';
  const isPublicChallengeRead = pathname.startsWith('/api/challenges') && request.method === 'GET';
  const isPublicPortfolioRead = pathname.startsWith('/api/portfolio') && request.method === 'GET';

  if (isPublicRoute || isPublicGetRoute || isPublicCourseRead || isPublicVagasRead || isPublicChallengeRead || isPublicPortfolioRead) {
    // If it's a public route but they have a token, we still want to inject user headers
    // But we don't return 401 if they don't have one.
    const token = request.cookies.get('auth-token')?.value;
    if (token) {
      try {
        const payload = await verifyJWT(token);
        if (payload) {
          const requestHeaders = new Headers(request.headers);
          requestHeaders.set('x-user-id', payload.id as string);
          requestHeaders.set('x-user-email', payload.email as string);
          requestHeaders.set('x-user-role', payload.role as string);
          return NextResponse.next({ request: { headers: requestHeaders } });
        }
      } catch (e) {}
    }
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.id as string);
  requestHeaders.set('x-user-email', payload.email as string);
  requestHeaders.set('x-user-role', payload.role as string);


  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: '/api/:path*',
};