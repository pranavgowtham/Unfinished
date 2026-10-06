// ==========================================================================
// UNFINISHED — Algorithmic Engine & State Machine
// Enhanced for strict narrative thread continuity (no abrupt context switching)
// Implements zero-sum bump math, candidate scoring, and why-this rationale
// ==========================================================================

import { THREADS, STANDALONE_FACTS, STANDALONE_POLLS } from './data.js?v=2';

export const TOPIC_LABELS = {
  money: "Money Mechanics",
  systems: "Hidden Systems",
  science: "Everyday Science",
  behaviour: "Human Quirks"
};

export const INITIAL_STATE = {
  topics: {
    money: 0.50,
    systems: 0.50,
    science: 0.50,
    behaviour: 0.50
  },
  depth: 0.50,
  evidenceNeed: 0.30,
  
  threadRecords: {},
  customThreads: [],
  lastThreadId: null,
  lastUnitKind: null,
  
  signals: [],
  signalHeadlines: new Set(),
  pendingCallbacks: [],
  
  completedBeatsCount: 0,
  dailyGoal: 5,
  
  currentUnit: null,
  whyThis: "Initial dispatch · Exploring relatable mysteries across money, systems, science, and human behavior.",
  standaloneCount: 0
};

function clamp(val, min = 0.03, max = 1.0) {
  return Math.max(min, Math.min(max, val));
}

// 5.2 Topic weight update — "bump" (zero-sum attention)
export function bumpTopic(state, topic, delta) {
  const newTopics = { ...state.topics };
  
  if (delta > 0) {
    newTopics[topic] = clamp(newTopics[topic] + delta);
    const share = (delta / 3) * 0.7;
    for (const otherTopic of Object.keys(newTopics)) {
      if (otherTopic !== topic) {
        newTopics[otherTopic] = clamp(newTopics[otherTopic] - share);
      }
    }
  } else if (delta < 0) {
    newTopics[topic] = clamp(newTopics[topic] + delta);
  }
  
  return { ...state, topics: newTopics };
}

export function bumpAxes(state, depthDelta = 0, evidenceDelta = 0) {
  return {
    ...state,
    depth: clamp(state.depth + depthDelta, 0.0, 1.0),
    evidenceNeed: clamp(state.evidenceNeed + evidenceDelta, 0.0, 1.0)
  };
}

export function logSignal(state, signal) {
  if (!signal || !signal.headline) return state;
  if (state.signalHeadlines.has(signal.headline)) return state;
  
  const updatedHeadlines = new Set(state.signalHeadlines);
  updatedHeadlines.add(signal.headline);
  
  return {
    ...state,
    signals: [...state.signals, signal],
    signalHeadlines: updatedHeadlines
  };
}

// 5.4 Candidate scoring
export function getAllThreads(state) {
  const custom = state.customThreads || [];
  return [...custom, ...THREADS];
}

export function injectThread(state, newThread) {
  const existingCustom = state.customThreads || [];
  const customThreads = [newThread, ...existingCustom.filter(t => t.id !== newThread.id)];
  
  const threadRecords = {
    ...state.threadRecords,
    [newThread.id]: { beatIndex: 0, status: 'new' }
  };
  
  // Set thread as next immediate priority
  const updatedState = {
    ...state,
    customThreads,
    threadRecords,
    lastThreadId: null // Reset to force scheduler to evaluate new thread
  };
  
  return scheduleNextUnit(updatedState, false, `Queued new curiosity thread: "${newThread.name}"`);
}

export function getScoredCandidates(state) {
  const candidates = [];
  const allThreads = getAllThreads(state);
  
  for (const thread of allThreads) {
    const record = state.threadRecords[thread.id] || { beatIndex: 0, status: 'new' };
    const beatsRemaining = thread.beats.length - record.beatIndex;
    
    const isLive = record.status === 'live' && beatsRemaining > 0;
    const isNew = record.status === 'new' && record.beatIndex === 0;
    
    if (isLive || isNew) {
      const baseWeight = state.topics[thread.topic] || 0.5;
      const liveBoost = isLive ? 0.35 : 0.0;
      const currentBoost = (state.lastThreadId === thread.id) ? 0.40 : 0.0;
      // Bonus boost for user-injected custom threads
      const customBoost = (state.customThreads || []).some(t => t.id === thread.id) && isNew ? 0.50 : 0.0;
      const score = baseWeight + liveBoost + currentBoost + customBoost;
      
      let reason = `${TOPIC_LABELS[thread.topic]} weight (${Math.round(baseWeight * 100)}%)`;
      if (isLive) reason += " · in-progress";
      if (state.lastThreadId === thread.id) reason += " · current focus";
      
      candidates.push({
        thread,
        record,
        score,
        reason,
        beatsRemaining,
        isLive,
        isNew
      });
    }
  }
  
  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}

