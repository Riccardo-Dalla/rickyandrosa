"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { pinyonScript, playfairDisplay } from "@/lib/fonts";

let homeHasAnimated = false;

const MEDIA_BASE = "https://media.rickyandrosa.com";

interface HeroVideo {
  src: string;
  objectPosition?: string;
  location: string;
}

const HERO_VIDEOS: HeroVideo[] = [
  { src: `${MEDIA_BASE}/hero-videos/GH010038_1732759039324.mp4`, location: "La Fortuna, Costa Rica" },
  { src: `${MEDIA_BASE}/hero-videos/GH010071_1732989066470.mp4`, location: "Tortuguero, Costa Rica" },
  { src: `${MEDIA_BASE}/hero-videos/GH010152_1773561192800.mp4`, location: "El Nido, Philippines" },
  { src: `${MEDIA_BASE}/hero-videos/GH010273_1773562971855.mp4`, location: "Kawasan Falls, Philippines" },
  { src: `${MEDIA_BASE}/hero-videos/GH010312_1773563884273.mp4`, objectPosition: "50% 50%", location: "Cebu, Philippines" },
  { src: `${MEDIA_BASE}/hero-videos/Norway00001890.mp4`, objectPosition: "15% 70%", location: "Senja, Norway" },
  { src: `${MEDIA_BASE}/hero-videos/Norway00010415.mp4`, location: "Senja, Norway" },
  { src: `${MEDIA_BASE}/hero-videos/Norway00010920.mp4`, objectPosition: "30% 65%", location: "Blåisvatnet, Norway" },
  { src: `${MEDIA_BASE}/hero-videos/Zion00007503.mp4`, objectPosition: "40% 55%", location: "Utah" },
  { src: `${MEDIA_BASE}/hero-videos/Zion00008579.mp4`, objectPosition: "40% 60%", location: "Utah" },
  { src: `${MEDIA_BASE}/hero-videos/Zion00015383.mp4`, location: "Utah" },
  { src: `${MEDIA_BASE}/hero-videos/CostaRica00023976.mp4`, objectPosition: "50% 70%", location: "Playa Cocles, Costa Rica" },
  { src: `${MEDIA_BASE}/hero-videos/Zion00001567.mp4`, location: "Utah" },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function useRotatingVideo(intervalMs = 8000) {
  const queueRef = useRef<HeroVideo[]>([]);
  const posRef = useRef(0);
  const [current, setCurrent] = useState<HeroVideo | null>(null);
  const [next, setNext] = useState<HeroVideo | null>(null);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const shuffled = shuffleArray(HERO_VIDEOS);
    queueRef.current = shuffled;
    posRef.current = 0;
    setCurrent(shuffled[0]);
    setNext(shuffled[1]);
  }, []);

  const advance = useCallback(() => {
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

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(advance, intervalMs);
    return () => clearTimeout(id);
  }, [tick, advance, intervalMs, paused]);

  const pause = useCallback(() => {
    setPaused(true);
    videoRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    setPaused(false);
    videoRef.current?.play();
  }, []);

  return { current, nextSrc: next?.src ?? null, advance, pause, resume, videoRef };
}

export default function Home() {
  const { t } = useI18n();
  const { current: currentVideo, nextSrc, advance, pause, resume, videoRef } = useRotatingVideo(8000);
  const activeSrcRef = useRef(currentVideo?.src ?? "");
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => { homeHasAnimated = true; }, []);
  if (currentVideo) activeSrcRef.current = currentVideo.src;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); pause(); };
    const onTouchEnd = () => resume();
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [pause, resume]);

  return (
    <section
      ref={sectionRef}
      className="hero-fullbleed relative flex items-center justify-center overflow-hidden bg-deep select-none"
      style={{ WebkitTouchCallout: "none", touchAction: "manipulation" }}
      onMouseDown={pause}
      onMouseUp={resume}
      onMouseLeave={resume}
      onContextMenu={(e) => e.preventDefault()}
    >
      {nextSrc && (
        <video
          key={nextSrc}
          src={nextSrc}
          preload="auto"
          muted
          className="hidden"
        />
      )}
      <AnimatePresence mode="popLayout">
        {currentVideo && (
          <motion.video
            key={currentVideo.src}
            ref={(el) => { if (el) videoRef.current = el; }}
            autoPlay
            muted
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: currentVideo.objectPosition }}
            src={currentVideo.src}
            onEnded={(e) => {
              if (e.currentTarget.src.includes(activeSrcRef.current)) advance();
            }}
          />
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-deep/70 via-deep/70 to-deep/70" />

      <AnimatePresence mode="wait">
        {currentVideo && (
          <motion.span
            key={currentVideo.location}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-4 right-4 z-10 pb-[env(safe-area-inset-bottom)] font-sans text-[10px] font-light tracking-[0.15em] text-white/50 sm:bottom-6 sm:right-6 sm:text-[11px]"
          >
            {currentVideo.location}
          </motion.span>
        )}
      </AnimatePresence>

      <div className="relative z-10 px-6 text-center">
        <motion.div
          initial={homeHasAnimated ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="flex flex-col items-center gap-0 [&_h1]:leading-[0.8]"
        >
          <h1
            className={`${pinyonScript.className} text-6xl font-normal text-white sm:text-7xl md:text-8xl lg:text-9xl`}
          >
            Rosa
          </h1>
          <span
            className={`${playfairDisplay.className} my-0 block text-[0.9rem] font-normal italic leading-none text-gold sm:text-[1.125rem] md:text-[1.35rem] lg:text-[1.8rem]`}
          >
            &
          </span>
          <h1
            className={`${pinyonScript.className} text-6xl font-normal text-white sm:text-7xl md:text-8xl lg:text-9xl`}
          >
            Riccardo
          </h1>
        </motion.div>

        <motion.div
          initial={homeHasAnimated ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mx-auto mt-6 h-px w-full bg-gold"
        />

        <motion.p
          initial={homeHasAnimated ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-6 font-sans text-sm font-light uppercase tracking-[0.4em] text-white/90"
        >
          {t.home.wedding}
        </motion.p>

        <motion.p
          initial={homeHasAnimated ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-6 font-sans text-xs font-light uppercase tracking-[0.35em] text-white/70"
        >
          {t.home.summerBologna}
        </motion.p>

        <motion.p
          initial={homeHasAnimated ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-4 font-serif text-lg font-light italic tracking-wide text-white/50"
        >
          {t.home.detailsToCome}
        </motion.p>
      </div>
    </section>
  );
}
