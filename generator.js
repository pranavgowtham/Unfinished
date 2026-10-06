// ==========================================================================
// UNFINISHED — Gemini 1.5 Flash In-App Micro-Thread Generator
// Zero-typing curiosity sparks + On-demand structured 3-beat generation
// Features local caching to conserve tokens + pre-seeded offline topics
// ==========================================================================

// Pre-seeded trending spark topics (0 token cost, instant load for demos)
export const PRESEEDED_SPARKS = [
  {
    id: "spark_flight_wifi",
    title: "Why In-Flight Wi-Fi Still Sucks & Costs $20",
    pill: "✈️ $20 In-Flight Wi-Fi",
    topic: "systems",
    beats: [
      {
        id: "wifi_1",
        tension: "curio",
        loop: "Why is plane internet so slow?",
        type: "text",
        body: "You pay **$20 for in-flight Wi-Fi**, only for a webpage to take 45 seconds to load.\n\nIt feels like 1998 dial-up in the sky.\n\nYet the plane is traveling at **900 km/h at 35,000 feet**, bouncing data beams off satellites orbiting 35,786 km away in space.",
        visualCue: {
          type: "stat_pill",
          highlight: "35,786 km",
          caption: "Distance satellite data must travel twice for every single click"
        },
        reactions: [
          { label: "📡 How does data reach the plane?", action: "expand", hint: "Show satellite vs ground link" },
          { label: "➡️ Why does it cost $20?", action: "next", hint: "Explore airline equipment costs" }
        ],
        deepDive: {
          title: "The Geostationary Delay",
          text: "Most plane Wi-Fi routes through geostationary satellites. Physics mandates an unavoidable ~600ms latency just for the speed of light to travel 70,000 km round-trip. New Starlink low-earth-orbit (LEO) antennas are fixing this, but airlines take years to recertify hardware with the FAA.",
          stat: "600ms physical ping delay"
        }
      },
      {
        id: "wifi_2",
        tension: "pred",
        loop: "The drag penalty of the antenna bump",
        type: "call",
        question: "How much extra jet fuel does that small antenna 'bump' on top of a plane burn every year across a fleet?",
        options: [
          { label: "Negligible — under $5,000", isCorrect: false },
          { label: "Over $100,000 in drag fuel per aircraft", isCorrect: true },
          { label: "Antennas actually improve aerodynamics", isCorrect: false }
        ],
        percentage: 72,
        percentageLabel: "assumed the antenna dome has zero fuel impact",
        revealWrong: "That aerodynamic blister adds drag. Airlines burn up to $100,000+ in extra jet fuel per aircraft annually just carrying the antenna radome weight and wind resistance.",
        revealRight: "Correct! The teardrop radome creates parasitic aerodynamic drag, burning up to $100,000+ in extra jet fuel per plane annually. The airline is passing that fuel drag penalty directly to your credit card.",
        signalWrong: { headline: "Overlooked aerodynamic parasitic drag", detail: "Snack and Wi-Fi pricing often cover invisible aeronautical fuel surcharges." },
        signalRight: { headline: "Calculated aeronautical drag physics", detail: "Understood the physical fuel cost of carrying heavy radome hardware." }
      },
      {
        id: "wifi_3",
        tension: "mech",
        loop: "The FAA recertification bottleneck",
        type: "mechanism",
        body: "Why doesn't your airline upgrade to modern high-speed 5G antennas tomorrow?\n\nBecause drilling even a **single bolt hole** into an airplane fuselage requires up to @@18 months of FAA safety re-certification@@.",
        evidence: "Every modification to an airliner's pressurized hull must pass strict lightning strike, emergency cabin depressurization, and high-altitude flutter testing. Airlines lock into 7-to-10 year vendor contracts to amortize the million-dollar installation and certification fees.",
        citation: "Federal Aviation Administration (FAA) Advisory Circular 25-10: In-Flight Connectivity Radome Structural Installation",
        signal: { headline: "Navigated commercial aviation regulatory locks", detail: "Recognized that aerospace safety cycles move 10x slower than consumer tech." }
      }
    ]
  },
  {
    id: "spark_coffee_crash",
    title: "The Biology of the 2 PM Coffee Crash",
    pill: "☕ The 2 PM Coffee Crash",
    topic: "science",
    beats: [
      {
        id: "coffee_1",
        tension: "curio",
        loop: "Why coffee makes you more tired later",
        type: "text",
        body: "You drink a double espresso at 8:00 AM feeling invincible...\n\n...but by **2:15 PM**, you hit a wall so hard you can barely keep your eyes open at your desk.\n\nCoffee didn't give you energy. It **borrowed energy from your afternoon** with astronomical interest.",
        visualCue: {
          type: "stat_pill",
          highlight: "Zero Energy",
          caption: "Caffeine contains exactly 0 calories of metabolic energy"
        },
        reactions: [
          { label: "🔬 What happens in the brain?", action: "expand", hint: "Show receptor biology" },
          { label: "➡️ How do I prevent the crash?", action: "next", hint: "The 90-minute morning delay hack" }
        ],
        deepDive: {
          title: "The Adenosine Molecular Disguise",
          text: "All morning, your brain produces 'Adenosine' — the chemical that signals sleepiness. Caffeine has the exact same molecular shape as Adenosine, so it plugs into the receptor like a broken key in a lock. It doesn't eliminate tiredness; it just hides the growing pile of tiredness molecules behind a closed door.",
          stat: "Adenosine buildup continues silently"
        }
      },
      {
        id: "coffee_2",
        tension: "pred",
        loop: "When caffeine leaves the receptor",
        type: "call",
        question: "When caffeine finally wears off after 5 to 6 hours, what happens to all the sleep molecules that piled up while you were caffeinated?",
        options: [
          { label: "The liver safely destroys them", isCorrect: false },
          { label: "They all flood open receptors at the exact same instant", isCorrect: true },
          { label: "They turn into natural adrenaline", isCorrect: false }
        ],
        percentage: 64,
        percentageLabel: "assumed caffeine naturally burns off fatigue molecules",
        revealWrong: "Adenosine didn't vanish — it was accumulating all morning like water behind a dam. The second caffeine metabolizes, a tidal wave of tiredness hits your brain simultaneously.",
        revealRight: "Spot on! The dam breaks. Hours of accumulated Adenosine flood into your receptors all at once, triggering an immediate and violent afternoon mental crash.",
        signalWrong: { headline: "Thought caffeine destroys fatigue", detail: "Realized caffeine is an antagonist blocker, not an adenosine metabolizer." },
        signalRight: { headline: "Mastered neurotransmitter antagonism", detail: "Understood the dam-burst phenomenon of accumulated adenosine." }
      },
      {
        id: "coffee_3",
        tension: "mech",
        loop: "The 90-minute delay solution",
        type: "mechanism",
        body: "The cure for the 2 PM crash is surprisingly simple:\n\n**Wait 90 minutes after waking up** before your first sip of coffee.\n\nThis gives your body's natural @@cortisol awakening spike@@ time to naturally clear out overnight residual adenosine.",
        evidence: "Upon waking, human cortisol surges by 50% (the Cortisol Awakening Response) to flush night-time adenosine. Drinking coffee immediately blunts this natural clearing process and spikes tolerance. Delaying caffeine 90 minutes lets cortisol do its job, keeping receptors clean all afternoon.",
        citation: "Stanford School of Medicine, Neurobiology Dept (Huberman Lab / Czeisler Sleep Center)",
        signal: { headline: "Applied Circadian Neurobiology", detail: "Optimized caffeine timing against the cortisol awakening response." }
      }
    ]
  },
  {
    id: "spark_credit_points",
    title: "Who Actually Pays For Your Free Airline Miles?",
    pill: "💳 The Credit Card Points Secret",
    topic: "money",
    beats: [
      {
        id: "points_1",
        tension: "curio",
        loop: "Where does the 2% cashback come from?",
        type: "text",
        body: "When your credit card gives you **2% cashback** or free business-class flights to Tokyo, you feel like you beat the financial system.\n\nBanks aren't being generous.\n\nYour free flights are subsidized by a hidden **1.5% to 3.5% 'swipe fee'** levied on every grocery store and corner bakery.",
        visualCue: {
          type: "stat_pill",
          highlight: "$160 Billion",
          caption: "Credit card interchange fees extracted from US merchants annually"
        },
        reactions: [
          { label: "🔍 Who actually pays that 3%?", action: "expand", hint: "The cash payer penalty" },
          { label: "➡️ How do merchants survive this?", action: "next", hint: "The universal price markup" }
        ],
        deepDive: {
          title: "The Reverse Robin Hood Scheme",
          text: "Merchants cannot afford a 3% hit on small margins, so they raise prices on milk, bread, and groceries across the board for everyone. This means low-income cash and debit buyers pay the marked-up prices without getting points, effectively subsidizing luxury perks for premium cardholders.",
          stat: "Cash buyers subsidize ~1.2% higher prices"
        }
      },
      {
        id: "points_2",
        tension: "pred",
        loop: "Airlines: Flying banks with wings",
        type: "call",
        question: "During the 2020 aviation shutdown, what was United and Delta Airlines' most valuable asset that they mortgaged for billions in survival loans?",
        options: [
          { label: "Their fleet of Boeing and Airbus aircraft", isCorrect: false },
          { label: "Their Frequent Flyer Loyalty Programs", isCorrect: true },
          { label: "Their physical airport terminal gates", isCorrect: false }
        ],
        percentage: 78,
        percentageLabel: "thought airplanes were an airline's most valuable asset",
        revealWrong: "Shockingly, no. Delta mortgaged SkyMiles for $9B; United mortgaged MileagePlus for $5B. Major US airlines generate more operating profit selling miles to banks than flying airplanes.",
        revealRight: "Incredible, isn't it? Airlines are essentially financial institutions that operate airplanes as a marketing cost. Delta's SkyMiles program was appraised at nearly $30 Billion — higher than the market cap of the airline itself!",
        signalWrong: { headline: "Assumed airline capital is physical hardware", detail: "Overlooked high-margin financialization of frequent flyer loyalty currency." },
        signalRight: { headline: "Recognized loyalty point financialization", detail: "Understood that airlines make the bulk of their profits selling digital points to Visa and Amex." }
      },
      {
        id: "points_3",
        tension: "mech",
        loop: "The phantom point inflation trap",
        type: "mechanism",
        body: "Why do airlines love points more than cash?\n\nBecause they can print unlimited billions of points, and then @@silently devalue them by 20%@@ overnight without breaking a single law.",
        evidence: "Unlike dollars regulated by central banks, loyalty points have zero fixed redemption value. An airline can raise the price of a flight from 50,000 to 75,000 miles whenever they choose, generating billions in instant balance-sheet profit by extinguishing their liability to cardholders.",
        citation: "Consumer Financial Protection Bureau (CFPB) Report: Airline and Credit Card Rewards Program Dynamics",
        signal: { headline: "Decoded loyalty currency devaluation", detail: "Understood how unbacked private currencies allow airlines to unilaterally wipe out consumer points value." }
      }
    ]
  }
];

