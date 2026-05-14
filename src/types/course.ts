export interface CourseRecord {
  id: string;
  titulo: string;
  descricao: string;
  cargaHoraria: number;
  vagas: number;
  dataLimite: string; // ISO date string
  horario: string;
  instrutor: string;
  createdAt: string;
  updatedAt: string;
  _count?: { enrollments: number };
}

export interface EnrollmentRecord {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  user?: { id: string; fullName: string; email: string };
  course?: CourseRecord;
}

export interface CourseWithAvailability extends CourseRecord {
  enrollmentCount: number;
  isOpen: boolean; // derived: deadline not passed AND vacancies available
}

export interface CreateCoursePayload {
  titulo: string;
  descricao: string;
  cargaHoraria: number;
  vagas: number;
  dataLimite: string;
  horario: string;
  instrutor: string;
}

export interface EnrollmentPayload {
  courseId: string;
}
