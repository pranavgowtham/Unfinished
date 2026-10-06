// ==========================================================================
// UNFINISHED — Visual Cue Renderers & Action-Driven Interaction
// Replaces obscure reactions with direct user actions (Deep Dive vs Next Beat)
// Renders infographics (Breakdown bars, Split cards, Decoy tiers, Diagram boxes)
// ==========================================================================

import React, { useState } from 'https://esm.sh/react@18.3.1';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

// ==========================================================================
// VISUAL CUES COMPONENT
// ==========================================================================
export function VisualCue({ cue }) {
  if (!cue) return null;

  // 1. Breakdown Bar (e.g. Popcorn margins)
  if (cue.type === 'breakdown_bar') {
    return html`
      <div className="visual-card-wrapper">
        <div className="visual-card-title">
          <span>📊</span>
          <span>${cue.title}</span>
        </div>
        <div className="breakdown-bar-track">
          ${cue.segments.map((seg, i) => html`
            <div
              key=${i}
              className="breakdown-segment"
              style=${{ width: `${seg.pct}%`, background: seg.color }}
              title=${`${seg.label}: ${seg.value}`}
            />
          `)}
        </div>
        <div className="breakdown-legend">
          ${cue.segments.map((seg, i) => html`
            <div key=${i} className="legend-item">
              <span>
                <span className="legend-dot" style=${{ background: seg.color }} />
                <span>${seg.label}</span>
              </span>
              <span style=${{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${seg.value}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  // 2. Split Comparison (e.g. Ticket vs Popcorn)
  if (cue.type === 'split_comparison') {
    return html`
      <div className="visual-card-wrapper">
        <div className="split-grid">
          <div className="split-col" style=${{ borderColor: cue.left.color }}>
            <div className="split-header">${cue.left.title}</div>
            <div className="split-value" style=${{ color: cue.left.color }}>${cue.left.keep}</div>
          </div>
          <div className="split-col" style=${{ borderColor: cue.right.color }}>
            <div className="split-header">${cue.right.title}</div>
            <div className="split-value" style=${{ color: cue.right.color }}>${cue.right.keep}</div>
          </div>
        </div>
      </div>
    `;
  }

  // 3. Decoy Card (Pricing trick)
  if (cue.type === 'decoy_card') {
    return html`
      <div className="visual-card-wrapper">
        <div className="visual-card-title">
          <span>🎯</span>
          <span>The Decoy Pricing Structure</span>
        </div>
        <div className="decoy-grid">
          ${cue.items.map((item, i) => html`
            <div key=${i} className=${`decoy-item ${item.isTarget ? 'is-target' : (item.isDecoy ? 'is-decoy' : '')}`}>
              <div className="decoy-size">${item.size}</div>
              <div className="decoy-price">${item.price}</div>
              <div className="decoy-tag">${item.tag}</div>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  // 4. Chip Bag Cushion Diagram
  if (cue.type === 'bag_diagram') {
    return html`
      <div className="visual-card-wrapper">
        <div className="visual-card-title">
          <span>🥔</span>
          <span>${cue.title}</span>
        </div>
        <div className="bag-diagram-box">
          <div className="bag-layer nitrogen">
            <div>
              <strong>${cue.topLabel}</strong>
              <div style=${{ fontSize: '11px', opacity: 0.8 }}>${cue.topDesc}</div>
            </div>
            <span style=${{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>${cue.topPct}%</span>
          </div>
          <div className="bag-layer chips">
            <div>
              <strong>${cue.bottomLabel}</strong>
              <div style=${{ fontSize: '11px', opacity: 0.8 }}>${cue.bottomDesc}</div>
            </div>
            <span style=${{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>${cue.bottomPct}%</span>
          </div>
        </div>
      </div>
    `;
  }

  // 5. Altitude Meter
  if (cue.type === 'altitude_meter') {
    return html`
      <div className="visual-card-wrapper">
        <div className="visual-card-title">
          <span>✈️</span>
          <span>In-Flight Cabin Environment</span>
        </div>
        <div className="split-grid">
          <div className="split-col">
            <div className="split-header">Cruising Altitude</div>
            <div className="split-value" style=${{ color: 'var(--accent-curio)' }}>${cue.altitude}</div>
          </div>
          <div className="split-col">
            <div className="split-header">Cabin Humidity</div>
            <div className="split-value" style=${{ color: 'var(--accent-diag)' }}>${cue.humidity}</div>
          </div>
        </div>
        <div style=${{ fontSize: '11px', color: 'var(--ink-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
          ${cue.note}
        </div>
      </div>
    `;
  }

  // 6. Taste Comparison
  if (cue.type === 'taste_comparison') {
    return html`
      <div className="visual-card-wrapper">
        <div className="visual-card-title">
          <span>👅</span>
          <span>Taste Bud Perception at 35,000 ft</span>
        </div>
        <div style=${{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
          <div style=${{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Sweet Flavor Sensitivity:</span>
            <strong style=${{ color: 'var(--accent-diag)' }}>${cue.sweet}</strong>
          </div>
          <div style=${{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Salty Flavor Sensitivity:</span>
            <strong style=${{ color: 'var(--accent-diag)' }}>${cue.salty}</strong>
          </div>
          <div style=${{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
            <span>Savory (Umami) Sensitivity:</span>
            <strong style=${{ color: 'var(--accent-mech)' }}>${cue.umami}</strong>
          </div>
        </div>
      </div>
    `;
  }

  // 7. Battery Diagram
  if (cue.type === 'battery_diagram') {
    return html`
      <div className="visual-card-wrapper">
        <div className="visual-card-title">
          <span>🔋</span>
          <span>Chemical Voltage Buffer</span>
        </div>
        <div style=${{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--surface-raised)', padding: '10px 14px', borderRadius: '10px' }}>
          <div style=${{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-diag)' }}>1%</div>
          <div>
            <div style=${{ fontWeight: 600, fontSize: '13px' }}>${cue.label}</div>
            <div style=${{ fontSize: '11px', color: 'var(--ink-secondary)' }}>${cue.subtitle}</div>
          </div>
        </div>
      </div>
    `;
  }

  // 8. Mirror Angle Diagram
  if (cue.type === 'mirror_angle') {
    return html`
      <div className="visual-card-wrapper">
        <div className="visual-card-title">
          <span>🪞</span>
          <span>The Fitting Room Optical Illusion</span>
        </div>
        <div className="split-grid">
          <div className="split-col" style=${{ borderColor: 'var(--accent-counter)' }}>
            <div className="split-header">Mirror Position</div>
            <div className="split-value" style=${{ color: 'var(--accent-counter)' }}>${cue.angle}</div>
            <div style=${{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '2px' }}>${cue.effect}</div>
          </div>
          <div className="split-col" style=${{ borderColor: 'var(--accent-mech)' }}>
            <div className="split-header">Lighting Spectrum</div>
            <div className="split-value" style=${{ color: 'var(--accent-mech)', fontSize: '13px' }}>${cue.light}</div>
          </div>
        </div>
      </div>
    `;
  }

  // 9. Stat Pill
  if (cue.type === 'stat_pill') {
    return html`
      <div className="stat-pill-box">
        <div className="stat-pill-value">${cue.highlight}</div>
        <div className="stat-pill-caption">${cue.caption}</div>
      </div>
    `;
  }

  // 10. Photo / Illustration Image
  if (cue.type === 'image') {
    return html`
      <div className="visual-image-wrapper">
        ${cue.caption ? html`
          <div className="visual-card-title" style=${{ marginBottom: '8px' }}>
            <span>${cue.icon || '🖼️'}</span>
            <span>${cue.caption}</span>
          </div>
        ` : null}
        <img
          src=${cue.src}
          alt=${cue.alt || cue.caption || ''}
          className="beat-illustration"
          loading="lazy"
        />
      </div>
    `;
  }

  return null;
}

// ==========================================================================
// KINETIC TEXT ENGINE
// ==========================================================================
export function KineticText({ text, onTriggerProof }) {
  if (!text) return null;

  const paragraphs = text.split('\n\n');
  let globalWordIndex = 0;

  return html`
    <div className="beat-body">
      ${paragraphs.map((para, pIdx) => {
        const tokens = [];
        let remaining = para;
        let regex = /(\*\*.*?\*\*|@@.*?@@)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(para)) !== null) {
          if (match.index > lastIndex) {
            tokens.push({ type: 'normal', content: para.substring(lastIndex, match.index) });
          }
          const fullToken = match[0];
          if (fullToken.startsWith('**')) {
            tokens.push({ type: 'emphasis', content: fullToken.slice(2, -2) });
          } else if (fullToken.startsWith('@@')) {
            tokens.push({ type: 'hold', content: fullToken.slice(2, -2) });
          }
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < para.length) {
          tokens.push({ type: 'normal', content: para.substring(lastIndex) });
        }

        return html`
          <p key=${pIdx} style=${{ marginBottom: pIdx < paragraphs.length - 1 ? '16px' : 0 }}>
            ${tokens.map((token, tIdx) => {
              if (token.type === 'emphasis') {
                const words = token.content.split(/(\s+)/);
                return html`
                  <span key=${tIdx} className="kinetic-emphasis">
                    ${words.map((w, wIdx) => {
                      if (w.trim() === '') return w;
                      const delay = (globalWordIndex++) * 0.025;
                      return html`
                        <span key=${wIdx} className="kinetic-word" style=${{ animationDelay: `${delay}s` }}>
                          ${w}
                        </span>
                      `;
                    })}
                  </span>
                `;
              }

              if (token.type === 'hold') {
                const words = token.content.split(/(\s+)/);
                return html`
                  <span
                    key=${tIdx}
                    className="kinetic-hold"
                    onClick=${onTriggerProof}
                    title="Click to reveal underlying research proof"
                  >
                    ${words.map((w, wIdx) => {
                      if (w.trim() === '') return w;
                      const delay = (globalWordIndex++) * 0.025;
                      return html`
                        <span key=${wIdx} className="kinetic-word" style=${{ animationDelay: `${delay}s` }}>
                          ${w}
                        </span>
                      `;
                    })}
                  </span>
                `;
              }

              const words = token.content.split(/(\s+)/);
              return words.map((w, wIdx) => {
                if (w.trim() === '') return w;
                const delay = (globalWordIndex++) * 0.025;
                return html`
                  <span key=${wIdx} className="kinetic-word" style=${{ animationDelay: `${delay}s` }}>
                    ${w}
                  </span>
                `;
              });
            })}
          </p>
        `;
      })}
    </div>
  `;
}

// ==========================================================================
// 1. TEXT BEAT RENDERER (Clean Bite-Sized Single-Tap Interaction)
// ==========================================================================
export function TextBeatRenderer({ unit, onInteract, onAdvance }) {
  const [selectedLabel, setSelectedLabel] = useState(null);

  const reactions = unit.reactions || [
    { label: "💡 Makes sense", action: "next" },
    { label: "➡️ Next clue", action: "next" }
  ];

  const handleAction = (r) => {
    if (selectedLabel) return;
    setSelectedLabel(r.label);
    
    onInteract({
      type: 'action',
      label: r.label,
      delta: 0.14,
      note: `Selected '${r.label}'`,
      signal: {
        headline: `Uncovered: "${unit.loop || 'Curiosity point'}"`,
        detail: `Explored '${r.label}' — tuned preference for ${unit.threadTopic || unit.topic}.`
      }
    });

    // Advance smoothly after a brief satisfying tap feedback (200ms)
    setTimeout(() => {
      onAdvance(false);
    }, 220);
  };

  return html`
    <div className="beat-card-wrapper">
      <${KineticText} text=${unit.body} />
      ${unit.subline ? html`<div className="beat-subline">${unit.subline}</div>` : null}

      ${unit.visualCue ? html`<${VisualCue} cue=${unit.visualCue} />` : null}

      <div className="interaction-zone" style=${{ marginTop: '14px' }}>
        <div className="reaction-prompt">What's your take?</div>
        <div className="reaction-buttons-row">
          ${reactions.map((r, i) => html`
            <button
              key=${i}
              className=${`reaction-btn ${selectedLabel === r.label ? 'selected' : ''}`}
              onClick=${() => handleAction(r)}
              disabled=${!!selectedLabel}
            >
              <span>${selectedLabel === r.label ? '✓ ' : ''}${r.label}</span>
            </button>
          `)}
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 2. FLINCH BEAT RENDERER (Behavioral Honesty & Mirror Secrets)
// ==========================================================================
export function FlinchBeatRenderer({ unit, onInteract, onAdvance }) {
  const [flinched, setFlinched] = useState(null);

  const reactions = unit.reactions || [
    { label: "😬 100% happened to me", action: "next", isFlinch: true },
    { label: "👀 Never noticed this", action: "next" }
  ];

  const handleAction = (r) => {
    if (flinched) return;
    setFlinched(r.label);
    
    onInteract({
      type: 'flinch',
      isFlinch: !!r.isFlinch,
      label: r.label,
      delta: 0.14,
      note: "Reflected on retail mirror perception",
      signal: {
        headline: "Recognized retail cognitive bias",
        detail: `Acknowledged: '${unit.loop}'. Stored in personal reflection model.`
      }
    });

    setTimeout(() => {
      onAdvance(false);
    }, 220);
  };

  return html`
    <div className="beat-card-wrapper">
      <${KineticText} text=${unit.body} />
      ${unit.subline ? html`<div className="beat-subline">${unit.subline}</div>` : null}
      ${unit.visualCue ? html`<${VisualCue} cue=${unit.visualCue} />` : null}

      <div className="interaction-zone" style=${{ marginTop: '14px' }}>
        <div className="reaction-prompt" style=${{ color: 'var(--accent-diag)' }}>
          Self-Reflection · Honesty shapes your feed:
        </div>
        <div className="reaction-buttons-row">
          ${reactions.map((r, i) => html`
            <button
              key=${i}
              className=${`reaction-btn ${flinched === r.label ? 'flinch-selected' : ''}`}
              onClick=${() => handleAction(r)}
              disabled=${!!flinched}
            >
              <span>${flinched === r.label ? '✓ ' : ''}${r.label}</span>
            </button>
          `)}
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 3. CALL BEAT RENDERER (Clean Bite-Sized Guess-Before-Reveal — Zero Scroll)
// ==========================================================================
export function CallBeatRenderer({ unit, onInteract, onAdvance }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const isLocked = selectedIdx !== null;

  const handlePick = (idx) => {
    if (isLocked) return;
    setSelectedIdx(idx);

    const pick = unit.options[idx];
    const isCorrect = pick.isCorrect;
    const signal = isCorrect ? unit.signalRight : unit.signalWrong;

    onInteract({
      type: 'call',
      isCorrect,
      pickedLabel: pick.label,
      delta: 0.16,
      note: isCorrect ? "You guessed correctly!" : "You fell for a common misconception",
      signal: signal
    });
  };

  const selectedOpt = isLocked ? unit.options[selectedIdx] : null;
  const isRight = selectedOpt?.isCorrect;

  return html`
    <div className="beat-card-wrapper call-beat-container">
      <div className="call-question">
        ${unit.question}
      </div>

      <div className="options-list" style=${{ margin: '12px 0' }}>
        ${unit.options.map((opt, i) => {
          const isUserPick = selectedIdx === i;
          let cardClass = "option-card";
          if (isLocked) {
            cardClass += " locked";
            if (isUserPick) cardClass += " user-pick";
            if (opt.isCorrect) cardClass += " correct";
            if (isUserPick && !opt.isCorrect) cardClass += " incorrect";
          }

          return html`
            <div
              key=${i}
              className=${cardClass}
              onClick=${() => handlePick(i)}
              style=${{ cursor: isLocked ? 'default' : 'pointer' }}
            >
              ${isLocked ? html`
                <div
                  className=${`option-bar-fill ${opt.isCorrect ? 'highlight-right' : (isUserPick ? 'highlight-wrong' : '')}`}
                  style=${{ width: `${opt.isCorrect ? (100 - unit.percentage) : (isUserPick ? unit.percentage : 18)}%` }}
                />
              ` : null}
              <div className="option-content">
                <span style=${{ fontWeight: isUserPick ? 600 : 400 }}>${opt.label}</span>
                ${isLocked ? html`
                  <span className=${`option-verdict-badge ${opt.isCorrect ? 'right' : (isUserPick ? 'wrong' : '')}`}>
                    ${opt.isCorrect ? '✓ Correct' : (isUserPick ? '✗ Your guess' : '')}
                  </span>
                ` : null}
              </div>
            </div>
          `;
        })}
      </div>

      ${isLocked ? html`
        <div className="compact-verdict-box animate-pop">
          <div className=${`verdict-header ${isRight ? 'right' : 'wrong'}`}>
            <span>${isRight ? "💡 Nailed it!" : `👀 ${unit.percentage}% of people ${unit.percentageLabel}`}</span>
          </div>
          <div className="verdict-detail">
            ${isRight ? unit.revealRight : unit.revealWrong}
          </div>

          <div className="zero-scroll-advance-row">
            <button
              className="action-step-btn full-tap"
              onClick=${() => onAdvance(false)}
            >
              <span>➡️ Next Clue</span>
            </button>
          </div>
        </div>
      ` : html`
        <div className="interaction-hint">
          <span>Tap your instinctive guess to reveal the truth</span>
        </div>
      `}
    </div>
  `;
}

// ==========================================================================
// 4. MECHANISM BEAT RENDERER (Clean Bite-Sized Hidden Proof — Zero Scroll)
// ==========================================================================
export function MechanismBeatRenderer({ unit, onInteract, onAdvance }) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    onInteract({
      type: 'mechanism',
      delta: 0.10,
      depthDelta: 0.12,
      evidenceDelta: 0.22,
      note: "You requested deeper mechanism proof",
      signal: unit.signal || {
        headline: "Demanded underlying proof",
        detail: `Examined evidence for: "${unit.loop}".`
      }
    });
  };

  return html`
    <div className="beat-card-wrapper mech-beat-container">
      <${KineticText}
        text=${unit.body}
        onTriggerProof=${handleReveal}
      />

      ${unit.visualCue ? html`<${VisualCue} cue=${unit.visualCue} />` : null}

      ${!revealed ? html`
        <div className="mech-prompt-zone">
          <button className="proof-trigger-btn" onClick=${handleReveal}>
            <span>🔬 Reveal citation & proof</span>
          </button>
          <button className="reaction-btn compact-next-btn" onClick=${() => onAdvance(false)}>
            <span>➡️ Next</span>
          </button>
        </div>
      ` : html`
        <div className="compact-evidence-card animate-pop">
          <div className="evidence-badge-row">
            <span className="evidence-tag">🔬 Primary Proof</span>
            ${unit.citation ? html`<span className="evidence-source">${unit.citation}</span>` : null}
          </div>
          <div className="evidence-body-text">${unit.evidence}</div>
          <button
            className="action-step-btn full-tap"
            style=${{ marginTop: '10px' }}
            onClick=${() => onAdvance(false)}
          >
            <span>➡️ Continue</span>
          </button>
        </div>
      `}
    </div>
  `;
}

// ==========================================================================
// 5. STANDALONE POLL BEAT RENDERER (Clean Zero-Scroll)
// ==========================================================================
export function PollBeatRenderer({ unit, onInteract, onAdvance }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const isLocked = selectedIdx !== null;

  const handlePick = (idx) => {
    if (isLocked) return;
    setSelectedIdx(idx);
    onInteract({
      type: 'poll',
      pickedIdx: idx,
      delta: 0.10,
      note: "Contributed to consensus poll",
      signal: {
        headline: "Voted in community poll",
        detail: `Selected '${unit.options[idx].label}'. Distributed weight to ${unit.topic}.`
      }
    });
  };

  return html`
    <div className="beat-card-wrapper poll-beat-container">
      <div className="call-question">
        ${unit.question}
      </div>

      <div className="options-list" style=${{ margin: '12px 0' }}>
        ${unit.options.map((opt, i) => {
          const isUserPick = selectedIdx === i;
          return html`
            <div
              key=${i}
              className=${`option-card ${isLocked ? 'locked' : ''} ${isUserPick ? 'user-pick' : ''}`}
              onClick=${() => handlePick(i)}
              style=${{ cursor: isLocked ? 'default' : 'pointer' }}
            >
              ${isLocked ? html`
                <div className="option-bar-fill" style=${{ width: `${opt.percentage}%` }} />
              ` : null}
              <div className="option-content">
                <span style=${{ fontWeight: isUserPick ? 600 : 400 }}>${opt.label}</span>
                ${isLocked ? html`
                  <span className="option-verdict-badge poll-stat">
                    ${opt.percentage}%
                  </span>
                ` : null}
              </div>
            </div>
          `;
        })}
      </div>

      ${isLocked ? html`
        <div className="compact-verdict-box animate-pop">
          <div className="verdict-header right">
            <span>📊 Community Consensus</span>
          </div>
          <div className="verdict-detail">
            ${unit.reveal}
          </div>
          <div className="zero-scroll-advance-row">
            <button
              className="action-step-btn full-tap"
              onClick=${() => onAdvance(false)}
            >
              <span>➡️ Next Topic</span>
            </button>
          </div>
        </div>
      ` : html`
        <div className="interaction-hint">
          <span>Tap to see how community votes split</span>
        </div>
      `}
    </div>
  `;
}

// Chat Beat Fallback Renderer
export function ChatBeatRenderer({ unit, onInteract, onAdvance }) {
  return html`
    <div className="beat-card-wrapper">
      <${KineticText} text=${unit.body || unit.question} />
      ${unit.visualCue ? html`<${VisualCue} cue=${unit.visualCue} />` : null}
      <button className="action-step-btn full-tap" style=${{ marginTop: '14px' }} onClick=${() => onAdvance(false)}>
        <span>➡️ Continue</span>
      </button>
    </div>
  `;
}


