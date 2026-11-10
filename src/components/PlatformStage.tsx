import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useToolkit } from '../lib/toolkit';
import { platformById } from '../tools/platforms';
import { LogoMark } from './icons';
import { PLATFORM_WIDE_MOCKS } from './stageMocks';

/** Decorative US-layout keyboard — six rows, keys flex-grow to real proportions. */
const KEY_ROWS: Array<Array<{ label: string; grow?: number }>> = [
  [{ label: 'esc', grow: 1.5 }, { label: 'F1' }, { label: 'F2' }, { label: 'F3' }, { label: 'F4' }, { label: 'F5' }, { label: 'F6' }, { label: 'F7' }, { label: 'F8' }, { label: 'F9' }, { label: 'F10' }, { label: 'F11' }, { label: 'F12' }, { label: '', grow: 1.4 }],
  [{ label: '`' }, { label: '1' }, { label: '2' }, { label: '3' }, { label: '4' }, { label: '5' }, { label: '6' }, { label: '7' }, { label: '8' }, { label: '9' }, { label: '0' }, { label: '-' }, { label: '=' }, { label: '⌫', grow: 1.9 }],
  [{ label: '⇥', grow: 1.6 }, { label: 'Q' }, { label: 'W' }, { label: 'E' }, { label: 'R' }, { label: 'T' }, { label: 'Y' }, { label: 'U' }, { label: 'I' }, { label: 'O' }, { label: 'P' }, { label: '[' }, { label: ']' }, { label: '\\', grow: 1.3 }],
  [{ label: '⇪', grow: 1.9 }, { label: 'A' }, { label: 'S' }, { label: 'D' }, { label: 'F' }, { label: 'G' }, { label: 'H' }, { label: 'J' }, { label: 'K' }, { label: 'L' }, { label: ';' }, { label: "'" }, { label: '⏎', grow: 1.9 }],
  [{ label: '⇧', grow: 2.4 }, { label: 'Z' }, { label: 'X' }, { label: 'C' }, { label: 'V' }, { label: 'B' }, { label: 'N' }, { label: 'M' }, { label: ',' }, { label: '.' }, { label: '/' }, { label: '⇧', grow: 2.4 }],
  [{ label: 'fn', grow: 1.3 }, { label: '⌃', grow: 1.3 }, { label: '⌥', grow: 1.3 }, { label: '⌘', grow: 1.6 }, { label: '', grow: 6.2 }, { label: '⌘', grow: 1.6 }, { label: '⌥', grow: 1.3 }, { label: '←' }, { label: '↑' }, { label: '↓' }, { label: '→' }],
];

/**
 * The hero — a premium MacBook-class laptop rendered in pure CSS 3D,
 * reworked to mirror the reference render: silver aluminium unibody, black
 * keys, centred trackpad, black bezels, live platform-reactive app screen
 * with a live clock footer. Pink→cyan aurora with the luminous orbit ring,
 * floating in idle 3D sway + parallax.
 */
export default function PlatformStage() {
  const stageRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { platform } = useToolkit();
  const config = platformById(platform);
  const Mock = PLATFORM_WIDE_MOCKS[config.id];
  const [now, setNow] = useState<Date | null>(null);

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
          {/* ============ The 3D MacBook-class laptop ============ */}
          <div className="stage-perspective">
            <div className="laptop-parallax" ref={parallaxRef}>
              <div className="laptop-enter">
                <div className="laptop-float">
                  {/* Ambient glow behind the machine */}
                  <div className="laptop-glow" aria-hidden="true" />

                  <div className="laptop" data-platform={config.id}>
                    {/* ===== LID — the screen half ===== */}
                    <div className="laptop-lid">
                      <div className="laptop-lid-back" aria-hidden="true">
                        <LogoMark size={54} />
                      </div>
                      <span className="laptop-lid-edge laptop-lid-edge--left" aria-hidden="true" />
                      <span className="laptop-lid-edge laptop-lid-edge--right" aria-hidden="true" />
                      <span className="laptop-lid-edge laptop-lid-edge--top" aria-hidden="true" />

                      <div className="laptop-lid-front">
                        <div className="laptop-bezel">
                          <span className="laptop-camera" aria-hidden="true" />
                          {/* ===== The live BioCraft interface ===== */}
                          <div className="laptop-screen">
                            {/* The live app home — full-bleed, no chrome, no search */}
                            <div className="stage-slab-screen" key={config.id} role="region" aria-label={`Illustrative ${config.name} app home`}>
                              <Mock />
                            </div>

                            {/* Screen footer: live date/time + system icons */}
                            <div className="stage-slab-footer">
                              <span className="stage-footer-datetime">
                                <span className="stage-footer-date">{now ? now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '···'}</span>
                                <span className="stage-footer-time">{now ? now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', second: '2-digit' }) : '··:··:··'}</span>
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
                    </div>

                    {/* ===== HINGE ===== */}
                    <div className="laptop-hinge" aria-hidden="true" />

                    {/* ===== BASE — keyboard deck lying nearly flat ===== */}
                    <div className="laptop-base" aria-hidden="true">
                      <div className="laptop-deck-top">
                        <div className="laptop-deck-reflection" />
                        <div className="laptop-keyboard">
                          {KEY_ROWS.map((row, rowIndex) => (
                            <div className="laptop-key-row" key={rowIndex}>
                              {row.map((key, keyIndex) => (
                                <span className="laptop-key" key={keyIndex} style={{ flexGrow: key.grow ?? 1 }}>{key.label}</span>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="laptop-trackpad" />
                        <div className="laptop-lip" />
                      </div>
                      {/* Hinge barrels — one at each end of the lid junction */}
                      <span className="laptop-hinge-cap laptop-hinge-cap--left" aria-hidden="true" />
                      <span className="laptop-hinge-cap laptop-hinge-cap--right" aria-hidden="true" />
                      <span className="laptop-base-edge laptop-base-edge--front" />
                      <span className="laptop-base-edge laptop-base-edge--left" />
                      <span className="laptop-base-edge laptop-base-edge--right" />
                      <span className="laptop-base-edge laptop-base-edge--bottom" />
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
