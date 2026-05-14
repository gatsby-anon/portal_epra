export function generateToken(length = 32): string {
  // Mock JWT generator (In v5.0 this will use jose or jsonwebtoken)
  const chars = 'abcdef0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export function generateActivationToken(): { token: string; expires: Date } {
  const token = generateToken(64);
  const expires = new Date();
  expires.setHours(expires.getHours() + 24); // 24h expiry
  return { token, expires };
}

export const ROLE_REDIRECTS: Record<string, string> = {
  ORIENTADOR: '/dashboard/admin',
  ALUNO_INTERNO: '/dashboard/content',
  USUARIO_EXTERNO: '/dashboard/profile',
};

export function validatePassword(password: string): boolean {
  // RF-01: Senha mínimo 8 caracteres
  return password.length >= 8;
}
