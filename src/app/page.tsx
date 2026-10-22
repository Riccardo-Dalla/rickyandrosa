// 22Oct2026 - Used Composer via Cursor to restyle homepage hero to match E2 bright-middle outline RSVP mocks
// 22Oct2026 - Used Composer via Cursor to add muted Everywhere track with sound toggle by place name
// 22Oct2026 - Used Composer via Cursor to wait for canplaythrough before hero advances + cache-bust reencoded clips
// 22Oct2026 - Used Composer via Cursor to polish homepage hero amp, CTA layout, breathing room, sound hint
// 22Oct2026 - Used Composer via Cursor to center homepage hero title, wedding line, and RSVP stack
// 22Oct2026 - Used Composer via Cursor to even homepage hero stack gaps with a single flex gap
// 22Oct2026 - Used Composer via Cursor to drop hero overlay bottom green fade
// 22Oct2026 - Used Composer via Cursor to match homepage RSVP to save-the-date calendar outline pill
// 22Oct2026 - Used Composer via Cursor to tighten hero title→wedding optical gap for Great Vibes line-box
// 22Oct2026 - Used Composer via Cursor to fix mobile sound toggle swallowed by hero touch preventDefault
// 22Oct2026 - Used Composer via Cursor to dim hero video with uniform 20% black overlay
// 22Oct2026 - Used Composer via Cursor to stop mobile RSVP jump (opacity-only entrance + title min-height)
// 22Oct2026 - Used Composer via Cursor to use cropped logo ampersand image in homepage hero title
// 22Oct2026 - Used Composer via Cursor to swap hero names to gold script PNGs on one line
// 22Oct2026 - Used Composer via Cursor to cache-bust hero amp CDN URL after R2 upload
// 22Oct2026 - Used Composer via Cursor to swap Gemini gold scripts + amp and cache-bust CDN URLs
// 22Oct2026 - Used Composer via Cursor to drop hero video dim and rely on gold title glow
// 22Oct2026 - Used Composer via Cursor to swap Rosa PNG, drop gold glow for shadow, tighten title gap
// 22Oct2026 - Used Composer via Cursor to bust hero PNG cache, grow names 50%, match capital-R heights
// 22Oct2026 - Used Composer via Cursor to replace hero name PNGs with Pinyon Script text (logo match)
// 22Oct2026 - Used Composer via Cursor to set hero names in white Quasar Velour Script
// 22Oct2026 - Used Composer via Cursor to mix Great Vibes capital R with Quasar Velour hero names
// 22Oct2026 - Used Composer via Cursor to flip hero fonts: Quasar R + Great Vibes remainder
// 22Oct2026 - Used Composer via Cursor to set hero title entirely in Xyric Nocturne
// 22Oct2026 - Used Composer via Cursor to swap homepage hero title font to Allura
// 22Oct2026 - Used Composer via Cursor to swap homepage hero title font to Italianno
// 22Oct2026 - Used Composer via Cursor to harden home music stop on navigate away
// 22Oct2026 - Used Composer via Cursor to wire heroTitleFont on homepage hero h1
// 22Oct2026 - Used Composer via Cursor to apply Montserrat on hero wedding line + RSVP
// 22Oct2026 - Used Composer via Cursor to apply Forum on hero wedding line + RSVP
// 22Oct2026 - Used Composer via Cursor to grow hero title/wedding/RSVP sizes 50%
// 22Oct2026 - Used Composer via Cursor to strengthen hero title shadow, bold wedding line, tighten title gap
// 22Oct2026 - Used Composer via Cursor to fluid-scale hero title/wedding/RSVP on mobile
// 22Oct2026 - Used Composer via Cursor to add light center hero-scrim under title stack
// 22Oct2026 - Used Composer via Cursor to swap hero opening videos 1 and 2 (Dolomites before Zion)
// 22Oct2026 - Used Composer via Cursor to fade hero video plane ~25% via black overlay
// 22Oct2026 - Used Composer via Cursor to set hero-video-fade to 20% and remove hero-scrim
"use client";

