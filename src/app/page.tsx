"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

const MEDIA_BASE = "https://media.rickyandrosa.com";

interface HeroVideo {
  src: string;
  objectPosition?: string;
}

const HERO_VIDEOS: HeroVideo[] = [
  { src: `${MEDIA_BASE}/hero-videos/GH010038_1732759039324.mp4` },
  { src: `${MEDIA_BASE}/hero-videos/GH010071_1732989066470.mp4` },
  { src: `${MEDIA_BASE}/hero-videos/GH010273_1773562971855.mp4` },
  { src: `${MEDIA_BASE}/hero-videos/GH010312_1773563884273.mp4`, objectPosition: "35% 50%" },
  { src: `${MEDIA_BASE}/hero-videos/Norway00001890.mp4`, objectPosition: "30% 70%" },
  { src: `${MEDIA_BASE}/hero-videos/Norway00010415.mp4` },
  { src: `${MEDIA_BASE}/hero-videos/Norway00010920.mp4`, objectPosition: "30% 65%" },
  { src: `${MEDIA_BASE}/hero-videos/Zion00007503.mp4`, objectPosition: "40% 55%" },
  { src: `${MEDIA_BASE}/hero-videos/Zion00008579.mp4`, objectPosition: "40% 60%" },
  { src: `${MEDIA_BASE}/hero-videos/Zion00015383.mp4` },
  { src: `${MEDIA_BASE}/hero-videos/CostaRica00023976.mp4`, objectPosition: "25% 70%" },
  { src: `${MEDIA_BASE}/hero-videos/Zion00001567.mp4` },
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
  const queueRef = useRef<HeroVideo[]>(HERO_VIDEOS);
  const posRef = useRef(0);
  const [current, setCurrent] = useState(HERO_VIDEOS[0]);
  const [next, setNext] = useState(HERO_VIDEOS[1]);
  const [tick, setTick] = useState(0);

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
    const id = setTimeout(advance, intervalMs);
    return () => clearTimeout(id);
  }, [tick, advance, intervalMs]);

  return { current, nextSrc: next.src, advance };
}

export default function Home() {
  const { t } = useI18n();
  const { current: currentVideo, nextSrc, advance } = useRotatingVideo(8000);
  const activeSrcRef = useRef(currentVideo.src);
  activeSrcRef.current = currentVideo.src;

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <video
        key={nextSrc}
        src={nextSrc}
        preload="auto"
        muted
        className="hidden"
      />
      <AnimatePresence mode="popLayout">
        <motion.video
          key={currentVideo.src}
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
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-deep/70 via-deep/70 to-deep/70" />

      <div className="relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <h1
            className="text-6xl text-white sm:text-7xl md:text-8xl lg:text-9xl"
            style={{ fontFamily: "var(--font-monogram), cursive" }}
          >
            Rosa
          </h1>
          <span className="my-1 font-display text-2xl italic text-gold sm:text-3xl md:text-4xl">
            &
          </span>
          <h1
            className="text-6xl text-white sm:text-7xl md:text-8xl lg:text-9xl"
            style={{ fontFamily: "var(--font-monogram), cursive" }}
          >
            Riccardo
          </h1>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mx-auto mt-6 h-px w-full bg-gold"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-6 font-sans text-sm font-light uppercase tracking-[0.4em] text-white/90"
        >
          {t.home.wedding}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-6 font-sans text-xs font-light uppercase tracking-[0.35em] text-white/70"
        >
          {t.home.summerBologna}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
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
