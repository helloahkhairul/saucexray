import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnalysisCard } from '@/components/AnalysisCard';
import { Footer } from '@/components/Footer';
import { LinkIcon, ScanIcon, UserIcon } from '@/components/icons';
import { colors, shadows } from '@/constants/colors';
import { radii, spacing, type } from '@/constants/theme';
import { loadHistory, type HistoryItem } from '@/services/history';
import { setLastResult } from '@/services/store';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadHistory()
        .then((items) => setHistory(items.slice(0, 3)))
        .finally(() => setLoading(false));
    }, [])
  );

  function handleAnalyze() {
    const trimmed = url.trim();
    if (!trimmed) return;
    router.push({ pathname: '/analyzing', params: { url: trimmed } });
  }

  function openItem(item: HistoryItem) {
    setLastResult(item);
    router.push('/result');
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
          <View style={styles.logoRow}>
            <Text style={styles.logoSauce}>Sauce</Text>
            <Text style={styles.logoXray}>XRay.</Text>
          </View>
          <Pressable style={styles.avatar} onPress={() => router.push('/saved')}>
            <UserIcon size={18} color={colors.coral} />
          </Pressable>
        </View>

        {/* FEATURE CARDS */}
        <View style={styles.featureRow}>
          <Pressable
            style={({ pressed }) => [
              styles.featureCard,
              shadows.card,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => inputRef.current?.focus()}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.accentHighlightBg }]}>
              <ScanIcon size={18} color={colors.coral} />
            </View>
            <Text style={styles.featureTitle}>App Analysis</Text>
            <Text style={styles.featureSub}>Decode any app</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.featureCard,
              shadows.card,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => router.push('/creator')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.tealHighlight }]}>
              <UserIcon size={18} color={colors.teal} />
            </View>
            <View style={styles.featureTitleRow}>
              <Text style={styles.featureTitle}>Creator</Text>
              <View style={styles.newPill}>
                <Text style={styles.newPillText}>NEW</Text>
              </View>
            </View>
            <Text style={styles.featureSub}>Find app ideas</Text>
          </Pressable>
        </View>

        {/* MAIN CARD */}
        <View style={[styles.mainCard, shadows.card]}>
          <Text style={styles.cardLabel}>
            Paste any app link to{' '}
            <Text style={styles.highlight}>analyze</Text>
          </Text>

          <Pressable
            onPress={() => inputRef.current?.focus()}
            style={[styles.inputWrapper, inputFocused && styles.inputWrapperFocused]}
          >
            <LinkIcon size={16} color={inputFocused ? colors.coral : colors.muted} />
            <TextInput
              ref={inputRef}
              value={url}
              onChangeText={setUrl}
              placeholder="https://apps.apple.com/..."
              placeholderTextColor={colors.muted}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onSubmitEditing={handleAnalyze}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
          </Pressable>

          <Pressable
            onPress={handleAnalyze}
            style={({ pressed }) => [
              styles.analyzeBtn,
              shadows.button,
              pressed && { backgroundColor: colors.coralPress, transform: [{ scale: 0.97 }] },
            ]}
          >
            <ScanIcon size={18} color="#fff" />
            <Text style={styles.analyzeBtnText}>Analyze app</Text>
          </Pressable>
        </View>

        {/* RECENT ANALYSES */}
        {(loading || history.length > 0) && (
          <Text style={styles.sectionTitle}>Recent analyses</Text>
        )}

        {loading ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: 16 }} />
        ) : history.length > 0 ? (
          <View style={styles.listCards}>
            {history.map((item) => (
              <AnalysisCard
                key={item.app_url}
                name={item.app_name}
                category={item.category}
                screens={item.screen_count}
                difficulty={item.difficulty}
                iconUrl={item.icon_url}
                onPress={() => openItem(item)}
              />
            ))}
          </View>
        ) : null}

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
  logoRow: { flexDirection: 'row', alignItems: 'baseline' },
  logoSauce: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 22,
    color: colors.textPrimary,
    letterSpacing: -0.22,
  },
  logoXray: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 22,
    color: colors.coral,
    letterSpacing: -0.22,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentHighlightBg,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: spacing[5],
    gap: 14,
    marginBottom: spacing[6],
  },
  cardLabel: { ...type.titleM, color: colors.textPrimary, lineHeight: 26 },
  highlight: {
    backgroundColor: colors.accentHighlightBg,
    color: colors.coralPress,
    fontFamily: 'PlusJakartaSans_700Bold',
    borderRadius: 6,
    overflow: 'hidden',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bgSurfaceSunken,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.input,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  inputWrapperFocused: {
    borderColor: colors.coral,
    backgroundColor: colors.bgSurface,
  },
  input: {
    flex: 1,
    ...type.bodyM,
    color: colors.textPrimary,
    padding: 0,
    // @ts-ignore — web only: remove browser default focus ring
    outlineStyle: 'none',
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accentPrimary,
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
  featureRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing[4],
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: spacing[4],
    gap: 6,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  featureSub: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  newPill: {
    backgroundColor: colors.coral,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  newPillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 8,
    color: '#fff',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  listCards: { gap: 10 },
  footer: { marginTop: 28 },
});
