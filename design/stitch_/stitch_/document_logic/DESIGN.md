---
name: Document Logic
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#49473f'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7a776e'
  outline-variant: '#cbc6bc'
  surface-tint: '#615e57'
  primary: '#21201a'
  on-primary: '#ffffff'
  primary-container: '#37352f'
  on-primary-container: '#a19d95'
  inverse-primary: '#cbc6bd'
  secondary: '#5f5e5c'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfdb'
  on-secondary-container: '#636360'
  tertiary: '#002141'
  on-tertiary: '#ffffff'
  tertiary-container: '#003666'
  on-tertiary-container: '#50a0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e7e2d9'
  primary-fixed-dim: '#cbc6bd'
  on-primary-fixed: '#1d1c16'
  on-primary-fixed-variant: '#494740'
  secondary-fixed: '#e5e2de'
  secondary-fixed-dim: '#c8c6c3'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a4c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004884'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  mono:
    fontFamily: courierPrime
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 900px
  sidebar-width: 240px
---

## Brand & Style
The design system focuses on extreme clarity, functionality, and a document-first philosophy. It targets knowledge workers, planners, and teams who require a low-friction environment for thinking and organizing. The aesthetic is a refined **Minimalism** that prioritizes content over container. 

The emotional response should be one of "calm productivity"—reducing cognitive load through generous whitespace, a monochromatic base, and a vertical flow that mimics a physical sheet of paper. High-contrast typography ensures readability in Korean characters, while the use of emojis provides a human, playful touch to an otherwise utilitarian structure.

## Colors
The palette is intentionally restrained to keep the focus on the user's data. 
- **Primary Text (#37352f):** A warm near-black used for all core content and headings.
- **Secondary Text (#787774):** Used for metadata, descriptions, and placeholder text.
- **Surface & Neutrals:** White (#ffffff) is the canvas. Sidebars and inactive areas use #f1f1f1 or #f7f6f3 to create subtle separation without harsh lines.
- **Accents:** Use soft pastel backgrounds for callouts and highlights to categorize information without overwhelming the visual field.

## Typography
This design system uses **Inter** for its neutral, highly legible characteristics, which perform exceptionally well for both English and Korean script. 

Korean text should maintain a slightly higher line-height (1.6 for body) to ensure complex characters remain clear. Vertical rhythm is established by strictly adhering to the line-height multiples. Use a monospaced font for code blocks or technical references to provide a visual break from the humanist sans-serif flow.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Content is centered within a maximum width of 900px to maintain comfortable line lengths for reading. 

- **Desktop:** A permanent or collapsible sidebar (240px) on the left, with the main content area centered.
- **Mobile:** Single column flow with 16px side margins. 
- **Vertical Rhythm:** Use 24px or 40px gaps between major sections. Small elements like list items or checkboxes use 4px to 8px spacing.
- **Grid:** No formal column grid is used for the page body; instead, layout is managed through vertical stacking and simple horizontal flexbox containers for inline elements.

## Elevation & Depth
This system avoids traditional shadows to maintain its "flat paper" aesthetic. Depth is communicated through:
- **Tonal Layers:** Using light gray backgrounds (#f1f1f1) to indicate secondary areas like sidebars or "hover" states.
- **Low-Contrast Outlines:** Use 1px borders in #e9e9e8 for cards or containers.
- **Z-Index:** Modals and dropdown menus use a very subtle, large-radius ambient shadow (0px 4px 20px rgba(0,0,0,0.05)) to separate them from the base page, but should never appear "heavy."

## Shapes
The shape language is subtle and professional. 
- **Standard Elements:** Buttons, input fields, and small tags use a 4px (Soft) radius.
- **Large Elements:** Callout boxes and image containers use an 8px radius.
- **Icons:** Standard emojis are used in place of custom iconography to keep the interface friendly and recognizable.

## Components
- **Buttons:** Primary buttons are text-only or have a subtle gray background. Hover states use #efefef. No heavy fills unless it is a call-to-action.
- **Callouts:** Rectangular boxes with an 8px radius, a soft pastel background, and an emoji icon at the start.
- **Lists:** Bulleted and numbered lists use the primary text color. "Toggle" lists (collapsible) use a simple chevron icon to the left of the text.
- **Input Fields:** Minimal 1px border (#e9e9e8) that turns slightly darker on focus. No inner shadows.
- **Cards:** White background with a 1px border. Do not use shadows for cards; use whitespace to define boundaries.
- **Checkboxes:** Small squares with a 3px radius. When checked, they should appear as a simple blue or black fill with a white checkmark.
- **Dividers:** Horizontal lines should be 1px thick and use #eeeeee, spanning the width of the content container.