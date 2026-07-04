import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Footer } from '@/components/Footer';
import { BlueprintIcon, GridScanIcon, SparkCheckIcon } from '@/components/icons';
import { colors, shadows } from '@/constants/colors';
import { radii, spacing, type } from '@/constants/theme';

const FEATURES = [
  {
    Icon: GridScanIcon,
    iconBg: colors.accentHighlightBg,
    iconColor: colors.coral,
    title: 'Paste any app link',
    subtitle: 'App Store or Play Store',
  },
  {
    Icon: SparkCheckIcon,
    iconBg: colors.tealHighlight,
    iconColor: colors.teal,
    title: 'AI-powered analysis',
    subtitle: 'Features, screens, tech stack breakdown',
  },
  {
    Icon: BlueprintIcon,
    iconBg: colors.amberHighlight,
    iconColor: colors.amber,
    title: 'Get your rebuild blueprint',
    subtitle: 'MVP scope, build order, time estimates',
  },
];

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.top}>
          <View style={styles.logoRow}>
            <Text style={styles.logoSauce}>Sauce</Text>
            <Text style={styles.logoXray}>XRay.</Text>
          </View>

          <Text style={styles.tagline}>
            See inside any app.{' '}
            <Text style={styles.highlight}>Build it better.</Text>
          </Text>

          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f.title} style={[styles.featureCard, shadows.card]}>
                <View style={[styles.featureIcon, { backgroundColor: f.iconBg }]}>
                  <f.Icon size={20} color={f.iconColor} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottom}>
          <Pressable
            onPress={() => router.push('/home')}
            style={({ pressed }) => [
              styles.cta,
              shadows.button,
              pressed && { backgroundColor: colors.coralPress, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={styles.ctaText}>Start analyzing →</Text>
          </Pressable>
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgPage,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[7],
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingTop: spacing[2],
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoSauce: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 32,
    color: colors.textPrimary,
    letterSpacing: -0.32,
  },
  logoXray: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 32,
    color: colors.coral,
    letterSpacing: -0.32,
  },
  tagline: {
    ...type.bodyM,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  highlight: {
    backgroundColor: colors.accentHighlightBg,
    color: colors.coralPress,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  features: {
    gap: spacing[2] + 2,
    width: '100%',
    marginTop: spacing[6],
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3] + 2,
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radii.card,
    padding: spacing[4],
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  featureSubtitle: {
    ...type.bodyS,
    color: colors.textSecondary,
  },
  bottom: {
    gap: spacing[4],
  },
  cta: {
    width: '100%',
    backgroundColor: colors.accentPrimary,
    borderRadius: radii.button,
    paddingVertical: 15,
    paddingHorizontal: spacing[6],
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.16,
  },
});
