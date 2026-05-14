# **ARCHITECTURE.md \- EPRA Portal**

## **1\. Visão Geral (System Overview)**

O **EPRA Portal** consolida a Landing Page de alta performance visual com os painéis administrativos interativos. Ele é construído com princípios industriais e design retro-futurista (Cyberpunk Industrial), focado em fornecer uma interface de sistema limpa, densa e esteticamente agradável usando Glassmorphism e tipografia técnica `Space Grotesk`.

## **2\. Stack Tecnológica**

* **Core:** React 19 / Next.js 15 (App Router).
* **Estilização:** Tailwind CSS v4 com sistema rígido de Design Tokens (cores, fontes e containers).
* **Animações:** Framer Motion para efeitos de terminal, transições de páginas e componentes (HUD elements).
* **Ícones:** Lucide-React (Substituindo SVGs inline para economia de payload e uniformização visual).
* **Dados Públicos:** `src/data/content.json` (Textos, cursos, depoimentos institucionais).
* **Dados Administrativos:** `src/data/dashboard-content.json` (Logs, dados de sessão e alertas administrativos).
* **Autenticação:** Baseada na API Contexto do React (`AuthContext`) que simula papéis sistêmicos de nível de permissão (EXTERNO, MEMBRO, ORIENTADOR).

## **3\. Padrões e Regras de Implementação**

### **3.1. Reutilização Estrita de Headers**
Para preservar o conceito de "Portal Unificado", o cabeçalho (`Header.tsx`) é único e reage de acordo com o escopo global. Rotas da Landing Page usam o sistema interno para scroll suave (`useSmoothScroll`), enquanto rotas como `/login` usam o Next Router para desviar navegação.

### **3.2. Centralização de Classes Tailwind Dinâmicas**
O TailwindCSS v4 utiliza o sistema de purga agressiva. Assim sendo, classes com literais de interpolação (`bg-${color}`) são gerenciadas via lookups globais definidos no `src/components/ui/colorMaps.ts`. Exceções de utilitários como `font-headline` são garantidos diretamente em `globals.css` usando `@utility`.

### **3.3. Tokens ao invés de Valores Fixos**
* **NÃO use** cores em formato hexadecimal direto (ex: `#1A1A1A` ou `#0D0D0D`). 
* **Use SEMPRE** Design Tokens embutidos na configuração do Tailwind (`surface-container-low`, `border-border-gray`, `on-surface`, etc).

## **4\. Permissões de Usuário (RBAC)**
* **EXTERNO**: Acesso apenas a áreas públicas (Landing Page e Login).
* **MEMBRO**: Acesso a Identity Core (Perfil) e Console de Conteúdo de Projetos. Sem direitos de Admin Shell ou Telemetria Log Terminal.
* **ORIENTADOR**: Acesso total de Override ao sistema. Capacidade de visualização da Matriz de Autenticação e bloqueios de Protocolos no `AccessControlPage`.
