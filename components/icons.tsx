// Inline icon set recreated from the SauceXRay design bundle's hand-drawn SVGs
// (project/*.dc.html). Matches Lucide's ~1.6-1.8px stroke weight per the
// design system's iconography notes.
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = { size?: number; color?: string };

export function UserIcon({ size = 18, color = '#E8654A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Circle cx={9} cy={7} r={3} stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M3 15.5c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function LinkIcon({ size = 16, color = '#B0A89E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M6.5 9.5a3.536 3.536 0 005 0l2-2a3.536 3.536 0 00-5-5L7.5 3.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9.5 6.5a3.536 3.536 0 00-5 0l-2 2a3.536 3.536 0 005 5l.996-.997" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ScanIcon({ size = 18, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Rect x={2} y={2} width={4} height={4} rx={1} stroke={color} strokeWidth={1.6} />
      <Rect x={12} y={2} width={4} height={4} rx={1} stroke={color} strokeWidth={1.6} />
      <Rect x={2} y={12} width={4} height={4} rx={1} stroke={color} strokeWidth={1.6} />
      <Path d="M12 14h4M14 12v4" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M9 2v3M2 9h3M9 16v-3M16 9h-3" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 16, color = '#B0A89E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M6 4l4 4-4 4" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BackArrowIcon({ size = 22, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M14 5l-6 6 6 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShareIcon({ size = 22, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx={16} cy={6} r={2} stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx={6} cy={13} r={2} stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx={16} cy={16} r={2} stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M8 12.5l6-3M8 9.5l6 3" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 16, color = '#B0A89E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Circle cx={7} cy={7} r={4.5} stroke={color} strokeWidth={1.6} />
      <Path d="M11 11l3 3" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckmarkCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Circle cx={8} cy={8} r={7} fill="#D9F0EB" />
      <Path d="M5 8l2 2 4-4" stroke="#2BAA8E" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CameraIcon({ size = 22, color = '#E8654A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Rect x={2} y={5} width={18} height={14} rx={3} stroke={color} strokeWidth={1.7} />
      <Circle cx={11} cy={12} r={3.5} stroke={color} strokeWidth={1.7} />
      <Path d="M8 5l1.5-2.5h3L14 5" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Circle cx={16.5} cy={9} r={1} fill={color} />
    </Svg>
  );
}

export function BagIcon({ size = 22, color = '#2BAA8E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M4 8h14l-1.5 10H5.5L4 8z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M8 8V6a3 3 0 016 0v2" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M8 12h6" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function MusicIcon({ size = 22, color = '#D4960A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M9 16V7l9-2v9" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={7} cy={16} r={2.5} stroke={color} strokeWidth={1.7} />
      <Circle cx={16} cy={14} r={2.5} stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}

export function LanguageIcon({ size = 22, color = '#2BAA8E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 3C7.686 3 5 5.686 5 9c0 2.21 1.196 4.14 2.97 5.18L8 18h6l.03-3.82C15.804 13.14 17 11.21 17 9c0-3.314-2.686-6-6-6z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <Path d="M9 18v1a2 2 0 004 0v-1" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function ChatIcon({ size = 22, color = '#2BAA8E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M11 3a8 8 0 016.93 12.01L19 19l-4.07-1.07A8 8 0 1111 3z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M8.5 9.5c.5 1 1.5 2 2.5 2.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function GridScanIcon({ size = 20, color = '#E8654A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x={2} y={2} width={5} height={5} rx={1} stroke={color} strokeWidth={1.7} />
      <Rect x={13} y={2} width={5} height={5} rx={1} stroke={color} strokeWidth={1.7} />
      <Rect x={2} y={13} width={5} height={5} rx={1} stroke={color} strokeWidth={1.7} />
      <Path d="M13 16h5M15.5 13v5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M10 2v3M2 10h3M10 18v-3M18 10h-3" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function SparkCheckIcon({ size = 20, color = '#2BAA8E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx={10} cy={10} r={7.5} stroke={color} strokeWidth={1.7} />
      <Path d="M7 10l2 2 4-4" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BlueprintIcon({ size = 20, color = '#D4960A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M4 15V9l6-6 6 6v6a1 1 0 01-1 1H5a1 1 0 01-1-1z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M8 16v-4h4v4" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function AppIconGlyph({ size = 32, color = '#E8654A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect x={4} y={9} width={24} height={19} rx={4} stroke={color} strokeWidth={2} />
      <Circle cx={16} cy={18.5} r={5} stroke={color} strokeWidth={2} />
      <Path d="M12 9V8a4 4 0 018 0v1" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={23} cy={13} r={1.5} fill={color} />
    </Svg>
  );
}

export function BigScanIcon({ size = 32, color = '#E8654A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect x={3} y={3} width={7} height={7} rx={1.5} stroke={color} strokeWidth={2} />
      <Rect x={22} y={3} width={7} height={7} rx={1.5} stroke={color} strokeWidth={2} />
      <Rect x={3} y={22} width={7} height={7} rx={1.5} stroke={color} strokeWidth={2} />
      <Path d="M22 27h7M25.5 22v7" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M16 3v5M3 16h5M16 29v-5M29 16h-5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckIcon({ size = 14, color = '#2BAA8E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M3 7l3 3 5-5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
