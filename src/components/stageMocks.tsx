import { useState } from 'react';
import type { JSX } from 'react';
import type { PlatformId } from '../tools/platforms';

/**
 * Landscape "app home" mocks — each one mirrors the official home of a real
 * platform (official wordmarks, brand colours, navigation and layout), with
 * BioCraft's own account shown inside. Every visible control is real:
 * like / follow / bookmark / post / comment toggle state locally.
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

const Avatar = ({ initials, from, to, size = 34, square = false }: { initials: string; from: string; to: string; size?: number; square?: boolean }) => (
  <span
    className={`mock-avatar${square ? ' mock-avatar--square' : ''}`}
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

const CommentGlyph = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 20l1.3-4.6A8.5 8.5 0 1 1 21 11.5Z" />
  </svg>
);

const ShareGlyph = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M21 3 3 10.5l7 2.5m11-10-5 18-4-7.5m9-10.5L10 13" />
  </svg>
);

const RepeatGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const BookmarkButton = () => {
  const { on, toggle } = useToggle(false);
  return (
    <button type="button" className={`mock-action${on ? ' is-on mock-action--ig-on' : ''}`} aria-pressed={on} onClick={toggle} aria-label={on ? 'Remove bookmark' : 'Save BioCraft’s post'}>
      <BookmarkGlyph filled={on} />
    </button>
  );
};

function LikeButton({ count, variant }: { count: number; variant?: 'ig' | 'x' | 'threads' }) {
  const { on, count: n, toggle } = useToggle(false, count);
  const cls = variant === 'ig' ? ' mock-action--ig' : variant === 'x' ? ' mock-action--x' : variant === 'threads' ? ' mock-action--threads' : '';
  return (
    <button type="button" className={`mock-action${cls}${on ? ' is-on' : ''}`} aria-pressed={on} onClick={toggle} aria-label={on ? 'Unlike BioCraft’s post' : 'Like BioCraft’s post'}>
      <HeartGlyph filled={on} />
      <span>{n}</span>
    </button>
  );
}

const FollowButton = ({ variant = 'ig' }: { variant?: 'ig' | 'li' | 'tiktok' }) => {
  const [on, setOn] = useState(false);
  const cls = variant === 'li' ? ' mock-followbtn--li' : variant === 'tiktok' ? ' mock-followbtn--tiktok' : '';
  return (
    <button
      type="button"
      className={`mock-followbtn${cls}${on ? ' is-on' : ''}`}
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
    >
      {on ? 'Following ✓' : 'Follow'}
    </button>
  );
};

const SunsetScene = ({ className = 'm-ig-art' }: { className?: string }) => (
  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice" className={`mock-scene ${className}`}>
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

const LocalComposer = ({ placeholder, buttonLabel, variant }: {
  placeholder: string;
  buttonLabel: string;
  variant: 'fb' | 'x';
}) => {
  const [text, setText] = useState('');
  const [posts, setPosts] = useState<string[]>(['Weekend trail in the Western Ghats — worth every step. BioCraft wrote the hype post.']);
  const submit = () => {
    const value = text.trim();
    if (!value) return;
    setPosts((current) => [value, ...current]);
    setText('');
  };
  return (
    <div className="mock-localcomposer">
      <div className={`mock-localcomposer-row mock-localcomposer-row--${variant}`}>
        <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={26} />
        <input
          className="mock-localcomposer-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') submit(); }}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <button type="button" className={`mock-localcomposer-btn mock-localcomposer-btn--${variant}`} onClick={submit}>{buttonLabel}</button>
      </div>
      {posts.map((post, index) => (
        <div key={`${index}-${post.slice(0, 12)}`} className="mock-post mock-post--local">
          <p className="mock-caption mock-caption--feed">{post}</p>
        </div>
      ))}
    </div>
  );
};

/* ================= Instagram — the home feed ================= */

const Story = ({ label, initials, from, to, mine = false }: { label: string; initials: string; from: string; to: string; mine?: boolean }) => (
  <span className="m-story">
    <span className={`m-story-ring${mine ? ' m-story-ring--mine' : ''}`}>
      <span className="m-story-in" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>{initials}</span>
      {mine && <span className="m-story-plus" aria-hidden="true">+</span>}
    </span>
    <span className="m-story-name">{label}</span>
  </span>
);