import { useState, useEffect, useRef, useCallback, type SyntheticEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { heroTitleFont, forum } from "@/lib/fonts";

let homeHasAnimated = false;

const MEDIA_BASE = "https://media.rickyandrosa.com";
const RSVP_URL = "https://rsvp.rickyandrosa.com";
/** Bumps when hero MP4s change so browsers drop old immutable caches. */
const HERO_CACHE_BUST = "v=20261022f";
/** Fleetwood Mac — “I want to be with you everywhere”. Upload via `npm run upload-media`. */
const HOME_MUSIC = `${MEDIA_BASE}/everywhere.mp3`;

interface HeroVideo {
  src: string;
  objectPosition?: string;
  location: string;
}

function heroSrc(file: string) {
  return `${MEDIA_BASE}/hero-videos/${file}?${HERO_CACHE_BUST}`;
}

const HERO_VIDEOS: HeroVideo[] = [
  { src: heroSrc("GH010038_1732759039324.mp4"), location: "La Fortuna, Costa Rica" },
  { src: heroSrc("GH010071_1732989066470.mp4"), location: "Tortuguero, Costa Rica" },
  { src: heroSrc("GH010152_1773561192800.mp4"), location: "El Nido, Philippines" },
  { src: heroSrc("GH010273_1773562971855.mp4"), location: "Kawasan Falls, Philippines" },
  { src: heroSrc("GH010312_1773563884273.mp4"), objectPosition: "50% 50%", location: "Cebu, Philippines" },
  { src: heroSrc("Norway00001890.mp4"), objectPosition: "15% 70%", location: "Senja, Norway" },
  { src: heroSrc("Norway00010415.mp4"), location: "Senja, Norway" },
  { src: heroSrc("Norway00010920.mp4"), objectPosition: "30% 65%", location: "Blåisvatnet, Norway" },
  { src: heroSrc("Zion00007503.mp4"), objectPosition: "40% 55%", location: "Utah" },
  { src: heroSrc("Zion00008579.mp4"), objectPosition: "40% 60%", location: "Utah" },
  { src: heroSrc("Zion00015383.mp4"), location: "Utah" },
  { src: heroSrc("CostaRica00023976.mp4"), objectPosition: "50% 70%", location: "Playa Cocles, Costa Rica" },
  { src: heroSrc("Zion00001567.mp4"), location: "Utah" },
  { src: heroSrc("Dolomites00003000.mp4"), location: "Dolomites, Italy" },
  { src: heroSrc("Dolomites00011000.mp4"), location: "Dolomites, Italy" },
];

const OPENING_ZION = HERO_VIDEOS.find((v) => v.src.includes("Zion00007503"))!;
const OPENING_DOLOMITES = HERO_VIDEOS.find((v) => v.src.includes("Dolomites00003000"))!;

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Dolomites first, Zion second, then a shuffle of the rest. Later cycles reshuffle all. */
function buildOpeningQueue(): HeroVideo[] {
  const rest = HERO_VIDEOS.filter(
    (v) => v.src !== OPENING_ZION.src && v.src !== OPENING_DOLOMITES.src,
  );
  return [OPENING_DOLOMITES, OPENING_ZION, ...shuffleArray(rest)];
}

function useRotatingVideo(intervalMs = 8000) {
  const queueRef = useRef<HeroVideo[]>([]);
  const posRef = useRef(0);
  const [current, setCurrent] = useState<HeroVideo | null>(null);
  const [next, setNext] = useState<HeroVideo | null>(null);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const preloadRef = useRef<HTMLVideoElement | null>(null);
  const nextReadyRef = useRef(false);
  const pendingAdvanceRef = useRef(false);

  const commitAdvance = useCallback(() => {
    pendingAdvanceRef.current = false;
    nextReadyRef.current = false;
    posRef.current += 1;
    if (posRef.current >= queueRef.current.length) {
      queueRef.current = shuffleArray(HERO_VIDEOS);
      posRef.current = 0;
    }
    setCurrent(queueRef.current[posRef.current]);
    const nextPos = (posRef.current + 1) % queueRef.current.length;
    setNext(queueRef.current[nextPos]);
    setTick((t) => t + 1);
  }, []);

  const requestAdvance = useCallback(() => {
    if (nextReadyRef.current) {
      commitAdvance();
      return;
    }
    pendingAdvanceRef.current = true;
    // Nudge preload in case the browser deferred it
    preloadRef.current?.load();
  }, [commitAdvance]);

  useEffect(() => {
    const queue = buildOpeningQueue();
    queueRef.current = queue;
    posRef.current = 0;
    setCurrent(queue[0]);
    setNext(queue[1]);
  }, []);

  useEffect(() => {
    nextReadyRef.current = false;
  }, [next?.src]);

  const onNextReady = useCallback(() => {
    nextReadyRef.current = true;
    if (pendingAdvanceRef.current) commitAdvance();
  }, [commitAdvance]);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(requestAdvance, intervalMs);
    return () => clearTimeout(id);
  }, [tick, requestAdvance, intervalMs, paused]);

  const pause = useCallback(() => {
    setPaused(true);
    videoRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    setPaused(false);
    videoRef.current?.play();
  }, []);

  return {
    current,
    nextSrc: next?.src ?? null,
    advance: requestAdvance,
    pause,
    resume,
    videoRef,
    preloadRef,
    onNextReady,
  };
}

