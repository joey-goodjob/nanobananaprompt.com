# Web Components Theme Variables

This document defines the CSS variables that should be provided by the consuming application.

## Required CSS Variables

### Primary Colors
- `--primary-50` to `--primary-900`: Main brand color scale
- `--primary`: Default primary color (usually maps to primary-500)

### Accent Colors
- `--accent-50` to `--accent-900`: Secondary/accent color scale
- `--accent`: Default accent color (usually maps to accent-500)

### Text Colors
- `--text-primary`: Primary text color (high contrast)
- `--text-secondary`: Secondary text color (medium contrast)
- `--text-tertiary`: Tertiary text color (low contrast)
- `--text-inverse`: Text color on dark backgrounds

### Background Colors
- `--bg-primary`: Primary background color
- `--bg-secondary`: Secondary background color
- `--bg-tertiary`: Tertiary background color
- `--bg-inverse`: Dark background color

### Surface Colors (Cards, Panels)
- `--surface-primary`: Main surface background
- `--surface-secondary`: Secondary surface background
- `--surface-border`: Surface border color
- `--surface-shadow`: Surface shadow color (with alpha)

### Interactive States
- `--interactive-hover`: Hover state color
- `--interactive-active`: Active/pressed state color
- `--interactive-disabled`: Disabled state color

### Semantic Colors
- `--success`: Success state color
- `--warning`: Warning state color
- `--error`: Error state color
- `--info`: Info state color

### Layout
- `--max-width`: Maximum content width (e.g., 1200px)
- `--border-radius-sm`: Small border radius (e.g., 4px)
- `--border-radius-md`: Medium border radius (e.g., 8px)
- `--border-radius-lg`: Large border radius (e.g., 16px)

### Transitions
- `--transition-fast`: Fast transition (e.g., 150ms)
- `--transition-base`: Base transition (e.g., 200ms)
- `--transition-slow`: Slow transition (e.g., 300ms)

## Example Implementation

```css
:root {
  /* Primary Colors */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;
  --primary: var(--primary-500);

  /* Text Colors */
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --text-inverse: #ffffff;

  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #e5e5e5;
  --bg-inverse: #1a1a1a;

  /* Surfaces */
  --surface-primary: rgba(255, 255, 255, 0.9);
  --surface-secondary: rgba(255, 255, 255, 0.7);
  --surface-border: rgba(0, 0, 0, 0.1);
  --surface-shadow: rgba(0, 0, 0, 0.1);

  /* Interactive */
  --interactive-hover: rgba(0, 0, 0, 0.05);
  --interactive-active: rgba(0, 0, 0, 0.1);
  --interactive-disabled: rgba(0, 0, 0, 0.3);
}
```

## Usage in Components

Components should use these variables via inline styles or Tailwind arbitrary values:

```tsx
// Inline styles
<div style={{ color: 'var(--text-primary)' }}>Text</div>

// Tailwind arbitrary values (if Tailwind is configured)
<div className="text-[var(--text-primary)]">Text</div>
```
