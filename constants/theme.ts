export const colors = {
  // Primary palette - Green for highlights
  primary: '#00A699',
  primaryLight: '#1FBFB3',
  primaryDark: '#008A7D',
  
  // Background
  background: '#FFFFFF',
  backgroundDark: '#222222',
  surface: '#F7F7F7',
  surfaceDark: '#2B2B2B',
  card: '#FFFFFF',
  cardDark: '#2B2B2B',
  
  // Text
  text: '#222222',
  textDark: '#FFFFFF',
  textSecondary: '#717171',
  textSecondaryDark: '#B0B0B0',
  
  // Category colors (Airbnb-inspired palette)
  categoryFood: '#FC642D',
  categoryTransport: '#008489',
  categoryShopping: '#BD1E59',
  categoryEntertainment: '#9065B0',
  categoryBills: '#E0B423',
  categoryHealth: '#00A699',
  categoryOther: '#767676',
  
  // Status
  success: '#00A699',
  warning: '#FF5A5F',
  error: '#E0424B',
  info: '#008489',
  
  // UI Elements
  border: '#EBEBEB',
  borderDark: '#3D3D3D',
  divider: '#DDDDDD',
  dividerDark: '#3D3D3D',
  
  // Overlays
  overlay: 'rgba(34, 34, 34, 0.6)',
  overlayLight: 'rgba(34, 34, 34, 0.3)',
  
  // Gradients
  gradientStart: '#00A699',
  gradientEnd: '#008489',
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
