import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Footer } from '@/components/Footer';
import { CheckIcon } from '@/components/icons';
import { colors, shadows } from '@/constants/colors';
import { radii, spacing, type } from '@/constants/theme';
import { analyzeYouTube, analyzeTikTok, analyzeInstagram } from '@/services/creatorAnalyzer';
import { generateMonetizationIdeas } from '@/services/monetizationIdeas';
import { setCreatorResult } from '@/services/creatorStore';
import { addCreatorToHistory } from '@/services/creatorHistory';

const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#E8654A',
  tiktok: '#2BAA8E',
  instagram: '#E1306C',
};

const PLATFORM_EMOJI: Record<string, string> = {
  youtube: '▶',
  tiktok: '♪',
  instagram: '◉',
};

function SpinningArc({ size = 72, color }: { size?: number; color: string }) {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDeg((d) => (d + 6) % 360), 16);
    return () => clearInterval(id);
  }, []);
  return (
    <View
      style={{
        transform: [{ rotate: `${deg}deg` }],
        position: 'absolute',
        width: size,
        height: size,
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 3}
          stroke={color}
          strokeWidth={3}
          strokeDasharray="60 150"
          strokeLinecap="round"
          opacity={0.7}
          fill="none"
        />
      </Svg>
    </View>
  );
}

