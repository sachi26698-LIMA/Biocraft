import { useState } from 'react';
import type { JSX } from 'react';
import type { PlatformId } from '../tools/platforms';

/**
 * Landscape "app home" mocks — BioCraft's own official accounts across the
 * six platforms, illustrative only. Every visible control is real:
 * like / bookmark / follow / post / comment toggle state locally.
 * No network, no fake interactivity.
 */

function useToggle(initial = false, initialCount = 0) {
  const [on, setOn] = useState(initial);
  const [count, setCount] = useState(initialCount);
  const toggle = () => {
    setOn((current) => {
      setCount((value) => value + (current ? -1 : 1));
      return !current;
    });
  };
  return { on, count, toggle };
}

const Avatar = ({ initials, from, to, size = 34 }: { initials: string; from: string; to: string; size?: number }) => (
  <span
    className="mock-avatar"
    style={{ width: size, height: size, background: `linear-gradient(135deg, ${from}, ${to})`, fontSize: size * 0.34 }}
    aria-hidden="true"
  >
    {initials}
  </span>
);

const HeartGlyph = ({ filled }: { filled: boolean }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M12 20s-7.2-4.6-9.3-9.4C1.6 7.4 4 4.6 7.1 4.6c1.9 0 3.6 1 4.9 2.6 1.3-1.6 3-2.6 4.9-2.6 3.1 0 5.5 2.8 4.4 6-2.1 4.8-9.3 9.4-9.3 9.4Z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const BookmarkGlyph = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7 4h10v16l-5-4.2L7 20V4Z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

function LikeButton({ count }: { count: number }) {
  const { on, count: n, toggle } = useToggle(false, count);
  return (
    <button type="button" className={`mock-action${on ? ' is-on' : ''}`} aria-pressed={on} onClick={toggle} aria-label={on ? 'Unlike BioCraft’s post' : 'Like BioCraft’s post'}>
      <HeartGlyph filled={on} />
      <span>{n}</span>
    </button>
  );
}

function BookmarkButton() {
  const { on, toggle } = useToggle(false);
  return (
    <button type="button" className={`mock-action${on ? ' is-on' : ''}`} aria-pressed={on} onClick={toggle} aria-label={on ? 'Remove bookmark' : 'Save BioCraft’s post'}>
      <BookmarkGlyph filled={on} />
    </button>
  );
}

const FollowButton = ({ variant = 'ig' }: { variant?: 'ig' | 'li' }) => {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={`mock-followbtn${variant === 'li' ? ' mock-followbtn--li' : ''}${on ? ' is-on' : ''}`}
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
    >
      {on ? 'Following ✓' : 'Follow'}
    </button>
  );
};

const SunsetScene = () => (
  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice" className="mock-scene">
    <defs>
      <linearGradient id="mock-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFD9A0" /><stop offset="0.45" stopColor="#FF9E9E" /><stop offset="1" stopColor="#B983FF" />
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#mock-sky)" />
    <circle cx="100" cy="78" r="22" fill="#FFF3D6" />
    <path d="M0 88 44 44 78 88Z" fill="#5E3A8E" opacity="0.85" />
    <path d="M52 88 108 30 156 88Z" fill="#3E2560" opacity="0.9" />
    <path d="M120 88 162 52 200 88Z" fill="#2A163F" />
    <rect y="88" width="200" height="32" fill="#1B0E28" />
  </svg>
);

