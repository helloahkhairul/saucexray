import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Footer } from '@/components/Footer';
import { BackArrowIcon, UserIcon } from '@/components/icons';
import { colors, shadows } from '@/constants/colors';
import { radii, spacing, type } from '@/constants/theme';

type Platform = 'youtube' | 'tiktok' | 'instagram';

const PLATFORMS: {
  id: Platform;
  label: string;
  color: string;
  placeholder: string;
  examples: string[];
}[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    color: '#E8654A',
    placeholder: 'MrBeast',
    examples: ['@MrBeast', '@mkbhd', '@veritasium'],
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    color: '#2BAA8E',
    placeholder: 'khaby.lame',
    examples: ['@khaby.lame', '@charlidamelio', '@zachking'],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    color: '#E1306C',
    placeholder: 'natgeo',
    examples: ['@natgeo', '@nasa', '@nike'],
  },
];

export default function CreatorScreen() {
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [handle, setHandle] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const current = PLATFORMS.find((p) => p.id === platform)!;

  function handleAnalyze() {
    const raw = handle.trim();
    if (!raw) return;
    const clean = raw.startsWith('@') ? raw : `@${raw}`;
    router.push({ pathname: '/creator-analyzing', params: { platform, handle: clean } });
  }

  function pickExample(ex: string) {
    setHandle(ex.startsWith('@') ? ex.slice(1) : ex);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/home')} style={styles.iconBtn}>
            <BackArrowIcon size={22} />
          </Pressable>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Creator Analysis</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          </View>
          <View style={styles.iconBtn} />
        </View>

        {/* PLATFORM TABS */}
        <View style={[styles.tabsCard, shadows.card]}>
          {PLATFORMS.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => {
                setPlatform(p.id);
                setHandle('');
              }}
              style={[
                styles.tab,
                platform === p.id && { backgroundColor: p.color },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  platform === p.id
                    ? { color: '#fff' }
                    : { color: colors.textSecondary },
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* INPUT CARD */}
        <View style={[styles.inputCard, shadows.card]}>
          <Text style={styles.cardLabel}>
            Enter a{' '}
            <Text style={[styles.platformWord, { color: current.color }]}>
              {current.label}
            </Text>{' '}
            handle
          </Text>

          <View
            style={[
              styles.inputRow,
              inputFocused && { borderColor: current.color, backgroundColor: colors.bgSurface },
            ]}
          >
            <Text style={[styles.atSign, { color: inputFocused ? current.color : colors.muted }]}>
              @
            </Text>
            <TextInput
              value={handle}
              onChangeText={setHandle}
              placeholder={current.placeholder}
              placeholderTextColor={colors.muted}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleAnalyze}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
          </View>

          {/* EXAMPLE CHIPS */}
          <View style={styles.chipRow}>
            <Text style={styles.tryLabel}>Try:</Text>
            {current.examples.map((ex) => (
              <Pressable
                key={ex}
                onPress={() => pickExample(ex)}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{ex}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handleAnalyze}
            style={({ pressed }) => [
              styles.analyzeBtn,
              shadows.button,
              { backgroundColor: current.color },
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            <UserIcon size={18} color="#fff" />
            <Text style={styles.analyzeBtnText}>Analyze creator</Text>
          </Pressable>
        </View>

        {/* INFO CARD */}
        <View style={[styles.infoCard, shadows.card]}>
          <Text style={styles.infoTitle}>What you'll get</Text>
          {[
            'Creator profile: followers, engagement & niche',
            'AI audience analysis for your platform',
            '3 tailored app monetization ideas',
            'Revenue model & build complexity per idea',
          ].map((line) => (
            <View key={line} style={styles.infoRow}>
              <View style={[styles.infoDot, { backgroundColor: current.color }]} />
              <Text style={styles.infoText}>{line}</Text>
            </View>
          ))}
        </View>

        <Footer style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPage },
  scroll: { paddingHorizontal: spacing[5], paddingBottom: spacing[7] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[4],
    paddingBottom: spacing[5],
  },
  iconBtn: { padding: 6, width: 34 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  newBadge: {
    backgroundColor: colors.coral,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  newBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 9,
    color: '#fff',
    letterSpacing: 0.6,
  },
  tabsCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: 4,
    gap: 4,
    marginBottom: spacing[4],
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radii.card - 2,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
  },
  inputCard: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: spacing[5],
    gap: 14,
    marginBottom: spacing[4],
  },
  cardLabel: { ...type.titleM, color: colors.textPrimary, lineHeight: 26 },
  platformWord: { fontFamily: 'PlusJakartaSans_700Bold' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurfaceSunken,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.input,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  atSign: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    marginRight: 4,
  },
  input: {
    flex: 1,
    ...type.bodyM,
    color: colors.textPrimary,
    padding: 0,
    // @ts-ignore — web only: remove browser default focus ring
    outlineStyle: 'none',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  tryLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: colors.textMuted,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurfaceSunken,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  chipText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.button,
    paddingVertical: 14,
    paddingHorizontal: spacing[5],
  },
  analyzeBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.15,
  },
  infoCard: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: spacing[5],
    gap: 12,
  },
  infoTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  infoText: { flex: 1, ...type.bodyM, color: colors.textPrimary },
  footer: { marginTop: 28 },
});
