# ARCHITECTURE.md - Arquitetura do Sistema

## 1. Visão Geral da Arquitetura

O EPRA Portal v5.0 é um **Research Management System** que atualmente opera em arquitetura **standalone Next.js 15**, com planejamento para evolução para Monorepo Turborepo em fases futuras.

### Estado Atual: Transição v3.0.42 → v5.0

| Fase | Arquitetura | Status |
|------|-------------|--------|
| **Atual** | Next.js 15 Standalone | ✅ Ativo |
| **Futura** | Monorepo Turborepo | 📋 Planejado |
| **Futura** | Component Library | 📋 Planejado |

---

## 2. Stack Tecnológica

### 2.1 Stack Atual

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | 19.x | Framework UI |
| **Next.js** | 15.x | App Router, SSR |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 4.x | Estilização |
| **Framer Motion** | 12.x | Animações |
| **Lucide React** | 1.14.x | Ícones |

### 2.2 Estrutura de Pastas

```
epra-portal/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing Page
│   │   ├── layout.tsx            # Layout raiz
│   │   ├── globals.css          # Estilos globais
│   │   ├── login/
│   │   │   └── page.tsx         # Página de login
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Dashboard principal
│   │   │   ├── layout.tsx       # Layout admin
│   │   │   ├── profile/
│   │   │   │   └── page.tsx     # Identity Core
│   │   │   ├── content/
│   │   │   │   └── page.tsx     # Content Manager
│   │   │   └── admin/
│   │   │       └── page.tsx     # Access Control
│   │   └── api/
│   │       └── posts/
│   │           └── route.ts     # API mock
│   ├── components/
│   │   ├── ui/                   # Componentes reutilizáveis
│   │   │   ├── GlassCard.tsx
│   │   │   ├── GlowButton.tsx
│   │   │   ├��─ StatusBadge.tsx
│   │   │   ├── LogTerminal.tsx
│   │   │   ├── colorMaps.ts
│   │   │   └── ...
│   │   ├── layout/
│   │   │   └── AdminShell.tsx
│   │   └── sections/            # Seções da Landing Page
│   │       ├── Hero.tsx
│   │       ├── Metrics.tsx
│   │       ├── MissionLog.tsx
│   │       ├── ModuleGrid.tsx
│   │       ├── Challenge.tsx
│   │       ├── Testimonials.tsx
│   │       ├── Courses.tsx
│   │       ├── Portfolio.tsx
│   │       ├── Recruitment.tsx
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── data/
│   │   ├── content.json         # Dados públicos
│   │   └── dashboard-content.json # Dados admin
│   ├── context/
│   │   └── AuthContext.tsx      # Contexto de autenticação
│   ├── hooks/
│   │   └── useSmoothScroll.ts
│   └── lib/
│       └── (utilitários futuros)
├── public/
│   ├── images/
│   └── icons/
├── docs/                        # Documentação
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Renderização: Server vs Client Components

### 3.1 Server Components (Padrão)

Componentes que renderizam no servidor por padrão:

```typescript
// app/page.tsx - Server Component
import Hero from '@/components/sections/Hero';
import Metrics from '@/components/sections/Metrics';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Metrics />
      {/* ... outras seções Server */}
    </main>
  );
}
```

### 3.2 Client Components (Interatividade)

Componentes que necessitam de estado ou eventos:

```typescript
// src/components/ui/GlowButton.tsx
'use client';

