import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Footer } from '@/components/Footer';
import { BigScanIcon, CheckIcon } from '@/components/icons';
import { colors, shadows } from '@/constants/colors';
import { radii, spacing, type } from '@/constants/theme';
import { analyzeApp, extractAppName } from '@/services/analyzer';
import { addToHistory } from '@/services/history';
import { setLastResult } from '@/services/store';

function SpinningArc({ size = 72 }: { size?: number }) {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDeg(d => (d + 6) % 360), 16);
    return () => clearInterval(id);
  }, []);
  return (
    <View style={{ transform: [{ rotate: `${deg}deg` }], position: 'absolute', width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 3}
          stroke={colors.coral}
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

function PulseRing({ delay = 0, inset = 0 }: { delay?: number; inset?: number }) {
  const [val, setVal] = useState(0); // 0 → 1 → 0 over 2s cycle
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
        backgroundColor: colors.coral,
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

function InlineSpinner() {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDeg(d => (d + 10) % 360), 33);
    return () => clearInterval(id);
  }, []);
  return (
    <View style={{ transform: [{ rotate: `${deg}deg` }] }}>
      <Svg width={16} height={16} viewBox="0 0 16 16">
        <Circle cx={8} cy={8} r={6} stroke={colors.coral} strokeWidth={2} strokeDasharray="20 18" strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  );
}

// 0 = all pending, 1 = step1 done + step2 running, 2 = step2 done + step3 running, 3 = all done
type Step = 0 | 1 | 2 | 3;

function StepRow({
  label,
  stepState,
}: {
  label: string;
  stepState: 'done' | 'active' | 'pending';
}) {
  const isLast = label === 'Generating rebuild plan';
  return (
    <View style={[styles.stepRow, !isLast && styles.stepBorder]}>
      {stepState === 'done' && (
        <View style={[styles.stepDot, { backgroundColor: colors.tealHighlight }]}>
          <CheckIcon size={14} color={colors.teal} />
        </View>
      )}
      {stepState === 'active' && (
        <View style={[styles.stepDot, { backgroundColor: colors.accentHighlightBg }]}>
          <InlineSpinner />
        </View>
      )}
      {stepState === 'pending' && (
        <View style={[styles.stepDot, { backgroundColor: colors.bgSurfaceSunken, borderWidth: 1.5, borderColor: colors.borderDefault }]}>
          <View style={styles.pendingDot} />
        </View>
      )}
      <Text
        style={[
          styles.stepLabel,
          stepState === 'done' && { color: colors.teal },
          stepState === 'active' && { color: colors.coral },
          stepState === 'pending' && { color: colors.textMuted },
        ]}
      >
        {label}
      </Text>
      {stepState === 'done' && <Text style={[styles.stepStatus, { color: colors.teal }]}>Done</Text>}
      {stepState === 'active' && <Text style={[styles.stepStatus, { color: colors.coral }]}>...</Text>}
    </View>
  );
}

export default function AnalyzingScreen() {
  const { url } = useLocalSearchParams<{ url?: string }>();
  const [step, setStep] = useState<Step>(0);
  const [error, setError] = useState<string | null>(null);

  const appName = url ? extractAppName(url) : 'your app';

  useEffect(() => {
    if (!url) return;

    const t1 = setTimeout(() => setStep(1), 500);

    analyzeApp(url)
      .then((result) => {
        setStep(2);
        setLastResult(result);
        addToHistory(result);
        setTimeout(() => {
          setStep(3);
          setTimeout(() => router.replace('/result'), 600);
        }, 800);
      })
      .catch((err: Error) => {
        setError(err.message ?? 'Analysis failed');
      });

    return () => clearTimeout(t1);
  }, [url]);

  const step1: 'done' | 'active' | 'pending' = step >= 1 ? 'done' : step === 0 ? 'active' : 'pending';
  const step2: 'done' | 'active' | 'pending' = step >= 2 ? 'done' : step === 1 ? 'active' : 'pending';
  const step3: 'done' | 'active' | 'pending' = step >= 3 ? 'done' : step === 2 ? 'active' : 'pending';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.logoSauce}>Sauce</Text>
        <Text style={styles.logoXray}>XRay.</Text>
      </View>

      <View style={styles.center}>
        <View style={styles.pulseContainer}>
          <PulseRing delay={300} inset={0} />
          <PulseRing delay={0} inset={10} />
          <View style={styles.coreCircle}>
            <BigScanIcon size={32} color={colors.coral} />
            <SpinningArc size={72} />
          </View>
        </View>

        <View style={styles.labelGroup}>
          <Text style={styles.analyzingText}>Analyzing {appName}...</Text>
          {error ? (
            <Text style={[styles.subText, { color: colors.coral }]}>{error}</Text>
          ) : (
            <Text style={styles.subText}>This usually takes 10–15 seconds</Text>
          )}
        </View>

        <View style={[styles.stepCard, shadows.card]}>
          <StepRow label="Fetching app data" stepState={step1} />
          <StepRow label="AI analyzing features" stepState={step2} />
          <StepRow label="Generating rebuild plan" stepState={step3} />
        </View>

        {error && (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.viewBtn,
              shadows.button,
              pressed && { backgroundColor: colors.coralPress },
            ]}
          >
            <Text style={styles.viewBtnText}>← Go back</Text>
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
    backgroundColor: colors.accentHighlightBg,
    borderWidth: 2.5,
    borderColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  labelGroup: {
    alignItems: 'center',
    gap: 6,
  },
  analyzingText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    lineHeight: 26,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  subText: {
    ...type.bodyS,
    color: colors.textSecondary,
  },
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
  viewBtn: {
    width: '100%',
    backgroundColor: colors.accentPrimary,
    borderRadius: radii.button,
    paddingVertical: 14,
    paddingHorizontal: spacing[5],
    alignItems: 'center',
  },
  viewBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.15,
  },
  footer: {
    paddingBottom: spacing[6],
  },
});
