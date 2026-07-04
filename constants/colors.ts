// SauceXRay color tokens — ported from _ds/tokens/colors.css
// Warm, cream-based, coral-accented palette. See DESIGN_HANDOFF.md.

export const colors = {
  // Base palette
  cream: '#FAF7F4',
  white: '#FFFFFF',
  coral: '#E8654A',
  coralHighlight: '#FADDD6',
  coralHover: '#D4553C',
  coralPress: '#C04A33',
  charcoal: '#1A1A1A',
  warmGray: '#8A8078',
  muted: '#B0A89E',
  border: '#E8E0D8',
  borderStrong: '#D9CCC0',
  teal: '#2BAA8E',
  tealHighlight: '#D9F0EB',
  tealText: '#137A63',
  amber: '#D4960A',
  amberHighlight: '#FBEBCE',
  amberText: '#8A5F06',
  redError: '#D8483C',
  redHighlight: '#FADDD6',

  // Semantic — surfaces
  bgPage: '#FAF7F4',
  bgSurface: '#FFFFFF',
  bgSurfaceSunken: '#F3EEE9',
  bgOverlay: 'rgba(26, 18, 13, 0.45)',

  // Semantic — text
  textPrimary: '#1A1A1A',
  textSecondary: '#8A8078',
  textMuted: '#B0A89E',
  textOnAccent: '#FFFFFF',
  textLink: '#E8654A',

  // Semantic — accent / brand
  accentPrimary: '#E8654A',
  accentPrimaryHover: '#D4553C',
  accentPrimaryPress: '#C04A33',
  accentHighlightBg: '#FADDD6',

  // Semantic — status
  statusSuccess: '#2BAA8E',
  statusSuccessBg: '#D9F0EB',
  statusWarning: '#D4960A',
  statusWarningBg: '#FBEBCE',
  statusError: '#D8483C',
  statusErrorBg: '#FADDD6',

  // Semantic — borders & focus
  borderDefault: '#E8E0D8',
  focusRing: 'rgba(232, 101, 74, 0.35)',
} as const;

// Soft, warm shadows (never cold gray/blue) — React Native shadow props.
export const shadows = {
  card: {
    shadowColor: 'rgba(60, 40, 25, 1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHover: {
    shadowColor: 'rgba(60, 40, 25, 1)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 4,
  },
  button: {
    shadowColor: 'rgba(196, 74, 51, 1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
} as const;
