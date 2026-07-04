import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Footer } from '@/components/Footer';
import { AppIconGlyph, BackArrowIcon, CheckmarkCircleIcon, ShareIcon } from '@/components/icons';
import { colors, shadows } from '@/constants/colors';
import { radii, spacing, type } from '@/constants/theme';
import { getLastResult } from '@/services/store';
import type { AnalysisResult } from '@/services/analyzer';
import { estimateBuildTime } from '@/utils/buildTimeEstimator';

// ─── Display shape ────────────────────────────────────────────

type DisplayData = {
  appName: string;
  developer: string;
  category: string;
  rating: string;
  price: string;
  overview: string;
  targetAudience: string;
  monetization: string;
  complaints: string[];
  screenCount: number;
  difficulty: string;
  screenFlow: string[];
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
  techStack: string[];
  improvements: string[];
  mvpScreens: string[];
  buildSteps: { label: string; time: string }[];
  buildTimeVibe: string;
  buildTimeHybrid: string;
  buildTimeManual: string;
  buildTimeBreakdown: string;
  buildTimeDisclaimer: string;
};

const FALLBACK: DisplayData = {
  appName: 'Instagram',
  developer: 'Meta Platforms',
  category: 'Social',
  rating: '4.0',
  price: 'Free',
  overview:
    'A photo and video sharing social network where users create and discover content through feeds, Stories, and Reels. Owned by Meta, it is one of the world\'s most-used social platforms with over 2 billion monthly active users.',
  targetAudience: '18–35 year old content creators and social media users',
  monetization: 'Freemium + Ads',
  complaints: [
    'Algorithm changes reduce organic reach',
    'Too many ads in stories and reels',
    'Mental health concerns for younger users',
  ],
  screenCount: 42,
  difficulty: 'Hard',
  screenFlow: ['Onboarding', 'Home Feed', 'Stories', 'Reels', 'Search / Explore', 'Profile', 'Settings'],
  mustHaveFeatures: [
    'Photo/Video feed with infinite scroll',
    'Stories with 24hr expiry',
    'Reels short-form video player',
    'Direct messaging',
    'Search and explore grid',
  ],
  niceToHaveFeatures: ['Shopping / marketplace', 'Live streaming', 'Close friends lists'],
  techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'AWS S3', 'FFmpeg'],
  improvements: [
    'Add AI-powered content suggestions',
    'Simplify onboarding to 2 steps instead of 5',
    'Better creator monetization tools',
  ],
  mvpScreens: ['Auth / Login screen', 'Home feed with photo grid', 'User profile page', 'Camera / Upload screen'],
  ...(() => {
    const labels = ['Auth + Onboarding', 'Home Feed UI', 'Profile + Camera', 'Polish + Testing'];
    const t = estimateBuildTime(42, 'Hard', labels.length);
    return {
      buildSteps: labels.map((label, i) => ({ label, time: t.stepTimings[i] ?? '' })),
      buildTimeVibe: t.vibecoding,
      buildTimeHybrid: t.hybrid,
      buildTimeManual: t.manual,
      buildTimeBreakdown: t.breakdown,
      buildTimeDisclaimer: t.disclaimer,
    };
  })(),
};

function fromResult(r: AnalysisResult): DisplayData {
  const steps = r.build_steps ?? [];
  return {
    appName: r.app_name,
    developer: r.developer,
    category: r.category,
    rating: r.rating ? String(r.rating) : '—',
    price: r.price,
    overview: r.overview,
    targetAudience: r.target_audience,
    monetization: r.monetization,
    complaints: r.complaints,
    screenCount: r.screen_count,
    difficulty: r.difficulty,
    screenFlow: r.screen_flow,
    mustHaveFeatures: r.must_have_features,
    niceToHaveFeatures: r.nice_to_have_features,
    techStack: r.tech_stack,
    improvements: r.improvement_opportunities,
    mvpScreens: r.screen_flow.slice(0, 4),
    ...(() => {
      const t = estimateBuildTime(r.screen_count, r.difficulty, steps.length);
      return {
        buildSteps: steps.map((s, i) => ({
          label: s.label,
          time: t.stepTimings[i] ?? s.time,
        })),
        buildTimeVibe: t.vibecoding,
        buildTimeHybrid: t.hybrid,
        buildTimeManual: t.manual,
        buildTimeBreakdown: t.breakdown,
        buildTimeDisclaimer: t.disclaimer,
      };
    })(),
  };
}

