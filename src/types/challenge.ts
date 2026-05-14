export interface ChallengeRecord {
  id: string;
  titulo: string;
  descricao: string;
  dataLimite: string;
  urlGithub: string | null;
  instrutor: string;
  createdAt: string;
  updatedAt: string;
  _count?: { submissions: number };
}

export interface ChallengeSubmissionRecord {
  id: string;
  userId: string;
  challengeId: string;
  githubUrl: string;
  observacoes: string | null;
  submittedAt: string;
  user?: { id: string; fullName: string; email: string; course: string | null };
  challenge?: ChallengeRecord;
}

export interface ChallengeWithSubmissions extends ChallengeRecord {
  submissionCount: number;
  isOpen: boolean;
}

export interface CreateChallengePayload {
  titulo: string;
  descricao: string;
  dataLimite: string;
  urlGithub?: string;
  instrutor: string;
}

export interface SubmitSolutionPayload {
  githubUrl: string;
  observacoes?: string;
}