export function getNextStandalone(state) {
  const count = state.standaloneCount;
  const isPoll = (count % 3 === 2);
  let item = null;
  
  if (isPoll && STANDALONE_POLLS.length > 0) {
    const pollIndex = Math.floor(count / 3) % STANDALONE_POLLS.length;
    item = { ...STANDALONE_POLLS[pollIndex], isStandalonePoll: true, type: 'standalone_poll' };
  } else {
    const factIndex = (count - Math.floor(count / 3)) % STANDALONE_FACTS.length;
    item = { ...STANDALONE_FACTS[factIndex], isStandaloneFact: true, type: 'standalone_fact' };
  }
  
  return { item, newCount: count + 1 };
}

// 5.5 Scheduler core logic (with strict narrative continuity)
export function scheduleNextUnit(state, isAwayAction = false, interactionNote = "") {
  let nextUnit = null;
  let whyReason = "";
  let updatedState = { ...state };
  const allThreads = getAllThreads(state);
  
  const currentThread = state.lastThreadId ? allThreads.find(t => t.id === state.lastThreadId) : null;
  const currentRecord = currentThread ? (state.threadRecords[currentThread.id] || { beatIndex: 0, status: 'new' }) : null;
  
  // Track total beats progressed for the daily meter
  if (state.currentUnit) {
    updatedState.completedBeatsCount = (state.completedBeatsCount || 0) + 1;
  }
  
  // 5.6 Handle bailing or finishing previous thread
  if (currentThread && currentRecord) {
    if (isAwayAction && currentRecord.status === 'live' && currentRecord.beatIndex < currentThread.beats.length) {
      // User explicitly swiped away / bailed
      const threadRecords = { ...updatedState.threadRecords };
      threadRecords[currentThread.id] = { ...currentRecord, status: 'abandoned' };
      updatedState = { ...updatedState, threadRecords };
      updatedState = bumpTopic(updatedState, currentThread.topic, -0.18);
      
      const newWeightPct = Math.round(updatedState.topics[currentThread.topic] * 100);
      updatedState = logSignal(updatedState, {
        headline: `Left '${currentThread.name}' at beat ${currentRecord.beatIndex}`,
        detail: `${TOPIC_LABELS[currentThread.topic]} weight reduced to ${newWeightPct}%. Bailing is a clean signal you wanted something else.`,
        isBail: true
      });
    } else if (currentRecord.beatIndex >= currentThread.beats.length) {
      // Thread completed its story!
      const threadRecords = { ...updatedState.threadRecords };
      threadRecords[currentThread.id] = { ...currentRecord, status: 'done' };
      updatedState = { ...updatedState, threadRecords };
      updatedState = logSignal(updatedState, {
        headline: `Finished full thread: "${currentThread.name}"`,
        detail: `Explored all ${currentThread.beats.length} beats in this investigation.`
      });
    }
  }
  
  const candidates = getScoredCandidates(updatedState);
  
  // Case A: User intentionally swiped sideways ("away" action)
  if (isAwayAction) {
    const remainingCandidates = candidates.filter(c => c.thread.id !== state.lastThreadId);
    if (remainingCandidates.length > 0) {
      const chosen = remainingCandidates[0];
      const record = chosen.record;
      const beat = chosen.thread.beats[record.beatIndex];
      
      const threadRecords = { ...updatedState.threadRecords };
      threadRecords[chosen.thread.id] = { beatIndex: record.beatIndex + 1, status: 'live' };
      
      nextUnit = {
        ...beat,
        threadId: chosen.thread.id,
        threadName: chosen.thread.name,
        threadTopic: chosen.thread.topic,
        beatIndex: record.beatIndex,
        totalBeats: chosen.thread.beats.length,
        unitKind: 'thread_beat'
      };
      
      updatedState = {
        ...updatedState,
        threadRecords,
        lastThreadId: chosen.thread.id,
        lastUnitKind: 'thread_beat'
      };
      
      whyReason = `You wanted something else. Switched to ${TOPIC_LABELS[chosen.thread.topic]} (your next highest weight).`;
    } else {
      const { item, newCount } = getNextStandalone(updatedState);
      nextUnit = { ...item, unitKind: 'standalone' };
      updatedState = {
        ...updatedState,
        standaloneCount: newCount,
        lastThreadId: null,
        lastUnitKind: 'standalone'
      };
      whyReason = "Switched to a quick standalone fact while other threads replenish.";
    }
  }
  // Case B: Normal forward advance (Keep thread continuity!)
  else {
    let picked = false;
    
    // 1. Thread Continuity Rule: If currently in a live thread with beats remaining, ALWAYS continue the thread!
    const hasRemainingBeats = currentThread && currentRecord && (currentRecord.beatIndex < currentThread.beats.length) && (currentRecord.status === 'live');
    
    if (hasRemainingBeats) {
      const beat = currentThread.beats[currentRecord.beatIndex];
      const threadRecords = { ...updatedState.threadRecords };
      threadRecords[currentThread.id] = { beatIndex: currentRecord.beatIndex + 1, status: 'live' };
      
      nextUnit = {
        ...beat,
        threadId: currentThread.id,
        threadName: currentThread.name,
        threadTopic: currentThread.topic,
        beatIndex: currentRecord.beatIndex,
        totalBeats: currentThread.beats.length,
        unitKind: 'thread_beat'
      };
      
      updatedState = {
        ...updatedState,
        threadRecords,
        lastThreadId: currentThread.id,
        lastUnitKind: 'thread_beat'
      };
      
      whyReason = `Continuing '${currentThread.name}' · Beat ${currentRecord.beatIndex + 1} of ${currentThread.beats.length} (Next clue in this story).`;
      picked = true;
    }
    
    // 2. Thread finished or no active thread -> choose next story, callback, or standalone
    if (!picked) {
      // Check for flinch callback
      if (updatedState.pendingCallbacks.length > 0 && Math.random() < 0.25) {
        const [callbackItem, ...rest] = updatedState.pendingCallbacks;
        nextUnit = {
          ...callbackItem,
          unitKind: 'callback',
          tension: 'diag',
          loop: 'Revisiting earlier reflection'
        };
        updatedState = {
          ...updatedState,
          pendingCallbacks: rest,
          lastThreadId: null,
          lastUnitKind: 'callback'
        };
        whyReason = "Revisiting something you reflected on earlier in this session.";
        picked = true;
      }
      // Pick top scored thread
      else if (candidates.length > 0) {
        const chosen = candidates[0];
        const record = chosen.record;
        const beat = chosen.thread.beats[record.beatIndex];
        
        const threadRecords = { ...updatedState.threadRecords };
        threadRecords[chosen.thread.id] = { beatIndex: record.beatIndex + 1, status: 'live' };
        
        nextUnit = {
          ...beat,
          threadId: chosen.thread.id,
          threadName: chosen.thread.name,
          threadTopic: chosen.thread.topic,
          beatIndex: record.beatIndex,
          totalBeats: chosen.thread.beats.length,
          unitKind: 'thread_beat'
        };
        
        updatedState = {
          ...updatedState,
          threadRecords,
          lastThreadId: chosen.thread.id,
          lastUnitKind: 'thread_beat'
        };
        
        const topicName = TOPIC_LABELS[chosen.thread.topic];
        const weightPct = Math.round(updatedState.topics[chosen.thread.topic] * 100);
        
        if (chosen.isLive) {
          whyReason = `${topicName} is your highest interest (${weightPct}%) · Resuming '${chosen.thread.name}'.`;
        } else {
          whyReason = `${topicName} is your highest interest (${weightPct}%) · Opening '${chosen.thread.name}'.`;
        }
        picked = true;
      } else {
        // Fallback standalone if all threads completed
        const { item, newCount } = getNextStandalone(updatedState);
        nextUnit = { ...item, unitKind: 'standalone' };
        updatedState = {
          ...updatedState,
          standaloneCount: newCount,
          lastThreadId: null,
          lastUnitKind: 'standalone'
        };
        whyReason = "All core threads finished! Serving standalone curiosities.";
      }
    }
  }
  
  const fullWhyThis = interactionNote ? `${interactionNote} · ${whyReason}` : whyReason;
  
  return {
    ...updatedState,
    currentUnit: nextUnit,
    whyThis: fullWhyThis
  };
}

export function createInitialSession() {
  let state = {
    ...INITIAL_STATE,
    threadRecords: Object.fromEntries(THREADS.map(t => [t.id, { beatIndex: 0, status: 'new' }]))
  };
  return scheduleNextUnit(state, false, "Fresh session");
}
