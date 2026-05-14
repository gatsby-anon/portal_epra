import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  course: z.string().optional(),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar os termos de uso',
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  course: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const courseSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  cargaHoraria: z.number().int().positive('Carga horária deve ser positiva'),
  vagas: z.number().int().positive('Vagas deve ser um número positivo'),
  dataLimite: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data limite inválida',
  }),
  horario: z.string().min(1, 'Horário é obrigatório'),
  instrutor: z.string().min(2, 'Nome do instrutor deve ter pelo menos 2 caracteres'),
});

export const enrollmentSchema = z.object({
  courseId: z.string().min(1, 'ID do curso é obrigatório'),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

const githubUrlRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;

export const challengeSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  dataLimite: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data limite inválida',
  }),
  urlGithub: z.string().url().optional().or(z.literal('')),
  instrutor: z.string().min(2, 'Nome do instrutor deve ter pelo menos 2 caracteres'),
});

export const submissionSchema = z.object({
  githubUrl: z.string()
    .refine((val) => githubUrlRegex.test(val), {
      message: 'URL do GitHub deve seguir o formato: https://github.com/owner/repo',
    }),
  observacoes: z.string().optional(),
});

export type ChallengeInput = z.infer<typeof challengeSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;

export const opportunitySchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  vagas: z.number().int().positive("Vagas deve ser um número positivo"),
  dataLimite: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Data limite inválida",
  }),
  status: z.enum(["Open", "Closed"]).default("Open"),
});

export const applicationSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  curso: z.string().min(1, "Curso é obrigatório"),
  semestre: z.string().min(1, "Semestre é obrigatório"),
  linkedInUrl: z.string().url().optional().or(z.literal("")),
  pdfUrl: z.string().url("Link do currículo é obrigatório"),
  opportunityId: z.string().min(1, "ID da vaga é obrigatório"),
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;