// ─── Sub-components ───────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={[styles.sectionCard, shadows.card]}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {children}
    </View>
  );
}

function Pill({ label, style }: { label: string; style?: object }) {
  return <Text style={[styles.pill, style]}>{label}</Text>;
}

// ─── Tab content ──────────────────────────────────────────────

function OverviewTab({ data }: { data: DisplayData }) {
  return (
    <>
      <SectionCard title="What this app does">
        <Text style={styles.bodyText}>{data.overview}</Text>
      </SectionCard>

      <SectionCard title="Target audience">
        <Text style={styles.bodyText}>{data.targetAudience}</Text>
      </SectionCard>

      <View style={[styles.sectionCard, shadows.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <Text style={styles.sectionLabel}>Monetization</Text>
        <Pill label={`💰 ${data.monetization}`} style={{ backgroundColor: colors.amberHighlight, color: colors.amberText }} />
      </View>

      <SectionCard title="Top user complaints">
        {data.complaints.map((complaint, i) => (
          <View
            key={i}
            style={[
              styles.complaintRow,
              i < data.complaints.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault },
            ]}
          >
            <View style={styles.amberDot} />
            <Text style={styles.bodyText}>{complaint}</Text>
          </View>
        ))}
      </SectionCard>
    </>
  );
}

function TechnicalTab({ data }: { data: DisplayData }) {
  const difficultyColor =
    data.difficulty === 'Easy'
      ? colors.teal
      : data.difficulty === 'Hard'
      ? colors.coral
      : colors.amber;

  return (
    <>
      <View style={[styles.sectionCard, shadows.card, { flexDirection: 'row', alignItems: 'center', gap: spacing[4] }]}>
        <Text style={styles.bigNumber}>{data.screenCount}</Text>
        <View>
          <Text style={styles.sectionLabel}>Estimated screens</Text>
          <Text style={styles.bodyText}>screens identified</Text>
        </View>
      </View>

      <SectionCard title="Screen flow">
        {data.screenFlow.map((step, i) => (
          <View key={step + i} style={styles.flowRow}>
            <View style={styles.flowDotCol}>
              <View style={[styles.flowDot, i === data.screenFlow.length - 1 && { backgroundColor: colors.muted }]} />
              {i < data.screenFlow.length - 1 && <View style={styles.flowLine} />}
            </View>
            <Text style={styles.bodyS}>{step}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Core features">
        <Text style={styles.featureGroup}>Must-have</Text>
        <View style={{ gap: 8, marginBottom: 14 }}>
          {data.mustHaveFeatures.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureDot, { backgroundColor: colors.coral }]} />
              <Text style={styles.bodyS}>{f}</Text>
            </View>
          ))}
        </View>
        <View style={styles.divider} />
        <Text style={[styles.featureGroup, { marginTop: 14 }]}>Nice-to-have</Text>
        <View style={{ gap: 8 }}>
          {data.niceToHaveFeatures.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureDot, { backgroundColor: colors.muted }]} />
              <Text style={[styles.bodyS, { color: colors.textSecondary }]}>{f}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Suggested tech stack">
        <View style={styles.chipWrap}>
          {data.techStack.map((t) => (
            <Text key={t} style={styles.techChip}>{t}</Text>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Complexity score">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill
            label={data.difficulty}
            style={{ backgroundColor: colors.accentHighlightBg, color: difficultyColor, fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13 }}
          />
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const filled =
                data.difficulty === 'Easy' ? n <= 2 : data.difficulty === 'Hard' ? n <= 5 : n <= 3;
              return (
                <View
                  key={n}
                  style={[styles.complexityBar, { backgroundColor: filled ? colors.coral : colors.borderDefault }]}
                />
              );
            })}
          </View>
        </View>
      </SectionCard>
    </>
  );
}

