export const colors = {
  // Shadcn-inspired dark mode with lime accents
  // Primary palette - Lime for highlights
  primary: '#a3e635',
  primaryLight: '#bef264',
  primaryDark: '#84cc16',

  // Background - Dark neutral
  background: '#09090b',
  backgroundDark: '#09090b',
  surface: '#18181b',
  surfaceDark: '#18181b',
  card: '#18181b',
  cardDark: '#18181b',

  // Text - Light on dark
  text: '#fafafa',
  textDark: '#fafafa',
  textSecondary: '#a1a1aa',
  textSecondaryDark: '#a1a1aa',

  // Category colors (vibrant on dark)
  categoryFood: '#f97316',
  categoryTransport: '#06b6d4',
  categoryShopping: '#ec4899',
  categoryEntertainment: '#a855f7',
  categoryBills: '#eab308',
  categoryHealth: '#10b981',
  categoryOther: '#71717a',

  // Status
  success: '#84cc16',
  warning: '#eab308',
  error: '#dc2626',
  info: '#06b6d4',

  // UI Elements - Subtle borders on dark
  border: '#27272a',
  borderDark: '#27272a',
  divider: '#27272a',
  dividerDark: '#27272a',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Gradients - Lime gradient
  gradientStart: '#a3e635',
  gradientEnd: '#84cc16',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};
