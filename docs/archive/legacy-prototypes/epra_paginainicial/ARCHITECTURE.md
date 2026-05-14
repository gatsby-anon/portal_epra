# **ARCHITECTURE.md \- EPRA Interface System**

## **1\. Visão Geral (System Overview)**

O **EPRA Portal** é estruturado como uma interface de missão crítica baseada em princípios de design industrial. A arquitetura foca na economia de tokens para desenvolvimento assistido por IA (Cursor) e na modularidade de componentes visuais "Glassmorphic".

## **2\. Stack Tecnológica**

* **Core:** React (Next.js) / Tailwind CSS.  
* **Estilização:** Utility-first com Design Tokens (DESIGN.md).  
* **Animações:** Framer Motion para efeitos de terminal e HUD.  
* **Ícones:** Lucide-React (Substituindo SVGs inline para poupar tokens).  
* **Dados:** content.json (Fonte única de verdade para textos).
* **Estado Global:** AuthContext (React Context API) para gerenciar avatar, nível de acesso (role) e persistência de sessão mockada via `localStorage`.

## **3\. Estrutura de Componentes "Token-Efficient"**

| Pasta/Arquivo | Responsabilidade | Meta de Código   |
| :---- | :---- | :---- |
| `/components/ui` | Átomos (Buttons, Input, GlassCard, LogTerminal). | Máximo 50-100 linhas. |
| `/components/sections` | Dobras principais da Landing Page (Hero, Courses, Metrics). | Máximo 150 linhas. |
| `/components/layout` | Componentes de casca (AdminShell, SectionWrapper). | Reutilização máxima. |

## **4\. Padrões de Implementação (Update v2.1)**

### **4.1. Contextual Headers**

Decisão Técnica: O header se adapta ao contexto. Na Landing Page (`/`), ele exibe o menu de âncoras. No Dashboard (`/dashboard`), o `AdminShell` injeta um header adaptado com barra de busca, notificações e avatar do usuário. Ambos mantêm o mesmo CSS base (`h-16`, cores) para evitar saltos visuais.

### **4.2. Gestão de Acesso (AuthContext)**

Três níveis lógicos alinhados com o Diagrama de Casos de Uso:
1. **EXTERNO**: Acesso apenas à Landing Page.
2. **MEMBRO**: Acesso ao Perfil e Content Manager (Cursos, Desafios, Tutoriais).
3. **ORIENTADOR**: Acesso total, incluindo Controle de Acesso (Admin Matrix) e System Logs.

## **5\. Regras de Manutenção (VIBE DEV™)**

* **Zero Hardcoding:** Textos e labels da área pública devem residir no `content.json`. Textos do Dashboard devem ser traduzidos e descritivos.
* **Componentização Reversa:** Se um padrão visual se repete 3 vezes, deve ser movido para `/ui`. O `LogTerminal` é um exemplo.