import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIconGlyph, ChevronRightIcon } from '@/components/icons';
import { colors, shadows } from '@/constants/colors';
import { radii, spacing, type } from '@/constants/theme';
import type { Difficulty } from '@/services/supabase';

const iconColors: Record<Difficulty, { bg: string; fg: string }> = {
  Easy: { bg: colors.tealHighlight, fg: colors.teal },
  Medium: { bg: colors.amberHighlight, fg: colors.amber },
  Hard: { bg: colors.accentHighlightBg, fg: colors.coral },
};

const diffText: Record<Difficulty, string> = {
  Easy: colors.tealText,
  Medium: colors.amberText,
  Hard: colors.coralPress,
};

type CardProps = {
  name: string;
  category: string;
  screens: number;
  difficulty: Difficulty;
  iconUrl?: string;
  onPress?: () => void;
};

export function AnalysisCard({ name, category, screens, difficulty, iconUrl, onPress }: CardProps) {
  const ic = iconColors[difficulty] ?? iconColors.Medium;
  const textColor = diffText[difficulty] ?? colors.textSecondary;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadows.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconSquare, { backgroundColor: iconUrl ? 'transparent' : ic.bg }]}>
        {iconUrl ? (
          <Image source={{ uri: iconUrl }} style={styles.iconImage} />
        ) : (
          <AppIconGlyph size={22} color={ic.fg} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          {category} · {screens} screens ·{' '}
          <Text style={{ color: textColor, fontFamily: 'PlusJakartaSans_600SemiBold' }}>
            {difficulty}
          </Text>
        </Text>
      </View>
      <ChevronRightIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    paddingVertical: 14,
    paddingHorizontal: spacing[4],
  },
  pressed: { transform: [{ scale: 0.98 }] },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  info: { flex: 1 },
  name: { ...type.titleS, color: colors.textPrimary, marginBottom: 3 },
  meta: { ...type.bodyS, color: colors.textSecondary },
});
