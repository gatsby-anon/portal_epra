---
name: EPRA Interface System
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#292a2a'
  surface-container-highest: '#333535'
  on-surface: '#e3e2e2'
  on-surface-variant: '#c5c9b3'
  inverse-surface: '#e3e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8f937f'
  outline-variant: '#454838'
  surface-tint: '#b1d35c'
  primary: '#b1d35c'
  on-primary: '#273500'
  primary-container: '#8faf3c'
  on-primary-container: '#2f3f00'
  inverse-primary: '#4e6700'
  secondary: '#fff9ef'
  on-secondary: '#3a3000'
  secondary-container: '#ffdb3c'
  on-secondary-container: '#725f00'
  tertiary: '#b0c6ff'
  on-tertiary: '#002d6f'
  tertiary-container: '#79a1ff'
  on-tertiary-container: '#003581'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cdf074'
  primary-fixed-dim: '#b1d35c'
  on-primary-fixed: '#151f00'
  on-primary-fixed-variant: '#3a4d00'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#b0c6ff'
  on-tertiary-fixed: '#001945'
  on-tertiary-fixed-variant: '#00429c'
  background: '#121414'
  on-background: '#e3e2e2'
  surface-variant: '#333535'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  mono-data:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin: 32px
---

## Brand & Style

The design system is engineered for a **Cyberpunk Industrial** aesthetic, blending high-tech precision with rugged, utilitarian hardware vibes. It evokes a sense of "factory-floor futurism"—where advanced robotics meet reliable, heavy-duty engineering. 

The visual style heavily leverages **Glassmorphism** to simulate heads-up displays (HUDs) and semi-transparent control panels. This is layered over a deep, dark environment to prioritize focus and reduce eye strain during technical workflows. The interface feels like a sophisticated diagnostic tool: sharp, authoritative, and innovative.

## Colors

This design system utilizes a high-contrast dark palette designed for technical environments. 

- **Backgrounds:** The primary canvas uses *Deep Black* for maximum depth, with *Dark Graphite* used for cards and surfacing elements.
- **Technical Green:** *Neon Olive* serves as the primary action color. 
- **Functional Accents:** *Vibrant Gold* (Secondary) identifies robotic hardware components and high-priority status, *Electric Blue* signals logic and Arduino-based connectivity, and *Wire Red* is strictly for critical alerts and safety stops.
- **Grays:** *Medium Gray* is used for borders and inactive states, while *Light Gray* provides high-legibility secondary text and icons.

## Typography

**Space Grotesk** is the sole typeface for this design system, chosen for its technical, geometric, and cutting-edge characteristics. 

Headlines utilize tight tracking and bold weights to mimic industrial signage. Body text is kept clean for readability against dark backgrounds. A specialized "Label Caps" style is used for metadata, status tags, and peripheral interface labels, ensuring a consistent HUD-like appearance throughout the application.

## Layout & Spacing

This design system employs a **Fixed Grid** model for main dashboards, ensuring telemetry and control panels remain in predictable locations. 

The spacing rhythm is based on a **4px baseline**, which allows for the precision required in technical UIs. A 12-column grid is standard for desktop views, using 20px gutters. Internal card padding should favor the *sm (16px)* and *md (24px)* increments to maintain a dense, information-rich environment without feeling cluttered.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and tonal layering rather than traditional shadows.

1.  **Base Layer:** Deep Black (#0D0D0D) represents the bottom-most environment.
2.  **Surface Layer:** Dark Graphite (#1A1A1A) with a 1px solid border of Medium Gray (#3A3A3A) creates defined containers.
3.  **Glass Panels:** For overlays and modals, use a background blur (12px - 20px) with a semi-transparent Dark Graphite fill (70% opacity). 
4.  **Glow Effects:** Critical technical elements or active states use a soft outer glow (drop-shadow) using the primary Neon Olive or Electric Blue to simulate illuminated hardware LEDs.

## Shapes

The shape language is strictly **Sharp (0px)**. 

To reinforce the industrial and technical nature of the system, all buttons, cards, and input fields must have square corners. This architectural rigidity mimics machine-milled components. The only exceptions are circular indicators for status "pills" or specific hardware-related iconography.

## Components

-   **Buttons:** Primary CTAs use a solid Neon Olive background with Black text. Hovers transition to Dark Olive. Secondary buttons use the Vibrant Gold for high-caution triggers or a Medium Gray "Ghost" style for standard secondary actions.
-   **Technical Chips:** Small, rectangular tags used for data status. Use Vibrant Gold for hardware status and Electric Blue for logic/software status.
-   **Inputs:** Fields are Dark Graphite with a 1px Medium Gray bottom border. On focus, the border glows Neon Olive.
-   **Cards:** Glassmorphic panels with a 1px "Wireframe" border. Use Light Gray for internal headers.
-   **Alerts:** High-visibility Wire Red banners with "Warning" iconography. Text within alerts should remain highly legible, using the darkest background to ensure contrast.
-   **Progress Bars:** Thin, pixel-precise bars. Use Electric Blue for "Processing" and Neon Olive for "Complete."