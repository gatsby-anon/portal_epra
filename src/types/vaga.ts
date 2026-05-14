export interface OpportunityRecord {
  id: string;
  titulo: string;
  descricao: string;
  vagas: number;
  dataLimite: string | null;
  status: "Open" | "Closed";
  createdAt: string;
  updatedAt: string;
  _count?: { applications: number };
}

export interface ApplicationRecord {
  id: string;
  nome: string;
  email: string;
  curso: string;
  semestre: string;
  linkedInUrl: string | null;
  pdfUrl: string;
  opportunityId: string;
  userId: string | null;
  createdAt: string;
  opportunity?: OpportunityRecord;
}

export interface OpportunityWithStatus extends OpportunityRecord {
  applicationCount: number;
  isOpen: boolean;
}

export interface CreateOpportunityPayload {
  titulo: string;
  descricao: string;
  vagas: number;
  dataLimite?: string;
  status?: "Open" | "Closed";
}

export interface ApplicationPayload {
  nome: string;
  email: string;
  curso: string;
  semestre: string;
  linkedInUrl?: string;
  pdfUrl: string;
  opportunityId: string;
}