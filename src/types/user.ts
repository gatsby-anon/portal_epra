export type UserRole = 'ORIENTADOR' | 'ALUNO_INTERNO' | 'USUARIO_EXTERNO';

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  course?: string;
  isEmailConfirmed: boolean;
  activationToken?: string;
  activationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  course?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<UserRecord, 'passwordHash' | 'activationToken'>;
  error?: string;
  redirectTo?: string;
}
