# Unfinished — Serialized Knowledge Feed

An algorithmic, transparent learning feed where informative content is delivered as endless interleaved serials. Every screen ends mid-question, users can leave anything instantly at zero cost, and the algorithm visibly explains why you are seeing every single beat.

---

## 🚀 Quick Start (1-Click Run)

To run the application locally on macOS without needing Node.js or any external package managers:

```bash
cd /Users/pronow/Unfinished
./start.sh
```

Or run directly:
```bash
/usr/bin/ruby -run -ehttpd . -p3000
```
Then open [http://localhost:3000](http://localhost:3000) in Safari or Chrome.

---

## 💡 Enhanced User Interaction (Beyond "huh" / "ouch")

Per the design upgrade to avoid ambiguous statements that users skip or don't understand, the application features:

1. **Context-Aware Curiosity Chips (Replacing "huh"):**
   - Content-specific emotional and intellectual triggers:
     - *Surprise / Counterintuitive:* `[ 🤯 Never knew that ]`, `[ 🤔 Tell me why ]`
     - *Mechanism / Practical:* `[ 💡 Makes sense ]`, `[ ☕ Expected that ]`, `[ 🔍 Show proof ]`
     - *Scale Shock:* `[ 🤯 Mind-blowing density ]`, `[ 📦 Hard to fathom ]`
   - **Real-Time Visual Micro-Feedback:** Tapping immediately displays a subtle animated toast:  
     `✨ Model tuned: +14% Science focus`  
     while the corresponding topic bar in the companion side-panel illuminates and smoothly adjusts.

2. **Reflective Honesty Chips (Replacing "ouch"):**
   - For behavioral diagnosis beats (capped at $\le 15\%$):
     - `[ 😬 100% guilty of this ]` — Queues a personalized reflection callback (*"Are you still letting 30-minute calendar defaults dictate your time today?"*).
     - `[ 🛡️ Not me — I protect my time ]` — Affirms discipline without penalty.
   - Shows feedback: `📌 Stored in personal reflection model · We will revisit this`.

3. **Interactive Mechanism Proofs (`@@word@@`):**
   - Keyword triggers are underlined with a dashed accent style.
   - Paired with an explicit button: `[ 🔍 Not convinced? Reveal primary citation & proof ]`.
   - Smoothly expands the evidence container with academic citations and raises both the **Depth** and **Evidence Need** axes.

4. **Guess-Before-Reveal Prediction Cards (Call & Poll Beats):**
   - Tactile option cards that lock upon tapping.
   - Horizontal bars animate smoothly across in 1.1s showing community distribution.
   - Distinct feedback on whether you guessed right or fell into a common misconception.

5. **Conversational SMS Dialogue (Chat Beat):**
   - Staged messaging interface with typing indicators and realistic colleague counter-replies.

---

## 🧠 Algorithmic Engine & Mathematics

- **Zero-Sum Attention ("Bump" Rule):** Positive weight increases to one topic decay the remaining three topics by `(amount / 3) * 0.7`, preventing saturation. All weights clamped to `[0.03, 1.0]`.
- **Bail Signal Penalty:** Swiping sideways on an unfinished thread immediately docks the topic by `-0.18` and records a downvote signal without interrupting the user's flow.
- **Candidate Scoring:** `TopicWeight + 0.22 (if live) + 0.30 (if current focus)`. Top 4 candidates are displayed live on the companion panel.
- **Momentum Scheduling:** 58% probability of continuing an engaged live thread, with 91st-percentile callbacks, 74th-percentile standalones, and fallback to top-ranked candidates.
- **Why This Line:** Explicit, human-readable justification regenerated for every single screen.

---

## ⌨️ Controls & Gestures

- **Next Beat:** `Spacebar`, `↓ Down Arrow`, or Swipe Up on mobile stage.
- **Leave Thread:** `→ Right Arrow`, or Swipe Sideways.
- **Restart / Toggle:** Controls available directly in the companion side panel.
