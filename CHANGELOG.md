# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [3.1.0] - 2026-04-30
### Added
- Arquivo `dashboard-content.json` para desacoplar textos e dados mockados do painel administrativo.
- Mapeamento centralizado de cores (`colorMaps.ts`) em `@/components/ui/colorMaps.ts`.
- Implantação de `next/image` para avatar de usuários com `remotePatterns` para o provedor Google via `next.config.ts`.
- Implementação global de `@utility font-headline`, `@utility font-code` e `@utility font-body` no CSS global.
- Documentação centralizada em `ARCHITECTURE.md` para o módulo web `epra-portal`.

### Changed
- Substituição massiva de cores hardcoded no Tailwind (`bg-[#0D0D0D]`, `border-[#3A3A3A]`) por design tokens do projeto (`bg-surface-container-lowest`, `border-border-gray`, etc).
- As rotas `admin/page.tsx`, `content/page.tsx`, `profile/page.tsx` não contêm mais dados injetados inline; eles extraem do `dashboard-content.json`.
- A página de Login agora reaproveita globalmente o componente `<Header />` da Landing Page em vez de recriar sua estrutura e animações do zero.
- Os mapas de tradução visual duplicados (como `textColorMap`, `borderColorMap`, `ctaColorMap`) foram refatorados para importar diretamente da constante global `colorMaps`.

### Fixed
- Comportamento de cor de borda piscante para cores desconhecidas no componente `StatusBadge` agora aplica um tom fallback (`neon-green`) caso o nome da classe não seja resolvido.
- A indentação da página de login e sobreposição do flex layout foram reparados.
- Imports mortos não utilizados (como `<Image />` não usado e ícones soltos em shells administrativos) foram limpos.

### Added
- Estrutura inicial do `AdminShell.tsx` para unificação de rotas do Dashboard.
- `AuthContext` para gerenciar estado global de autenticação e níveis de acesso (EXTERNO, MEMBRO, ORIENTADOR).
- Rota de Login funcional (`/login`) com seleção de mock roles e redirect.
- Tela de Perfil (`/dashboard/profile`) migrada para Next.js.
- Tela Content Manager (`/dashboard/content`) migrada para Next.js, incluindo abas para Cursos, Desafios, Tutoriais e Depoimentos.
- Tela Controle de Acesso (`/dashboard/admin`) migrada para Next.js.
- Componente global `LogTerminal` extraído para uso reutilizável.
- API Mock routes em `/api/posts` para operações CRUD simuladas.

### Refactor
- Padronização dos headers das telas internas (Access Control, Content Mgr, Identity Core) seguindo o `Header.tsx` da Landing Page via Contextual Headers.
- Os labels e ações no front-end do Dashboard foram traduzidos e realinhados para corresponder estritamente ao diagrama UML de Casos de Uso.
- O componente `AdminShell` agora possui lógica condicional para exibir/ocultar links da sidebar com base nos privilégios de acesso do usuário.

### Fixed
- Inconsistência de grid lateral entre portal público e área administrativa resolvida usando o layout principal do Next.js.
- Remoção de botões visuais e elementos HTML estáticos "placeholders" que não tinham uso atrelado ao modelo mental da aplicação.
