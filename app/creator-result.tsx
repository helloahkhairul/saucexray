import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Footer } from '@/components/Footer';
import { BackArrowIcon } from '@/components/icons';
import { colors, shadows } from '@/constants/colors';
import { radii, spacing, type } from '@/constants/theme';
import { getCreatorResult } from '@/services/creatorStore';
import type { AppIdea } from '@/services/monetizationIdeas';
import type { Platform } from '@/services/creatorAnalyzer';

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

const DIFFICULTY_TEXT: Record<string, string> = {
  Easy: colors.teal,
  Medium: colors.amber,
  Hard: colors.coral,
};
const DIFFICULTY_BG: Record<string, string> = {
  Easy: colors.tealHighlight,
  Medium: colors.amberHighlight,
  Hard: colors.coralHighlight,
};

function IdeaCard({
  idea,
  index,
  accentColor,
}: {
  idea: AppIdea;
  index: number;
  accentColor: string;
}) {
  const diffColor = DIFFICULTY_TEXT[idea.buildDifficulty] ?? colors.coral;
  const diffBg = DIFFICULTY_BG[idea.buildDifficulty] ?? colors.coralHighlight;

  return (
    <View style={[styles.ideaCard, shadows.card]}>
      {/* CARD HEADER */}
      <View style={styles.ideaHeader}>
        <View style={[styles.ideaNum, { backgroundColor: accentColor }]}>
          <Text style={styles.ideaNumText}>{index + 1}</Text>
        </View>
        <View style={styles.ideaTitles}>
          <Text style={styles.ideaName}>{idea.name}</Text>
          <Text style={styles.ideaTagline}>{idea.tagline}</Text>
        </View>
        <View style={[styles.diffBadge, { backgroundColor: diffBg }]}>
          <Text style={[styles.diffBadgeText, { color: diffColor }]}>
            {idea.buildDifficulty}
          </Text>
        </View>
      </View>

      {/* DESCRIPTION */}
      <Text style={styles.ideaDesc}>{idea.description}</Text>

      {/* META ROW */}
      <View style={styles.metaRow}>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Revenue</Text>
          <Text style={styles.metaValue}>{idea.revenueModel}</Text>
        </View>
        <View style={styles.metaSep} />
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Est. income</Text>
          <Text style={[styles.metaValue, { color: colors.teal }]}>
            {idea.estimatedRevenue}
          </Text>
        </View>
        <View style={styles.metaSep} />
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Audience</Text>
          <Text style={styles.metaValue} numberOfLines={2}>
            {idea.targetAudience}
          </Text>
        </View>
      </View>

      {/* KEY FEATURES */}
      {idea.keyFeatures?.length > 0 && (
        <View style={styles.featureList}>
          {idea.keyFeatures.slice(0, 3).map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={[styles.featureDot, { backgroundColor: accentColor }]} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function CreatorResultScreen() {
  const result = getCreatorResult();

  if (!result) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No creator data found.</Text>
          <Pressable
            onPress={() => router.push('/creator')}
            style={styles.emptyBtn}
          >
            <Text style={styles.emptyBtnText}>← Analyze a creator</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const { profile, ideas } = result;
  const accentColor = PLATFORM_COLORS[profile.platform] ?? colors.coral;
  const emoji = PLATFORM_EMOJI[profile.platform] ?? '◎';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* STICKY HEADER */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.push('/creator')}
            style={styles.iconBtn}
          >
            <BackArrowIcon size={22} />
          </Pressable>
          <Text style={styles.headerTitle}>Creator Analysis</Text>
          <View style={styles.iconBtn} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* CREATOR PROFILE CARD */}
        <View
          style={[
            styles.profileCard,
            shadows.card,
            { borderTopColor: accentColor, borderTopWidth: 3 },
          ]}
        >
          <View style={styles.profileRow}>
            {profile.thumbnailUrl ? (
              <Image
                source={{ uri: profile.thumbnailUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarFallback,
                  { backgroundColor: accentColor + '22' },
                ]}
              >
                <Text style={styles.avatarEmoji}>{emoji}</Text>
              </View>
            )}

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.creatorName} numberOfLines={1}>
                  {profile.name}
                </Text>
                {profile.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: accentColor }]}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.creatorHandle}>{profile.handle}</Text>
              <View
                style={[
                  styles.platformBadge,
                  {
                    backgroundColor: accentColor + '18',
                    borderColor: accentColor + '40',
                  },
                ]}
              >
                <Text style={[styles.platformBadgeText, { color: accentColor }]}>
                  {profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: accentColor }]}>
                {profile.followersDisplay.split(' ')[0]}
              </Text>
              <Text style={styles.statLabel}>
                {profile.followersDisplay.split(' ').slice(1).join(' ')}
              </Text>
            </View>
            {profile.avgViewsDisplay && (
              <>
                <View style={styles.statSep} />
                <View style={styles.statCell}>
                  <Text style={[styles.statValue, { color: accentColor }]}>
                    {profile.avgViewsDisplay.split(' ')[0]}
                  </Text>
                  <Text style={styles.statLabel}>
                    {profile.avgViewsDisplay.split(' ').slice(1).join(' ')}
                  </Text>
                </View>
              </>
            )}
          </View>

          {!!profile.bio && (
            <Text style={styles.bio} numberOfLines={3}>
              {profile.bio}
            </Text>
          )}
        </View>

        {/* APP IDEAS SECTION */}
        <Text style={styles.sectionLabel}>App monetization ideas</Text>

        {ideas.map((idea, i) => (
          <IdeaCard
            key={idea.name + i}
            idea={idea}
            index={i}
            accentColor={accentColor}
          />
        ))}

        <Footer style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPage },

  stickyHeader: {
    backgroundColor: colors.bgPage,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  iconBtn: { padding: 6, width: 34 },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },

  scroll: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[7],
  },

  profileCard: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: spacing[5],
    gap: 16,
    marginBottom: spacing[6],
    overflow: 'hidden',
  },
  profileRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  avatar: { width: 68, height: 68, borderRadius: 34, flexShrink: 0 },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 30 },
  profileInfo: { flex: 1, gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  creatorName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: colors.textPrimary,
    flex: 1,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  verifiedText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  creatorHandle: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  platformBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  platformBadgeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },

  statsRow: { flexDirection: 'row', paddingTop: 4 },
  statCell: { flex: 1, alignItems: 'center', gap: 2 },
  statSep: { width: 1, backgroundColor: colors.borderDefault },
  statValue: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 22,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 11,
    color: colors.textSecondary,
  },
  bio: { ...type.bodyS, color: colors.textSecondary, lineHeight: 18 },

  sectionLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  ideaCard: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: spacing[5],
    gap: 14,
    marginBottom: 12,
  },
  ideaHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ideaNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  ideaNumText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: '#fff',
  },
  ideaTitles: { flex: 1, gap: 3 },
  ideaName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: colors.textPrimary,
  },
  ideaTagline: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    flexShrink: 0,
  },
  diffBadgeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },
  ideaDesc: { ...type.bodyM, color: colors.textPrimary, lineHeight: 20 },

  metaRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurfaceSunken,
    borderRadius: radii.input,
    paddingVertical: 12,
  },
  metaCell: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
  },
  metaSep: { width: 1, backgroundColor: colors.borderDefault },
  metaLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metaValue: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  featureList: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  featureDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  featureText: { flex: 1, ...type.bodyS, color: colors.textSecondary, lineHeight: 18 },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: spacing[5],
  },
  emptyText: { ...type.bodyM, color: colors.textSecondary },
  emptyBtn: {
    backgroundColor: colors.coral,
    borderRadius: radii.button,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#fff',
  },

  footer: { marginTop: spacing[7] },
});
