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
const ENVELOPE_FADE_AT = 3;      // seconds into video before fade starts
const ENVELOPE_FADE_DUR = 0.5;     // seconds the fade-out lasts

function Envelope({ onOpen }: { onOpen: (bgAudio: HTMLAudioElement) => void }) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"sealed" | "playing" | "fading" | "done">("sealed");
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const [videoSrc, setVideoSrc] = useState(ENVELOPE_DESKTOP);

  useEffect(() => {
    setVideoSrc(window.innerWidth < 640 ? ENVELOPE_MOBILE : ENVELOPE_DESKTOP);
  }, []);

  const handleOpen = () => {
    if (phase !== "sealed") return;
    const video = videoRef.current;
    if (!video) return;

    setPhase("playing");
    // Keep the video muted so only the main song is heard
    video.muted = true;
    video.volume = 0.0;
    video.play();

    // Start background music immediately on tap, at a clean point in the track
    const bgAudio = new Audio("https://media.rickyandrosa.com/save-the-date.mp3");
    bgAudio.preload = "auto";
    bgAudio.currentTime = 12.5;
    bgAudio.volume = 1.0;
    bgAudio.loop = true;
    bgAudio.play().catch(() => { });
    bgAudioRef.current = bgAudio;

    const startFade = () => {
      setPhase("fading");
      if (bgAudioRef.current) {
        onOpen(bgAudioRef.current);
      } else {
        onOpen(bgAudio);
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
      transition={{ duration: 2 }}
      layout={false}
      className="fixed inset-0 overflow-hidden bg-black"
    >
      <motion.div
        className="absolute inset-0 z-[1] cursor-pointer"
        onClick={handleOpen}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="h-full w-full select-none object-cover object-center"
        />
      </motion.div>

      {/* Tap hint — below the seal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "sealed" ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-[5%] left-0 right-0 z-[25] flex justify-center pointer-events-none"
      >
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="font-sans text-sm font-light uppercase tracking-[0.3em] text-white/70 sm:text-sm"
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
    <>
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
        >
          <img
            src="/save-the-date-bg.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-deep/40" />
          <div className="std-grain absolute inset-0 opacity-[0.03]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0 }}
          className="relative z-10 px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0 }}
            className="mt-6 flex justify-center sm:mt-10"
          >
            <img
              src="/rr-logo.png"
              alt="Riccardo & Rosa"
              className="w-[208px] opacity-90 sm:w-[288px] md:w-[368px] lg:w-[416px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0 }}
            className="mt-3 text-center"
          >
            <div className="mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl">
              <h2
                className={`${playfairDisplay.className} w-full text-xl font-normal leading-[1.35] tracking-[0.02em] text-white/90 sm:text-2xl md:text-3xl lg:text-4xl`}
              >
                {t.saveTheDate.date}
              </h2>
              <p
                className={`${inter.className} mx-auto mt-5 w-full max-w-xl text-center text-[0.9rem] font-normal leading-[1.4] text-white/[0.78] sm:mt-6 sm:text-[1.0125rem] md:max-w-2xl`}
              >
                {t.saveTheDate.heroBody}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setInviteOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-2.5 font-sans text-[10px] font-semibold text-charcoal backdrop-blur-sm transition-all duration-300 hover:bg-gold/90"
              >
                {/* Same stroke weight / size as WeddingCalendarButton icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                {t.saveTheDate.getFormalInvite}
              </motion.button>
              <WeddingCalendarButton />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Invite modal */}
      <AnimatePresence>
        {inviteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-10 sm:p-12 md:p-16 backdrop-blur-sm"
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
                className="absolute right-2 top-2 rounded-full border border-gold/30 bg-black/15 p-1 text-gold/90 transition-colors hover:border-gold/50 hover:bg-gold/10 sm:right-2.5 sm:top-2.5"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
              <GuestInfoForm variant="forestGold" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function SaveTheDate() {
  const [isOpened, setIsOpened] = useState(false);
  const [bgAudio, setBgAudio] = useState<HTMLAudioElement | null>(null);

  return (
    <div className="std-page relative bg-deep">
      <AnimatePresence mode="wait">
        {!isOpened && (
          <motion.section
            key="envelope"
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
