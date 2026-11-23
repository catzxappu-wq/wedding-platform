/**
 * Kannada Wedding Cultural Dictionary & Language Engine
 * Authentic Karnataka traditional wedding phrases, invocations, and bilingual translations.
 */

export type LanguageMode = "kannada" | "english" | "bilingual";

export const KANNADA_CULTURAL_TEXTS = {
  ganeshaInvocation: {
    kannadaTitle: "॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥",
    sanskritTitle: "॥ श्री गणेशाय नमः ॥",
    shlokaKannada: "ವಕ್ರತುಂಡ ಮಹಾಕಾಯ ಸೂರ್ಯಕೋಟಿ ಸಮಪ್ರಭ।\nನಿರ್ವಿಘ್ನಂ ಕುರು ಮೇ ದೇವ ಸರ್ವಕಾರ್ಯೇಷು ಸರ್ವದಾ॥",
    shlokaDevanagari: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
    meaningKannada: "ಕೋಟಿ ಸೂರ್ಯರಂತೆ ಪ್ರಕಾಶಿಸುವ, ವಕ್ರತುಂಡ ಮಹಾಗಣಪತಿಯೇ, ನಮ್ಮ ಈ ವಿವಾಹ ಮಹೋತ್ಸವವನ್ನು ನಿರ್ವಿಘ್ನವಾಗಿ ನೆರವೇರಿಸಿ ಸದಾ ಆಶೀರ್ವದಿಸು.",
    meaningEnglish: "O Lord Ganesha of the curved trunk and immense brilliance of millions of suns, please bless our union and remove all obstacles.",
    shubhaVivahaTag: "॥ ಶುಭ ವಿವಾಹ ಮಹೋತ್ಸವ ॥",
  },

  welcomeGreeting: {
    kannada: "ಅತಿಥಿ ದೇವೋ ಭವ • ತಮಗೆಲ್ಲರಿಗೂ ಪ್ರೀತಿಯ ಆದರದ ಸುಸ್ವಾಗತ",
    english: "Welcome with folded hands • Athithi Devo Bhava",
  },

  mangalyaDharanam: {
    shlokaKannada: "ಮಾಂಗಲ್ಯಂ ತಂತುನಾನೇನ ಲೋಕಜೀವನಹೇತುನಾ।\nಕಂಠೇ ಬಧ್ನಾಮಿ ಸುಭಗೇ ಸಂಜೀವ ಶರದಃ ಶತಮ್॥",
    shlokaDevanagari: "माङ्गल्यं तन्तुनानेन लोकजीवनहेतुना।\nकण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम्॥",
    meaningKannada: "ಲೋಕಹಿತಕ್ಕಾಗಿ ಹಾಗೂ ಗೃಹಸ್ಥ ಧರ್ಮ ಪಾಲನೆಗಾಗಿ ಈ ಮಂಗಳಸೂತ್ರವನ್ನು ನಿನ್ನ ಕಂಠದಲ್ಲಿ ಧಾರಣೆ ಮಾಡುತ್ತಿದ್ದೇನೆ, ನೂರು ವರ್ಷಗಳ ಕಾಲ ಆನಂದದಿಂದ ಬಾಳು.",
    meaningEnglish: "This sacred thread I tie around your neck for our shared life and righteous dharma; may you live happily for a hundred autumns.",
  },

  saptapadi: [
    {
      step: 1,
      kannadaTitle: "ಪ್ರಥಮ ಹೆಜ್ಜೆ (First Vow)",
      sanskrit: "ಇಷ ಏಕಪದೀ ಭವ ಸಾ ಮಾಮನುವ್ರತಾ ಭವ",
      symbol: "🌾 ಅನ್ನ & ಆರೋಗ್ಯ",
      meaningKannada: "ಪರಸ್ಪರ ಪೋಷಣೆ, ಉತ್ತಮ ಆರೋಗ್ಯ ಮತ್ತು ಸಂಪತ್ತಿಗಾಗಿ. ನಮ್ಮ ಕುಟುಂಬವನ್ನು ಪ್ರೀತಿ ಮತ್ತು ಭಕ್ತಿಯಿಂದ ಪೋಷಿಸುವ ಪವಿತ್ರ ಪ್ರತಿಜ್ಞೆ.",
      meaningEnglish: "A sacred prayer for nourishment, good health, and prosperity for each other and our family.",
    },
    {
      step: 2,
      kannadaTitle: "ದ್ವಿತೀಯ ಹೆಜ್ಜೆ (Second Vow)",
      sanskrit: "ಊರ್ಜೇ ದ್ವಿಪದೀ ಭವ ಸಾ ಮಾಮನುವ್ರತಾ ಭವ",
      symbol: "🛡️ ಶಕ್ತಿ & ಧೈರ್ಯ",
      meaningKannada: "ದೈಹಿಕ ಮತ್ತು ಮಾನಸಿಕ ಶಕ್ತಿ, ಧೈರ್ಯ ಹಾಗೂ ಆಧ್ಯಾತ್ಮಿಕ ಸ್ಥಿರತೆಗಾಗಿ. ಜೀವನದ ಎಲ್ಲಾ ಹಂತಗಳಲ್ಲೂ ಪರಸ್ಪರ ಬೆಂಬಲವಾಗಿರುವ ಸಂಕಲ್ಪ.",
      meaningEnglish: "A vow of mutual physical and mental strength, courage, and unwavering support through all tides of life.",
    },
    {
      step: 3,
      kannadaTitle: "ತೃತೀಯ ಹೆಜ್ಜೆ (Third Vow)",
      sanskrit: "ರಾಯಸ್ಪೋಷಾಯ ತ್ರಿಪದೀ ಭವ ಸಾ ಮಾಮನುವ್ರತಾ ಭವ",
      symbol: "💰 ಸಮೃದ್ಧಿ & ಧರ್ಮ",
      meaningKannada: "ನ್ಯಾಯಯುತ ಸಂಪಾದನೆ, ಧರ್ಮ ಪಾಲನೆ ಮತ್ತು ಸಮಾಜಸೇವೆಗಾಗಿ. ಸನ್ಮಾರ್ಗದಲ್ಲಿ ದುಡಿದು ಸಮಾಜಕ್ಕೆ ಹಂಚುವ ವ್ರತ.",
      meaningEnglish: "A prayer for righteous wealth, adherence to dharma, and generous charity.",
    },
    {
      step: 4,
      kannadaTitle: "ಚತುರ್ಥ ಹೆಜ್ಜೆ (Fourth Vow)",
      sanskrit: "ಮಾಯೋಭವ್ಯಾಯ ಚತುಷ್ಪದೀ ಭವ ಸಾ ಮಾಮನುವ್ರತಾ ಭವ",
      symbol: "🕊️ ಸಾಮರಸ್ಯ & ವಿಶ್ವಾಸ",
      meaningKannada: "ಪರಸ್ಪರ ಅಚಲ ನಂಬಿಕೆ, ಪ್ರೀತಿ, ಕೌಟುಂಬಿಕ ಸಾಮರಸ್ಯ ಮತ್ತು ಗೃಹಸ್ಥ ಜೀವನದ ಆನಂದಕ್ಕಾಗಿ.",
      meaningEnglish: "A pledge of profound mutual trust, lifelong harmony, emotional understanding, and joyful companionship.",
    },
    {
      step: 5,
      kannadaTitle: "ಪಂಚಮ ಹೆಜ್ಜೆ (Fifth Vow)",
      sanskrit: "ಪ್ರಜಾಭ್ಯಃ ಪಂಚಪದೀ ಭವ ಸಾ ಮಾಮನುವ್ರತಾ ಭವ",
      symbol: "🌱 ಸಂತಾನ & ಕರುಣೆ",
      meaningKannada: "ಸಂಸ್ಕಾರಯುತ ಸಂತಾನ, ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ಸಕಲ ಜೀವರಾಶಿಗಳ ಮೇಲಿನ ಕರುಣೆ-ವಾತ್ಸಲ್ಯಕ್ಕಾಗಿ.",
      meaningEnglish: "A prayer for noble, virtuous children, wisdom, compassion, and caring for all living beings.",
    },
    {
      step: 6,
      kannadaTitle: "ಷಷ್ಠ ಹೆಜ್ಜೆ (Sixth Vow)",
      sanskrit: "ಋತುಭ್ಯಃ ಷಟ್ಪದೀ ಭವ ಸಾ ಮಾಮನುವ್ರತಾ ಭವ",
      symbol: "🌸 ಸಕಲ ಋತುಗಳಲ್ಲೂ ಜೊತೆ",
      meaningKannada: "ಸಕಲ ಋತುಗಳಲ್ಲೂ, ಸುಖ-ದುಃಖಗಳಲ್ಲೂ ಆಜೀವ ಪರ್ಯಂತ ಜೊತೆಯಾಗಿ ನಡೆದು ಬಾಂಧವ್ಯವನ್ನು ಕಾಪಾಡುವ ಮಾತು.",
      meaningEnglish: "A promise of lifelong companionship and joy across all seasons, joys, and hardships.",
    },
    {
      step: 7,
      kannadaTitle: "ಸಪ್ತಮ ಹೆಜ್ಜೆ (Seventh Vow)",
      sanskrit: "ಸಖೇ ಸಪ್ತಪದೀ ಭವ ಸಾ ಮಾಮನುವ್ರತಾ ಭವ",
      symbol: "❤️ ಚಿರಂತನ ಮೈತ್ರಿ",
      meaningKannada: "ಚಿರಂತನ ಸ್ನೇಹ, ಆತ್ಮೀಯತೆ ಮತ್ತು ನಿಷ್ಠೆ. ಎರಡು ದೇಹಗಳು, ಎರಡು ಮನಸ್ಸುಗಳು ಒಂದೇ ಆತ್ಮವಾಗಿ ಬೆಸೆದುಕೊಂಡ ಪವಿತ್ರ ಸಪ್ತಪದಿ.",
      meaningEnglish: "The culmination of eternal friendship, spiritual oneness, and undying fidelity. Forever one soul.",
    },
  ],

  ui: {
    celebrationOf: {
      kannada: "ಪವಿತ್ರ ವಿವಾಹ ಮಹೋತ್ಸವ",
      english: "The Wedding Celebration Of",
    },
    saveTheDate: {
      kannada: "ಶುಭ ದಿನಾಂಕ",
      english: "Save The Date",
    },
    meetCouple: {
      kannada: "ವಧು - ವರರ ಪರಿಚಯ",
      english: "Meet The Bride & Groom",
    },
    theGroom: {
      kannada: "ವರ",
      english: "The Groom",
    },
    theBride: {
      kannada: "ವಧು",
      english: "The Bride",
    },
    ourStory: {
      kannada: "ನಮ್ಮ ಪ್ರೇಮ ಕಥೆ",
      english: "Our Love Story",
    },
    familyBlessings: {
      kannada: "ಹಿರಿಯರ ಹಾಗೂ ಕುಟುಂಬದ ಆಶೀರ್ವಾದ",
      english: "Family Blessings",
    },
    sacredVows: {
      kannada: "ಪವಿತ್ರ ಸಪ್ತಪದಿ - ಏಳು ಪವಿತ್ರ ಹೆಜ್ಜೆಗಳು",
      english: "The Sacred Saat Phere (Seven Vows)",
    },
    eventsSchedule: {
      kannada: "ಮಂಗಳ ಕಾರ್ಯಕ್ರಮಗಳ ವಿವರ",
      english: "Events & Celebrations",
    },
    venueDetails: {
      kannada: "ಕಲ್ಯಾಣ ಮಂಟಪದ ವಿಳಾಸ ಹಾಗೂ ಮಾರ್ಗ",
      english: "Wedding Venue & Location",
    },
    photoGallery: {
      kannada: "ಚಿತ್ರ ಸಂಪುಟ (ಫೋಟೋ ಗ್ಯಾಲರಿ)",
      english: "Photo Gallery",
    },
    rsvpTitle: {
      kannada: "ನಿಮ್ಮ ಉಪಸ್ಥಿತಿಯನ್ನು ದೃಢೀಕರಿಸಿ (RSVP)",
      english: "Confirm Your Attendance (RSVP)",
    },
    rsvpButton: {
      kannada: "ಆಗಮನ ದೃಢೀಕರಿಸಿ",
      english: "RSVP Now",
    },
    addToCalendar: {
      kannada: "ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ",
      english: "Add to Calendar",
    },
    scrollDown: {
      kannada: "ವೀಕ್ಷಿಸಲು ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ",
      english: "Scroll To Explore",
    },
    backToTop: {
      kannada: "ಪುಟದ ಮೇಲಕ್ಕೆ",
      english: "Back to Top",
    },
    shareInvitation: {
      kannada: "ಆಹ್ವಾನ ಪತ್ರಿಕೆ ಹಂಚಿಕೊಳ್ಳಿ",
      english: "Share Invitation",
    },
    tapToOpen: {
      kannada: "ಆಹ್ವಾನ ಪತ್ರಿಕೆ ತೆರೆಯಿರಿ",
      english: "Tap To Open Invitation",
    },
    togetherWithFamilies: {
      kannada: "ಕುಟುಂಬಸ್ಥರ ಹಾಗೂ ಬಂಧು-ಮಿತ್ರರ ಜೊತೆಯಾಗಿ",
      english: "Together With Their Families",
    },
  },
};

