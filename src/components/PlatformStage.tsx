import type { CSSProperties } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useToolkit } from '../lib/toolkit';
import { platformById } from '../tools/platforms';
import { PLATFORM_WIDE_MOCKS } from './stageMocks';


/**
 * The hero — a premium MacBook-class laptop: photoreal asset for the
 * aluminium unibody, black keys and centred trackpad; the display is a live,
 * platform-reactive app screen with a live clock footer. Pink glow behind,
 * floating in idle sway + parallax.
 */
export default function PlatformStage() {
  const stageRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const { platform } = useToolkit();
  const config = platformById(platform);
  const Mock = PLATFORM_WIDE_MOCKS[config.id];
  const [now, setNow] = useState<Date | null>(null);
  /* Scale the fixed 610×419 app-home canvas to fill the live display */
  const [mockScale, setMockScale] = useState(1);
  useLayoutEffect(() => {
    const el = screenRef.current;
    if (!el) return undefined;
    const update = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth > 0 && clientHeight > 0) setMockScale(Math.min(clientWidth / 610, clientHeight / 419));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Mouse-follow parallax on top of the idle sway — rAF-lerped. */
  useEffect(() => {
    const stage = stageRef.current;
    const layer = parallaxRef.current;
    if (!stage || !layer) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (reduce.matches || !fine.matches) return undefined;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, raf = 0;
    const onMove = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };
    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      layer.style.setProperty('--plx', currentX.toFixed(4));
      layer.style.setProperty('--ply', currentY.toFixed(4));
      raf = window.requestAnimationFrame(tick);
    };
    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
    raf = window.requestAnimationFrame(tick);
    return () => {
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={stageRef}
      className="platform-stage"
      data-platform={config.id}
      aria-label="BioCraft homepage hero — the toolkit, in one laptop"
      style={{
        '--stage-accent': config.accent,
        '--stage-hover': config.accentHover,
        '--stage-deep': config.deep,
        '--stage-soft': config.accentSoft,
        '--stage-line': config.line,
        '--stage-tile-from': config.tileFrom,
        '--stage-tile-to': config.tileTo,
      } as CSSProperties}
    >
      <div className="container">
        <div className="stage-inner">
          {/* ============ The photoreal MacBook-class laptop ============ */}
          <div className="stage-perspective">
            <div className="laptop-parallax" ref={parallaxRef}>
              <div className="laptop-enter">
                <div className="laptop-float">
                  {/* Ambient glow behind the machine */}
                  <div className="laptop-glow" aria-hidden="true" />

                  {/* ===== Photoreal chassis — static geometry, live screen ===== */}
                  <div className="laptop-visual" data-platform={config.id}>
                    {/* Premium render: real keyboard, hinge, trackpad and aluminium body.
                        The display is pure black — our live interface renders on top of it. */}
                    {/* React 18.3 does not map the React 19 `fetchPriority` prop; the HTML attribute is
            `fetchpriority` (case-insensitive), which React 18 forwards when spelled lowercase. */}
                    <img className="laptop-chassis" src="/laptop-hero.webp" alt="" width={1742} height={1246} decoding="async" draggable={false} {...{ fetchpriority: 'high' } as object} />
                    <div className="laptop-screen-shell">
                      <div className="laptop-screen-canvas">
                        {/* The live app home — full-bleed, no chrome, no search */}
                        <div
                          className="stage-slab-screen"
                          key={config.id}
                          role="region"
                          aria-label={`Illustrative ${config.name} app home`}
                          ref={screenRef}
                          style={{ '--mock-scale': mockScale } as CSSProperties}
                        >
                          <Mock />
                        </div>

                        {/* Screen footer: live date/time + system icons */}
                        <div className="stage-slab-footer">
                          <span className="stage-footer-datetime">
                            <span className="stage-footer-date">{now ? now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '···'}</span>
                            <span className="stage-footer-time">
                              {/* Two localized variants — the phone-sized one drops seconds; CSS toggles them by width */}
                              <span className="stage-footer-time-short">{now ? now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '··:··'}</span>
                              <span className="stage-footer-time-full" aria-hidden="true">{now ? now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', second: '2-digit' }) : '··:··'}</span>
                            </span>
                          </span>
                          <span className="stage-footer-home" aria-hidden="true"><span className="stage-footer-home-bar" /></span>
                          <span className="stage-footer-icons" aria-hidden="true">
                            {/* Wi-Fi */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2.5 9.5a15.5 15.5 0 0 1 19 0" /><path d="M6 13.4a10.5 10.5 0 0 1 12 0" /><path d="M9.5 17a5.2 5.2 0 0 1 5 0" /><circle cx="12" cy="20" r="1.1" fill="currentColor" stroke="none" /></svg>
                            {/* Cellular signal */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="14" width="3.2" height="6" rx="1" /><rect x="8.4" y="10.5" width="3.2" height="9.5" rx="1" /><rect x="13.8" y="7" width="3.2" height="13" rx="1" /><rect x="19.2" y="3.5" width="3.2" height="16.5" rx="1" /></svg>
                            {/* Battery */}
                            <span className="stage-footer-battery">
                              <span>92%</span>
                              <svg width="24" height="14" viewBox="0 0 26 14" fill="none"><rect x="0.7" y="0.7" width="20" height="12.6" rx="3.4" stroke="currentColor" strokeWidth="1.4" /><rect x="3" y="3" width="13.2" height="8" rx="1.6" fill="currentColor" /><path d="M24 4.8v4.4a2.4 2.4 0 0 0 0-4.4Z" fill="currentColor" /></svg>
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact shadow on the surface beneath */}
                  <div className="laptop-shadow" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