function BlueprintTab({ data }: { data: DisplayData }) {
  return (
    <>
      <View style={[styles.sectionCard, shadows.card]}>
        <Text style={styles.mvpTitle}>
          MVP scope — build in{' '}
          <Text style={styles.highlight}>{data.buildTimeVibe}</Text>
        </Text>
        <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Focus on these screens only</Text>
        <View style={{ gap: 8 }}>
          {data.mvpScreens.map((screen, i) => (
            <View key={i} style={styles.numberedRow}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{i + 1}</Text>
              </View>
              <Text style={styles.bodyS}>{screen}</Text>
            </View>
          ))}
        </View>
      </View>

      <SectionCard title="Improvement opportunities">
        <View style={{ gap: 10 }}>
          {data.improvements.map((item, i) => (
            <View key={i} style={styles.oppRow}>
              <CheckmarkCircleIcon size={16} />
              <Text style={styles.bodyS}>{item}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Estimated build time">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={[styles.timeCard, { backgroundColor: colors.coral }]}>
            <Text style={[styles.timeValue, { color: '#fff' }]}>{data.buildTimeVibe}</Text>
            <Text style={[styles.timeLabel, { color: 'rgba(255,255,255,0.8)' }]}>⚡ VibeCoding</Text>
          </View>
          <View style={[styles.timeCard, { backgroundColor: colors.accentHighlightBg, borderWidth: 1.5, borderColor: colors.borderDefault }]}>
            <Text style={[styles.timeValue, { color: colors.coral }]}>{data.buildTimeHybrid}</Text>
            <Text style={[styles.timeLabel, { color: colors.coralPress }]}>🔀 Hybrid</Text>
          </View>
          <View style={[styles.timeCard, { backgroundColor: colors.bgSurfaceSunken, borderWidth: 1.5, borderColor: colors.borderDefault }]}>
            <Text style={[styles.timeValue, { color: colors.textPrimary }]}>{data.buildTimeManual}</Text>
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>🛠 Manual</Text>
          </View>
        </View>
        <Text style={styles.buildBreakdown}>{data.buildTimeBreakdown}</Text>
        <Text style={styles.buildDisclaimer}>ⓘ {data.buildTimeDisclaimer}</Text>
      </SectionCard>

      <SectionCard title="Build order">
        {data.buildSteps.map((step, i) => (
          <View key={i} style={styles.buildRow}>
            <View style={styles.buildStepCol}>
              <View style={[styles.buildBadge, i === data.buildSteps.length - 1 && { backgroundColor: colors.teal }]}>
                <Text style={styles.buildNum}>{String(i + 1).padStart(2, '0')}</Text>
              </View>
              {i < data.buildSteps.length - 1 && <View style={styles.buildLine} />}
            </View>
            <View style={styles.buildInfo}>
              <Text style={styles.buildLabel}>{step.label}</Text>
              <Text style={styles.buildTime}>⏱ {step.time}</Text>
            </View>
          </View>
        ))}
      </SectionCard>
    </>
  );
}

// ─── Main screen ──────────────────────────────────────────────

const TABS = ['Overview', 'Technical X-Ray', 'Rebuild Blueprint'] as const;
type Tab = typeof TABS[number];

export default function ResultScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const stored = getLastResult();
  const data: DisplayData = stored ? fromResult(stored) : FALLBACK;
  const iconUrl: string | undefined = stored?.icon_url;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/home')} style={styles.iconBtn}>
          <BackArrowIcon size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Analysis result</Text>
        <Pressable style={styles.iconBtn}>
          <ShareIcon size={22} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={[styles.appCard, shadows.card]}>
          <View style={styles.appIcon}>
            {iconUrl ? (
              <Image source={{ uri: iconUrl }} style={styles.appIconImage} />
            ) : (
              <AppIconGlyph size={32} color={colors.coral} />
            )}
          </View>
          <Text style={styles.appName}>{data.appName}</Text>
          <Text style={styles.devName}>{data.developer}</Text>
          <View style={styles.badgeRow}>
            <Pill label={`📱 ${data.category}`} style={styles.pillCoral} />
            <Pill label={`⭐ ${data.rating}`} style={styles.pillCoral} />
            <Pill label={data.price} style={styles.pillTeal} />
          </View>
        </View>

        <View style={[styles.tabBar, shadows.card]}>
          {TABS.map((tab, i) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabBtn,
                i > 0 && styles.tabBtnBorder,
                activeTab === tab && styles.tabBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab ? styles.tabTextActive : styles.tabTextInactive,
                ]}
                numberOfLines={1}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'Overview' && <OverviewTab data={data} />}
          {activeTab === 'Technical X-Ray' && <TechnicalTab data={data} />}
          {activeTab === 'Rebuild Blueprint' && <BlueprintTab data={data} />}
        </View>

        <Footer style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPage },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    backgroundColor: colors.bgPage,
  },
  iconBtn: { padding: 6 },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[7],
    gap: spacing[4],
  },
  appCard: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: spacing[5],
    alignItems: 'center',
    gap: 10,
    marginTop: spacing[5],
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.accentHighlightBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  appIconImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  appName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  devName: {
    ...type.bodyS,
    color: colors.textSecondary,
  },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 },
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    lineHeight: 18,
    overflow: 'hidden',
  },
  pillCoral: { backgroundColor: colors.accentHighlightBg, color: colors.coralPress },
  pillTeal: { backgroundColor: colors.tealHighlight, color: colors.tealText },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabBtnBorder: {
    borderLeftWidth: 1,
    borderLeftColor: colors.borderDefault,
  },
  tabBtnActive: { borderBottomColor: colors.coral },
  tabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    lineHeight: 16,
  },
  tabTextActive: { color: colors.coral },
  tabTextInactive: { color: colors.textSecondary },
  tabContent: { gap: 14 },
  sectionCard: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: spacing[4],
  },
  sectionLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  bodyText: {
    ...type.bodyM,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  bodyS: {
    ...type.bodyS,
    color: colors.textPrimary,
  },
  complaintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
  },
  amberDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.amber,
    marginTop: 6,
    flexShrink: 0,
  },
  bigNumber: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 52,
    color: colors.coral,
    letterSpacing: -1,
    lineHeight: 56,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  flowDotCol: {
    width: 16,
    alignItems: 'center',
    flexShrink: 0,
  },
  flowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.coral,
  },
  flowLine: {
    width: 2,
    height: 24,
    backgroundColor: colors.borderDefault,
    marginTop: 2,
  },
  featureGroup: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  divider: { height: 1, backgroundColor: colors.borderDefault, marginBottom: 14 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  techChip: {
    backgroundColor: colors.accentHighlightBg,
    color: colors.coralPress,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    fontFamily: 'JetBrainsMono_600SemiBold',
    fontSize: 12,
    overflow: 'hidden',
  },
  complexityBar: { width: 28, height: 10, borderRadius: radii.pill },
  mvpTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  highlight: {
    backgroundColor: colors.accentHighlightBg,
    color: colors.coralPress,
    overflow: 'hidden',
    borderRadius: 6,
  },
  numberedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  numberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentHighlightBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numberText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: colors.coral,
    lineHeight: 22,
  },
  oppRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  timeCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  timeValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 4,
  },
  timeLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    lineHeight: 14,
  },
  buildRow: { flexDirection: 'row', gap: 14 },
  buildStepCol: { width: 32, alignItems: 'center', flexShrink: 0 },
  buildBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  buildNum: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 12, color: '#fff' },
  buildLine: { width: 2, flex: 1, backgroundColor: colors.borderDefault, marginTop: 4, minHeight: 20 },
  buildInfo: { paddingTop: 6, flex: 1, paddingBottom: 14 },
  buildLabel: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, lineHeight: 18, color: colors.textPrimary, marginBottom: 2 },
  buildTime: { ...type.bodyS, color: colors.textSecondary },
  buildBreakdown: {
    marginTop: 10,
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buildDisclaimer: {
    marginTop: 6,
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: { marginTop: spacing[4] },
});