function InstagramWide() {
  return (
    <div className="mock m-ig">
      <header className="m-ig-topbar">
        <span className="m-ig-wordmark">Instagram</span>
        <span className="m-ig-icons" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7.2-4.6-9.3-9.4C1.6 7.4 4 4.6 7.1 4.6c1.9 0 3.6 1 4.9 2.6 1.3-1.6 3-2.6 4.9-2.6 3.1 0 5.5 2.8 4.4 6-2.1 4.8-9.3 9.4-9.3 9.4Z" /></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3 3 10.5l7 2.5m11-10-5 18-4-7.5m9-10.5L10 13" /></svg>
        </span>
      </header>
      <div className="m-ig-stories">
        <Story label="Your story" initials="BC" from="#A78BFA" to="#7C3AED" mine />
        <Story label="sunset.co" initials="SC" from="#F58529" to="#DD2A7B" />
        <Story label="kraftlab" initials="KL" from="#8134AF" to="#515BD4" />
        <Story label="urbangreens" initials="UG" from="#34D399" to="#15803D" />
        <Story label="fitwithria" initials="FR" from="#F472B6" to="#BE185D" />
        <Story label="artmeet.in" initials="AM" from="#2DD4BF" to="#0F766E" />
      </div>
      <div className="m-ig-post">
        <div className="m-ig-post-head">
          <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={22} />
          <span className="m-ig-user">biocraft</span>
          <FollowButton />
          <span className="m-dots" aria-hidden="true">•••</span>
        </div>
        <SunsetScene />
        <div className="m-ig-actions">
          <LikeButton count={248} variant="ig" />
          <span aria-hidden="true" className="m-ig-action-glyph"><CommentGlyph /></span>
          <span aria-hidden="true" className="m-ig-action-glyph"><ShareGlyph /></span>
          <span className="m-ig-actions-spacer" />
          <BookmarkButton />
        </div>
        <p className="m-ig-likes"><strong>248 likes</strong></p>
        <p className="mock-caption m-ig-caption"><strong>biocraft</strong> chasing the perfect 150-character sunset 🌇</p>
      </div>
      <nav className="m-ig-tabbar" aria-hidden="true">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.6H9.6V21H5a1 1 0 0 1-1-1v-8.8Z" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M10.5 10.2v4l3.5-2-3.5-2Z" fill="currentColor" stroke="none" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M5.5 8h13l-1.2 12a2 2 0 0 1-2 1.8H8.7a2 2 0 0 1-2-1.8L5.5 8Z" /><path d="M9 11V6.8a3 3 0 0 1 6 0V11" /></svg>
        <span className="m-ig-profile-dot">BC</span>
      </nav>
    </div>
  );
}

/* ================= Facebook — the feed ================= */

