import { useState } from 'react';
import { RefreshIcon } from './icons';

/**
 * Instagram-style sample profile preview (BOYS / GIRLS variants).
 *
 * Honest by construction: the avatar is an original abstract SVG illustration
 * (no real person, no generated human face), the numbers are clearly-labelled
 * sample layout values, and a caption states the preview is illustrative and
 * not affiliated with Instagram.
 */

function BoyAvatar() {
  return (
    <svg viewBox="0 0 96 96" width="84" height="84" role="img" aria-label="Illustrated sample avatar, male silhouette">
      <defs>
        <linearGradient id="pv-boy-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#93C5FD" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="pv-boy-hoodie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B82B8" />
          <stop offset="1" stopColor="#0B1D3A" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" fill="url(#pv-boy-bg)" />
      <circle cx="48" cy="40" r="17.5" fill="#F2C9A4" />
      <path d="M29 34c2.5-9.5 10.5-14 19-14s16.5 4.5 19 14c-6-4-12-6-19-6s-13 2-19 6z" fill="#241B35" />
      <path d="M22 96c2-18 12.5-27 26-27s24 9 26 27z" fill="url(#pv-boy-hoodie)" />
      <path d="M40 74h16l-3 6h-10z" fill="#93C5FD" opacity="0.85" />
      <circle cx="41" cy="41" r="1.7" fill="#241B35" />
      <circle cx="55" cy="41" r="1.7" fill="#241B35" />
      <path d="M43.5 49.5c3 2.2 6 2.2 9 0" stroke="#241B35" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function GirlAvatar() {
  return (
    <svg viewBox="0 0 96 96" width="84" height="84" role="img" aria-label="Illustrated sample avatar, female silhouette">
      <defs>
        <linearGradient id="pv-girl-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FBCFE8" />
          <stop offset="1" stopColor="#9D174D" />
        </linearGradient>
        <linearGradient id="pv-girl-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F472B6" />
          <stop offset="1" stopColor="#831843" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" fill="url(#pv-girl-bg)" />
      <path d="M26 44c0-13 9.5-22 22-22s22 9 22 22v18c-4.5 3-9-3.5-9-9 0 4-4.5 6-13 6s-13-2-13-6c0 5.5-4.5 12-9 9z" fill="#2B1B2E" />
      <circle cx="48" cy="41" r="15.5" fill="#F6CFAE" />
      <path d="M32.5 37.5C34 26 40.5 21 48 21s14 5 15.5 16.5c-5-3.4-10-5-15.5-5s-10.5 1.6-15.5 5z" fill="#2B1B2E" />
      <circle cx="62.5" cy="30" r="3.4" fill="#FDA4AF" />
      <circle cx="62.5" cy="30" r="1.2" fill="#FFF1F2" />
      <path d="M23 96c2-17 12-26 25-26s23 9 25 26z" fill="url(#pv-girl-top)" />
      <circle cx="42" cy="42" r="1.6" fill="#2B1B2E" />
      <circle cx="54" cy="42" r="1.6" fill="#2B1B2E" />
      <path d="M43.5 50c3 2.4 6 2.4 9 0" stroke="#2B1B2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

interface ProfilePreviewProps {
  variant: 'boys' | 'girls';
  /** Bios from this collection; the preview cycles through them on shuffle. */
  bios: readonly string[];
}

export default function ProfilePreview({ variant, bios }: ProfilePreviewProps) {
  const sample = bios.length > 0 ? bios : [''];
  const [index, setIndex] = useState(0);
  const bio = sample[index % sample.length];

  return (
    <figure className="profile-preview" aria-label="Sample Instagram-style profile preview">
      <div className="profile-preview-card">
        <div className="profile-preview-top">
          <span className="profile-preview-avatar">{variant === 'boys' ? <BoyAvatar /> : <GirlAvatar />}</span>
          <dl className="profile-preview-stats">
            <div><dt>Posts</dt><dd>128</dd></div>
            <div><dt>Followers</dt><dd>1,024</dd></div>
            <div><dt>Following</dt><dd>180</dd></div>
          </dl>
        </div>
        <div className="profile-preview-id">
          <p className="profile-preview-name">Your Name</p>
          <p className="profile-preview-handle">@yourhandle</p>
        </div>
        <p className="profile-preview-bio">{bio}</p>
        <button
          type="button"
          className="btn btn-secondary btn-small profile-preview-shuffle"
          onClick={() => setIndex((current) => (current + 1) % sample.length)}
        >
          <RefreshIcon size={15} /> Shuffle bio
        </button>
      </div>
      <figcaption className="profile-preview-note">
        Illustrative sample layout — sample numbers, not a real account. Names, counts and imagery are
        placeholders; the bio text is a real entry from this collection. BioCraft is not affiliated with
        Instagram or Meta.
      </figcaption>
    </figure>
  );
}
