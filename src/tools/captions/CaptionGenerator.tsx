import { useState } from 'react';
import { RefreshIcon } from '../../components/icons';
import {
  CAPTION_LIMIT,
  bioLength,
} from '../../lib/text';
import {
  TOPICS,
  TONES,
  generateCaptions,
  type CaptionCta,
  type CaptionTone,
  type TopicId,
} from './data/pools';
import type { Language } from '../../types';
import SegmentedControl from '../../components/SegmentedControl';
import CharCounter from '../../components/CharCounter';
import CopyButton from '../../components/CopyButton';
import { CAPTION_FRAMES, applyCaptionFrame } from './captionFrames';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी', lang: 'hi' },
  { value: 'hg', label: 'Hinglish' },
] as const;

/**
 * Caption Generator — exactly five unique captions per run, shaped by topic,
 * tone and language. Optional Unicode caption frames wrap the result. Each
 * caption carries a live character counter (2,200-char caption limit) and a
 * one-tap copy button.
 */
export default function CaptionGenerator() {
  const [topic, setTopic] = useState<TopicId>('photography');
  const [tone, setTone] = useState<CaptionTone>('witty');
  const [language, setLanguage] = useState<Language>('en');
  const [emojis, setEmojis] = useState(true);
  const [cta, setCta] = useState<CaptionCta>('none');
  const [frame, setFrame] = useState('none');
  const [captions, setCaptions] = useState<string[] | null>(null);
  const framed = (caption: string) => applyCaptionFrame(caption, frame);
  const [statusMessage, setStatusMessage] = useState('');

  const runGeneration = () => {
    const next = generateCaptions(topic, tone, language, { emoji: emojis, cta });
    setCaptions(next);
    setStatusMessage(`${next.length} captions generated.`);
  };

  return (
    <div className="tool-card">
      <fieldset className="plain-fieldset">
        <legend className="option-label" id="caption-topic-legend">Topic</legend>
        <div className="chip-row" role="group" aria-labelledby="caption-topic-legend">
          {TOPICS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip${item.id === topic ? ' is-selected' : ''}`}
              aria-pressed={item.id === topic}
              onClick={() => setTopic(item.id)}
            >
              {language === 'hi' ? item.labelHi : language === 'hg' ? item.labelHg : item.labelEn}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="plain-fieldset">
        <legend className="option-label" id="caption-tone-legend">Tone</legend>
        <div className="chip-row" role="group" aria-labelledby="caption-tone-legend">
          {TONES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip${item.id === tone ? ' is-selected' : ''}`}
              aria-pressed={item.id === tone}
              onClick={() => setTone(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="generator-options">
        <SegmentedControl
          label="Caption language"
          visibleLabel="Caption language"
          options={LANGUAGE_OPTIONS}
          value={language}
          onChange={setLanguage}
        />

        <div className="option-group option-group-inline">
          <span className="option-label" id="caption-emoji-label">
            Include emojis
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={emojis}
            aria-labelledby="caption-emoji-label"
            className={`switch${emojis ? ' is-on' : ''}`}
            onClick={() => setEmojis((current) => !current)}
          >
            <span className="switch-knob" aria-hidden="true" />
          </button>
        </div>

        <div className="option-group">
          <label className="option-label" htmlFor="caption-cta">
            Call to action <span className="optional">(optional)</span>
          </label>
          <select
            id="caption-cta"
            className="select"
            value={cta}
            onChange={(event) => setCta(event.target.value as CaptionCta)}
          >
            <option value="none">None</option>
            <option value="follow">Follow for more</option>
            <option value="link">Link in bio</option>
            <option value="save">Save for later</option>
            <option value="share">Share with someone</option>
            <option value="tag">Tag a friend</option>
          </select>
        </div>

        <div className="option-group">
          <label className="option-label" htmlFor="caption-frame-select">
            Caption frame <span className="optional">(optional)</span>
          </label>
          <select
            id="caption-frame-select"
            className="select"
            value={frame}
            onChange={(event) => setFrame(event.target.value)}
          >
            {CAPTION_FRAMES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="button" className="btn btn-primary btn-large generate-button" onClick={runGeneration}>
        Generate 5 captions
      </button>

      <div className="results-block" role="region" aria-label="Generated captions">
        <div className="results-header">
          <h2 className="results-title">
            Your five captions <span className="results-count">{captions ? captions.length : 5}</span>
          </h2>
          {captions && (
            <div className="results-actions">
              <CopyButton
                text={captions.map(framed).join('\n\n')}
                ariaLabel="Copy all five captions to clipboard"
               
              />
              <button type="button" className="btn btn-secondary btn-small" onClick={runGeneration}>
                <RefreshIcon size={16} />
                Regenerate
              </button>
            </div>
          )}
        </div>

        {captions ? (
          <ol className="results-list">
            {captions.map((caption, index) => (
              <li key={index}>
                <article className="bio-card caption-card" aria-label={`Caption option ${index + 1}`}>
                  <div className="bio-card-top">
                    <span className="bio-index">Caption {index + 1}</span>
                    <CharCounter
                      count={bioLength(framed(caption))}
                      limit={CAPTION_LIMIT}
                      ariaLabel={`Caption ${index + 1} length against Instagram's 2200-character limit`}
                    />
                  </div>
                  <p className="bio-text">{framed(caption)}</p>
                  <div className="bio-card-actions">
                    <CopyButton text={framed(caption)} ariaLabel={`Copy caption option ${index + 1} to clipboard`} />
                  </div>
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            <p className="empty-state-title">Your five captions will appear here.</p>
            <p className="empty-state-text">
              Pick a topic, a tone and a language — then press “Generate 5 captions”.
            </p>
          </div>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </p>
      </div>
    </div>
  );
}
