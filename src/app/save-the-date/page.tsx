"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { motion, AnimatePresence } from "framer-motion";
import { GuestInfoForm } from "@/components/GuestInfoForm";
import { WeddingCalendarButton } from "@/components/WeddingCalendarButton";
import { playfairDisplay, inter } from "@/lib/fonts";

/* ─── Full-Screen Envelope Video ─── */
const ENVELOPE_DESKTOP = "https://media.rickyandrosa.com/envelope.mp4";
const ENVELOPE_MOBILE = "https://media.rickyandrosa.com/envelope-mobile.mp4";
const ENVELOPE_FADE_AT = 3;       // seconds into video before fade starts
const ENVELOPE_FADE_DUR = 0.8;    // seconds the fade-out lasts
const MUSIC_FADE_IN_MS = 500;    // milliseconds for music to fade in
const MUSIC_SKIP_MS = 0;        // milliseconds to skip at start (hides stutter)

function Envelope({ onOpen }: { onOpen: (bgAudio: HTMLAudioElement) => void }) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"sealed" | "playing" | "fading" | "done">("sealed");
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    setVideoSrc(window.innerWidth < 640 ? ENVELOPE_MOBILE : ENVELOPE_DESKTOP);
  }, []);

  // Preload background music so it's ready when user clicks
  useEffect(() => {
    const bgAudio = new Audio("https://media.rickyandrosa.com/save-the-date.mp3");
    bgAudio.preload = "auto";
    bgAudio.volume = 0;
    bgAudio.loop = true;
    bgAudio.load();
    bgAudioRef.current = bgAudio;
    // No cleanup - audio continues after component unmounts (passed to parent)
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    const showFirstFrame = () => { video.currentTime = 0; };
    video.addEventListener("loadeddata", showFirstFrame, { once: true });
    return () => video.removeEventListener("loadeddata", showFirstFrame);
  }, [videoSrc]);

  const handleOpen = () => {
    if (phase !== "sealed") return;
    const video = videoRef.current;
    if (!video) return;

    setPhase("playing");
    // Keep the video muted so only the main song is heard
    video.muted = true;
    video.volume = 0.0;
    video.play();

    // Start background music (already preloaded)
    const bgAudio = bgAudioRef.current;
    if (bgAudio) {
      bgAudio.currentTime = 0;
      bgAudio.volume = 0;
      bgAudio.play().catch(() => { });

      // Skip first 50ms (stay silent), then fade in
      setTimeout(() => {
        const fadeSteps = 20;
        const fadeInterval = MUSIC_FADE_IN_MS / fadeSteps;
        const fadeIncrement = 1 / fadeSteps;
        const fadeIn = setInterval(() => {
          if (bgAudio.volume < 1 - fadeIncrement) {
            bgAudio.volume = Math.min(1, bgAudio.volume + fadeIncrement);
          } else {
            bgAudio.volume = 1;
            clearInterval(fadeIn);
          }
        }, fadeInterval);
      }, MUSIC_SKIP_MS);
    }

    const startFade = () => {
      setPhase("fading");
      if (bgAudioRef.current) {
        onOpen(bgAudioRef.current);
      }
      setTimeout(() => {
        setPhase("done");
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.src = "";
        }
      }, ENVELOPE_FADE_DUR * 1000);
    };

    const checkTime = () => {
      if (!video) return;
      if (video.currentTime >= ENVELOPE_FADE_AT) {
        startFade();
      } else {
        requestAnimationFrame(checkTime);
      }
    };

    requestAnimationFrame(checkTime);
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: ENVELOPE_FADE_DUR, ease: "easeInOut" }}
      layout={false}
      className="fixed inset-0 overflow-hidden bg-black"
    >
      <motion.div
        className="absolute inset-0 z-[1] cursor-pointer"
        onClick={handleOpen}
      >
        <video
          ref={videoRef}
          src={videoSrc || undefined}
          muted
          playsInline
          preload="auto"
          className="h-full w-full select-none object-cover object-center sepia-[0.15] saturate-[1.1] brightness-[1.02] sm:sepia-0 sm:saturate-100 sm:brightness-100"
        />
      </motion.div>

      {/* Tap hint — below the seal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "sealed" ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute left-0 right-0 bottom-8 z-[999] flex justify-center pointer-events-none sm:bottom-12 md:bottom-16"
      >
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="font-sans text-sm font-medium uppercase tracking-[0.3em] text-[#8B7355] drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)] sm:text-base"
        >
          {t.saveTheDate.tapSeal}
        </motion.p>
      </motion.div>

    </motion.div>
  );
}

function SaveTheDateContent({ bgAudio }: { bgAudio: HTMLAudioElement | null }) {
  const { t } = useI18n();
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    if (!bgAudio) return;

    const onVisibility = () => {
      if (document.hidden) {
        bgAudio.pause();
      } else {
        if (bgAudio.paused) {
          bgAudio.play().catch(() => { });
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [bgAudio]);

  useEffect(() => {
    if (!inviteOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInviteOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [inviteOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
    >
      <section className="relative flex h-dvh min-h-dvh flex-col items-center overflow-hidden bg-deep">
        <motion.div
          className="absolute inset-0"
        >
          <img
            src="/save-the-date-bg.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            style={{ objectPosition: "60% center" }}
          />
          <div className="absolute inset-0 bg-deep/40" />
          <div className="std-grain absolute inset-0 opacity-[0.03]" />
        </motion.div>

        <div className="relative z-10 mt-16 flex justify-center sm:mt-20">
          <img
            src="/rr-logo-gold.png"
            alt="Riccardo & Rosa"
            className="w-[208px] opacity-90 sm:w-[288px] md:w-[368px] lg:w-[416px]"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 -mt-[8vh]">
          <p
            className={`${playfairDisplay.className} mb-0 text-center text-xl font-normal tracking-[0.02em] text-white/90 sm:mb-0 sm:text-2xl md:text-3xl lg:text-4xl`}
          >
            {t.saveTheDate.heroBody}
          </p>
          <h2
            className={`${playfairDisplay.className} text-center text-5xl font-normal leading-[1.2] tracking-[0.02em] text-white/90 sm:text-6xl md:text-7xl lg:text-8xl`}
          >
            {t.saveTheDate.date}
          </h2>
          <p
            className={`${playfairDisplay.className} mt-3 text-center text-xl font-normal tracking-[0.02em] text-white/90 sm:mt-4 sm:text-2xl md:text-3xl lg:text-4xl`}
          >
            {t.saveTheDate.location}
          </p>
        </div>

        <div className="relative z-10 mt-auto mb-6 grid w-full grid-cols-2 gap-3 px-4 sm:mb-8 sm:flex sm:w-auto sm:gap-4 sm:px-6">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setInviteOpen(true)}
            className="flex flex-col items-center justify-center gap-1.5 rounded-full bg-gold px-5 py-3 font-sans text-[11px] font-semibold text-charcoal backdrop-blur-sm transition-all duration-300 hover:bg-gold/90 sm:flex-row sm:gap-3 sm:px-8 sm:text-[13px]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="sm:h-[17px] sm:w-[17px]"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="m22 6-10 7L2 6" />
            </svg>
            <span className="whitespace-nowrap">{t.saveTheDate.getFormalInvite}</span>
          </motion.button>
          <WeddingCalendarButton className="w-full sm:w-auto" />
        </div>
      </section>

      {/* Invite modal */}
      <AnimatePresence>
        {inviteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/55 p-6 sm:p-12 md:p-16 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setInviteOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md overflow-visible rounded-2xl bg-forest p-6 sm:p-8"
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setInviteOpen(false)}
                className="absolute -right-2 -top-2 rounded-full border border-gold/30 bg-forest p-1.5 text-gold/90 shadow-lg transition-colors hover:border-gold/50 hover:bg-gold/10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
              <GuestInfoForm variant="forestGold" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SaveTheDate() {
  const [isOpened, setIsOpened] = useState(false);
  const [bgAudio, setBgAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    document.body.style.backgroundColor = "#1A1614";
    return () => { document.body.style.backgroundColor = ""; };
  }, []);

  return (
    <div className="std-page relative min-h-dvh bg-deep">
      <AnimatePresence>
        {!isOpened && (
          <motion.section
            key="envelope"
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: ENVELOPE_FADE_DUR, ease: "easeInOut" }}
          >
            <Envelope onOpen={(audio) => { setBgAudio(audio); setIsOpened(true); }} />
          </motion.section>
        )}
      </AnimatePresence>

      {isOpened && <SaveTheDateContent bgAudio={bgAudio} />}
    </div>
  );
}