function FacebookWide() {
  const { on: liked, count: likes, toggle: toggleLike } = useToggle(false, 128);
  return (
    <div className="mock m-fb">
      <header className="m-fb-topbar">
        <span className="m-fb-wordmark">facebook</span>
        <span className="m-fb-icons" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 4h16v12H8l-4 4V4Z" /></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </header>
      <nav className="m-fb-tabs" aria-hidden="true">
        <span className="m-fb-tab is-active"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.6H9.6V21H5a1 1 0 0 1-1-1v-8.8Z" /></svg></span>
        <span className="m-fb-tab"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" /><circle cx="16.5" cy="9" r="2.7" /><path d="M16 14.6c2.2.2 3.7 1.7 4.2 4.4" /></svg></span>
        <span className="m-fb-tab"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M10.3 9.7v4.6l4-2.3-4-2.3Z" fill="currentColor" stroke="none" /></svg></span>
        <span className="m-fb-tab"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M4.5 7.5 12 4l7.5 3.5v6a7.5 7.5 0 0 1-15 0v-6Z" /><path d="M9.7 12.2l2.3 2.3 4.4-4.4" /></svg></span>
        <span className="m-fb-tab"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M5 8h14M5 12h14M5 16h14" /></svg></span>
      </nav>
      <div className="m-fb-feed">
        <div className="m-fb-card m-fb-composer-card">
          <LocalComposer placeholder="Post as BioCraft…" buttonLabel="Post" variant="fb" />
        </div>
        <div className="m-fb-card m-fb-post">
          <div className="m-fb-post-head">
            <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={26} />
            <span className="m-fb-post-meta"><strong>BioCraft</strong><span>Just now · <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10" opacity="0.9" /></svg></span></span>
            <span className="m-dots" aria-hidden="true">•••</span>
          </div>
          <SunsetScene />
          <div className="m-fb-reactions"><span className="m-fb-reaction-stack" aria-hidden="true">👍❤️😮</span><span>{likes} reactions</span><span className="m-fb-reactions-right">12 comments · 4 shares</span></div>
          <div className="m-fb-actions">
            <button type="button" className={`m-fb-action${liked ? ' is-on' : ''}`} aria-pressed={liked} onClick={toggleLike} aria-label={liked ? 'Unlike' : 'Like'}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Zm0 0 4.2-6.6c1.5.4 2.4 2 2 3.8l-.6 2.3h6.9a2 2 0 0 1 2 2.4l-1.3 6A2 2 0 0 1 18.2 21H7" /></svg>
              Like
            </button>
            <span className="m-fb-action m-fb-action--static" aria-hidden="true"><CommentGlyph /> Comment</span>
            <span className="m-fb-action m-fb-action--static" aria-hidden="true"><ShareGlyph /> Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Threads — the home feed ================= */

function ThreadsWide() {
  const posts = [
    { t: 'New drop: 40+ stylish name styles — each tuned to your platform’s real character limit.', like: 342, reply: 28, repost: 89, time: '3h' },
    { t: 'Rule-based beats AI slop. Your bio stays yours — nothing leaves your browser.', like: 219, reply: 17, repost: 64, time: '7h' },
    { t: 'Chasing the perfect 150-character bio, one honest draft at a time 🌇', like: 178, reply: 12, repost: 31, time: '11h' },
  ];
  return (
    <div className="mock m-thr">
      <header className="m-thr-topbar">
        <Avatar initials="BC" from="#E5E7EB" to="#4B5563" size={24} />
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"><path d="M12.4 3.6c4.7 0 8 2.8 8.2 7.2.18 4.2-2.35 7.15-6.35 7.15-2.9 0-4.6-1.35-4.6-3.6 0-2.1 1.55-3.4 3.95-3.4.62 0 1.22.1 1.78.28.18-2.25-1.32-4.6-4.9-4.6-3.62 0-6.05 2.4-6.05 6.4 0 4.28 3.2 6.7 7.45 6.7" /></svg>
        <span className="m-thr-icons" aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7.2-4.6-9.3-9.4C1.6 7.4 4 4.6 7.1 4.6c1.9 0 3.6 1 4.9 2.6 1.3-1.6 3-2.6 4.9-2.6 3.1 0 5.5 2.8 4.4 6-2.1 4.8-9.3 9.4-9.3 9.4Z" /></svg>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8.5v7M8.5 12h7" /></svg>
        </span>
      </header>
      <div className="m-thr-feed">
        {posts.map((post, index) => (
          <article key={index} className="m-thr-post">
            <Avatar initials="BC" from="#E5E7EB" to="#4B5563" size={26} />
            <div className="m-thr-body">
              <span className="m-thr-head"><strong>biocraft</strong><FollowButton /><span className="mock-meta">· {post.time}</span></span>
              <p className="m-thr-text">{post.t}</p>
              <div className="m-thr-actions">
                <LikeButton count={post.like} variant="threads" />
                <span className="m-thr-action-glyph" aria-hidden="true"><CommentGlyph /> <span>{post.reply}</span></span>
                <span className="m-thr-action-glyph" aria-hidden="true"><RepeatGlyph /> <span>{post.repost}</span></span>
                <span className="m-thr-action-glyph" aria-hidden="true"><ShareGlyph /></span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <nav className="m-thr-tabbar" aria-hidden="true">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.6H9.6V21H5a1 1 0 0 1-1-1v-8.8Z" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7.2-4.6-9.3-9.4C1.6 7.4 4 4.6 7.1 4.6c1.9 0 3.6 1 4.9 2.6 1.3-1.6 3-2.6 4.9-2.6 3.1 0 5.5 2.8 4.4 6-2.1 4.8-9.3 9.4-9.3 9.4Z" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8.2" r="3.6" /><path d="M5 20c.8-3.6 3.4-5.4 7-5.4s6.2 1.8 7 5.4" /></svg>
      </nav>
    </div>
  );
}

/* ================= TikTok — the FYP ================= */

function TikTokWide() {
  const { on, count, toggle } = useToggle(false, 14800);
  const [following, setFollowing] = useState(false);
  return (
    <div className="mock m-tt">
      <div className="m-tt-main">
        <div className="m-tt-view" aria-hidden="true">
          <svg viewBox="0 0 160 200" preserveAspectRatio="xMidYMid slice" className="m-tt-art">
            <defs>
              <linearGradient id="mock-fyp-wide" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#22d3ee" /><stop offset="0.5" stopColor="#0f172a" /><stop offset="1" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <rect width="160" height="200" fill="url(#mock-fyp-wide)" />
            <circle cx="78" cy="88" r="34" fill="#f8fafc" opacity="0.16" />
          </svg>
          <div className="m-tt-tabs"><span>Following</span><strong>For You</strong></div>
          <div className="m-tt-caption">
            <strong>@biocraft</strong>
            <span>POV: your bio finally sounds like you ✨</span>
            <span>♪ original sound — biocraft</span>
          </div>
        </div>
        <div className="m-tt-rail">
          <span className="m-tt-avatar-wrap">
            <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={36} />
            <button type="button" className={`m-tt-follow${following ? ' is-following' : ''}`} aria-pressed={following} onClick={() => setFollowing((v) => !v)} aria-label={following ? 'Unfollow BioCraft' : 'Follow BioCraft'}>
              {following ? '✓' : '+'}
            </button>
          </span>
          <button type="button" className={`m-tt-rail-btn${on ? ' is-on' : ''}`} aria-pressed={on} onClick={toggle} aria-label={on ? 'Unlike BioCraft’s video' : 'Like BioCraft’s video'}>
            <HeartGlyph filled={on} />
            <span>{(count / 1000).toFixed(1)}K</span>
          </button>
          <span className="m-tt-rail-btn m-tt-rail-btn--static" aria-hidden="true"><CommentGlyph /><span>412</span></span>
          <span className="m-tt-rail-btn m-tt-rail-btn--static" aria-hidden="true"><ShareGlyph /><span>2,340</span></span>
          <span className="m-tt-music" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V6l10-2v12" /><circle cx="7.5" cy="18" r="2.6" /><circle cx="17.5" cy="16" r="2.6" /></svg></span>
        </div>
      </div>
      <nav className="m-tt-tabbar" aria-hidden="true">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.6H9.6V21H5a1 1 0 0 1-1-1v-8.8Z" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 15c2.2-1.3 4-4.2 4-7.5 0-.3 1.2-3.5 7-3.5s7 3.2 7 3.5c0 3.3-1.8 6.2-4 7.5" /><path d="M7 18.5c1.7.8 3.4.8 5 .1" /></svg>
        <span className="m-tt-create"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 4h16v12H8l-4 4V4Z" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8.2" r="3.6" /><path d="M5 20c.8-3.6 3.4-5.4 7-5.4s6.2 1.8 7 5.4" /></svg>
      </nav>
    </div>
  );
}

/* ================= X — the For You feed ================= */

function XWide() {
  return (
    <div className="mock m-x">
      <header className="m-x-topbar">
        <Avatar initials="BC" from="#CBD5E1" to="#334155" size={24} />
        <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.2 5.2h3.8l5.3 7.05L18.6 5.2h2.2l-6.7 8.7 6.2 5h-3.8l-4.9-6.35-5.1 6.35H6.3l6.6-8.6-6.7-5.5Z" fill="currentColor" /></svg>
        <span className="m-x-icons" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><circle cx="12" cy="12" r="3.4" /><path d="M19.4 13.5a7.9 7.9 0 0 0 .1-3l2-1.4-2-3.4-2.3 1a8 8 0 0 0-2.6-1.5L14.2 3h-4l-.4 2.5a8 8 0 0 0-2.6 1.5l-2.3-1-2 3.4 2 1.4a7.9 7.9 0 0 0 0 3l-2 1.4 2 3.4 2.3-1a8 8 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a8 8 0 0 0 2.6-1.5l2.3 1 2-3.4-2-1.4Z" /></svg>
        </span>
      </header>
      <div className="m-x-tabs" aria-hidden="true"><strong>For you</strong><span>Following</span></div>
      <div className="m-x-composer"><LocalComposer placeholder="What is happening?!" buttonLabel="Post" variant="x" /></div>
      <article className="m-x-post">
        <div className="m-x-post-head">
          <Avatar initials="BC" from="#CBD5E1" to="#334155" size={28} />
          <span className="m-x-post-id"><strong>BioCraft</strong><span className="mock-meta mock-meta--dark"> @biocraft · 6h</span></span>
        </div>
        <p className="m-x-text">Your bio is the 160 characters between you and the follow button. Spend the four minutes — or let BioCraft draft it.</p>
        <div className="m-x-actions">
          <span className="m-x-action-glyph" aria-hidden="true"><CommentGlyph /> <span>38</span></span>
          <span className="m-x-action-glyph" aria-hidden="true"><RepeatGlyph /> <span>214</span></span>
          <LikeButton count={891} variant="x" />
          <span className="m-x-action-glyph" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M4 20V10M10.6 20V4M17.3 20v-8M22 20H2" /></svg> <span>12.8K</span></span>
          <span className="m-x-action-glyph" aria-hidden="true"><ShareGlyph /></span>
        </div>
      </article>
      <div className="m-x-trends">
        <p className="m-x-trends-title">Trends for you</p>
        <span className="m-x-trend"><strong>Bio generators</strong><span>24.6K posts</span></span>
        <span className="m-x-trend"><strong>Creator economy</strong><span>9.1K posts</span></span>
      </div>
      <nav className="m-x-tabbar" aria-hidden="true">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.6H9.6V21H5a1 1 0 0 1-1-1v-8.8Z" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M6 18V9.8a6 6 0 0 1 12 0V18l1.6 2.4H4.4L6 18Z" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2.2" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>
      </nav>
    </div>
  );
}

/* ================= LinkedIn — the home feed ================= */

function LinkedInWide() {
  const { on: liked, count: likes, toggle: toggleLike } = useToggle(false, 342);
  return (
    <div className="mock m-li">
      <header className="m-li-topbar">
        <span className="m-li-wordmark">LinkedIn</span>
        <span className="m-li-search" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg> Search</span>
        <span className="m-li-icons" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="4.4" height="4.4" rx="1" /><rect x="9.8" y="4" width="4.4" height="4.4" rx="1" /><rect x="15.6" y="4" width="4.4" height="4.4" rx="1" /><rect x="4" y="9.8" width="4.4" height="4.4" rx="1" /><rect x="9.8" y="9.8" width="4.4" height="4.4" rx="1" /><rect x="15.6" y="9.8" width="4.4" height="4.4" rx="1" /><rect x="4" y="15.6" width="4.4" height="4.4" rx="1" /><rect x="9.8" y="15.6" width="4.4" height="4.4" rx="1" /><rect x="15.6" y="15.6" width="4.4" height="4.4" rx="1" /></svg>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M6 18V9.8a6 6 0 0 1 12 0V18l1.6 2.4H4.4L6 18Z" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></svg>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2.2" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>
        </span>
      </header>
      <div className="m-li-scroll">
        <div className="m-li-card m-li-company">
          <div className="m-li-banner" aria-hidden="true" />
          <div className="m-li-company-body">
            <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={38} square />
            <span className="m-li-company-meta"><strong>BioCraft — Social Media Toolkit</strong><span>Bio toolkit · 12,441 followers</span></span>
            <FollowButton variant="li" />
          </div>
        </div>
        <article className="m-li-card m-li-post">
          <div className="m-li-post-head">
            <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={26} square />
            <span className="m-li-post-id"><strong>BioCraft</strong><span className="mock-meta">12,441 followers · 3h</span></span>
            <span className="m-dots" aria-hidden="true">•••</span>
          </div>
          <p className="m-li-text">We read 2,000 bios this month. The winners shared three traits: <strong>a specific promise, a niche noun and zero clichés.</strong> Steal the structure — or let BioCraft draft it in one tap.</p>
          <SunsetScene className="m-li-art" />
          <div className="m-li-actions">
            <button type="button" className={`m-li-action${liked ? ' is-on' : ''}`} aria-pressed={liked} onClick={toggleLike} aria-label={liked ? 'Unlike' : 'Like'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Zm0 0 4.2-6.6c1.5.4 2.4 2 2 3.8l-.6 2.3h6.9a2 2 0 0 1 2 2.4l-1.3 6A2 2 0 0 1 18.2 21H7" /></svg>
              Like · {likes}
            </button>
            <span className="m-li-action m-li-action--static" aria-hidden="true"><CommentGlyph /> Comment</span>
            <span className="m-li-action m-li-action--static" aria-hidden="true"><RepeatGlyph /> Repost</span>
            <span className="m-li-action m-li-action--static" aria-hidden="true"><ShareGlyph /> Send</span>
          </div>
        </article>
      </div>
      <nav className="m-li-tabbar" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.6H9.6V21H5a1 1 0 0 1-1-1v-8.8Z" /></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" /><circle cx="16.5" cy="9" r="2.7" /><path d="M16 14.6c2.2.2 3.7 1.7 4.2 4.4" /></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M12 8.5v7M8.5 12h7" /></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M6 18V9.8a6 6 0 0 1 12 0V18l1.6 2.4H4.4L6 18Z" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M9 8V6.4A2.4 2.4 0 0 1 11.4 4h1.2A2.4 2.4 0 0 1 15 6.4V8" /></svg>
      </nav>
    </div>
  );
}

/* ================= WhatsApp — the chats list ================= */

function WhatsAppWide() {
  const chats = [
    { name: 'BioCraft Studio', preview: '139 characters. One line. All vibe.', time: '09:30', unread: 2, from: '#25D366', to: '#075E54', initials: 'BC' },
    { name: 'Kraft Design Co.', preview: 'Voice note (0:42)', time: '08:15', unread: 1, from: '#F59E0B', to: '#B45309', initials: 'KD' },
    { name: 'Sunset Vendors', preview: 'Order packed — dispatch at 5 PM 📦', time: 'Yesterday', unread: 0, from: '#F97316', to: '#C2410C', initials: 'SV' },
    { name: 'Urban Greens', preview: 'The sunset shoot got moved to Sunday', time: 'Yesterday', unread: 0, from: '#34D399', to: '#047857', initials: 'UG' },
    { name: 'Dispatch', preview: 'Driver assigned for 6:30 PM', time: 'Monday', unread: 1, from: '#60A5FA', to: '#1D4ED8', initials: 'DP' },
    { name: 'Field Ops', preview: 'Standup notes dropped in the group', time: 'Monday', unread: 0, from: '#C084FC', to: '#7E22CE', initials: 'FO' },
  ];
  return (
    <div className="mock m-wa">
      <header className="m-wa-topbar">
        <span className="m-wa-wordmark">WhatsApp</span>
        <span className="m-wa-icons" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1L9 3.5h6L16.5 6h1A2.5 2.5 0 0 1 20 8.5v9A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-9Z" /><circle cx="12" cy="12.6" r="3.6" /></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5.5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="18.5" r="1.6" /></svg>
        </span>
      </header>
      <div className="m-wa-tabs" aria-hidden="true"><strong>Chats</strong><span>Status</span><span>Calls</span></div>
      <div className="m-wa-list" role="list">
        {chats.map((chat) => (
          <div key={chat.name} className="m-wa-row" role="listitem">
            <Avatar initials={chat.initials} from={chat.from} to={chat.to} size={38} />
            <span className="m-wa-row-main">
              <span className="m-wa-row-top"><strong>{chat.name}</strong><span className={`m-wa-time${chat.unread ? ' is-unread' : ''}`}>{chat.time}</span></span>
              <span className="m-wa-row-bottom"><span className="m-wa-preview">{chat.preview}</span>{chat.unread > 0 && <span className="m-wa-badge">{chat.unread}</span>}</span>
            </span>
          </div>
        ))}
      </div>
      <span className="m-wa-fab" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h8" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L10 16l-4 1 1-4 9.5-9.5Z" /></svg>
      </span>
    </div>
  );
}

/* ================= Snapchat — the Chat tab ================= */

const QuickAddButton = () => {
  const [added, setAdded] = useState(false);
  return (
    <button type="button" className={`m-snap-add${added ? ' is-added' : ''}`} aria-pressed={added} onClick={() => setAdded((v) => !v)}>
      {added ? 'Added ✓' : 'Add'}
    </button>
  );
};

function SnapchatWide() {
  return (
    <div className="mock m-snap">
      <header className="m-snap-topbar">
        <span className="m-snap-me" aria-hidden="true">BC</span>
        <strong>Chat</strong>
        <span className="m-snap-icons" aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="10.5" cy="8.2" r="3.4" /><path d="M4.5 19.4c.7-3.2 3-4.8 6-4.8s5.3 1.6 6 4.8" /><path d="M18.5 7.5v5M16 10h5" /></svg>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>
        </span>
      </header>
      <div className="m-snap-body">
        <p className="m-snap-label">New Snaps</p>
        <div className="m-snap-row">
          <Avatar initials="CD" from="#FBBF24" to="#F59E0B" size={34} />
          <span className="m-snap-row-main"><strong>craft.design</strong><span className="m-snap-sub m-snap-sub--new"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3l14 9-14 9V3Z" /></svg> New Snap · 2m</span></span>
        </div>
        <div className="m-snap-row">
          <Avatar initials="BC" from="#A78BFA" to="#7C3AED" size={34} />
          <span className="m-snap-row-main"><strong>biocraft</strong><span className="m-snap-sub m-snap-sub--new"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3l14 9-14 9V3Z" /></svg> New Snap · 1h</span></span>
        </div>
        <div className="m-snap-row">
          <Avatar initials="US" from="#F472B6" to="#BE185D" size={34} />
          <span className="m-snap-row-main"><strong>urban.studio</strong><span className="m-snap-sub">Opened · Yesterday</span></span>
        </div>
        <p className="m-snap-label">Quick Add</p>
        {[
          { name: 'FitWithRia', handle: '@fitwithria', initials: 'FR', from: '#F472B6', to: '#9D174D' },
          { name: 'CraftLab', handle: '@craftlab', initials: 'CL', from: '#FB923C', to: '#C2410C' },
          { name: 'SunsetCo', handle: '@sunset.co', initials: 'SC', from: '#F58529', to: '#8134AF' },
        ].map((person) => (
          <div key={person.handle} className="m-snap-row">
            <Avatar initials={person.initials} from={person.from} to={person.to} size={34} />
            <span className="m-snap-row-main"><strong>{person.name}</strong><span className="m-snap-sub">{person.handle}</span></span>
            <QuickAddButton />
          </div>
        ))}
      </div>
      <nav className="m-snap-tabbar" aria-hidden="true">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M12 21s-6.5-4.4-8.8-9A5.4 5.4 0 0 1 12 4.6 5.4 5.4 0 0 1 20.8 12c-2.3 4.6-8.8 9-8.8 9Z" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v13H8.5L4 20.5V4Z" /></svg>
        <span className="m-snap-camera"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5c3.2 0 5.4 2.1 5.5 5.3 0 .5.2 1 .7 1.3l.4.3c.9.6 1.2 1.7.7 2.7-.4.8-1.3 1.1-2.1.9l-.6-.1c-.3 1.4-1.2 2.4-2.4 2.8 1.6.5 2.3 1.8 1.6 3-.5 1-1.8 1.3-3 .8-1 .4-2.4.4-3.4 0-1.2.5-2.5.2-3-.8-.7-1.2 0-2.5 1.6-3-1.2-.4-2-1.4-2.4-2.8l-.6.1c-.8.2-1.7-.1-2.1-.9-.5-1 .1-2.1 1-2.7l.4-.3c.5-.3.7-.8.7-1.3.1-3.2 2.3-5.3 5.5-5.3Z" /></svg></span>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8.2" r="3.4" /><path d="M3.6 19.4c.7-3.2 3-4.8 5.4-4.8s4.7 1.6 5.4 4.8" /><circle cx="16.8" cy="9.6" r="2.6" /><path d="M16.4 14.7c1.9.3 3.2 1.8 3.6 4.1" /></svg>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
      </nav>
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
  whatsapp: WhatsAppWide,
  snapchat: SnapchatWide,
};