// Helper to check localStorage cache for generated threads
export function getCachedTopic(topicId) {
  try {
    const raw = localStorage.getItem(`unfinished_spark_${topicId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveCachedTopic(topicId, data) {
  try {
    localStorage.setItem(`unfinished_spark_${topicId}`, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage full or unavailable");
  }
}

// Retrieve or store API key in browser
export function getStoredGeminiKey() {
  return localStorage.getItem('gemini_api_key') || '';
}

export function saveStoredGeminiKey(key) {
  localStorage.setItem('gemini_api_key', key.trim());
}

// Core LLM Request using Gemini 1.5 Flash
export async function generateThreadWithGemini(topicPrompt, apiKey) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Click ⚙️ to add your free Google AI Studio key.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are the narrative engine for "Unfinished", a serialized non-fiction knowledge feed.
Generate a structured 3-beat thread on the topic: "${topicPrompt}".
Keep the copy punchy, suspenseful, and intellectually honest.

Return ONLY valid JSON matching this schema:
{
  "id": "slug_id",
  "name": "Short Catchy Headline",
  "topic": "one of: money, systems, science, behaviour",
  "beats": [
    {
      "id": "beat_1",
      "tension": "curio",
      "loop": "Hook question in 5 words",
      "type": "text",
      "body": "Opening paragraph with **bolded key takeaway** and surprising contrast. 3 short sentences.",
      "visualCue": {
        "type": "stat_pill",
        "highlight": "Shocking metric or number",
        "caption": "Context in 6 words"
      },
      "reactions": [
        { "label": "🔍 Tell me why", "action": "expand", "hint": "Explore deep dive" },
        { "label": "➡️ What's the catch?", "action": "next", "hint": "Advance to next beat" }
      ],
      "deepDive": {
        "title": "The Hidden Reality",
        "text": "2 sentences explaining the underlying reason.",
        "stat": "Key takeaway stat"
      }
    },
    {
      "id": "beat_2",
      "tension": "pred",
      "loop": "Guess before reveal question",
      "type": "call",
      "question": "A counter-intuitive question about this topic?",
      "options": [
        { "label": "Common misconception option", "isCorrect": false },
        { "label": "Surprising true option", "isCorrect": true },
        { "label": "Plausible wrong guess", "isCorrect": false }
      ],
      "percentage": 65,
      "percentageLabel": "chose the intuitive but incorrect answer",
      "revealWrong": "Why the common assumption fails.",
      "revealRight": "Why this counter-intuitive truth works.",
      "signalWrong": { "headline": "Identified cognitive trap", "detail": "Addressed common intuition mistake." },
      "signalRight": { "headline": "Parsed system complexity", "detail": "Predicted counter-intuitive outcome." }
    },
    {
      "id": "beat_3",
      "tension": "mech",
      "loop": "Underlying structural mechanism",
      "type": "mechanism",
      "body": "The structural proof with @@held evidence trigger@@. 2 punchy sentences.",
      "evidence": "Concrete engineering, legal, or biological evidence explaining why.",
      "citation": "Authoritative paper, study, or regulatory source.",
      "signal": { "headline": "Examined primary mechanism", "detail": "Analyzed verified evidence." }
    }
  ]
}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 600,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Gemini API error (${response.status})`);
  }

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawText) {
    throw new Error("No response from Gemini.");
  }

  const cleanJson = JSON.parse(rawText);
  return cleanJson;
}
