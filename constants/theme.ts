// SauceXRay spacing, radii, and type-scale tokens — ported from
// _ds/tokens/spacing.css and _ds/tokens/typography.css

export const fonts = {
  display: 'PlusJakartaSans_800ExtraBold',
  displayBold: 'PlusJakartaSans_700Bold',
  displaySemibold: 'PlusJakartaSans_600SemiBold',
  displayMedium: 'PlusJakartaSans_500Medium',
  body: 'PlusJakartaSans_400Regular',
  mono: 'JetBrainsMono_500Medium',
  monoSemibold: 'JetBrainsMono_600SemiBold',
} as const;

// Type scale — mirrors --text-* tokens (fontFamily/fontSize/lineHeight triples,
// weight is baked into the font file chosen above since RN ignores CSS `font-weight`
// for custom fonts).
export const type = {
  displayXl: { fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 39 },
  displayL: { fontFamily: fonts.displayBold, fontSize: 28, lineHeight: 34 },
  titleL: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 29 },
  titleM: { fontFamily: fonts.displaySemibold, fontSize: 18, lineHeight: 24 },
  titleS: { fontFamily: fonts.displaySemibold, fontSize: 16, lineHeight: 22 },
  bodyL: { fontFamily: fonts.body, fontSize: 16, lineHeight: 25 },
  bodyM: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22 },
  bodyS: { fontFamily: fonts.displaySemibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.displaySemibold, fontSize: 12, lineHeight: 17 },
  button: { fontFamily: fonts.displaySemibold, fontSize: 15, lineHeight: 18 },
  monoM: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 20 },
  monoS: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 17 },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
} as const;

export const radii = {
  sm: 8,
  button: 10,
  input: 10,
  card: 14,
  modal: 20,
  pill: 999,
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;