function GoldDot() {
  return (
    <span className="px-1.5 text-[#D4AF63]" aria-hidden="true">
      ·
    </span>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M11 5 6 9H3v6h3l5 4V5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="m16 9 5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function useHomeMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [showMusicHint, setShowMusicHint] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const audio = new Audio(HOME_MUSIC);
    audio.loop = true;
    audio.preload = "auto";
    audio.muted = true;
    audio.volume = 1;
    audioRef.current = audio;
    // Muted autoplay is allowed in most browsers; unmute happens via the icon.
    void audio.play().then(() => {
      // Late play() settle after unmount must not keep audio alive.
      if (cancelled) {
        audio.pause();
        audio.src = "";
      }
    }).catch(() => {});
    return () => {
      cancelled = true;
      audio.pause();
      audio.muted = true;
      audio.removeAttribute("src");
      audio.src = "";
      audio.load();
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.muted) {
      audio.muted = false;
      setMuted(false);
      setShowMusicHint(false);
      void audio.play().catch(() => {});
    } else {
      audio.muted = true;
      setMuted(true);
    }
  }, []);

  const dismissMusicHint = useCallback(() => setShowMusicHint(false), []);

  return { muted, toggle, showMusicHint, dismissMusicHint };
}

export default function Home() {
  const { t } = useI18n();
  const {
    current: currentVideo,
    nextSrc,
    advance,
    pause,
    resume,
    videoRef,
    preloadRef,
    onNextReady,
  } = useRotatingVideo(8000);
  const {
    muted,
    toggle: toggleMusic,
    showMusicHint,
    dismissMusicHint,
  } = useHomeMusic();
  const activeSrcRef = useRef(currentVideo?.src ?? "");
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    homeHasAnimated = true;
  }, []);
  if (currentVideo) activeSrcRef.current = currentVideo.src;

  // Touch-only hold-to-pause (desktop mouse handlers removed — less confusing).
  // Skip interactive controls: preventDefault on touchstart cancels the later click on iOS/Android.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let holding = false;
    const onTouchStart = (e: TouchEvent) => {
      const target = e.target;
      if (target instanceof Element && target.closest("a, button")) return;
      e.preventDefault();
      holding = true;
      pause();
    };
    const onTouchEnd = () => {
      if (!holding) return;
      holding = false;
      resume();
    };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [pause, resume]);

  return (
    <section
      ref={sectionRef}
      className="hero-fullbleed relative overflow-hidden bg-[#0F3B2C] select-none"
      style={{ WebkitTouchCallout: "none", touchAction: "manipulation" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {nextSrc && (
        <video
          key={nextSrc}
          ref={(el) => {
            preloadRef.current = el;
          }}
          src={nextSrc}
          preload="auto"
          muted
          playsInline
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          onCanPlayThrough={onNextReady}
          onLoadedData={(e) => {
            // Fallback when canplaythrough never fires (some mobile browsers)
            if (e.currentTarget.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) onNextReady();
          }}
        />
      )}
      <AnimatePresence mode="popLayout">
        {currentVideo && (
          <motion.video
            key={currentVideo.src}
            ref={(el) => {
              if (el) videoRef.current = el;
            }}
            autoPlay
            muted
            playsInline
            preload="auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: currentVideo.objectPosition }}
            src={currentVideo.src}
            onEnded={(e) => {
              if (e.currentTarget.src.includes(activeSrcRef.current.split("?")[0])) advance();
            }}
          />
        )}
      </AnimatePresence>

      {/* Overall video-plane fade (~20%) — delete this node + .hero-video-fade in globals.css to revert */}
      <div aria-hidden="true" className="hero-video-fade" />

      {/* Top gradient only — darkens nav; title drop-shadow carries readability over bright video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(6,24,18,0.82)_0%,rgba(6,24,18,0.45)_9%,rgba(6,24,18,0)_18%,rgba(6,24,18,0)_100%)] max-md:bg-[linear-gradient(to_bottom,rgba(6,24,18,0.8)_0%,rgba(6,24,18,0.4)_10%,rgba(6,24,18,0)_18%,rgba(6,24,18,0)_100%)]"
      />

      {/* Title + wedding line + RSVP — centered.
          Opacity-only entrance (no y) + reserved title min-height keep RSVP from jumping on font swap. */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-5 text-center">
        <motion.h1
          initial={homeHasAnimated ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.5 }}
          className={`hero-title m-0 -mb-[0.2em] w-full max-w-[min(100%,56rem)] text-white ${heroTitleFont.className}`}
        >
          <span className="hero-title-row">
            Rosa
            <span className="hero-amp">&amp;</span>
            Riccardo
          </span>
        </motion.h1>

        <motion.p
          initial={homeHasAnimated ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className={`hero-wedding-line ${forum.className}`}
        >
          {t.home.wedding}
          <GoldDot />
          {t.home.dateShort}
          <GoldDot />
          {t.home.city}
        </motion.p>

        <motion.a
          href={RSVP_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={homeHasAnimated ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{
            opacity: { duration: 0.9, delay: 0.9 },
            scale: { duration: 0.2 },
          }}
          className={`cta-outline-pill hero-rsvp-pill inline-flex items-center justify-center uppercase ${forum.className}`}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {t.nav.rsvp}
        </motion.a>
      </div>

      {/* Place name + sound — bottom right */}
      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2.5 pb-[env(safe-area-inset-bottom)] sm:bottom-10 sm:right-[4.5rem]">
        <AnimatePresence mode="wait">
          {currentVideo && (
            <motion.p
              key={currentVideo.location}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="font-sans text-[12px] font-medium tracking-[0.14em] text-white"
            >
              {currentVideo.location}
            </motion.p>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={toggleMusic}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onAnimationEnd={dismissMusicHint}
          aria-label={muted ? t.home.unmuteMusic : t.home.muteMusic}
          aria-pressed={!muted}
          className={`flex h-8 w-8 shrink-0 items-center justify-center text-white/80 transition-colors hover:text-[#E3C78A] ${
            muted && showMusicHint ? "sound-hint-once" : ""
          }`}
        >
          <SoundIcon muted={muted} />
        </button>
      </div>
    </section>
  );
}
