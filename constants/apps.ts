// Shared "recent / saved analyses" data — mirrors the Home and Saved screens
// in the design bundle. Backed by Supabase once a user has real analyses
// (see services/supabase.ts); this is the seed/fallback list.
import { colors } from '@/constants/colors';
import {
  BagIcon,
  CameraIcon,
  ChatIcon,
  LanguageIcon,
  MusicIcon,
} from '@/components/icons';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type AppSummary = {
  id: string;
  name: string;
  category: string;
  screens: number;
  difficulty: Difficulty;
  Icon: (props: { size?: number; color?: string }) => JSX.Element;
  iconBg: string;
  iconColor: string;
};

export const difficultyColors: Record<Difficulty, { text: string; bg: string }> = {
  Easy: { text: colors.tealText, bg: colors.tealHighlight },
  Medium: { text: colors.amberText, bg: colors.amberHighlight },
  Hard: { text: colors.coralPress, bg: colors.accentHighlightBg },
};

export const apps: AppSummary[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social',
    screens: 42,
    difficulty: 'Hard',
    Icon: CameraIcon,
    iconBg: colors.accentHighlightBg,
    iconColor: colors.coral,
  },
  {
    id: 'ubereats',
    name: 'Uber Eats',
    category: 'Food',
    screens: 28,
    difficulty: 'Medium',
    Icon: BagIcon,
    iconBg: colors.tealHighlight,
    iconColor: colors.teal,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Music',
    screens: 35,
    difficulty: 'Hard',
    Icon: MusicIcon,
    iconBg: colors.amberHighlight,
    iconColor: colors.amber,
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    category: 'Education',
    screens: 18,
    difficulty: 'Easy',
    Icon: LanguageIcon,
    iconBg: colors.tealHighlight,
    iconColor: colors.teal,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Messaging',
    screens: 22,
    difficulty: 'Medium',
    Icon: ChatIcon,
    iconBg: colors.tealHighlight,
    iconColor: colors.teal,
  },
];

export const recentApps = apps.slice(0, 3);
