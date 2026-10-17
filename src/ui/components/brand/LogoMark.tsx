import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { brand } from '@/ui/theme/tokens';

interface LogoMarkProps {
  size?: number;
  accessibilityLabel?: string;
}

export function LogoMark({ size = 28, accessibilityLabel = 'Pornhwa DB' }: LogoMarkProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Defs>
        <LinearGradient id="phdbRose" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={brand.roseLight} />
          <Stop offset="0.55" stopColor={brand.rose} />
          <Stop offset="1" stopColor={brand.roseDeep} />
        </LinearGradient>
        <RadialGradient id="phdbGlow" cx="0.5" cy="0.42" r="0.62">
          <Stop offset="0" stopColor={brand.rose} stopOpacity="0.55" />
          <Stop offset="1" stopColor={brand.rose} stopOpacity="0" />
        </RadialGradient>
        <ClipPath id="phdbSquircle">
          <Rect x="64" y="64" width="896" height="896" rx="224" />
        </ClipPath>
      </Defs>

      <Rect x="64" y="64" width="896" height="896" rx="224" fill={brand.ink} />
      <G clipPath="url(#phdbSquircle)">
        <Circle cx="512" cy="470" r="430" fill="url(#phdbGlow)" />
      </G>
      <Rect
        x="64"
        y="64"
        width="896"
        height="896"
        rx="224"
        fill="none"
        stroke={brand.border}
        strokeWidth="6"
      />

      <G
        fill="none"
        stroke="url(#phdbRose)"
        strokeWidth="118"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M362 286 V738" />
        <Path d="M362 286 H548 A116 116 0 0 1 548 518 H362" />
      </G>

      <G fill={brand.ink} opacity="0.62">
        <Rect x="452" y="334" width="112" height="24" rx="12" />
        <Rect x="452" y="386" width="112" height="24" rx="12" />
        <Rect x="452" y="438" width="112" height="24" rx="12" />
      </G>

      <Circle cx="700" cy="712" r="74" fill={brand.ink} />
      <Circle cx="700" cy="712" r="56" fill="url(#phdbRose)" />
      <Ellipse cx="700" cy="692" rx="30" ry="11" fill={brand.ink} opacity="0.35" />
    </Svg>
  );
}
