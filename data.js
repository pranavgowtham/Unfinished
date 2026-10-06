// ==========================================================================
// UNFINISHED — Relatable Everyday Knowledge Dataset
// Highly relatable topics: Popcorn margins, Chip bag air, Airplane food taste,
// 1% Battery life, Dressing room mirrors.
// Packed with clear visual cues and interactive action-oriented triggers.
// ==========================================================================

export const THREADS = [
  {
    id: "popcorn",
    name: "The ₹400 Popcorn Robbery",
    topic: "money",
    beats: [
      {
        id: "pop_1",
        tension: "curio",
        loop: "Where does your ₹400 go?",
        type: "text",
        body: "When you pay **₹400 for a large tub of movie popcorn**, the actual popcorn kernels, oil, and salt cost the theatre exactly **₹8.50**.\n\nThe paper bucket costs ₹14.\n\nThat means a ₹400 bucket carries a mind-boggling **94% pure profit margin**.",
        subline: "Higher markup than luxury perfume or Rolex watches.",
        visualCue: {
          type: "image",
          src: "/assets/popcorn_economics.jpg",
          alt: "Popcorn margin breakdown infographic",
          icon: "🍿",
          caption: "The ₹400 Popcorn Margin"
        },
        deepDive: {
          title: "The Popcorn Subsidy",
          text: "Why don't cinemas lower the price? Because movie studios (Disney, Warner Bros) take up to 70% of ticket sales in the opening weeks. Theatres barely break even on the movie ticket itself — popcorn and fountain drinks are literally what keep the cinema's lights on.",
          stat: "85% of theatre profits come from snacks"
        },
        reactions: [
          { label: "🔍 Why do theatres do this?", action: "expand", hint: "Reveal the theatre survival secret" },
          { label: "🍿 What about the soda cup?", action: "next", hint: "Continue to next beat" }
        ]
      },
      {
        id: "pop_2",
        tension: "pred",
        loop: "The movie ticket profit split",
        type: "call",
        question: "When you buy a ₹350 ticket for a brand-new Hollywood blockbuster, how much does the theatre keep in the first 2 weeks?",
        options: [
          { label: "About ₹175 (50%)", isCorrect: false },
          { label: "About ₹70 to ₹105 (20% to 30%)", isCorrect: true },
          { label: "Over ₹280 (80%)", isCorrect: false }
        ],
        percentage: 68,
        percentageLabel: "assumed theatres keep at least half the ticket price",
        revealWrong: "Studios demand up to 70-80% of ticket sales during opening weeks. On a ₹350 ticket, the theatre might only keep ₹70.",
        revealRight: "Spot on. Studios take the lion's share of ticket revenue early on. That's why theatres don't care if you watch the movie — they care if you buy the ₹400 tub.",
        visualCue: {
          type: "split_comparison",
          left: { title: "₹350 Movie Ticket", keep: "Theatre keeps ~₹70", pct: 20, color: "#ff6b5a" },
          right: { title: "₹400 Popcorn Tub", keep: "Theatre keeps ~₹378", pct: 95, color: "#5ad1a0" }
        },
        signalWrong: {
          headline: "Believed theatres live on ticket sales",
          detail: "Overlooked studio revenue cuts that force snack price gouging."
        },
        signalRight: {
          headline: "Recognized concession cross-subsidy",
          detail: "Understood that cinemas are restaurants with a movie screen."
        }
      },
      {
        id: "pop_3",
        tension: "counter",
        loop: "The medium popcorn trap",
        type: "text",
        body: "Have you ever noticed the price trick on the menu board?\n\n• **Small:** ₹280\n• **Medium:** ₹360\n• **Large:** ₹390\n\nThe Medium size is priced high on purpose. It exists solely to make the Large feel like an undeniable bargain for just ₹30 more.",
        subline: "Known as the Decoy Effect in pricing psychology.",
        visualCue: {
          type: "decoy_card",
          items: [
            { size: "Small", price: "₹280", tag: "Baseline" },
            { size: "Medium", price: "₹360", tag: "The Decoy (Nobody buys this)", isDecoy: true },
            { size: "Large", price: "₹390", tag: "The Target (Feels like a steal!)", isTarget: true }
          ]
        },
        reactions: [
          { label: "🎯 I fall for this every single time", action: "next", hint: "Money +14%" },
          { label: "💡 The Decoy Effect at work", action: "next", hint: "Money +14%" }
        ]
      }
    ]
  },
  {
    id: "chips",
    name: "Why Chips Bags Are 70% Air",
    topic: "systems",
    beats: [
      {
        id: "chips_1",
        tension: "curio",
        loop: "A scam or pure chemistry?",
        type: "text",
        body: "When you crack open a bag of potato chips and find it half empty, your first instinct is to feel scammed.\n\nBut that empty space isn't regular air. If it were normal air, the chips would turn into soggy, rotten mush in under **48 hours**.",
        visualCue: {
          type: "image",
          src: "/assets/chip_bag_anatomy.jpg",
          alt: "Chip bag nitrogen cushion anatomy diagram",
          icon: "🥔",
          caption: "65% Nitrogen Cushion vs 35% Chips"
        },
        deepDive: {
          title: "The Nitrogen Secret",
          text: "Oxygen and ambient moisture react with potato starch and unsaturated fats, turning crisp oil rancid. Food companies vacuum-flush the bag with 100% inert nitrogen gas before sealing. Nitrogen doesn't react with food and creates a pressurized pillow so bags don't crush during highway transport.",
          stat: "0% oxygen inside a sealed bag"
        },
        reactions: [
          { label: "🔬 Show me the chemistry", action: "expand", hint: "Reveal the nitrogen gas explanation" },
          { label: "🥔 Why not fill it 90% then?", action: "next", hint: "Go to the transport physics beat" }
        ]
      },
      {
        id: "chips_2",
        tension: "mech",
        loop: "The highway shipping crush test",
        type: "mechanism",
        body: "If companies filled the bag with 90% chips, you wouldn't get a single whole chip. You would open a bag of @@potato dust@@.\n\nThe gas serves as a literal structural airbag designed to survive freight logistics.",
        evidence: "Trucks stack pallets 8 feet high. Under highway vibration and cabin pressure changes over mountain passes, non-pressurized bags crush or pop. The 60-70% nitrogen ratio provides the exact calculated compression resistance required to deliver intact circular chips.",
        citation: "Packaging Technology and Science Journal: Modified Atmosphere Cushioning in Fragile Snack Distribution",
        visualCue: {
          type: "pressure_card",
          title: "Pallet Vibration Physics",
          stat1: "8 ft",
          desc1: "Pallet stacking height in freight trucks",
          stat2: "70%",
          desc2: "Minimum gas volume to absorb vibration shock"
        },
        signal: {
          headline: "Understood snack logistics engineering",
          detail: "Looked past consumer grievance to modified atmosphere packaging physics."
        }
      },
      {
        id: "chips_3",
        tension: "counter",
        loop: "The sound that tricks your tongue",
        type: "text",
        body: "The noisy, crinkly, loud plastic of snack bags isn't cheap material. It's acoustic engineering.\n\nOxford studies found that the **louder the crunching sound** of the packaging, the fresher and crisper your brain perceives the food inside.",
        subline: "Professor Charles Spence, Oxford Crossmodal Research Laboratory.",
        visualCue: {
          type: "stat_pill",
          highlight: "+15% Crisper",
          caption: "How much fresher chips taste when accompanied by loud bag crinkle sounds"
        },
        reactions: [
          { label: "🤯 My brain is easily fooled", action: "next", hint: "Systems +14%" },
          { label: "🔊 Explains why SunChips was so loud", action: "next", hint: "Systems +14%" }
        ]
      }
    ]
  },
  {
    id: "airline_food",
    name: "Why Airplane Food Tastes Terrible",
    topic: "science",
    beats: [
      {
        id: "air_1",
        tension: "curio",
        loop: "Is the airline chef really that bad?",
        type: "text",
        body: "Have you ever wondered why even a ₹3,000 airline meal in Business Class often tastes bland, dry, and like cardboard?\n\nThe airline caterer isn't the problem.\n\nThe real culprit is **what 35,000 feet does to your tongue and nose**.",
        visualCue: {
          type: "image",
          src: "/assets/airplane_taste_infographic.jpg",
          alt: "Airplane cabin altitude effect on taste buds",
          icon: "✈️",
          caption: "Cabin Altitude vs Taste Receptors"
        },
        deepDive: {
          title: "The Altitude Effect on Taste Buds",
          text: "Inside a pressurized cabin, atmospheric pressure drops and relative humidity plunges to under 12%. This dries out your nasal passages and numbs your taste buds. Studies by Lufthansa and the Fraunhofer Institute revealed that your perception of salt and sugar drops by up to 30% in flight!",
          stat: "30% taste numbness at cruising altitude"
        },
        reactions: [
          { label: "👅 Tell me why taste buds fail", action: "expand", hint: "Read the sensory science" },
          { label: "🍅 What about Tomato Juice?", action: "next", hint: "Explore the tomato juice mystery" }
        ]
      },
      {
        id: "air_2",
        tension: "pred",
        loop: "The #1 in-flight drink mystery",
        type: "call",
        question: "Why do airlines serve millions of cans of Tomato Juice and Bloody Mary mix, even though passengers rarely drink it on the ground?",
        options: [
          { label: "Tomato juice settles turbulence motion sickness", isCorrect: false },
          { label: "Umami (savory) taste is completely immune to altitude", isCorrect: true },
          { label: "It's the cheapest beverage for airlines to buy in bulk", isCorrect: false }
        ],
        percentage: 61,
        percentageLabel: "believed tomato juice is for motion sickness",
        revealWrong: "While healthy, the real reason is sensory chemistry. Sweet and salty sensations drop by 30% at altitude, but Umami (savory glutamate) receptors remain 100% active and actually taste richer in dry air!",
        revealRight: "Spot on! Sweet and salty receptors numb at altitude, but Umami (savory taste) is unaffected by cabin pressure. Tomato juice tastes intensely rich and satisfying in the air, while tasting dull on ground.",
        visualCue: {
          type: "taste_comparison",
          salty: "🔻 -30% (Numbed)",
          sweet: "🔻 -30% (Numbed)",
          umami: "✅ 100% Intact (Tomato Juice shines!)"
        },
        signalWrong: {
          headline: "Assumed stomach remedy over tongue biology",
          detail: "Overlooked altitude preservation of human umami receptors."
        },
        signalRight: {
          headline: "Recognized umami stability at altitude",
          detail: "Understood why savory tomato juice tastes richer at 35,000 feet."
        }
      },
      {
        id: "air_3",
        tension: "counter",
        loop: "The noise cancelation flavor boost",
        type: "text",
        body: "Here is an instant lifehack for your next flight:\n\nIf you put on **noise-canceling headphones**, your meal will immediately taste better.\n\nLoud white engine hum (85 decibels) suppresses your tongue's ability to register sweet and salty flavors.",
        visualCue: {
          type: "stat_pill",
          highlight: "85 dB Jet Noise",
          caption: "Suppresses tongue flavor transmission to the brain"
        },
        reactions: [
          { label: "🎧 Trying this on my next flight", action: "next", hint: "Science +14%" },
          { label: "🧠 Sound influences taste?", action: "next", hint: "Science +14%" }
        ]
      }
    ]
  },
  {
    id: "battery",
    name: "The 1% Battery Miracle",
    topic: "systems",
    beats: [
      {
        id: "bat_1",
        tension: "curio",
        loop: "Why 1% lasts longer than 100%",
        type: "text",
        body: "Have you ever noticed your phone battery drops from **60% to 40%** in what feels like 15 minutes...\n\n...but when it reaches **1%**, it stays alive for 25 minutes of emergency messaging?\n\nThat 1% isn't magic. It's a deliberate psychological buffer programmed by phone engineers.",
        visualCue: {
          type: "battery_diagram",
          level: 1,
          label: "1% Remaining",
          subtitle: "Deliberate 4-6% emergency reserve hidden from the UI"
        },
        deepDive: {
          title: "The Chemical Voltage Problem",
          text: "Batteries don't have a fuel tank gauge. Phones estimate battery level by measuring chemical voltage. Lithium-ion batteries have a very flat voltage curve (3.7V down to 3.5V), meaning a 0.05V drop can look like a 20% jump. Phone makers deliberately hold the screen at '1%' while secretly tapping the last safety buffer so you can make emergency calls.",
          stat: "Voltage curve is nonlinear"
        },
        reactions: [
          { label: "🔋 How do phones calculate %?", action: "expand", hint: "See the voltage curve explanation" },
          { label: "⚡ Does fast charging destroy it?", action: "next", hint: "Explore the fast-charging heat truth" }
        ]
      },
      {
        id: "bat_2",
        tension: "mech",
        loop: "The 20% to 80% golden rule",
        type: "mechanism",
        body: "Charging your phone to 100% every night causes physical @@internal micro-cracking@@ inside the lithium cathode.\n\nKeeping your battery between 20% and 80% can literally double its lifespan from 2 years to 4+ years.",
        evidence: "Lithium ions physically swell the cathode lattice by up to 10% at full 4.35V charge. Repeated swelling and contraction creates microscopic structural fractures that trap lithium permanently, reducing capacity. Limiting charge to 80% prevents peak mechanical stress.",
        citation: "Journal of The Electrochemical Society, Dahn Lab: Parasitic Reactions and Degradation Mechanisms in Li-Ion Cells",
        visualCue: {
          type: "image",
          src: "/assets/battery_lifecycle.jpg",
          alt: "Battery health 20-80% charge rule",
          icon: "🔋",
          caption: "Double Battery Lifespan: The 20% to 80% Window"
        },
        signal: {
          headline: "Investigated lithium cathode swelling physics",
          detail: "Reviewed mechanical strain curves on high-voltage battery charging."
        }
      }
    ]
  },
  {
    id: "mirror",
    name: "The Dressing Room Mirror Secret",
    topic: "behaviour",
    beats: [
      {
        id: "mir_1",
        tension: "diag",
        loop: "Why you look better in the store",
        type: "flinch",
        body: "Have you ever tried on a shirt in a clothing store fitting room, thought **'Wow, I look incredible in this'**...\n\n...only to get home, look in your bathroom mirror, and wonder where that person went?\n\nYou weren't imagining things. Retail fitting rooms are engineered optical illusions.",
        visualCue: {
          type: "image",
          src: "/assets/dressing_room_mirror.jpg",
          alt: "Fitting room mirror tilt and lighting illusion",
          icon: "🪞",
          caption: "Store Mirror Tilt vs Home Mirror"
        },
        deepDive: {
          title: "The Retail Mirror Blueprint",
          text: "High-end fashion stores rarely hang mirrors flush against the wall. A mirror tilted backwards by just 2 to 3 degrees tricks the eye by lengthening your vertical silhouette. Combined with dual 2700K warm diffused light strips from the sides (instead of harsh overhead hospital lighting), it softens skin blemishes and boosts buying confidence.",
          stat: "2.5 degree tilt = 5% slimmer silhouette"
        },
        reactions: [
          { label: "😬 100% happened to me", isFlinch: true, action: "next", hint: "Queues callback" },
          { label: "🔍 How do they tilt the mirrors?", action: "expand", hint: "See the mirror diagram" }
        ]
      },
      {
        id: "mir_2",
        tension: "counter",
        loop: "The 3-second impulse window",
        type: "text",
        body: "Retail psychology studies prove you make the purchase decision within the **first 3 seconds** of looking at yourself in the mirror.\n\nStores invest up to ₹1,50,000 per fitting room stall purely on lighting fixtures to win those 3 seconds.",
        visualCue: {
          type: "stat_pill",
          highlight: "3 Seconds",
          caption: "Average time in front of mirror before the brain decides to buy or put back"
        },
        reactions: [
          { label: "💡 Take photos in fitting rooms next time", action: "next", hint: "Behaviour +14%" },
          { label: "🛒 The retail psychology playbook", action: "next", hint: "Behaviour +14%" }
        ]
      }
    ]
  }
];