import { useState } from 'react';
// Interatividade aqui
```

### 3.3 Critérios de Decisão

| Usa... | Componente | Tipo |
|--------|------------|------|
| useState, useEffect | Sim | Client |
| event handlers | Sim | Client |
| browser APIs | Sim | Client |
|fetch de dados estáticos | Não | Server |

---

## 4. Sistema de Dados (Mock)

### 4.1 content.json (Dados Públicos)

```typescript
interface ContentData {
  system: {
    id: string;           // "EPRA-v3.0"
    name: string;         // "EPRA // TERMINAL"
    version: string;      // "3.0.42"
  };
  nav: NavItem[];
  hero: HeroContent;
  stats: StatItem[];
  mission: MissionContent;
  modules: ModuleItem[];
  challenge: ChallengeContent;
  testimonials: TestimonialItem[];
  courses: CourseItem[];
  portfolio: PortfolioItem[];
}
```

### 4.2 dashboard-content.json (Dados Admin)

```typescript
interface DashboardData {
  admin: {
    logs: LogEntry[];
    users: UserEntry[];
    alert: AlertContent;
  };
  content: {
    projects: ProjectItem[];
  };
  profile: {
    security: SecurityData;
    activity: ActivityEntry[];
  };
}
```

---

## 5. Sistema de Permissões (RBAC)

### 5.1 Níveis de Acesso

| Nível | Role | Descrição |
|-------|------|-----------|
| 1 | **USUARIO_EXTERNO** | Visitante, apenas landing page |
| 2 | **ALUNO_INTERNO** | Aluno ativo, acesso intermediário |
| 3 | **ORIENTADOR** | Professor, acesso total |

### 5.2 Permissões por Role

| Recurso | USUARIO_EXTERNO | ALUNO_INTERNO | ORIENTADOR |
|---------|---------|--------|------------|
| Landing Page | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| Identity Core | ❌ | ✅ | ✅ |
| Content Manager | ❌ | ✅ | ✅ |
| Access Control | ❌ | ❌ | ✅ |
| Log Terminal | ❌ | ❌ | ✅ |

### 5.3 Implementação

```typescript
// src/context/AuthContext.tsx
interface AuthUser {
  role: 'USUARIO_EXTERNO' | 'ALUNO_INTERNO' | 'ORIENTADOR';
  name: string;
  avatar?: string;
}

function hasPermission(user: AuthUser, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role);
}
```

---

## 6. Evolução Planejada: v5.0

### 6.1 Monorepo Turborepo

```
epra/
├── apps/
│   ├── web/              # Next.js atual
│   └── admin/            # Painel admin separado (futuro)
├── packages/
│   ├── ui/               # Component Library
│   ├── config/           # Configurações compartilhadas
│   └── utils/            # Utilitários
├── turbo.json
└── package.json
```

### 6.2 Banco de Dados (Futuro)

| Fase | Tecnologia | Status |
|------|------------|--------|
| Atual | JSON Mock | ✅ |
| v5.0 | PostgreSQL | 📋 Planejado |
| v5.0 | Prisma ORM | 📋 Planejado |

### 6.3 Autenticação (Futuro)

| Fase | Solução | Status |
|------|---------|--------|
| Atual | AuthContext mock | ✅ |
| Sprint Atual | JWT tokens | 🚧 Em Progresso |
| v5.0 | NextAuth.js | 📋 Planejado |

---

## 6.5 Módulos Adicionados (v0.2.0)

### app_users (Identidade)
- **Auth Strategy:** JWT + RBAC.
- **Roles:** ORIENTADOR, ALUNO_INTERNO, USUARIO_EXTERNO.
- **Integrations:** SMTP Service para ativação de contas.

### app_content (Gerenciamento de Conteúdo)
- Placeholder para a migração dos dados do dashboard.

---

## 7. API Routes (Mock Atual)

### 7.1 POST /api/posts

```typescript
// src/app/api/posts/route.ts
export async function POST(request: Request) {
  // Implementação mock para CRUD
  return Response.json({ success: true });
}
```

### 7.2 Auth API Routes (Mock Atual)

```typescript
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/activate
```

### 7.3 Schema Futuro

```typescript
// Schema Prisma planejado
model User {
  id                String    @id @default(cuid())
  fullName          String
  email             String    @unique
  passwordHash      String
  role              Role      @default(USUARIO_EXTERNO)
  course            String?
  isEmailConfirmed  Boolean   @default(false)
  activationToken   String?
  activationExpires DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

enum Role {
  USUARIO_EXTERNO
  ALUNO_INTERNO
  ORIENTADOR
}
```

---

## 8. Regras de Ouro para IA

> **ATENÇÃO: Regras que a IA NUNCA deve violar ao editar este documento**

1. **Server Components por padrão** - usar `use client` apenas quando necessário
2. **JSON como fonte única** - não criar novos arquivos de dados sem atualizar content.json
3. **RBAC respeitado** - todas as rotas devem verificar permissions via AuthContext
4. **Design Tokens** - usar `surface-container-low` ao invés de `#1A1A1A`
5. **Imports com @/** - usar path alias, não imports relativos longos
6. **Estado transitório** - documentar que estado atual é mock e será migrado

---

## 9. Referências

- [PRODUCT.md](./PRODUCT.md) - Visão do produto
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Tokens e estilos
- [UX.md](./UX.md) - Jornada do usuário
- [USABILITY.md](./USABILITY.md) - Acessibilidade
- `src/context/AuthContext.tsx` - Implementação RBAC
- `src/data/content.json` - Dados públicos
- `src/data/dashboard-content.json` - Dados admin