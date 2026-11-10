import { LogoMark } from './icons';

/** BioCraft logo — layered-mark + wordmark for the light interface. */
export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="logo" aria-hidden="true">
      <LogoMark size={size} />
      <span className="logo-word">
        Bio<span className="logo-gradient">Craft</span>
      </span>
    </span>
  );
}
