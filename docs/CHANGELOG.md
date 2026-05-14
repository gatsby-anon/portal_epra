# CHANGELOG.md - Histórico de Versões

## Visão Geral

Este documento registra todas as versões do **EPRA Portal** desde a concepção até a versão atual.

> **Nota:** Registros históricos das versões v1-v4 não estão disponíveis. O sistema atual evoluiu de um protótipo interno com a versão标识 `EPRA-v3.0` (3.0.42).

---

## [Unreleased]

### Planejado para v5.0

#### Added
- [ ] Estrutura Monorepo com Turborepo
- [ ] packages/ui para Component Library
- [ ] Banco de dados PostgreSQL
- [ ] Prisma ORM
- [ ] NextAuth.js com JWT
- [ ] apps/admin para painel administrativo separado
- [ ] API routes RESTful
- [ ] Sistema de autenticação real
- [ ] Formulário de inscrição com persistência
- [ ] Sistema de aprovação de inscrições
- [ ] Email de notificação (via SendGrid/Resend)

#### Technical Debt
- [ ] Migrar de JSON mock para banco de dados
- [ ] Implementar testes E2E (Playwright)
- [ ] Implementar testes unitários (Vitest)
- [ ] Setup CI/CD (GitHub Actions)

---

## [v0.2.0] - 2026-05-01

### Added
- Especificação técnica dos módulos `app_users` e `app_content`.
- Definição de fluxos para UC1 (Cadastro) e UC2 (Login).
- Estrutura de redirecionamento baseada em perfis (RBAC).

### Security
- Requisito de criptografia AES-256 e hash de senhas (LGPD Compliance).

### Changed
- Migração do vocabulário de papéis (Role vocabulary): `EXTERNO` → `USUARIO_EXTERNO`, `MEMBRO` → `ALUNO_INTERNO`.

---

## [3.1.0] - 2026-04-30

### Added

- **Dashboard administrativo completo**
  - `AdminShell.tsx` - Layout unificado para rotas do dashboard
  - `AuthContext.tsx` - Gerenciamento de estado de autenticação
  - Rotas: `/login`, `/dashboard/profile`, `/dashboard/content`, `/dashboard/admin`

- **Sistema de autenticação mockado**
  - 3 níveis de acesso: EXTERNO, MEMBRO, ORIENTADOR
  - Seleção de role para demonstração
  - Redirect baseado em permissões

- **Content Manager**
  - Tabs: Cursos, Desafios, Tutoriais, Depoimentos
  - CRUD simulado com `dashboard-content.json`
  - Status PUSH (IDLE → PUSHING → SUCCESS)

- **Log Terminal**
  - Componente `LogTerminal.tsx` reutilizável
  - Logs formatados com timestamp, level e message

- **Arquivos de dados separados**
  - `content.json` - Dados públicos da Landing Page
  - `dashboard-content.json` - Dados administrativos

- **Mapeamento centralizado de cores**
  - `colorMaps.ts` - Constantes para `colorMaps`
  -lookups para classes Tailwind dinâmicas

- **Documentação**
  - `ARCHITECTURE.md` - Documentação técnica do módulo
  - `CHANGELOG.md` - Registro de versões

### Changed

- **Refatoração de cores**
  - Substituição de valores hex hardcoded por Design Tokens
  - Tokens migrados: `bg-surface-container-low`, `border-outline`, `text-on-surface`

- **Header global**
  - Página de Login reutiliza `<Header />` da Landing Page
  - Animação consistente entre páginas

- **Refatoração de componentes**
  - `colorMaps.ts` importado em todos os componentes que usam cores
  - Remoção de mapas duplicados (textColorMap, borderColorMap, ctaColorMap)

### Fixed

- **StatusBadge**
  - Comportamento de fallback para cores desconhecidas
  - Neon-green como cor padrão quando não resolvido

