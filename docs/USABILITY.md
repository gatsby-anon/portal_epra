# USABILITY.md - Acessibilidade e Usabilidade

## 1. Visão Geral

O EPRA Portal v5.0 segue as diretrizes **WCAG 2.1 Nível AA** para garantir que a interface seja utilizável por todos os usuários, incluindo pessoas com deficiência.

### Objetivos de Acessibilidade

| Objetivo | Descrição |
|----------|-----------|
| **Perceptível** | Informações apresentados de forma discernível |
| **Operável** | Interface navegável por teclado |
| **Compreensível** | Texto claro e previsível |
| **Robusto** | Compatível com tecnologias assistivas |

---

## 2. Contraste de Cores (Neon WCAG)

### 2.1 Problema: Cores Neon

Cores neon como **Neon Olive (#b1d35c)** e **Electric Blue (#b0c6ff)** podem falhar contraste quando usadas em backgrounds similares.

### 2.2 Solução: Tokens de Contraste

| Token | Hex | Ratio | WCAG |
|-------|-----|-------|------|
| `on-primary` | #273500 | 7.5:1 | ✅ AAA |
| `on-secondary` | #3a3000 | 12:1 | ✅ AAA |
| `on-tertiary` | #002d6f | 8.5:1 | ✅ AAA |
| `on-surface` | #e3e2e2 | 12:1 | ✅ AAA |

### 2.3 Regra de Ouro: Never Neon on Neon

```typescript
// ❌ ERRADO - Falha contraste
<span className="text-primary bg-primary">
  Texto aqui
</span>

// ✅ CORRETO - Contraste adequado
<span className="text-on-primary bg-primary">
  Texto aqui
</span>

// ❌ ERRADO - Neon em neon
<span className="text-tertiary bg-secondary-fixed">
  Falha contraste
</span>

// ✅ CORRETO - Fundo escuro
<span className="text-tertiary bg-surface-container-low">
  Contraste OK
</span>
```

### 2.4 Tabela de Combinações Válidas

| Background | Texto Válido | Texto Inválido |
|------------|--------------|----------------|
| `surface-container` | `on-surface`, `primary` | ❌ |
| `primary` | `on-primary` | `tertiary`, `secondary-fixed` |
| `surface-container-low` | `on-surface`, `primary` | ❌ |
| `surface-container-highest` | `on-surface`, `primary` | ❌ |

---

## 3. Navegação por Teclado

### 3.1 Ordem de Foco (Tab Order)

A ordem de foco deve seguir a ordem visual da página:

```
[1] HEADER
    [1.1] Logo (link para /)
    [1.2] Nav links (INICIO → SOBRE → DESAFIOS → TUTORIAL → CURSOS)
    [1.3] Botão Login

[2] HERO
    [2.1] Status indicator
    [2.2] Título
    [2.3] CTAs [VER CURSOS] [EXPLORAR TUTORIAIS]

[3] METRICS
    [3.1-3.4] Cards de métricas

[4] ... (seguir ordem visual)

[10] RECRUITMENT
    [10.1] CTA de inscrição
    [10.2] Footer links
```

### 3.2 Indicador de Foco Visível

```css
/* Estilo de foco para TODO elemento interativo */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  box-shadow: 0 0 8px rgba(177, 211, 92, 0.4);
}

/* Em elementos glass, ajustar outline */
.glass-card:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}
```

### 3.3 Atalhos de Teclado

| Atalho | Ação | Escopo |
|--------|------|--------|
| `Tab` | Próximo elemento | Global |
| `Shift + Tab` | Elemento anterior | Global |
| `Enter` | Ativar link/botão | Links e botões |
| `Escape` | Fechar modal/menu | Modais |
| `Space` | Ativar botão | Botões |

---

## 4. Semântica HTML

### 4.1 Elementos Estruturais

| Elemento | Uso Correto |
|----------|-------------|
| `<header>` | Cabeçalho do site |
| `<main>` | Conteúdo principal |
| `<nav>` | Navegação principal |
| `<section>` | Seções temáticas |
| `<article>` | Conteúdo independente (depoimentos) |
| `<footer>` | Rodapé |
| `<h1>` a `<h6>` | Hierarquia de títulos |

### 4.2 Exemplo de Estrutura

```html
<body>
  <header role="banner">
    <nav role="navigation" aria-label="Menu principal">
      <!-- Links de navegação -->
    </nav>
  </header>
  
  <main role="main">
    <section id="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">DECODE O FUTURO COM ROBÓTICA</h1>
      <!-- Conteúdo hero -->
    </section>
    
    <section id="metrics" aria-labelledby="metrics-title">
      <h2 id="metrics-title" class="sr-only">Métricas de Impacto</h2>
      <!-- Cards de métricas -->
    </section>
  </main>
  
  <footer role="contentinfo">
    <!-- Links do rodapé -->
  </footer>
</body>
```

---

## 5. ARIA Labels e Roles

### 5.1 Atributos ARIA Essenciais

| Atributo | Uso | Exemplo |
|----------|-----|---------|
| `aria-label` | Label descritivo | `aria-label="Navegação principal"` |
| `aria-labelledby` | Referência a label | `aria-labelledby="section-title"` |
| `aria-describedby` | Descrição adicional | `aria-describedby="btn-desc"` |
| `aria-hidden` | Esconder de AT | `aria-hidden="true"` |
| `role` | Papel semântico | `role="navigation"` |

### 5.2 Componentes Específicos

#### StatusBadge
```tsx
<span 
  role="status" 
  aria-label={`Status: ${status}`}
  className="text-primary"
>
  {status}
</span>
```

#### GlassCard
```tsx
<div 
  role="article" 
  aria-labelledby="card-title"
  className="glass-card"
>
  <h3 id="card-title">Título do Card</h3>
  <p>Conteúdo...</p>
</div>
```

#### LogTerminal
```tsx
<div 
  role="log" 
  aria-live="polite"
  aria-label="Terminal de logs do sistema"
>
  {logs.map(log => (
    <div key={log.timestamp}>{log.message}</div>
  ))}
</div>
```

---

## 6. Screen Reader Support

### 6.1 Classe SR-Only

```css
/* Para texto visível apenas para screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Manter visível quando focado (ex: skip links) */
.sr-only-focusable:focus,
.sr-only-focusable:focus-within {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### 6.2 Uso Correto

```tsx
// ❌ ERRADO - Título visível mas seção sem label
<section>
  <h2>Métricas</h2>
</section>

// ✅ CORRETO - Título como label da seção
<section aria-labelledby="metrics-title">
  <h2 id="metrics-title" className="sr-only">Métricas de Impacto</h2>
  {/* Visual: título estilizado diferente */}
  <h3 className="text-3xl font-headline">NOSSOS NÚMEROS</h3>
  {/* Cards */}
</section>
```

---

## 7. Motion e Animações

### 7.1 Respeitar Preferência Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 7.2 Implementação Framer Motion

```tsx
import { useReducedMotion } from 'framer-motion';

export function AnimatedCard({ children }) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
    >
      {children}
    </motion.div>
  );
}
```

### 7.3 Neon Pulse em Reduced Motion

```css
/* Desativar glow pulsante quando reduzido */
@media (prefers-reduced-motion: reduce) {
  .glow-active {
    animation: none;
    box-shadow: 0 0 5px rgba(177, 211, 92, 0.5);
  }
}
```

---

## 8. Guidelines Interface High-Tech

### 8.1 Terminologia do Sistema

| Termo | Significado | Contexto |
|-------|-------------|----------|
| **Terminal** | Interface de texto estilizada | Mission Log, Hero |
| **Protocolo** | Funcionalidade/Curso | "Protocolo Arduino", "Protocolo C++" |
| **Node** | Módulo de aprendizado | Module Grid |
| **Deploy** | Publicar conteúdo | Content Manager |

### 8.2 Padrões de Nomenclatura

| Elemento | Formato | Exemplo |
|---------|---------|---------|
| Labels | UPPERCASE | `TOTAL_ALUNOS`, `PROJECTS_DEPLOYED` |
| Status | UPPERCASE | `AO VIVO`, `EM ESPERA` |
| IDs | UPPER_SNAKE | `MOD_01`, `PROJECT_ORION_PHASE_1` |
| Buttons | [ bracketed ] | `[VER CURSOS]`, `[EXPLORAR TUTORIAIS]` |

### 8.3 Estados de Interface

| Estado | Visual | Uso |
|--------|--------|-----|
| **Default** | Neon padrão | Elementos normais |
| **Hover** | Glow aumentado | Interação mouse |
| **Focus** | Outline primary | Navegação teclado |
| **Active** | Background pressed | Click em botão |
| **Disabled** | Opacity 50% | Sem acesso |
| **Loading** | Spinner/pulse | Operação em progresso |

---

## 9. Checklist de Acessibilidade

### 9.1 Perceptível
- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande (18px+)
- [ ] Imagens têm alt text descritivo
- [ ] Áudio tem alternativas (futuro)

### 9.2 Operável
- [ ] Todos os elementos são navegáveis por Tab
- [ ] Indicador de foco visível em todos os elementos
- [ ] Sem armadilhas de teclado (focus trap apenas em modais)
- [ ] Skip links para conteúdo principal

### 9.3 Compreensível
- [ ] Labels em todos os inputs
- [ ] Mensagens de erro descritivas
- [ ] Idioma da página definido (`lang="pt-BR"`)
- [ ] Terminologia consistente

### 9.4 Robusto
- [ ] HTML semântico válido
- [ ] ARIA usado corretamente
- [ ] Compatível com NVDA, JAWS, VoiceOver

---

## 10. Regras de Ouro para IA

> **ATENÇÃO: Regras que a IA NUNCA deve violar ao editar este documento**

1. **Contraste WCAG** - Nunca neon sobre neon ou cores similares
2. **`on-primary`/`on-surface`** - Usar tokens de contraste, não invented colors
3. **Focus visible** - TODO elemento interativo deve ter indicador de foco
4. **Reduced motion** - Respeitar `prefers-reduced-motion`
5. **ARIA apenas quando necessário** - HTML semântico é preferível
6. **SR-only** - Usar classe para текст visível apenas para screen readers
7. **Semantic HTML** - Usar `<button>` para ações, `<a>` para links
8. **Não desabilitar zoom** - `user-scalable=no` é proibido

---

## 11. Referências

- [PRODUCT.md](./PRODUCT.md) - Personas
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Estrutura
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Tokens de cores
- [UX.md](./UX.md) - Fluxos
- WCAG 2.1: https://www.w3.org/TR/WCAG21/
- MDN ARIA: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA