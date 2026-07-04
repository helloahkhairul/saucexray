import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { BackArrowIcon, ChevronRightIcon, SearchIcon } from '@/components/icons';
import { colors, shadows } from '@/constants/colors';
import { radii, spacing, type } from '@/constants/theme';
import { loadHistory, type HistoryItem } from '@/services/history';
import { loadCreatorHistory, type CreatorHistoryItem } from '@/services/creatorHistory';
import { setLastResult } from '@/services/store';
import { setCreatorResult } from '@/services/creatorStore';
import type { Difficulty } from '@/services/supabase';
import type { Platform } from '@/services/creatorAnalyzer';

// ─── types ────────────────────────────────────────────────────────────────────
type Tab = 'apps' | 'creators';
type DiffFilter = 'All' | Difficulty;
type PlatformFilter = 'All' | Platform;

const DIFF_FILTERS: DiffFilter[] = ['All', 'Easy', 'Medium', 'Hard'];
const PLATFORM_FILTERS: PlatformFilter[] = ['All', 'youtube', 'tiktok', 'instagram'];
const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
};
const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: '#E8654A',
  tiktok: '#2BAA8E',
  instagram: '#E1306C',
};
const PLATFORM_EMOJI: Record<Platform, string> = {
  youtube: '▶',
  tiktok: '♪',
  instagram: '◉',
};

// ─── creator card ─────────────────────────────────────────────────────────────
function CreatorCard({
  item,
  onPress,
}: {
  item: CreatorHistoryItem;
  onPress: () => void;
}) {
  const { profile, ideas } = item;
  const color = PLATFORM_COLORS[profile.platform] ?? colors.coral;
  const emoji = PLATFORM_EMOJI[profile.platform] ?? '◎';
  const label = PLATFORM_LABELS[profile.platform] ?? profile.platform;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.creatorCard, shadows.card, pressed && { opacity: 0.8 }]}
    >
      {/* avatar */}
      {profile.thumbnailUrl ? (
        <Image
          source={{ uri: profile.thumbnailUrl }}
          style={styles.creatorAvatar}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.creatorAvatar, styles.creatorAvatarFallback, { backgroundColor: color + '22' }]}>
          <Text style={styles.creatorEmoji}>{emoji}</Text>
        </View>
      )}

      {/* info */}
      <View style={styles.creatorInfo}>
        <Text style={styles.creatorName} numberOfLines={1}>
          {profile.name}
        </Text>
        <Text style={styles.creatorMeta} numberOfLines={1}>
          {label} · {profile.followersDisplay}
        </Text>
      </View>

      {/* badge */}
      <View style={[styles.ideaCountBadge, { backgroundColor: color + '18' }]}>
        <Text style={[styles.ideaCountText, { color }]}>{ideas.length} ideas</Text>
      </View>

      <ChevronRightIcon size={16} color={colors.muted} />
    </Pressable>
  );
}

// ─── screen ───────────────────────────────────────────────────────────────────
export default function SavedScreen() {
  const [tab, setTab] = useState<Tab>('apps');
  const [diffFilter, setDiffFilter] = useState<DiffFilter>('All');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('All');
  const [query, setQuery] = useState('');
  const [appHistory, setAppHistory] = useState<HistoryItem[]>([]);
  const [creatorHistory, setCreatorHistory] = useState<CreatorHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([loadHistory(), loadCreatorHistory()])
        .then(([apps, creators]) => {
          setAppHistory(apps);
          setCreatorHistory(creators);
        })
        .finally(() => setLoading(false));
    }, []),
  );

  // filtered lists
  const visibleApps = appHistory.filter((h) => {
    const matchDiff = diffFilter === 'All' || h.difficulty === diffFilter;
    const matchQ = h.app_name.toLowerCase().includes(query.toLowerCase());
    return matchDiff && matchQ;
  });

  const visibleCreators = creatorHistory.filter((h) => {
    const matchPlatform = platformFilter === 'All' || h.profile.platform === platformFilter;
    const matchQ = h.profile.name.toLowerCase().includes(query.toLowerCase()) ||
                   h.profile.handle.toLowerCase().includes(query.toLowerCase());
    return matchPlatform && matchQ;
  });

  function openApp(item: HistoryItem) {
    setLastResult(item);
    router.push('/result');
  }

  function openCreator(item: CreatorHistoryItem) {
    setCreatorResult({ profile: item.profile, ideas: item.ideas });
    router.push('/creator-result');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── STICKY HEADER ─────────────────────────────────── */}
      <View style={styles.stickyHeader}>
        {/* top row */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.push('/home')} style={styles.iconBtn}>
            <BackArrowIcon size={22} />
          </Pressable>
          <Text style={styles.headerTitle}>Saved analyses</Text>
          <View style={styles.iconBtn} />
        </View>

        {/* tab toggle */}
        <View style={styles.tabRow}>
          {(['apps', 'creators'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => { setTab(t); setQuery(''); }}
              style={[styles.tab, tab === t && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'apps' ? 'App Analyses' : 'Creator Analyses'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* search */}
        <View style={styles.searchBar}>
          <SearchIcon size={16} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={tab === 'apps' ? 'Search apps...' : 'Search creators...'}
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* filter pills — vary by tab */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {tab === 'apps'
            ? DIFF_FILTERS.map((f) => (
                <Pressable
                  key={f}
                  onPress={() => setDiffFilter(f)}
                  style={[styles.filterPill, diffFilter === f && styles.filterPillActive]}
                >
                  <Text style={[styles.filterText, diffFilter === f && styles.filterTextActive]}>
                    {f}
                  </Text>
                </Pressable>
              ))
            : PLATFORM_FILTERS.map((f) => {
                const active = platformFilter === f;
                const color = f === 'All' ? colors.coral : PLATFORM_COLORS[f as Platform];
                return (
                  <Pressable
                    key={f}
                    onPress={() => setPlatformFilter(f)}
                    style={[
                      styles.filterPill,
                      active && { backgroundColor: color, borderColor: color },
                    ]}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>
                      {f === 'All' ? 'All' : PLATFORM_LABELS[f as Platform]}
                    </Text>
                  </Pressable>
                );
              })}
        </ScrollView>
      </View>

      {/* ── CARD LIST ─────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.list}>
          {loading ? (
            <ActivityIndicator color={colors.coral} style={{ marginTop: 32 }} />
          ) : tab === 'apps' ? (
            visibleApps.length > 0 ? (
              visibleApps.map((item) => (
                <AnalysisCard
                  key={item.app_url}
                  name={item.app_name}
                  category={item.category}
                  screens={item.screen_count}
                  difficulty={item.difficulty}
                  iconUrl={item.icon_url}
                  onPress={() => openApp(item)}
                />
              ))
            ) : (
              <Text style={styles.empty}>
                {appHistory.length === 0
                  ? 'No app analyses yet. Analyze an app to see it here.'
                  : `No apps match "${query}"`}
              </Text>
            )
          ) : visibleCreators.length > 0 ? (
            visibleCreators.map((item) => (
              <CreatorCard
                key={`${item.profile.platform}-${item.profile.handle}`}
                item={item}
                onPress={() => openCreator(item)}
              />
            ))
          ) : (
            <Text style={styles.empty}>
              {creatorHistory.length === 0
                ? 'No creator analyses yet. Analyze a creator to see it here.'
                : `No creators match "${query}"`}
            </Text>
          )}
        </View>
        <Footer style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPage },

  stickyHeader: {
    backgroundColor: colors.bgPage,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    gap: 10,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 2,
  },
  iconBtn: { padding: 6, width: 34 },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },

  // tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurfaceSunken,
    borderRadius: radii.card,
    padding: 3,
    gap: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radii.card - 2,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.bgSurface,
    ...shadows.card,
  },
  tabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabTextActive: { color: colors.textPrimary },

  // search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.input,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, ...type.bodyM, color: colors.textPrimary, padding: 0 },

  // filter pills
  filterScroll: { flexDirection: 'row', gap: 8, paddingBottom: 12 },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  filterPillActive: { backgroundColor: colors.coral, borderColor: colors.coral },
  filterText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterTextActive: { color: '#fff' },

  // list
  scroll: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[7],
  },
  list: { gap: 10 },
  empty: {
    ...type.bodyM,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[8],
  },
  footer: { marginTop: spacing[7] },

  // creator card
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: 12,
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flexShrink: 0,
  },
  creatorAvatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorEmoji: { fontSize: 22 },
  creatorInfo: { flex: 1, gap: 3 },
  creatorName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  creatorMeta: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  ideaCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    flexShrink: 0,
  },
  ideaCountText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },
});
