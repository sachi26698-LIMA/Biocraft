import type { JSX } from 'react';
import {
  PersonIcon,
  PersonDressIcon,
  SparkIcon,
  ZapIcon,
  GemIcon,
  HeartIcon,
  CloudRainIcon,
  CrownIcon,
  LeafIcon,
  SmileIcon,
  GlobeIcon,
  TypeIcon,
  LotusIcon,
  FacebookIcon,
  RocketIcon,
  CameraIcon,
  GraduationCapIcon,
  GamepadIcon,
  FlowerIcon,
} from './icons';

const ICONS: Record<string, (props: { size?: number }) => JSX.Element> = {
  boys: PersonIcon,
  girls: PersonDressIcon,
  spark: SparkIcon,
  zap: ZapIcon,
  gem: GemIcon,
  heart: HeartIcon,
  sad: CloudRainIcon,
  crown: CrownIcon,
  leaf: LeafIcon,
  cool: SmileIcon,
  globe: GlobeIcon,
  type: TypeIcon,
  lotus: LotusIcon,
  facebook: FacebookIcon,
  rocket: RocketIcon,
  camera: CameraIcon,
  cap: GraduationCapIcon,
  gamer: GamepadIcon,
  cute: FlowerIcon,
};

/** Renders the collection's SVG glyph. Falls back to the spark icon. */
export default function CollectionIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? SparkIcon;
  return <Icon size={size} />;
}
