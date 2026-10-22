// 22Oct2026 - Used Composer via Cursor to tighten Great Vibes fallback metrics for hero CLS
// 22Oct2026 - Used Composer via Cursor to load Quasar Velour Script for homepage hero names
// 22Oct2026 - Used Composer via Cursor to load Xyric Nocturne for homepage hero title
// 22Oct2026 - Used Composer via Cursor to swap homepage hero title font to Allura
// 22Oct2026 - Used Composer via Cursor to swap homepage hero title font to Italianno
// 22Oct2026 - Used Composer via Cursor to parameterize hero title font (Parisienne + candidates)
// 22Oct2026 - Used Composer via Cursor to add Playfair Display to hero title font switcher
// 22Oct2026 - Used Composer via Cursor to set hero pairing Great Vibes + Montserrat
// 22Oct2026 - Used Composer via Cursor to set hero pairing Pinyon Script + Forum
import {
  Spectral,
  Inter,
  Great_Vibes,
  Forum,
  Pinyon_Script,
  Playfair_Display,
  Italianno,
  Allura,
  Parisienne,
} from "next/font/google";

/** Hero pairing: Pinyon Script (title) + Forum (wedding line / RSVP). Change HERO_TITLE_FONT to switch title. Valid: "playfairDisplay" | "parisienne" | "italianno" | "allura" | "greatVibes" | "pinyon" */
const HERO_TITLE_FONT = "pinyon" as const;

export const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "block",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "block",
});

/** Forum — hero wedding line + RSVP (serif side of Pinyon Script pairing). */
export const forum = Forum({
  variable: "--font-forum",
  subsets: ["latin"],
  weight: "400",
  display: "block",
});

/** Script display already block; adjustFontFallback emits size-adjust so hero title metrics stay closer pre-swap. */
export const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "block",
  adjustFontFallback: true,
});

/** Pinyon Script — use `.className` on headings for reliable rendering; `.variable` for CSS `var(--font-pinyon)` */
export const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "block",
});

/** Hero title candidates — all loaded so flipping HERO_TITLE_FONT is enough (no import edits). */
export const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
  display: "block",
});

export const italianno = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: "400",
  display: "block",
});

export const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
  display: "block",
});

/** Playfair Display — hero title candidate + elsewhere (ampersand, pages). */
export const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "block",
});

const heroTitleByKey = {
  playfairDisplay,
  parisienne,
  italianno,
  allura,
  greatVibes,
  pinyon: pinyonScript,
} as const;

/** Homepage hero title (Rosa & Riccardo). Selected by HERO_TITLE_FONT. */
export const heroTitleFont = heroTitleByKey[HERO_TITLE_FONT];