- **Login page**
  - Indentação e sobreposição do flex layout reparadas
  - Espaçamento consistente

- **Imports**
  - Remoção de imports não utilizados
  - Componentes limpos

---

## [3.0.42] - Versão Atual do Sistema

> **Nota:** Esta é a versão referenciada em `content.json` como `EPRA-v3.0`.

### Overview

Landing Page completa com 10 seções, estilizada com o Design System Neon Pulse (Cyberpunk Industrial).

### Seções Implementadas

| Seção | Status | Descrição |
|-------|--------|-----------|
| Header | ✅ | Navegação com scroll suave |
| Hero | ✅ | Terminal principal com CTAs |
| Metrics | ✅ | Dashboard de impacto (4 cards) |
| MissionLog | ✅ | História UFC com animação terminal |
| ModuleGrid | ✅ | 5 nodes de aprendizado |
| Challenge | ✅ | Protocolo de Alarme com imagem |
| Testimonials | ✅ | 3 depoimentos com avatar |
| Courses | ✅ | Grid de cursos |
| Portfolio | ✅ | Showcase de hardware |
| Recruitment/Footer | ✅ | CTA + informações |

### Features

- **Scroll Suave** - Navegação com `useSmoothScroll`
- **Glassmorphism** - Cards com backdrop-blur
- **Animações Neon** - Glow em elementos interativos
- **Responsividade** - Mobile-first

---

## [v3.0.x] - Série de Desenvolvimento

### Added (Série)

- Design System Neon Pulse implementado
- Space Grotesk como fonte principal
- Tokens de cores (Neon Olive, Electric Blue, Vibrant Yellow)
- GlassCard, GlowButton, StatusBadge components
- Lucide React para ícones
- Framer Motion para animações

### Technical

- Next.js 15 App Router
- TypeScript strict mode
- Tailwind CSS v4
- ESLint configurado

---

## [v1-v2] - Registros Historicos Indisponíveis

> **Nota:** Historical records not available for versions v1-v2.

### O que se sabe

- **v1.x**: Protótipo inicial com HTML/CSS estático
- **v2.x**: Migração para React, início do design system
- **v3.0**: Refatoração completa para Next.js, início da Landing Page

### Evolução Conhecida

```
v1.0 (Static) 
    ↓
v2.0 (React SPA)
    ↓
v3.0 (Next.js App Router) ← Current codebase foundation
    ↓
v3.1 (Admin Dashboard) ← Current
    ↓
v5.0 (Monorepo + SQL) ← Planned
```

---

## Versionamento Semântico

O EPRA Portal segue **SemVer**:

| Segmento | Exemplo | Significado |
|----------|---------|-------------|
| Major (v5) | Breaking changes | Arquitetura nova |
| Minor (v3.1) | Features | Funcionalidades |
| Patch (v3.0.42) | Bug fixes | Correções |

---

## Formato de Entrada

```markdown
## [VERSION] - DATE

### Added
- Nova funcionalidade

### Changed
- Alteração existente

### Fixed
- Correção de bug

### Deprecated
- Funcionalidade removida futuramente

### Removed
- Funcionalidade removida
```

---

## Regras de Ouro para IA

> **ATENÇÃO: Regras que a IA NUNCA deve violar ao editar este documento**

1. **Ordem cronológica** - Entradas mais recentes primeiro
2. **Uma seção por change type** - Added, Changed, Fixed, etc.
3. **Versão atual** - Manter `[Unreleased]` no topo
4. **Data real** - Usar formato `YYYY-MM-DD`
5. **Breaking changes** - Documentar claramente
6. **Não inventar** - Apenas mudanças reais
7. **Links** - Referenciar issues/pr se aplicável

---

## Referências

- [PRODUCT.md](./PRODUCT.md) - Visão do produto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Estrutura técnica
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Tokens e estilos
- `src/data/content.json` - Dados do sistema com versão
- `src/data/dashboard-content.json` - Dados admin