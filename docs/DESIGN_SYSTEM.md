# DESIGN_SYSTEM.md - Sistema de Design Neon Pulse

## 1. Visão Geral

O EPRA Portal utiliza o **Neon Pulse Design System**, uma estética **Cyberpunk Industrial** que combina alta tecnologia com rugged utilitarianism. O visual evoca "factory-floor futurism" - onde robótica avançada encontra engenharia confiável e de alta resistência.

### Princípios de Design

| Princípio | Descrição |
|-----------|-----------|
| **HUD Visual** | Glassmorphism para simular displays heads-up |
| **Industrial** | Cantos retos (0px radius) imitando máquinas |
| **Technical** | Tipografia Space Grotesk para signage industrial |
| **High-Contrast** | Cores neon sobre fundos escuros |

---

## 2. Paleta de Cores (Design Tokens)

### 2.1 Sistema de Superfície

```css
:root {
  /* Backgrounds - Camadas de Profundidade */
  --surface-dim:           #121414;     /* Base mais profunda */
  --surface:               #121414;     /* Canvas principal */
  --surface-bright:        #38393a;     /* Destacado */
  
  /* Containers - Hierarquia de Elevação */
  --surface-container-lowest:  #0d0e0f; /* Fundo absoluto */
  --surface-container-low:     #1a1c1c; /* Cards principais */
  --surface-container:         #1e2020; /* Containers médios */
  --surface-container-high:    #292a2a; /* Hover states */
  --surface-container-highest: #333535; /* Modais, overlays */
  
  /* Textos */
  --on-surface:            #e3e2e2;     /* Texto primário */
  --on-surface-variant:    #c5c9b3;     /* Texto secundário */
  --inverse-surface:       #e3e2e2;     /* Texto invertido */
  --inverse-on-surface:    #2f3131;     /* Fundo invertido */
}
```

### 2.2 Cores Primárias (Neon Pulse)

```css
:root {
  /* Primary - Neon Olive (#b1d35c) */
  --primary:               #b1d35c;     /* Neon Olive - Principal */
  --on-primary:            #273500;     /* Texto sobre primary */
  --primary-container:     #8faf3c;     /* Container primary */
  --on-primary-container:   #2f3f00;     /* Texto em container */
  --primary-fixed:         #cdf074;     /* Primary destacado */
  --primary-fixed-dim:     #b1d35c;     /* Primary dimmed */
  --on-primary-fixed:      #151f00;     /* Texto fixed */
  
  /* Surface Tint */
  --surface-tint:          #b1d35c;     /* Tonalidade base */
}
```

### 2.3 Cores Secundárias

```css
:root {
  /* Secondary - Vibrant Gold (#ffdb3c) */
  --secondary:             #fff9ef;    /* Texto secondary */
  --on-secondary:           #3a3000;     /* Texto sobre secondary */
  --secondary-container:    #ffdb3c;     /* Container */
  --on-secondary-container: #725f00;     /* Texto em container */
  --secondary-fixed:       #ffe16d;     /* Fixed */
  --secondary-fixed-dim:   #e9c400;     /* Dimmed */
  --on-secondary-fixed:    #221b00;     /* Texto fixed */
  
  /* Tertiary - Electric Blue (#b0c6ff) */
  --tertiary:              #b0c6ff;     /* Azul elétrico */
  --on-tertiary:           #002d6f;     /* Texto */
  --tertiary-container:    #79a1ff;     /* Container */
  --on-tertiary-container: #003581;     /* Texto */
  --tertiary-fixed:        #d9e2ff;     /* Fixed */
  --tertiary-fixed-dim:    #b0c6ff;     /* Dimmed */
  --on-tertiary-fixed:     #001945;     /* Texto */
}
```

### 2.4 Cores de Estado

```css
:root {
  /* Error - Wire Red (#ffb4ab) */
  --error:               #ffb4ab;       /* Vermelho alerta */
  --on-error:            #690005;       /* Texto erro */
  --error-container:    #93000a;       /* Container erro */
  --on-error-container:  #ffdad6;       /* Texto container */
}
```

### 2.5 Cores de Estrutura

```css
:root {
  /* Outlines e Bordas */
  --outline:             #8f937f;      /* Borda principal */
  --outline-variant:      #454838;      /* Borda secundária */
  
  /* Background global */
  --background:           #121414;      /* Fundo app */
  --on-background:        #e3e2e2;      /* Texto fundo */
  
  /* Surface Variant */
  --surface-variant:      #333535;      /* Variante superfície */
}
```

### 2.6 Mapa de Cores para Componentes

```typescript
// src/components/ui/colorMaps.ts
export const colorMaps = {
  neonGreen: {
    text: 'text-primary',
    border: 'border-primary',
    bg: 'bg-primary/10',
    glow: 'shadow-[0_0_20px_rgba(177,211,92,0.3)]'
  },
  neonYellow: {
    text: 'text-secondary-fixed',
    border: 'border-secondary-fixed-dim',
    bg: 'bg-secondary-fixed/10',
    glow: 'shadow-[0_0_20px_rgba(255,225,109,0.3)]'
  },
  electricBlue: {
    text: 'text-tertiary',
    border: 'border-tertiary',
    bg: 'bg-tertiary/10',
    glow: 'shadow-[0_0_20px_rgba(176,198,255,0.3)]'
  },
  wireRed: {
    text: 'text-error',
    border: 'border-error',
    bg: 'bg-error/10',
    glow: 'shadow-[0_0_20px_rgba(255,180,171,0.3)]'
  }
} as const;
```

---

## 3. Tipografia (Space Grotesk)

### 3.1 Importação

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 3.2 Escala Tipográfica

