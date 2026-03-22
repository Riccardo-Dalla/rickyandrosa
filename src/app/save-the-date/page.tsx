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
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    setVideoSrc(window.innerWidth < 640 ? ENVELOPE_MOBILE : ENVELOPE_DESKTOP);
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
          src={videoSrc || undefined}
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
      <section className="relative flex h-dvh min-h-dvh flex-col items-center overflow-hidden bg-deep">
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

        <div className="relative z-10 mt-16 flex justify-center sm:mt-20">
          <div
            className="w-[208px] aspect-[2/1] bg-gold opacity-90 sm:w-[288px] md:w-[368px] lg:w-[416px]"
            role="img"
            aria-label="Riccardo & Rosa"
            style={{
              WebkitMaskImage: "url(/rr-logo.png)",
              maskImage: "url(/rr-logo.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 -mt-[8vh]">
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

        <div className="relative z-10 mt-auto mb-6 flex items-center justify-center gap-4 px-6 sm:mb-8">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-3 font-sans text-[13px] font-semibold text-charcoal backdrop-blur-sm transition-all duration-300 hover:bg-gold/90"
          >
            <svg
              width="17"
              height="17"
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
    </>
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
