const en = {
  nav: {
    home: "Home",
    events: "Events",
    bolognaGuide: "Bologna Guide",
    ourStory: "Our Story",
    reverseRegistry: "Reverse Registry",
    gallery: "Gallery",
    rsvp: "RSVP",
    toggleMenu: "Toggle menu",
  },

  footer: {
    summerBologna: "Summer 2027 · Bologna, Italy",
    madeWithLove: "Made with love",
  },

  home: {
    summerBologna: "June 19, 2027 \u00A0·\u00A0 Bologna, Italy",
    wedding: "Wedding",
    detailsToCome: "Details to come",
  },

  saveTheDate: {
    tapSeal: "Tap the seal to open",
    summerBologna: "June 19, 2027 \u00A0·\u00A0 Bologna, Italy",
    date: "June 19, 2027",
    location: "Bologna, Italy",
    heroBody: "Save the date",
    addToCalendar: "Add to Calendar",
    googleCalendar: "Google Calendar",
    appleCalendar: "Apple Calendar",
    getFormalInvite: "Get your invite",
    countingDown: "Countdown to the big day!",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    untilCelebrate: "",
    inviteModalTitle:
      "Share your details so we can send you a formal invite 💌",
  },

  guestForm: {
    title: "Please share your details so we can\nsend you a formal invite 💌",
    subtitle:
      "so we can send you a formal invite 💌",
    name: "Full Name",
    email: "Email",
    address: "Mailing Address",
    namePlaceholder: "First & Last Name",
    emailPlaceholder: "your@email.com",
    addressPlaceholder: "Start typing your address...",
    submit: "Submit",
    submitting: "Submitting...",
    successTitle: "Thank you",
    successMessageLine1:
      "We have your details now! Stay tuned for a formal invitation in the mail.",
    successMessageLine2: "We hope to see you in Bologna!",
    duplicateTitle: "Already Received!",
    duplicateMessage:
      "We already have your information on file \u2014 no need to submit again.",
    errorMessage: "Something went wrong. Please try again.",
    required: "Please fill out this field 😊",
    invalidEmail: "Please enter a valid email address",
    selectAddress: "Please select an address from the suggestions",
  },

  ourStory: {
    riccardoRosa: "Riccardo & Rosa",
    ourStory: "Our Story",
    subtitle: "The moments that brought us here",
    milestones: [
      {
        year: "2018",
        title: "How We Met",
        description:
          "A chance encounter that changed everything. What started as a conversation turned into hours of talking, and then into something neither of us expected.",
      },
      {
        year: "2019",
        title: "First Adventures",
        description:
          "Our first trips together — discovering new places, new flavors, and a shared love for exploring the unknown. Every journey deepened what we knew from the start.",
      },
      {
        year: "2020",
        title: "Through It All",
        description:
          "A year that tested the world — and brought us closer. We learned that home isn't a place, it's a person.",
      },
      {
        year: "2021",
        title: "Moving to Boston",
        description:
          "A bold leap together across the Atlantic. New city, new chapter, same feeling of being exactly where we're meant to be — side by side.",
      },
      {
        year: "2023",
        title: "Building Our Life",
        description:
          "From exploring New England to finding our rhythm in the city, we built a life filled with dinner parties, weekend escapes, and everyday magic.",
      },
      {
        year: "2026",
        title: "The Engagement",
        description:
          "The question that had the most obvious answer. A moment of pure joy, years in the making, and the beginning of our next great adventure.",
      },
      {
        year: "2027",
        title: "Bologna",
        description:
          "And now, we celebrate — in the city that captures everything we love. Great food, warmth, beauty, and the people closest to our hearts.",
      },
    ],
    quote:
      "\u201CIn all the world, there is no heart for me like yours.\u201D",
    quoteAuthor: "— Maya Angelou",
  },

  events: {
    theWeekend: "The Weekend",
    theCelebration: "The Celebration",
    subtitle: "Three unforgettable events across a weekend in Bologna",
    date: "Date",
    time: "Time",
    venue: "Venue",
    dressCode: "Dress Code",
    eventList: [
      {
        tag: "Day One",
        name: "Welcome Cocktail",
        date: "Date TBD",
        time: "7:00 PM",
        venue: "Venue TBD",
        address: "Bologna, Italy",
        description:
          "An intimate evening to welcome our guests. Enjoy craft cocktails and local delicacies as we kick off the celebration together.",
        dresscode: "Smart Casual",
      },
      {
        tag: "Day Two",
        name: "Wedding Ceremony",
        date: "Date TBD",
        time: "4:00 PM",
        venue: "Venue TBD",
        address: "Bologna, Italy",
        description:
          "The moment we've been dreaming of. Join us as we exchange vows in a beautiful setting surrounded by the people we love most.",
        dresscode: "Formal",
      },
      {
        tag: "Day Two",
        name: "Reception Dinner & Party",
        date: "Date TBD",
        time: "7:30 PM",
        venue: "Venue TBD",
        address: "Bologna, Italy",
        description:
          "An evening of feasting, toasts, and dancing under the stars. Bolognese cuisine, flowing wine, and celebrations into the night.",
        dresscode: "Formal",
      },
    ],
    whatToWear: "What to Wear",
    dressCodeInspiration: "Dress Code Inspiration",
    dressCodeDescription:
      "We envision an elegant, refined aesthetic. Think garden formal meets Italian sophistication — flowing fabrics, warm earth tones, and timeless silhouettes.",
    moodboard: [
      "Elegant suiting",
      "Flowing fabrics",
      "Earth tones",
      "Classic tailoring",
      "Romantic silhouettes",
      "Refined accessories",
      "Warm neutrals",
      "Italian elegance",
    ],
    suggestedAttire: "Suggested Attire",
    gardenFormal: "Garden Formal / Cocktail",
  },

  bolognaGuide: {
    aCuratedGuide: "A Curated Guide",
    bologna: "Bologna",
    subtitle:
      "La Dotta, La Grassa, La Rossa — The Learned, The Fat, The Red. Our favorite places in one of Italy\u2019s most delicious cities.",
    categories: {
      Hotels: "Hotels",
      Restaurants: "Restaurants",
      "Cafés": "Cafés",
      Gelato: "Gelato",
      Bars: "Bars",
      "Things to Do": "Things to Do",
      Neighborhoods: "Neighborhoods",
    } as Record<string, string>,
    recommendations: {
      Hotels: [
        {
          name: "Hotel Metropolitan",
          description:
            "Our top pick. A refined four-star hotel in the heart of Bologna, steps from Piazza Maggiore. Elegant rooms, rooftop terrace, and impeccable service.",
          highlight: true,
          tag: "Our Top Pick",
        },
        {
          name: "Grand Hotel Majestic già Baglioni",
          description:
            "Bologna's most prestigious address. A palatial five-star with frescoed ceilings and centuries of history.",
        },
        {
          name: "Art Hotel Commercianti",
          description:
            "Charming boutique hotel overlooking the Basilica di San Petronio. Medieval architecture meets modern comfort.",
        },
        {
          name: "Hotel Corona d'Oro",
          description:
            "A historic gem near the Two Towers. Art Nouveau details, central location, and a beautifully preserved palazzo setting.",
        },
      ],
      Restaurants: [
        {
          name: "Trattoria Anna Maria",
          description:
            "An institution for handmade pasta. The tortellini in brodo is legendary. Book well in advance.",
          tag: "Must Visit",
        },
        {
          name: "Drogheria della Rosa",
          description:
            "Set inside a former pharmacy, this intimate spot serves refined Bolognese cuisine with a creative twist.",
        },
        {
          name: "Osteria dell'Orsa",
          description:
            "A beloved local favorite in the university quarter. Generous portions, fair prices, and a lively atmosphere.",
        },
        {
          name: "Ristorante Rodrigo",
          description:
            "Elevated Emilian cuisine in an elegant setting. Perfect for a special dinner.",
        },
        {
          name: "Sfoglia Rina",
          description:
            "Watch pasta being made by hand through the glass window. Simple, perfect, unforgettable.",
        },
      ],
      "Cafés": [
        {
          name: "Caffè Terzi",
          description:
            "The best specialty coffee in Bologna. A sleek, minimalist space with exceptional espresso.",
          tag: "Best Coffee",
        },
        {
          name: "Aroma Caffè",
          description:
            "A cozy café with excellent pastries and a peaceful courtyard. Ideal for a slow morning.",
        },
        {
          name: "Camera a Sud",
          description:
            "Southern Italian charm in the heart of Bologna. Great brunch spot with Neapolitan-inspired pastries.",
        },
      ],
      Gelato: [
        {
          name: "Cremeria Funivia",
          description:
            "Artisanal gelato made with the finest local ingredients. The pistachio is otherworldly.",
          tag: "Our Favorite",
        },
        {
          name: "Cremeria Santo Stefano",
          description:
            "Classic and beloved. Rich, creamy flavors in a beautiful piazza setting.",
        },
        {
          name: "La Sorbetteria Castiglione",
          description:
            "Inventive seasonal flavors alongside the classics. Always a queue — always worth it.",
        },
      ],
      Bars: [
        {
          name: "Camera a Sud",
          description:
            "Aperitivo culture at its finest. Great cocktails and a vibrant atmosphere.",
        },
        {
          name: "Ruggine",
          description:
            "A trendy bar with craft cocktails and natural wines. Industrial-chic setting near the canal.",
        },
        {
          name: "Le Stanze",
          description:
            "Set inside a former private chapel with stunning frescoed walls. One of the most unique bars in Italy.",
          tag: "Unique",
        },
        {
          name: "Enoteca Italiana",
          description:
            "An intimate wine bar with an exceptional selection of Italian wines and local charcuterie.",
        },
      ],
      "Things to Do": [
        {
          name: "Climb the Asinelli Tower",
          description:
            "498 steps to the best panoramic view of Bologna. Arrive early to avoid lines.",
          tag: "Must Do",
        },
        {
          name: "Portico di San Luca",
          description:
            "Walk the world's longest portico — 3.8 km of covered arches leading to the stunning hilltop sanctuary.",
        },
        {
          name: "Piazza Maggiore",
          description:
            "The beating heart of the city. Explore the Basilica, Neptune Fountain, and medieval architecture.",
        },
        {
          name: "Mercato di Mezzo",
          description:
            "A vibrant indoor food market in the Quadrilatero. Sample local specialties and soak in the energy.",
        },
        {
          name: "Day Trip to Modena",
          description:
            "Visit the home of balsamic vinegar and Ferrari. Just 30 minutes by train.",
        },
      ],
      Neighborhoods: [
        {
          name: "Quadrilatero",
          description:
            "The ancient market district. Narrow streets lined with food shops, delis, and artisan boutiques.",
          tag: "Food & Shopping",
        },
        {
          name: "Santo Stefano",
          description:
            "Quiet, elegant, and photogenic. Beautiful piazzas, antique shops, and the stunning seven-church complex.",
        },
        {
          name: "University Quarter",
          description:
            "The lively heart of student Bologna. Murals, bookshops, affordable eats, and youthful energy.",
        },
        {
          name: "Bolognina",
          description:
            "The emerging creative district across the station. Multicultural restaurants, street art, and a local vibe.",
        },
      ],
    } as Record<string, { name: string; description: string; highlight?: boolean; tag?: string }[]>,
    fromUsToYou: "From Us to You",
    makeItYourOwn: "Make It Your Own",
    closingNote:
      "Bologna is a city best explored on foot, with an open appetite and a sense of curiosity. Wander the porticoes, stumble into a hidden courtyard, and let the city surprise you. These are our favorites — but the best discoveries will be yours.",
  },

  reverseRegistry: {
    reverseRegistry: "Reverse Registry",
    title: "The Things We\u2019ll Finally Do",
    subtitle:
      "Instead of buying things for the couple, choose from a list of experiences to do for yourself — and commit to actually doing them. You can also add your own ideas.",
    browseActivities: "Browse Activities",
    liveFeed: "Live Feed",
    aDifferentKind: "A Different Kind of Gift",
    howItWorks: "How It Works",
    steps: [
      {
        step: "01",
        title: "Choose",
        description:
          "Browse our curated list of experiences — from cooking classes to skydiving — or add your own custom activity.",
      },
      {
        step: "02",
        title: "Commit",
        description:
          "Select the activities you want to do and make a commitment. We\u2019ll remind you every 6 months to follow through.",
      },
      {
        step: "03",
        title: "Share",
        description:
          "Complete the activity and submit a photo. Your experience appears on the live feed for everyone to see.",
      },
    ],
    quote:
      "\u201CThe greatest gift you can give someone is your time.\u201D",
    exploreActivities: "Explore Activities \u2192",
  },

  activities: {
    reverseRegistry: "Reverse Registry",
    chooseYourAdventure: "Choose Your Adventure",
    commit: "Commit \u2192",
    yourIdea: "Your Idea",
    addCustomActivity: "Add a Custom Activity",
    addCustomDescription:
      "Have something else in mind? Add your own experience below.",
    activityName: "Activity Name",
    description: "Description",
    estimatedCost: "Estimated Cost",
    placeholders: {
      activityName: "e.g. Learn to surf",
      description: "Tell us about it...",
      cost: "e.g. $100 \u2013 $200",
      name: "First & Last Name",
      email: "your@email.com",
    },
    commitToThis: "Commit to This",
    commitTo: "Commit to",
    yourName: "Your Name",
    email: "Email",
    submitting: "Submitting...",
    iCommit: "I Commit",
    cancel: "Cancel",
    keepPrivate: "Keep my commitment private",
    privateHint: "Your name won\u2019t appear on the live feed",
    committed: "You\u2019re Committed!",
    committedMessage:
      "We\u2019ll send you a confirmation email and remind you every 6 months. Now go make it happen!",
    close: "Close",
    errorMessage: "Something went wrong. Please try again.",
    activityList: [
      {
        id: "cooking",
        name: "Cooking Class",
        description:
          "Learn to make fresh pasta, sauces, or a full Italian meal with a hands-on class.",
        costRange: "$50 \u2013 $150",
        icon: "\uD83C\uDF5D",
      },
      {
        id: "skydiving",
        name: "Skydiving Experience",
        description:
          "Take the leap — literally. A tandem skydive to remember for a lifetime.",
        costRange: "$200 \u2013 $400",
        icon: "\uD83E\uDE82",
      },
      {
        id: "weekend-trip",
        name: "Weekend Trip",
        description:
          "Plan a weekend getaway somewhere you've always wanted to visit.",
        costRange: "$300 \u2013 $800",
        icon: "\u2708\uFE0F",
      },
      {
        id: "language",
        name: "Language Class",
        description:
          "Start learning a new language — take the first level of a course.",
        costRange: "$100 \u2013 $300",
        icon: "\uD83D\uDCDA",
      },
      {
        id: "balloon",
        name: "Hot Air Balloon Ride",
        description:
          "Float above the world at sunrise. A magical, once-in-a-lifetime experience.",
        costRange: "$250 \u2013 $500",
        icon: "\uD83C\uDF88",
      },
      {
        id: "scuba",
        name: "Scuba Diving Certification",
        description:
          "Get certified and explore the underwater world. PADI Open Water is just the start.",
        costRange: "$400 \u2013 $700",
        icon: "\uD83E\uDD3F",
      },
      {
        id: "pottery",
        name: "Pottery Workshop",
        description:
          "Get your hands dirty and create something beautiful from clay.",
        costRange: "$60 \u2013 $200",
        icon: "\uD83C\uDFFA",
      },
      {
        id: "wellness",
        name: "Weekend Wellness Retreat",
        description:
          "A weekend of yoga, meditation, and deep relaxation. You deserve it.",
        costRange: "$300 \u2013 $600",
        icon: "\uD83E\uDDD8",
      },
    ],
  },

  feed: {
    liveFeed: "Live Feed",
    guestAdventures: "Guest Adventures",
    seeWhat: "See what other guests have committed to",
    loading: "Loading adventures...",
    noAdventures: "No Adventures Yet",
    beFirst: "Be the first to commit to an experience!",
    browseActivities: "Browse Activities",
    committed: "Committed",
    completedActivity: "Completed an Activity?",
    shareExperience: "Share Your Experience",
    shareDescription:
      "Submit a photo and a short message about your adventure.",
    uploadPhoto: "Upload Photo",
    timeAgo: {
      justNow: "just now",
      mAgo: "m ago",
      hAgo: "h ago",
      dAgo: "d ago",
      moAgo: "mo ago",
    },
    upload: {
      title: "Share Your Experience",
      enterEmail: "Enter the email you used when committing",
      emailPlaceholder: "your@email.com",
      findCommitments: "Find My Commitments",
      searching: "Searching...",
      noCommitments: "No commitments found for this email.",
      selectCommitment: "Which activity did you complete?",
      choosePhoto: "Choose a Photo",
      dragOrClick: "Drag a photo here or click to browse",
      uploading: "Uploading...",
      submit: "Share Experience",
      success: "Photo Shared!",
      successMessage: "Your experience is now visible on the feed.",
      error: "Something went wrong. Please try again.",
      close: "Close",
      back: "Back",
      maxSize: "Max 10 MB",
    },
  },
};

export type Translations = typeof en;
export default en;