```css
@utility font-headline {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

@utility font-code {
  font-family: 'Space Grotesk', monospace;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.4;
}

@utility font-body {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}
```

### 3.3Tokens de Tipografia (Tailwind)

| Classe | Uso | Configuração |
|--------|-----|--------------|
| `font-headline` | Títulos H1 | 700, -0.02em, 1.1 |
| `font-code` | Dados técnicos | 500, 0.02em, 1.4 |
| `font-body` | Textos gerais | 400, 1.6 |
| `text-4xl` | H1 | 48px |
| `text-3xl` | H2 | 32px |
| `text-2xl` | H3 | 24px |
| `text-lg` | Body Large | 18px |
| `text-base` | Body | 16px |
| `text-xs` | Labels | 12px |

---

## 4. Glassmorphism

### 4.1 Regras de Glassmorphism

O Glassmorphism simula painéis semi-transparentes de HUD sobrepostos ao fundo escuro.

```css
/* Componente GlassCard base */
.glass-card {
  background: rgba(30, 32, 32, 0.7);  /* surface-container 70% */
  backdrop-filter: blur(12px);
  border: 1px solid rgba(143, 147, 127, 0.2); /* outline 20% */
}

/* Glass overlay para modais */
.glass-overlay {
  background: rgba(30, 32, 32, 0.85);  /* Mais opaco */
  backdrop-filter: blur(20px);
  border: 1px solid rgba(143, 147, 127, 0.3);
}
```

### 4.2 Camadas de Elevação

| Nível | Token | Uso |
|-------|-------|-----|
| 1 (base) | `surface-dim` | Fundo absoluto (#121414) |
| 2 (surface) | `surface-container-low` | Cards (#1a1c1c) |
| 3 (glass) | `rgba(surface-container, 0.7)` | Glass cards |
| 4 (overlay) | `rgba(surface-container, 0.85)` | Modais |

---

## 5. Animações Neon Pulse

### 5.1 Efeito Glow Pulse

```css
/* Animação de pulso neon para elementos ativos */
@keyframes neon-pulse {
  0%, 100% {
    box-shadow: 0 0 5px rgba(177, 211, 92, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(177, 211, 92, 0.8),
                0 0 30px rgba(177, 211, 92, 0.4);
  }
}

.glow-active {
  animation: neon-pulse 2s ease-in-out infinite;
}
```

### 5.2 Tipos de Animação

| Animação | Uso | Duração |
|----------|-----|---------|
| `neon-pulse` | Elementos ativos (LEDs) | 2s loop |
| `fade-in` | Entrada de elementos | 300ms |
| `slide-up` | Reveal de cards | 400ms |
| `typewriter` | Terminal text | Variável |

### 5.3 Framer Motion Config

```typescript
// Exemplo de animação em componente
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};
```

---

## 6. Espaçamento (Spacing)

### 6.1 Escala Base 4px

```css
:root {
  --spacing-xs:    4px;   /* Micro */
  --spacing-sm:    8px;   /* Compacto */
  --spacing-md:    16px;  /* Padrão */
  --spacing-lg:    24px;  /* Ambiente */
  --spacing-xl:    32px;  /* Seção */
  --spacing-2xl:   40px;  /* Grande */
  --spacing-3xl:   64px;  /* Hero */
}
```

### 6.2 Tokens Tailwind

| Classe | Valor | Uso |
|--------|-------|-----|
| `gap-1` | 4px | Micro gaps |
| `gap-2` | 8px | Compacto |
| `gap-4` | 16px | Padrão |
| `gap-6` | 24px | Cards |
| `gap-8` | 32px | Seções |
| `gap-12` | 48px | Hero |

---

## 7. Componentes base

### 7.1 GlassCard

```tsx
// src/components/ui/GlassCard.tsx
export function GlassCard({ children, className = '' }) {
  return (
    <div className={`
      bg-surface-container/70 
      backdrop-blur-md 
      border border-outline/20 
      p-4 
      ${className}
    `}>
      {children}
    </div>
  );
}
```

### 7.2 GlowButton

```tsx
// src/components/ui/GlowButton.tsx
interface GlowButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function GlowButton({ children, variant = 'primary' }: GlowButtonProps) {
  const styles = variant === 'primary'
    ? 'bg-primary text-on-primary hover:shadow-[0_0_20px_rgba(177,211,92,0.5)]'
    : 'bg-secondary-fixed text-on-secondary-fixed';
    
  return (
    <button className={`${styles} transition-shadow duration-300`}>
      {children}
    </button>
  );
}
```

### 7.3 StatusBadge

```tsx
// src/components/ui/StatusBadge.tsx
interface StatusBadgeProps {
  status: 'AO VIVO' | 'EM ESPERA' | 'OFFLINE';
  color: keyof typeof colorMaps;
}
```

---

## 8. Regras de Ouro para IA

> **ATENÇÃO: Regras que a IA NUNCA deve violar ao editar este documento**

1. **NUNCA usar hex hardcoded** - usar tokens: `bg-surface-container-low`, `border-outline`
2. **0px border-radius** - TODO componente deve ter cantos retos
3. **Space Grotesk only** - não usar outras fontes
4. **Cores Neon em contraste** - nunca text on text neon (falha WCAG)
5. **Glassmorphism consistente** - blur 12-20px, opacity 70-85%
6. **Glow em hover/active** - não em estado default (desempenho)
7. **Não usar `bg-[#hex]`** - o Tailwind purga essas classes

---

## 9. Referências

- [PRODUCT.md](./PRODUCT.md) - Visão do produto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Estrutura técnica
- `src/components/ui/colorMaps.ts` - Mapa de cores
- `src/app/globals.css` - Tokens CSS
- `src/components/ui/GlassCard.tsx` - Componente base