const LocalComposer = ({ placeholder, buttonLabel, wide }: {
  placeholder: string;
  buttonLabel: string;
  wide?: boolean;
}) => {
  const [text, setText] = useState('');
  const [posts, setPosts] = useState<string[]>([wide ? 'Weekend trail in the Western Ghats — worth every step. BioCraft wrote the hype post.' : ''].filter(Boolean));
  const submit = () => {
    const value = text.trim();
    if (!value) return;
    setPosts((current) => [value, ...current]);
    setText('');
  };
  return (
    <div className="mock-localcomposer">
      <div className="mock-localcomposer-row">
        <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={30} />
        <input
          className="mock-localcomposer-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') submit(); }}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <button type="button" className="mock-localcomposer-btn" onClick={submit}>{buttonLabel}</button>
      </div>
      {posts.map((post, index) => (
        <div key={`${index}-${post.slice(0, 12)}`} className="mock-post mock-post--local">
          <div className="mock-post-head">
            <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={24} />
            <span className="mock-post-head-col">
              <span className="mock-username">BioCraft</span>
              <span className="mock-meta">Just now</span>
            </span>
          </div>
          <p className="mock-caption">{post}</p>
        </div>
      ))}
    </div>
  );
};

function InstagramWide() {
  return (
    <div className="mock mock-wide mock-wide--instagram">
      <div className="mock-header mock-header--compact">
        <span className="mock-wordmark mock-wordmark--ig">Instagram</span>
        <span className="mock-header-icons" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.35-4.35" /></svg>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M21 3 3 10.5l7 2.5m11-10-5 18-4-7.5m9-10.5L10 13" /></svg>
        </span>
      </div>
      <div className="mock-wide-body mock-wide-body--insta">
        <div className="mock-wide-main">
          <SunsetScene />
          <div className="mock-post-actions">
            <LikeButton count={248} />
            <BookmarkButton />
          </div>
          <p className="mock-caption"><strong>biocraft</strong> chasing the perfect 150-character sunset 🌇</p>
        </div>
        <aside className="mock-wide-side">
          <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={44} />
          <strong className="mock-side-title">biocraft</strong>
          <span className="mock-meta">1,024 followers · 9 tools
          </span>
          <p className="mock-side-note">Free, private bio tools — built for creators.</p>
          <FollowButton />
          <p className="mock-side-label">From BioCraft</p>
          {[['✦', '@biocraft — daily bio tips'], ['🛠', '9 free generators, zero sign-up']].map(([icon, text]) => (
            <div key={text as string} className="mock-side-row mock-side-row--static">
              <span className="mock-side-emoji" aria-hidden="true">{icon}</span>
              <span className="mock-side-text">{text as string}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function FacebookWide() {
  return (
    <div className="mock mock-wide mock-wide--facebook">
      <div className="mock-header mock-header--fb mock-header--compact">
        <span className="mock-wordmark mock-wordmark--fb">facebook</span>
        <span className="mock-header-search mock-header-search--static" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.35-4.35" /></svg> Search</span>
      </div>
      <div className="mock-wide-body mock-wide-body--fb">
        <div className="mock-wide-main">
          <LocalComposer placeholder="Post as BioCraft…" buttonLabel="Post" wide />
        </div>
        <aside className="mock-wide-side mock-wide-side--soft">
          <p className="mock-side-label">BioCraft updates</p>
          {[['🚀', 'BioCraft v1.0 — all 9 tools are live'], ['🇮🇳', 'Hindi bios now supported everywhere'], ['🔒', '100% private — runs in your browser'], ['⭐', 'Free forever, no account needed']].map(([icon, text]) => (
            <div key={text as string} className="mock-side-row mock-side-row--static">
              <span className="mock-side-emoji" aria-hidden="true">{icon}</span>
              <span className="mock-side-text">{text as string}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function ThreadsWide() {
  return (
    <div className="mock mock-wide mock-wide--threads">
      <div className="mock-header mock-header--compact mock-header--threads">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12.4 3.6c4.7 0 8 2.8 8.2 7.2.18 4.2-2.35 7.15-6.35 7.15-2.9 0-4.6-1.35-4.6-3.6 0-2.1 1.55-3.4 3.95-3.4.62 0 1.22.1 1.78.28.18-2.25-1.32-4.6-4.9-4.6-3.62 0-6.05 2.4-6.05 6.4 0 4.28 3.2 6.7 7.45 6.7" /></svg>
        <span className="mock-username">biocraft</span>
      </div>
      <div className="mock-wide-body mock-wide-body--threads">
        <div className="mock-wide-main">
          {[
            { t: 'New drop: 40+ stylish name styles — each tuned to your platform’s real character limit.', l: 342 },
            { t: 'Rule-based beats AI slop. Your bio stays yours — nothing leaves your browser.', l: 219 },
          ].map((post, index) => (
            <div key={index} className="mock-thread-post mock-thread-post--wide">
              <Avatar initials="BC" from="#E5E7EB" to="#4B5563" size={28} />
              <div className="mock-thread-body">
                <span className="mock-username">biocraft <span className="mock-meta">· 3h</span></span>
                <p className="mock-caption">{post.t}</p>
                <div className="mock-post-actions"><LikeButton count={post.l} /></div>
              </div>
            </div>
          ))}
        </div>
        <aside className="mock-wide-side mock-wide-side--soft">
          <p className="mock-side-label">On Threads</p>
          {['Weekly bio teardown', 'New Unicode styles as they drop', 'Platform limit cheat-sheets'].map((text) => (
            <div key={text} className="mock-side-row mock-side-row--static">
              <span className="mock-side-emoji" aria-hidden="true">✦</span>
              <span className="mock-side-text">{text}</span>
            </div>
          ))}
          <FollowButton />
        </aside>
      </div>
    </div>
  );
}

function TikTokWide() {
  const { on, count, toggle } = useToggle(false, 14800);
  const [following, setFollowing] = useState(false);
  const [comments, setComments] = useState(['BioCraft actually slaps', 'Wait — this is completely free?!']);
  const [draft, setDraft] = useState('');
  const send = () => {
    const value = draft.trim();
    if (!value) return;
    setComments((current) => [...current, value]);
    setDraft('');
  };
  return (
    <div className="mock mock-wide mock-wide--tiktok">
      <div className="mock-tiktok-hero" aria-hidden="true">
        <svg viewBox="0 0 160 200" preserveAspectRatio="xMidYMid slice" className="mock-scene">
          <defs>
            <linearGradient id="mock-fyp-wide" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22d3ee" /><stop offset="0.5" stopColor="#0f172a" /><stop offset="1" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <rect width="160" height="200" fill="url(#mock-fyp-wide)" />
          <circle cx="78" cy="88" r="34" fill="#f8fafc" opacity="0.16" />
        </svg>
        <div className="mock-tiktok-hero-overlay">
          <strong>@biocraft</strong>
          <span>POV: your bio finally sounds like you ✨ #biocraft</span>
        </div>
      </div>
      <div className="mock-tiktok-side">
        <div className="mock-tiktok-creator">
          <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={36} />
          <div className="mock-tiktok-creator-meta">
            <strong>biocraft</strong>
            <span className="mock-meta mock-meta--dark">148K followers</span>
          </div>
          <button type="button" className={`mock-follow${following ? ' is-following' : ''}`} aria-pressed={following} onClick={() => setFollowing((v) => !v)} aria-label={following ? 'Unfollow BioCraft' : 'Follow BioCraft'}>
            {following ? '✓' : '+'}
          </button>
          <button type="button" className={`mock-rail-btn mock-rail-btn--light${on ? ' is-on' : ''}`} aria-pressed={on} onClick={toggle} aria-label={on ? 'Unlike BioCraft’s video' : 'Like BioCraft’s video'}>
            <HeartGlyph filled={on} />
            <span>{(count / 1000).toFixed(1)}K</span>
          </button>
        </div>
        <div className="mock-tiktok-comments">
          <p className="mock-side-label mock-side-label--dark">412 comments</p>
          <ul className="mock-tiktok-comment-list">
            {comments.map((comment, index) => (
              <li key={index}><strong>biocraft.fan</strong> {comment}</li>
            ))}
          </ul>
          <div className="mock-localcomposer-row mock-localcomposer-row--dark">
            <input
              className="mock-localcomposer-input mock-localcomposer-input--dark"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') send(); }}
              placeholder="Add a comment…"
              aria-label="Add a comment"
            />
            <button type="button" className="mock-localcomposer-btn mock-localcomposer-btn--dark" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function XWide() {
  return (
    <div className="mock mock-wide mock-wide--x">
      <div className="mock-header mock-header--x mock-header--compact">
        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.2 5.2h3.8l5.3 7.05L18.6 5.2h2.2l-6.7 8.7 6.2 5h-3.8l-4.9-6.35-5.1 6.35H6.3l6.6-8.6-6.7-5.5Z" fill="currentColor" /></svg>
        <span className="mock-wordmark mock-wordmark--x">BioCraft</span>
      </div>
      <div className="mock-wide-body mock-wide-body--x">
        <div className="mock-wide-main">
          <LocalComposer placeholder="Post as BioCraft…" buttonLabel="Post" />
          <div className="mock-thread-post mock-thread-post--wide">
            <Avatar initials="BC" from="#CBD5E1" to="#334155" size={28} />
            <div className="mock-thread-body">
              <span className="mock-username">BioCraft <span className="mock-meta">@biocraft</span></span>
              <p className="mock-caption">Your bio is the 160 characters between you and the follow button. Spend the four minutes — or let BioCraft draft it.</p>
              <div className="mock-post-actions"><LikeButton count={891} /></div>
            </div>
          </div>
        </div>
        <aside className="mock-wide-side mock-wide-side--soft">
          <p className="mock-side-label">Trending with BioCraft</p>
          {['#BioCraftWeek', 'BioCraft v1.0', 'Rule-based tools', 'Creator economy'].map((trend) => (
            <div key={trend} className="mock-side-row mock-side-row--static">
              <span className="mock-side-trend">{trend}</span>
              <span className="mock-meta">12.4K posts</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function LinkedInWide() {
  const { on, count, toggle } = useToggle(false, 342);
  return (
    <div className="mock mock-wide mock-wide--linkedin">
      <div className="mock-li-banner mock-li-banner--compact" aria-hidden="true" />
      <div className="mock-li-profilebar">
        <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={42} />
        <div className="mock-li-profilebar-meta">
          <strong>BioCraft — Social Media Toolkit</strong>
          <span className="mock-meta">9 free, private generators · Follow for bio science</span>
        </div>
        <FollowButton variant="li" />
      </div>
      <div className="mock-wide-body mock-wide-body--li">
        <div className="mock-wide-main">
          <p className="mock-caption mock-caption--li">We read 2,000 bios this month. The winners shared three traits: <strong>a specific promise, a niche noun, and zero clichés.</strong> Steal the structure — or let BioCraft draft it in one tap.</p>
          <div className="mock-post-actions">
            <button type="button" className={`mock-action mock-action--chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={toggle} aria-label={on ? 'Unlike' : 'Like'}>
              <HeartGlyph filled={on} />
              <span>Like · {count}</span>
            </button>
          </div>
        </div>
        <aside className="mock-wide-side mock-wide-side--soft">
          <p className="mock-side-label">From the BioCraft blog</p>
          {['Why rule-based beats AI slop for bios', '150 characters that matter: IG limits', 'Hindi bios: a field guide'].map((text) => (
            <div key={text} className="mock-side-row mock-side-row--static">
              <span className="mock-side-emoji" aria-hidden="true">✦</span>
              <span className="mock-side-text">{text}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

export const PLATFORM_WIDE_MOCKS: Record<PlatformId, () => JSX.Element> = {
  instagram: InstagramWide,
  facebook: FacebookWide,
  threads: ThreadsWide,
  tiktok: TikTokWide,
  x: XWide,
  linkedin: LinkedInWide,
};
