// ==========================================================================
// UNFINISHED — Main Application Shell & React Architecture
// Phone Viewport + Curiosity Sparks + Zero-Scroll Ergonomics + Daily Finish Line
// "Curiosity Brain" with User-Controlled Drawer + In-App Gemini 1.5 Flash Support
// Mindful Friction & Session Boundary Reminders
// ==========================================================================

import React, { useState, useEffect, useRef } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import htm from 'https://esm.sh/htm@3.1.1';

import {
  createInitialSession,
  scheduleNextUnit,
  bumpTopic,
  bumpAxes,
  logSignal,
  getScoredCandidates,
  injectThread,
  TOPIC_LABELS
} from './engine.js?v=4';
import {
  TextBeatRenderer,
  FlinchBeatRenderer,
  CallBeatRenderer,
  MechanismBeatRenderer,
  PollBeatRenderer
} from './renderers.js?v=4';
import {
  PRESEEDED_SPARKS,
  getCachedTopic,
  saveCachedTopic,
  getStoredGeminiKey,
  saveStoredGeminiKey,
  generateThreadWithGemini
} from './generator.js?v=4';

const html = htm.bind(React.createElement);

function App() {
  const [state, setState] = useState(() => createInitialSession());
  const [transitionAnim, setTransitionAnim] = useState('slide-up-enter');
  const [lastInteractionNote, setLastInteractionNote] = useState('');
  const [showWhyThis, setShowWhyThis] = useState(true);
  const [renderError, setRenderError] = useState(null);
  
  // Settings & Gemini Key Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => getStoredGeminiKey());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');

  // Daily Vault Finish Line State
  const [showDailyVault, setShowDailyVault] = useState(false);
  const [hasDismissedVault, setHasDismissedVault] = useState(false);

  // Desktop Side Panel: Hidden by default so user can focus, opens on demand or at goal
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState('insights');

  // Mindful Over-consumption warning (e.g. after goal + 5 extra cards)
  const [showMindfulWarning, setShowMindfulWarning] = useState(false);
  const [mindfulSnoozeCount, setMindfulSnoozeCount] = useState(0);
  const [knowledgeFilter, setKnowledgeFilter] = useState('all');

  // Contrarian & Skepticism Metrics
  const [userGuessStats, setUserGuessStats] = useState({ totalGuesses: 0, correctGuesses: 0, proofRequests: 0, pollVotes: 0 });
  const [copiedFactIdx, setCopiedFactIdx] = useState(null);

  const stageRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const unit = state.currentUnit;
  const completedBeats = state.completedBeatsCount || 0;
  const dailyGoal = state.dailyGoal || 5;

  // Trigger Daily Vault completion ONCE when goal is reached, until explicitly reopened
  useEffect(() => {
    if (completedBeats >= dailyGoal && !hasDismissedVault && !showDailyVault) {
      setShowDailyVault(true);
    }
    // Mindful friction: show only if not snoozed past current count
    const threshold = dailyGoal + 5;
    if (completedBeats >= threshold && completedBeats >= mindfulSnoozeCount && !showMindfulWarning) {
      setShowMindfulWarning(true);
    }
  }, [completedBeats, dailyGoal, hasDismissedVault, showDailyVault, mindfulSnoozeCount, showMindfulWarning]);

  const handleAdvance = (isAway = false) => {
    try {
      setRenderError(null);
      setTransitionAnim(isAway ? 'slide-sideways-enter' : 'slide-up-enter');

      setState(prevState => {
        const nextState = scheduleNextUnit(prevState, isAway, lastInteractionNote);
        return nextState;
      });

      setLastInteractionNote('');

      if (stageRef.current) {
        stageRef.current.scrollTop = 0;
      }
    } catch (err) {
      console.error("Advance error:", err);
      setRenderError(err.message || String(err));
    }
  };

  const handleBeatInteraction = (interaction) => {
    // Track stats for cognitive profile
    if (interaction.type === 'call') {
      setUserGuessStats(prev => ({
        ...prev,
        totalGuesses: prev.totalGuesses + 1,
        correctGuesses: prev.correctGuesses + (interaction.isCorrect ? 1 : 0)
      }));
    } else if (interaction.type === 'mechanism') {
      setUserGuessStats(prev => ({
        ...prev,
        proofRequests: prev.proofRequests + 1
      }));
    } else if (interaction.type === 'poll') {
      setUserGuessStats(prev => ({
        ...prev,
        pollVotes: prev.pollVotes + 1
      }));
    }

    setState(prevState => {
      let nextState = { ...prevState };

      if (interaction.delta && (unit.threadTopic || unit.topic)) {
        const topic = unit.threadTopic || unit.topic;
        nextState = bumpTopic(nextState, topic, interaction.delta);
      }

      if (interaction.depthDelta || interaction.evidenceDelta) {
        nextState = bumpAxes(nextState, interaction.depthDelta || 0, interaction.evidenceDelta || 0);
      }

      if (interaction.signal) {
        nextState = logSignal(nextState, interaction.signal);
      }

      if (interaction.note) {
        setLastInteractionNote(interaction.note);
      }

      return nextState;
    });
  };

  // 1-Tap Curiosity Spark Selection (Zero Typing!)
  const handleSelectSpark = async (spark) => {
    try {
      setIsGenerating(true);
      setGenerationStatus(`Activating "${spark.title}"...`);

      // 1. Check local cache first (0 tokens)
      let threadData = getCachedTopic(spark.id);
      
      if (!threadData) {
        const preseeded = PRESEEDED_SPARKS.find(s => s.id === spark.id);
        if (preseeded) {
          threadData = preseeded;
          saveCachedTopic(spark.id, preseeded);
        }
      }

      if (threadData) {
        setState(prev => injectThread(prev, threadData));
        setTransitionAnim('slide-up-enter');
        setIsGenerating(false);
        setGenerationStatus('');
        return;
      }

      // 2. Otherwise on-demand synthesis via Gemini 1.5 Flash
      const apiKey = getStoredGeminiKey();
      if (!apiKey) {
        setIsSettingsOpen(true);
        setIsGenerating(false);
        setGenerationStatus('');
        return;
      }

      setGenerationStatus("Gemini 1.5 Flash synthesizing 3-beat thread...");
      const generated = await generateThreadWithGemini(spark.title, apiKey);
      saveCachedTopic(spark.id, generated);
      
      setState(prev => injectThread(prev, generated));
      setTransitionAnim('slide-up-enter');
    } catch (err) {
      console.error("Spark generation error:", err);
      alert(`Could not load spark: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSettingsOpen || isGenerating || showDailyVault) return;
      if (e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleAdvance(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleAdvance(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastInteractionNote, state, isSettingsOpen, isGenerating, showDailyVault]);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    if (dt < 600) {
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        handleAdvance(true);
      } else if (dy < -60 && Math.abs(dy) > Math.abs(dx) * 1.2) {
        handleAdvance(false);
      }
    }
  };

  const handleRestart = () => {
    setState(createInitialSession());
    setLastInteractionNote('');
    setRenderError(null);
    setShowDailyVault(false);
    setHasDismissedVault(false);
    setShowMindfulWarning(false);
    setMindfulSnoozeCount(0);
    setUserGuessStats({ totalGuesses: 0, correctGuesses: 0, proofRequests: 0, pollVotes: 0 });
  };

  const handleSaveKey = () => {
    saveStoredGeminiKey(geminiKeyInput);
    setIsSettingsOpen(false);
  };

  const handleDismissVault = () => {
    setShowDailyVault(false);
    setHasDismissedVault(true);
  };

  const handleSnoozeMindfulWarning = (extraCards = 5) => {
    setShowMindfulWarning(false);
    setMindfulSnoozeCount(completedBeats + extraCards);
  };

  const candidates = getScoredCandidates(state);

  // Compute Inspiring Curiosity Superpower for user
  const getArchetype = () => {
    const { money, systems, science, behaviour } = state.topics;
    const highest = Object.entries({ money, systems, science, behaviour }).sort((a,b) => b[1] - a[1])[0][0];
    
    if (highest === 'systems') return { 
      name: "Hidden Systems Detective", 
      icon: "⚙️", 
      desc: "You look past surface appearances to understand the invisible infrastructure and engineering that make modern life work." 
    };
    if (highest === 'money') return { 
      name: "The Economics Sleuth", 
      icon: "🕵️‍♂️", 
      desc: "You can spot pricing psychology, hidden subsidies, and consumer traps from a mile away." 
    };
    if (highest === 'science') return { 
      name: "Sensory Myth-Buster", 
      icon: "🔬", 
      desc: "You demand real evidence and love discovering biological and physical quirks that defy common intuition." 
    };
    return { 
      name: "Behavior & Mind Hacker", 
      icon: "🧠", 
      desc: "You have an eye for cognitive biases, irrational social habits, and why humans do what they do." 
    };
  };

  const archetype = getArchetype();

  return html`
    <div className="app-layout">
      <!-- 1. PHONE SHELL (Zero-Scroll Viewport) -->
      <div
        className="phone-shell"
        onTouchStart=${handleTouchStart}
        onTouchEnd=${handleTouchEnd}
      >
        <!-- Top App Bar -->
        <header className="top-bar">
          <div className="brand-badge">
            <span className="brand-dot" />
            <span>Unfinished</span>
          </div>

          <div className="top-chips">
            <!-- 5-Beat Daily Meter (Clickable to inspect Vault) -->
            <button
              className="daily-meter-bar"
              style=${{ border: 'none', cursor: 'pointer' }}
              title="Click to view Daily Milestone summary"
              onClick=${() => setShowDailyVault(true)}
            >
              <span>Goal:</span>
              <div className="meter-dots">
                ${[...Array(dailyGoal)].map((_, i) => html`
                  <span key=${i} className=${`meter-dot ${i < completedBeats ? 'filled' : ''}`} />
                `)}
              </div>
              <span>${Math.min(completedBeats, dailyGoal)}/${dailyGoal}</span>
            </button>

            <!-- Insights Drawer Toggle Button directly on phone top bar -->
            <button
              style=${{ background: isSidePanelOpen ? 'rgba(122, 162, 255, 0.2)' : 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '11px', padding: '4px 7px', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Toggle Knowledge Insights Panel"
              onClick=${() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              <span>💡</span>
              <span style=${{ fontWeight: 600 }}>${state.signals.length}</span>
            </button>

            <!-- Settings / Gemini Key button -->
            <button
              style=${{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0 2px' }}
              title="Settings & AI Key"
              onClick=${() => setIsSettingsOpen(true)}
            >
              ⚙️
            </button>
          </div>
        </header>

        <!-- Curiosity Sparks Tray (Zero Typing Discovery) -->
        <div className="sparks-tray">
          <div className="sparks-label">
            <span>✨</span>
            <span>Sparks:</span>
          </div>
          ${PRESEEDED_SPARKS.map(s => html`
            <button
              key=${s.id}
              className=${`spark-pill ${state.lastThreadId === s.id ? 'active' : ''}`}
              onClick=${() => handleSelectSpark(s)}
              disabled=${isGenerating}
            >
              <span>${s.pill}</span>
            </button>
          `)}
        </div>

        ${isGenerating ? html`
          <div style=${{ padding: '8px 16px', background: 'rgba(122, 162, 255, 0.12)', fontSize: '11px', color: '#a3c2ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-dot" style=${{ animation: 'pulse 1s infinite' }} />
            <span>${generationStatus}</span>
          </div>
        ` : null}

        ${showWhyThis ? html`
          <div className="meta-strip">
            <div className="meta-header">
              <div className=${`tension-pill ${unit?.tension || 'curio'}`}>
                <span>${unit?.tension || 'curiosity'}</span>
                <span>·</span>
                <span>${TOPIC_LABELS[unit?.threadTopic || unit?.topic] || 'Discovery'}</span>
              </div>
              ${unit?.unitKind === 'thread_beat' ? html`
                <div className="thread-progress">
                  Beat ${(unit.beatIndex || 0) + 1} of ${unit.totalBeats || 3}
                </div>
              ` : null}
            </div>

            <div className="why-this-box">
              <span className="why-this-prefix">Why this:</span>
              <span>${state.whyThis}</span>
            </div>
          </div>
        ` : null}

        <!-- Mindful Session Warning: After 10 cards (5 beyond goal), caution user against doomscrolling -->
        ${showMindfulWarning ? html`
          <div className="mindful-reminder-card">
            <div className="mindful-badge">
              <span>⏳</span>
              <span>Mindful Attention Pause</span>
            </div>
            <div className="mindful-text">
              You've completed <strong>${completedBeats} mental models</strong> today (well past your goal). Unfinished is built to avoid bottomless feeds. Would you like to review your collected insights or take a break?
            </div>
            <div style=${{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                className="action-step-btn"
                style=${{ flex: 1, padding: '6px 10px', fontSize: '11px' }}
                onClick=${() => { setIsSidePanelOpen(true); setShowMindfulWarning(false); }}
              >
                Review Insights (${state.signals.length})
              </button>
              <button
                className="control-btn"
                style=${{ flex: 1, padding: '6px 10px', fontSize: '11px' }}
                onClick=${() => handleSnoozeMindfulWarning(5)}
              >
                Keep Reading (+5 cards)
              </button>
            </div>
          </div>
        ` : null}

        <!-- Main Card Stage (Clean Zero-Scroll Layout with universal fallback) -->
        <main className=${`stage-container ${transitionAnim}`} ref=${stageRef} key=${unit?.id || Math.random()}>
          ${renderError ? html`
            <div style=${{ padding: '20px', background: 'rgba(255, 107, 90, 0.15)', borderRadius: '12px', border: '1px solid var(--accent-diag)' }}>
              <div style=${{ color: 'var(--accent-diag)', fontWeight: 700, marginBottom: '6px' }}>Render Alert</div>
              <div style=${{ fontSize: '13px', color: '#f4f2ef' }}>${renderError}</div>
              <button
                className="reaction-btn"
                style=${{ marginTop: '12px' }}
                onClick=${() => handleAdvance(false)}
              >
                Skip to next beat
              </button>
            </div>
          ` : html`
            <div>
              ${unit?.type === 'text' ? html`
                <${TextBeatRenderer}
                  unit=${unit}
                  onInteract=${handleBeatInteraction}
                  onAdvance=${handleAdvance}
                  lastInteraction=${lastInteractionNote}
                />
              ` : null}

              ${unit?.type === 'flinch' ? html`
                <${FlinchBeatRenderer}
                  unit=${unit}
                  onInteract=${handleBeatInteraction}
                  onAdvance=${handleAdvance}
                />
              ` : null}

              ${unit?.type === 'call' ? html`
                <${CallBeatRenderer}
                  unit=${unit}
                  onInteract=${handleBeatInteraction}
                  onAdvance=${handleAdvance}
                />
              ` : null}

              ${unit?.type === 'mechanism' ? html`
                <${MechanismBeatRenderer}
                  unit=${unit}
                  onInteract=${handleBeatInteraction}
                  onAdvance=${handleAdvance}
                />
              ` : null}

              ${(unit?.type === 'standalone_poll' || unit?.type === 'poll') ? html`
                <${PollBeatRenderer}
                  unit=${unit}
                  onInteract=${handleBeatInteraction}
                  onAdvance=${handleAdvance}
                />
              ` : null}

              <!-- Universal Fallback: Ensures NO beat ever renders blank -->
              ${(unit?.type === 'standalone_fact' || (!['text', 'flinch', 'call', 'mechanism', 'standalone_poll', 'poll'].includes(unit?.type))) ? html`
                <${TextBeatRenderer}
                  unit=${unit}
                  onInteract=${handleBeatInteraction}
                  onAdvance=${handleAdvance}
                />
              ` : null}
            </div>
          `}
        </main>

        <!-- Floating Dismissible Daily Vault Overlay -->
        ${showDailyVault ? html`
          <div className="vault-modal-overlay" onClick=${handleDismissVault}>
            <div className="vault-card-inner" onClick=${(e) => e.stopPropagation()}>
              <button className="vault-close-x" onClick=${handleDismissVault} title="Close">✕</button>
              
              <div className="vault-badge">🎯 Milestone Reached</div>
              <div className="vault-title">Daily Mind Workout</div>
              <div className="vault-desc">
                ${completedBeats >= dailyGoal 
                  ? "You unlocked 5 structural mental models today without mindless doomscrolling."
                  : `You've unlocked ${completedBeats} of your ${dailyGoal} daily mental models.`}
              </div>

              <div className="vault-stats-grid">
                <div className="vault-stat-card">
                  <div className="vault-stat-num">${state.signals.length}</div>
                  <div className="vault-stat-label">Insights Logged</div>
                </div>
                <div className="vault-stat-card">
                  <div className="vault-stat-num">${Math.round(state.depth * 100)}%</div>
                  <div className="vault-stat-label">Depth Rating</div>
                </div>
              </div>

              <div style=${{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className="action-step-btn"
                  style=${{ width: '100%', margin: 0 }}
                  onClick=${() => { setShowDailyVault(false); setIsSidePanelOpen(true); }}
                >
                  <span>💡 View My Confirmed Insights</span>
                </button>
                <button
                  className="control-btn"
                  style=${{ width: '100%', padding: '8px' }}
                  onClick=${handleDismissVault}
                >
                  Keep Exploring Feed
                </button>
              </div>
            </div>
          </div>
        ` : null}
      </div>

      <!-- 2. DESKTOP "CURIOSITY BRAIN" COMPANION PANEL (Clean User-Controlled Drawer) -->
      <aside className=${`companion-panel ${isSidePanelOpen ? 'drawer-visible' : 'drawer-hidden'}`}>
        <!-- Tab Switcher -->
        <div className="panel-tab-nav">
          <button
            className=${`panel-tab-btn ${activePanelTab === 'insights' ? 'active' : ''}`}
            onClick=${() => setActivePanelTab('insights')}
          >
            <span>💡 Unlocked Truths</span>
            <span style=${{ fontSize: '10px', opacity: 0.7 }}>(${state.signals.length})</span>
          </button>
          <button
            className=${`panel-tab-btn ${activePanelTab === 'algorithm' ? 'active' : ''}`}
            onClick=${() => setActivePanelTab('algorithm')}
          >
            <span>⚡ Superpower & Impact</span>
          </button>
          <button
            className="panel-tab-btn"
            style=${{ flex: '0 0 32px', padding: '7px 0' }}
            title="Minimize Panel"
            onClick=${() => setIsSidePanelOpen(false)}
          >
            ✕
          </button>
        </div>

        ${activePanelTab === 'insights' ? html`
          <!-- INSIGHTS VIEW (Meaningful takeaways for user — Gamified Artifact Vault) -->
          <div className="panel-card vault-deck-card">
            <div className="archetype-banner" style=${{ marginBottom: '14px' }}>
              <div className="archetype-title">⚡ ${archetype.name}</div>
              <div className="archetype-desc">${archetype.desc}</div>
            </div>

            <!-- Vault Mastery Progress Header -->
            <div className="vault-mastery-header">
              <div className="vault-mastery-left">
                <span className="vault-title-text">Artifact Vault</span>
                <span className="vault-count-badge">${state.signals.length} Discovered</span>
              </div>
              <div className="vault-progress-pill">
                <span>Tier: ${state.signals.length >= 6 ? '🏆 Scholar' : (state.signals.length >= 3 ? '🧭 Explorer' : '🌱 Initiate')}</span>
              </div>
            </div>

            <!-- Category Filter Pills -->
            <div className="vault-filter-pills">
              ${['all', 'money', 'systems', 'science', 'behaviour'].map(cat => html`
                <button
                  key=${cat}
                  className=${`vault-pill-btn ${knowledgeFilter === cat ? 'active' : ''}`}
                  onClick=${() => setKnowledgeFilter(cat)}
                >
                  ${cat === 'all' ? 'All' : TOPIC_LABELS[cat] || cat}
                </button>
              `)}
            </div>

            <!-- Collectible Mental Model Deck (Party-Trick Truths) -->
            <div className="vault-cards-grid">
              ${state.signals.length === 0 ? html`
                <div className="empty-vault-state">
                  <div className="empty-vault-icon">💡</div>
                  <div className="empty-vault-title">No truths collected today</div>
                  <div className="empty-vault-desc">
                    Answer multiple-choice clues, inspect proof citations, or vote in polls to unlock punchy, shareable takeaways into your vault.
                  </div>
                </div>
              ` : state.signals
                .filter(sig => {
                  if (knowledgeFilter === 'all') return true;
                  const topic = sig.topic || '';
                  if (knowledgeFilter === topic) return true;
                  const text = (sig.headline + ' ' + sig.detail).toLowerCase();
                  if (knowledgeFilter === 'money') return text.includes('arbitrage') || text.includes('price') || text.includes('popcorn') || text.includes('concession') || text.includes('money') || text.includes('subsidy');
                  if (knowledgeFilter === 'science') return text.includes('sensory') || text.includes('biology') || text.includes('taste') || text.includes('food') || text.includes('altitude') || text.includes('proof') || text.includes('physics') || text.includes('science');
                  if (knowledgeFilter === 'systems') return text.includes('engine') || text.includes('chip') || text.includes('nitrogen') || text.includes('lithium') || text.includes('battery') || text.includes('packaging') || text.includes('systems');
                  if (knowledgeFilter === 'behaviour') return text.includes('psych') || text.includes('mirror') || text.includes('retail') || text.includes('bias') || text.includes('curiosity') || text.includes('behaviour') || text.includes('fall');
                  return true;
                })
                .map((sig, i) => html`
                  <div key=${i} className="truth-trophy-card animate-pop">
                    <div className="truth-card-header">
                      <div className="truth-topic-badge">
                        <span>${sig.icon || '💡'}</span>
                        <span style=${{ textTransform: 'capitalize' }}>${TOPIC_LABELS[sig.topic] || 'Mental Model'}</span>
                      </div>
                      ${sig.stat ? html`
                        <span className="truth-stat-pill">${sig.stat}</span>
                      ` : html`<span className="truth-stat-pill">✓ Uncovered</span>`}
                    </div>

                    <div className="truth-card-headline">${sig.headline}</div>
                    <div className="truth-card-takeaway">${sig.detail}</div>

                    <div className="truth-card-footer">
                      <button
                        className="copy-truth-btn"
                        onClick=${() => {
                          const textToCopy = `💡 Did you know? ${sig.headline}: ${sig.detail}`;
                          navigator.clipboard?.writeText(textToCopy);
                          setCopiedFactIdx(i);
                          setTimeout(() => setCopiedFactIdx(null), 1800);
                        }}
                      >
                        <span>${copiedFactIdx === i ? '✓ Copied to Clipboard!' : '📋 Copy Party-Trick Truth'}</span>
                      </button>
                    </div>
                  </div>
                `)}
            </div>
          </div>
        ` : html`
          <!-- USER-CENTRIC MIND WORKOUT & CURIOSITY SUPERPOWER -->
          <div className="cognitive-dna-container">
            <!-- 1. Curiosity Superpower Passport -->
            <div className="archetype-passport-card">
              <div className="passport-badge-row">
                <span className="passport-tag">Curiosity Superpower</span>
                <span className="passport-rank">Lvl ${Math.min(9, Math.floor(completedBeats / 2) + 1)} Explorer</span>
              </div>
              <div className="passport-title">${archetype.icon} ${archetype.name}</div>
              <div className="passport-desc">${archetype.desc}</div>

              <!-- Unlocked Trait Badges -->
              <div className="trait-badges-row">
                ${userGuessStats.correctGuesses > 0 ? html`
                  <span className="trait-badge" title="Saw through the counter-intuitive trap">🎯 Myth Buster</span>
                ` : null}
                ${userGuessStats.proofRequests > 0 ? html`
                  <span className="trait-badge" title="Looked up the real-world citation">🔬 Proof Hunter</span>
                ` : null}
                ${state.signals.length >= 3 ? html`
                  <span className="trait-badge" title="Saved multiple party-trick truths">💡 Idea Collector</span>
                ` : null}
                ${completedBeats >= dailyGoal ? html`
                  <span className="trait-badge" title="Completed daily dose without doomscrolling">🧘 Mindful Thinker</span>
                ` : null}
                <span className="trait-badge">
                  ${state.topics.systems > 0.4 ? '⚙️ Mechanical Eye' : (state.topics.money > 0.4 ? '💰 Scam Radar' : '🔬 Sensory Thinker')}
                </span>
              </div>
            </div>

            <!-- 2. Today's Brain Workout (Simple, Rewarding Metrics) -->
            <div className="panel-card metrics-card">
              <div className="panel-title">
                <span>Today's Brain Workout</span>
                <span className="brain-tag">Daily Impact</span>
              </div>

              <div className="dna-metric-grid">
                <div className="dna-metric-box">
                  <div className="dna-metric-val">
                    ${state.signals.length}
                  </div>
                  <div className="dna-metric-label">Truths Collected</div>
                  <div className="dna-metric-sub">
                    Ready to share with friends
                  </div>
                </div>

                <div className="dna-metric-box">
                  <div className="dna-metric-val">
                    ${completedBeats >= dailyGoal ? 'Goal Met 🎉' : `${completedBeats}/${dailyGoal}`}
                  </div>
                  <div className="dna-metric-label">Mindful Progress</div>
                  <div className="dna-metric-sub">
                    ${completedBeats >= dailyGoal ? 'Healthy curiosity habit kept' : `${dailyGoal - completedBeats} cards to hit daily finish line`}
                  </div>
                </div>
              </div>

              <div className="depth-meter-container">
                <div className="depth-meter-header">
                  <span>How You Like Your Insights</span>
                  <span style=${{ color: 'var(--accent-mech)', fontWeight: 700 }}>
                    ${state.depth > 0.6 ? "🔬 Deep Science & Proofs" : "💡 Fast, High-Level Truths"}
                  </span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill depth" style=${{ width: `${Math.round(state.depth * 100)}%` }} />
                </div>
              </div>
            </div>

            <!-- 3. What Sparks Your Brain (Top Interests) -->
            <div className="panel-card radar-balance-card">
              <div className="panel-title">
                <span>What Sparks Your Brain</span>
                <span className="brain-tag">Curiosity Mix</span>
              </div>

              <div className="radar-topic-grid">
                ${Object.entries(state.topics).map(([topic, weight]) => {
                  const label = TOPIC_LABELS[topic];
                  const pct = Math.round(weight * 100);
                  const icon = topic === 'money' ? '💰' : (topic === 'systems' ? '⚙️' : (topic === 'science' ? '🔬' : '🧠'));
                  return html`
                    <div key=${topic} className="radar-topic-item">
                      <div className="radar-topic-header">
                        <span className="radar-topic-name">${icon} ${label}</span>
                        <span className="radar-topic-pct">${pct}% interest</span>
                      </div>
                      <div className="bar-track">
                        <div className=${`bar-fill ${topic}`} style=${{ width: `${pct}%` }} />
                      </div>
                    </div>
                  `;
                })}
              </div>
            </div>

            <!-- 4. Up Next In Your Feed -->
            <div className="panel-card next-queue-card">
              <div className="panel-title">
                <span>Up Next For You</span>
                <span style=${{ fontSize: '10px', color: 'var(--ink-secondary)' }}>Curated for your curiosity</span>
              </div>
              <div className="candidate-queue-list">
                ${candidates.slice(0, 3).map((c, i) => html`
                  <div key=${c.thread.id} className=${`candidate-item ${i === 0 ? 'top-ranked' : ''}`}>
                    <div className="candidate-name">
                      <span>${i === 0 ? '👉 ' : ''}${c.thread.name}</span>
                      <span className="candidate-score-pill">
                        ${TOPIC_LABELS[c.thread.topic]}
                      </span>
                    </div>
                    <div className="candidate-reason">
                      ${c.thread.beats[0]?.subline || c.thread.beats[0]?.loop || 'Quick 2-minute bite'}
                    </div>
                  </div>
                `)}
              </div>
            </div>
          </div>
        `}

        <div className="panel-card">
          <div className="panel-title">Demo Controls</div>
          <div className="controls-grid">
            <button className="control-btn" onClick=${() => setShowWhyThis(!showWhyThis)}>
              <span>${showWhyThis ? 'Hide "Why This"' : 'Show "Why This"'}</span>
            </button>
            <button className="control-btn" onClick=${handleRestart}>
              <span>🔄 Restart Session</span>
            </button>
          </div>

          <div style=${{ marginTop: '10px', fontSize: '11px', color: 'var(--ink-secondary)' }}>
            Keyboard: <code style=${{ color: '#fff' }}>↓</code> / <code style=${{ color: '#fff' }}>Space</code> (Next) · <code style=${{ color: '#fff' }}>→</code> (Bail)
          </div>
        </div>
      </aside>

      <!-- Floating Drawer Opener Button on Bottom Right when closed -->
      ${!isSidePanelOpen ? html`
        <button
          className="companion-toggle-btn"
          onClick=${() => setIsSidePanelOpen(true)}
          title="Open Unlocked Truths & Curiosity Superpower"
        >
          <span>💡 Unlocked Truths (${state.signals.length})</span>
        </button>
      ` : null}

      <!-- 3. SETTINGS & GEMINI API KEY MODAL -->
      ${isSettingsOpen ? html`
        <div className="settings-overlay" onClick=${() => setIsSettingsOpen(false)}>
          <div className="settings-dialog" onClick=${(e) => e.stopPropagation()}>
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style=${{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>⚡ In-App Gemini 1.5 Flash</div>
              <button
                onClick=${() => setIsSettingsOpen(false)}
                style=${{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '16px' }}
              >✕</button>
            </div>
            
            <div style=${{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
              Enter your Google AI Studio API key to enable live, on-demand thread synthesis for any trending curiosity spark. Pre-seeded sparks work 100% offline with zero token usage.
            </div>

            <input
              type="password"
              className="settings-input"
              placeholder="AIzaSy..."
              value=${geminiKeyInput}
              onInput=${(e) => setGeminiKeyInput(e.target.value)}
            />

            <div style=${{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                className="control-btn"
                style=${{ padding: '8px 14px' }}
                onClick=${() => setIsSettingsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="action-step-btn"
                style=${{ marginTop: 0, padding: '8px 16px' }}
                onClick=${handleSaveKey}
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      ` : null}
    </div>
  `;
}

const root = createRoot(document.getElementById('app'));
root.render(React.createElement(App));