function PulseRing({
  delay = 0,
  inset = 0,
  color,
}: {
  delay?: number;
  inset?: number;
  color: string;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const period = 2000;
    const start = Date.now() - delay;
    const id = setInterval(() => {
      const t = ((Date.now() - start) % period) / period;
      setVal(t < 0.5 ? t * 2 : (1 - t) * 2);
    }, 33);
    return () => clearInterval(id);
  }, [delay]);
  const scale = 0.85 + val * 0.35;
  const opacity = 0.15 - val * 0.11;
  return (
    <View
      style={{
        position: 'absolute',
        top: inset,
        bottom: inset,
        left: inset,
        right: inset,
        borderRadius: 9999,
        backgroundColor: color,
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

function InlineSpinner({ color }: { color: string }) {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDeg((d) => (d + 10) % 360), 33);
    return () => clearInterval(id);
  }, []);
  return (
    <View style={{ transform: [{ rotate: `${deg}deg` }] }}>
      <Svg width={16} height={16} viewBox="0 0 16 16">
        <Circle
          cx={8}
          cy={8}
          r={6}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="20 18"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

type StepState = 'done' | 'active' | 'pending';

function StepRow({
  label,
  stepState,
  isLast,
  accentColor,
}: {
  label: string;
  stepState: StepState;
  isLast?: boolean;
  accentColor: string;
}) {
  return (
    <View style={[styles.stepRow, !isLast && styles.stepBorder]}>
      {stepState === 'done' && (
        <View style={[styles.stepDot, { backgroundColor: colors.tealHighlight }]}>
          <CheckIcon size={14} color={colors.teal} />
        </View>
      )}
      {stepState === 'active' && (
        <View style={[styles.stepDot, { backgroundColor: colors.accentHighlightBg }]}>
          <InlineSpinner color={accentColor} />
        </View>
      )}
      {stepState === 'pending' && (
        <View
          style={[
            styles.stepDot,
            {
              backgroundColor: colors.bgSurfaceSunken,
              borderWidth: 1.5,
              borderColor: colors.borderDefault,
            },
          ]}
        >
          <View style={styles.pendingDot} />
        </View>
      )}
      <Text
        style={[
          styles.stepLabel,
          stepState === 'done' && { color: colors.teal },
          stepState === 'active' && { color: accentColor },
          stepState === 'pending' && { color: colors.textMuted },
        ]}
      >
        {label}
      </Text>
      {stepState === 'done' && (
        <Text style={[styles.stepStatus, { color: colors.teal }]}>Done</Text>
      )}
      {stepState === 'active' && (
        <Text style={[styles.stepStatus, { color: accentColor }]}>...</Text>
      )}
    </View>
  );
}

export default function CreatorAnalyzingScreen() {
  const { platform = 'youtube', handle = '' } =
    useLocalSearchParams<{ platform?: string; handle?: string }>();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [error, setError] = useState<string | null>(null);

  const accentColor = PLATFORM_COLORS[platform] ?? colors.coral;
  const emoji = PLATFORM_EMOJI[platform] ?? '◎';
  const platformLabel =
    platform.charAt(0).toUpperCase() + platform.slice(1);

  function parseFriendlyError(err: unknown): string {
    const msg = String((err as Error)?.message ?? err ?? '');
    const isNotFound =
      msg.includes('404') ||
      msg.toLowerCase().includes('not_found') ||
      msg.toLowerCase().includes('not found');
    if (isNotFound) {
      return `No results found. We couldn't find a ${platformLabel} channel or profile matching "${handle}". Please check the handle and try again.`;
    }
    return 'Analysis failed. Please check your connection and try again.';
  }

  useEffect(() => {
    if (!handle) return;

    const t1 = setTimeout(() => setStep(1), 400);

    const run = async () => {
      try {
        let profile;
        if (platform === 'youtube') profile = await analyzeYouTube(handle);
        else if (platform === 'tiktok') profile = await analyzeTikTok(handle);
        else profile = await analyzeInstagram(handle);

        setStep(2);

        const ideas = await generateMonetizationIdeas(profile);

        setCreatorResult({ profile, ideas });
        addCreatorToHistory({ profile, ideas }).catch(() => {});
        setTimeout(() => {
          setStep(3);
          setTimeout(() => router.replace('/creator-result'), 600);
        }, 800);
      } catch (err: unknown) {
        setError(parseFriendlyError(err));
      }
    };

    run();
    return () => clearTimeout(t1);
  }, [handle, platform]);

  const step1: StepState = step >= 1 ? 'done' : 'active';
  const step2: StepState = step >= 2 ? 'done' : step === 1 ? 'active' : 'pending';
  const step3: StepState = step >= 3 ? 'done' : step === 2 ? 'active' : 'pending';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.logoSauce}>Sauce</Text>
        <Text style={styles.logoXray}>XRay.</Text>
      </View>

      <View style={styles.center}>
        <View style={styles.pulseContainer}>
          <PulseRing delay={300} inset={0} color={accentColor} />
          <PulseRing delay={0} inset={10} color={accentColor} />
          <View
            style={[
              styles.coreCircle,
              {
                borderColor: accentColor,
                backgroundColor: accentColor + '18',
              },
            ]}
          >
            <Text style={styles.platformEmoji}>{emoji}</Text>
            <SpinningArc size={72} color={accentColor} />
          </View>
        </View>

        <View style={styles.labelGroup}>
          <Text style={styles.analyzingText}>Analyzing {handle}...</Text>
          {error ? (
            <Text style={[styles.subText, { color: accentColor }]}>{error}</Text>
          ) : (
            <Text style={styles.subText}>This usually takes 15–20 seconds</Text>
          )}
        </View>

        <View style={[styles.stepCard, shadows.card]}>
          <StepRow
            label={`Fetching ${platformLabel} profile`}
            stepState={step1}
            accentColor={accentColor}
          />
          <StepRow
            label="AI analyzing audience"
            stepState={step2}
            accentColor={accentColor}
          />
          <StepRow
            label="Generating app ideas"
            stepState={step3}
            isLast
            accentColor={accentColor}
          />
        </View>

        {error && (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              { backgroundColor: accentColor },
              shadows.button,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.backBtnText}>← Go back</Text>
          </Pressable>
        )}
      </View>

      <Footer style={styles.footer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgPage,
    paddingHorizontal: spacing[6],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[4],
  },
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
  },
  pulseContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  coreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  platformEmoji: {
    fontSize: 26,
    color: colors.textPrimary,
    lineHeight: 30,
  },
  labelGroup: { alignItems: 'center', gap: 6 },
  analyzingText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    lineHeight: 26,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  subText: { ...type.bodyS, color: colors.textSecondary },
  stepCard: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    paddingHorizontal: spacing[5],
    width: '100%',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  stepBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.muted,
  },
  stepLabel: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
  },
  stepStatus: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
  },
  backBtn: {
    width: '100%',
    borderRadius: radii.button,
    paddingVertical: 14,
    paddingHorizontal: spacing[5],
    alignItems: 'center',
  },
  backBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.15,
  },
  footer: { paddingBottom: spacing[6] },
});
