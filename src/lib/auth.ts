import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import type { UserRole } from '@prisma/client';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export async function signJWT(payload: object, expiresIn = '15m'): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function roleGuard(allowedRoles: UserRole[]) {
  return (role: UserRole): boolean => allowedRoles.includes(role);
}

export const ROLE_REDIRECTS: Record<string, string> = {
  ORIENTADOR: '/dashboard/admin',
  ALUNO_INTERNO: '/dashboard/content',
  USUARIO_EXTERNO: '/dashboard/profile',
};

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  course?: string;
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  const payload = await verifyJWT(token);
  if (!payload) return null;
  
  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };
}