const NAME_KANNADA_MAP: Record<string, string> = {
  shrinivas: "ಶ್ರೀನಿವಾಸ",
  srinivas: "ಶ್ರೀನಿವಾಸ",
  meghashree: "ಮೇಘಶ್ರೀ",
  megha: "ಮೇಘಾ",
  rahul: "ರಾಹುಲ್",
  priya: "ಪ್ರಿಯಾ",
  arjun: "ಅರ್ಜುನ್",
  shreya: "ಶ್ರೇಯಾ",
};

export function getKannadaName(name: string): string {
  if (!name) return "";
  const key = name.trim().toLowerCase();
  return NAME_KANNADA_MAP[key] || name;
}

const EVENT_KANNADA_MAP: Record<string, { kannadaName: string; kannadaDesc: string }> = {
  haldi: {
    kannadaName: "ಅರಿಶಿನ ಹಾಗೂ ಮೆಹಂದಿ ಶಾಸ್ತ್ರ",
    kannadaDesc: "ಮಂಗಳಕರ ಅರಿಶಿನ ಸ್ನಾನ, ಸುಂದರ ಮೆಹಂದಿ ವಿನ್ಯಾಸಗಳು, ಜಾನಪದ ಗೀತೆಗಳು ಮತ್ತು ಆನಂದದ ಸಂಭ್ರಮ.",
  },
  mehendi: {
    kannadaName: "ಅರಿಶಿನ ಹಾಗೂ ಮೆಹಂದಿ ಶಾಸ್ತ್ರ",
    kannadaDesc: "ಮಂಗಳಕರ ಅರಿಶಿನ ಸ್ನಾನ, ಸುಂದರ ಮೆಹಂದಿ ವಿನ್ಯಾಸಗಳು, ಜಾನಪದ ಗೀತೆಗಳು ಮತ್ತು ಆನಂದದ ಸಂಭ್ರಮ.",
  },
  sangeet: {
    kannadaName: "ಸಂಗೀತ ಸಂಜೆ ಮತ್ತು ನೃತ್ಯೋತ್ಸವ",
    kannadaDesc: "ಕುಟುಂಬದ ನೃತ್ಯ ಪ್ರದರ್ಶನ, ಡೋಲು ವಾದನ, ಗಾಯನ ಮತ್ತು ರುಚಿಕರ ಭೋಜನದ ಸಂಭ್ರಮದ ಸಂಜೆ.",
  },
  muhurtham: {
    kannadaName: "ಶುಭ ಮುಹೂರ್ತ ಹಾಗೂ ಸಪ್ತಪದಿ",
    kannadaDesc: "ವೈದಿಕ ಮಂತ್ರಘೋಷ, ಕನ್ಯಾದಾನ, ಮಾಂಗಲ್ಯ ಧಾರಣ ಹಾಗೂ ಅಗ್ನಿಸಾಕ್ಷಿಯಾಗಿ ಏಳು ಪವಿತ್ರ ಹೆಜ್ಜೆಗಳ ಸಪ್ತಪದಿ.",
  },
  wedding: {
    kannadaName: "ಶುಭ ಮುಹೂರ್ತ ಹಾಗೂ ಸಪ್ತಪದಿ",
    kannadaDesc: "ವೈದಿಕ ಮಂತ್ರಘೋಷ, ಕನ್ಯಾದಾನ, ಮಾಂಗಲ್ಯ ಧಾರಣ ಹಾಗೂ ಅಗ್ನಿಸಾಕ್ಷಿಯಾಗಿ ಏಳು ಪವಿತ್ರ ಹೆಜ್ಜೆಗಳ ಸಪ್ತಪದಿ.",
  },
  reception: {
    kannadaName: "ಆರತಕ್ಷತೆ ಸಮಾರಂಭ (ರಿಸೆಪ್ಷನ್)",
    kannadaDesc: "ನವದಂಪತಿಗಳಿಗೆ ಶುಭ ಹಾರೈಕೆ, ಗೌರವ ಸತ್ಕಾರ, ಲೈವ್ ಸಂಗೀತ ಮತ್ತು ರಾಜಮನೆತನದ ಭೋಜನ ಕೂಟ.",
  },
};

export function getKannadaEvent(name: string, description?: string | null): { name: string; description: string } {
  const lower = (name || "").toLowerCase();
  for (const key of Object.keys(EVENT_KANNADA_MAP)) {
    if (lower.includes(key)) {
      return {
        name: EVENT_KANNADA_MAP[key].kannadaName,
        description: EVENT_KANNADA_MAP[key].kannadaDesc,
      };
    }
  }
  return {
    name: name,
    description: description || "",
  };
}
