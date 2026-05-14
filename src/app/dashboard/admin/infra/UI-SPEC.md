# Phase 09: Vercel + Neon Deployment - UI Specification

**Status:** approved
**Version:** 1.0
**Date:** 2026-05-04

## 1. Vision & Context
An exclusive **Infrastructure Control Panel** for the Orientador (Superuser), providing real-time-like feedback on the health of the Vercel + Neon ecosystem. The aesthetic follows the project's "Cyberpunk-Industrial" theme: high-contrast, glowing accents, and terminal-style information density.

## 2. Component Inventory

### 2.1. Admin Nav Update
- **Item:** "Infraestrutura"
- **Location:** Sub-item under "Gerenciar Sistema".
- **Permission:** `hasPermission(["ORIENTADOR"])`.
- **Icon:** `Activity` or `Cpu` from Lucide.

### 2.2. Health Overview Grid (3 Columns)
- **Neon DB Card:**
  - Title: `DATABASE_LINK`
  - Content: Status (Online/Offline), Provider (Neon), Region (Auto).
  - Interaction: "Ping" button that triggers a pulse animation.
- **Vercel Deploy Card:**
  - Title: `DEPLOY_STATUS`
  - Content: Environment (Production), Branch (Main), Last Build (Timestamp).
  - Interaction: Link to Vercel dashboard.
- **System Metrics Card:**
  - Title: `RESOURCE_UTILIZATION`
  - Content: Connection Pool (0-100% bar), Runtime (Node 20.x).

### 2.3. Deployment Log Terminal
- **Visual:** `crt-effect` glass panel.
- **Content:** Mocked terminal lines showing system boot/heartbeat sequences.
- **Copy:** "Initializing system link...", "Syncing with Neon Cluster...", "Vercel Edge Network: ACTIVE".

## 3. Design Tokens

### 3.1. Colors (M-DS-01)
- **Dominant (60%):** `#0D0D0D` (Background)
- **Secondary (30%):** `#1A1A1A` (Glass Panels)
- **Accent (10%):** 
  - `#A4C639` (Neon Green) - Success/Active.
  - `#D64545` (Wire Red) - Error/Alert.
  - `#2D6CDF` (Electric Blue) - System Information.

### 3.2. Typography (M-DS-02)
- **Headline:** `Space Grotesk` (Semibold 600)
- **Body:** `Inter` (Regular 400)
- **Monospace:** `JetBrains Mono` (For status values and logs)

### 3.3. Spacing (M-DS-03)
- **Grid Gap:** `24px`
- **Inner Padding:** `16px`
- **Border Radius:** `2px` (Sharp, industrial feel)

## 4. Copywriting (M-DS-04)
- **Primary CTA:** "RE-SYNC SYSTEM"
- **Empty State:** "Scanning infrastructure..."
- **Error State:** "LINK_FAILURE: Check Vercel Environment Variables"

## 5. Interactions & Animations
- **Status Pulse:** Use `animate-pulse-glow` on the Green/Red status indicators.
- **Log Stream:** Subtle fade-in animation for terminal lines.
- **Glass Hover:** Scale `1.02` with increased `backdrop-blur` on card hover.

## 6. Layout Reference
```
[ Sidebar ] [ Header: Infra Control Center ]
[ Sidebar ] [ Grid: Neon | Vercel | System  ]
[ Sidebar ] [ Log Terminal (Full Width)      ]
```

---

*Verified against: EPRA Design System (Tailwind v4)*