export const STANDALONE_FACTS = [
  {
    id: "fact_1",
    topic: "money",
    tension: "scale",
    body: "All the mined gold in human history fits into a single cube measuring just **22 meters on each side**.\n\nYet its total value is currently estimated at over **$16 Trillion**.",
    visualCue: {
      type: "stat_pill",
      highlight: "22 x 22 x 22 m",
      caption: "Fits neatly inside a single tennis court"
    },
    reactions: [
      { label: "🤯 Surprising density", action: "next", hint: "Money +12%" },
      { label: "📦 Hard to fathom", action: "next", hint: "Money +10%" }
    ]
  },
  {
    id: "fact_2",
    topic: "science",
    tension: "counter",
    body: "Bananas are slightly radioactive because of their natural Potassium-40 isotope.\n\nSleeping next to another human exposes you to **more radiation** than eating a banana.",
    visualCue: {
      type: "stat_pill",
      highlight: "Potassium-40",
      caption: "Sleeping next to someone = 0.05 µSv vs Banana = 0.1 µSv"
    },
    reactions: [
      { label: "🍌 Potassium physics", action: "next", hint: "Science +12%" },
      { label: "🛌 People are radioactive too", action: "next", hint: "Science +10%" }
    ]
  },
  {
    id: "fact_3",
    topic: "systems",
    tension: "mech",
    body: "Elevator 'Close Door' buttons in US buildings built after 1990 are legally required to **do nothing** unless a fireman's key is inserted.\n\nThey exist primarily as psychological comfort switches.",
    visualCue: {
      type: "stat_pill",
      highlight: "Placebo Switch",
      caption: "Mandated by Americans with Disabilities Act to prevent doors closing on people"
    },
    reactions: [
      { label: "🚪 Kept pressing it for nothing!", action: "next", hint: "Systems +12%" },
      { label: "⏳ Placebos are everywhere", action: "next", hint: "Systems +10%" }
    ]
  },
  {
    id: "fact_4",
    topic: "behaviour",
    tension: "diag",
    body: "You check your phone an average of **96 times a day**.\n\nIn 68% of those instances, there was no notification sound or vibration. Your brain triggered an anticipatory dopamine itch unprompted.",
    visualCue: {
      type: "stat_pill",
      highlight: "68% Phantom Checks",
      caption: "Unprompted dopamine loop reflex"
    },
    reactions: [
      { label: "📱 Painfully accurate", action: "next", hint: "Behaviour +12%" },
      { label: "🧠 Breaking this habit", action: "next", hint: "Behaviour +10%" }
    ]
  }
];

export const STANDALONE_POLLS = [
  {
    id: "poll_1",
    topic: "money",
    tension: "curio",
    question: "When you leave a tip on a credit card machine at a counter, does the worker always get 100% of it?",
    options: [
      { label: "Yes, law mandates 100% goes to staff", percentage: 28 },
      { label: "No, owners often deduct card swipe processing fees (2-3%)", percentage: 72 }
    ],
    reveal: "In many jurisdictions, employers legally deduct the 2.5% credit card swipe fee from staff tips to avoid eating the interchange cost!"
  },
  {
    id: "poll_2",
    topic: "systems",
    tension: "pred",
    question: "Which aisle in a supermarket has the highest markup on food items?",
    options: [
      { label: "The cereal aisle (Eye-level boxes)", percentage: 64 },
      { label: "The fresh meat counter", percentage: 14 },
      { label: "The frozen dinner section", percentage: 22 }
    ],
    reveal: "Cereal carries markups exceeding 45%! Eye-level cartoon boxes target kids' gaze angles with calculated 9.6-degree downward eye gaze trajectories."
  }
];
