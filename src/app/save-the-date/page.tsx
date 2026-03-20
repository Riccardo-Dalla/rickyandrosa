"use client";

import { useState, useEffect, useRef } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { useI18n } from "@/lib/i18n/context";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { GuestInfoForm } from "@/components/GuestInfoForm";

const inter = Inter({
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
});

function useCountdown(targetMs: number) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = targetMs - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return timeLeft;
}

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-5xl font-light tracking-wide text-white sm:text-6xl md:text-7xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 font-serif text-[11px] font-medium uppercase tracking-[0.35em] text-white/40 sm:text-[9px]">
        {label}
      </span>
    </div>
  );
}

const GOOGLE_CAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=Rosa+%26+Riccardo%27s+Wedding+%F0%9F%92%8D%F0%9F%92%95" +
  "&dates=20270619T140000Z/20270620T000000Z" +
  "&location=Bologna%2C+Italy" +
  "&details=Rosa+%26+Riccardo%27s+Wedding+%F0%9F%92%8D%F0%9F%92%95" +
  "&ctz=Europe/Rome";

const ICS_DATA =
  "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\n" +
  "DTSTART;TZID=Europe/Rome:20270619T160000\r\n" +
  "DTEND;TZID=Europe/Rome:20270620T020000\r\n" +
  "SUMMARY:Rosa & Riccardo's Wedding 💍💕\r\nLOCATION:Bologna, Italy\r\n" +
  "DESCRIPTION:Rosa & Riccardo's Wedding 💍💕\r\n" +
  "END:VEVENT\r\nEND:VCALENDAR";

function CalendarButton() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const downloadICS = () => {
    const a = document.createElement("a");
    a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ICS_DATA);
    a.download = "rr-wedding.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative mt-8 inline-block">
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-2.5 font-sans text-[10px] font-semibold tracking-[0.3em] text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:text-gold"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {t.saveTheDate.addToCalendar}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 flex flex-col gap-2 whitespace-nowrap"
          >
            <a
              href={GOOGLE_CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-deep/90 px-5 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition-colors hover:border-gold/50 hover:text-gold"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              {t.saveTheDate.googleCalendar}
            </a>
            <button
              onClick={downloadICS}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-deep/90 px-5 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition-colors hover:border-gold/50 hover:text-gold"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
              {t.saveTheDate.appleCalendar}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 20"
      className={`h-5 w-40 text-gold/40 ${className}`}
      fill="none"
    >
      <path
        d="M0 10 C30 10, 40 2, 60 2 S90 10, 100 10 S120 2, 140 2 S170 10, 200 10"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <circle cx="100" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

/* ─── Full-Screen Envelope Video ─── */
function Envelope({ onOpen }: { onOpen: (bgAudio: HTMLAudioElement) => void }) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"sealed" | "playing" | "fading" | "done">("sealed");
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

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
    const bgAudio = new Audio("https://sj0vhlkvbrjeks9b.public.blob.vercel-storage.com/save-the-date.mp3");
    bgAudio.preload = "auto";
    bgAudio.currentTime = 11;
    bgAudio.volume = 1.0;
    bgAudio.loop = true;
    bgAudio.play().catch(() => { });
    bgAudioRef.current = bgAudio;

    const startFade = () => {
      setPhase("fading");
      setTimeout(() => {
        setPhase("done");
        if (bgAudioRef.current) {
          onOpen(bgAudioRef.current);
        } else {
          onOpen(bgAudio);
        }
      }, 1000);
    };

    const checkTime = () => {
      if (!video) return;
      if (video.duration - video.currentTime <= 2) {
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
      transition={{ duration: 0.6 }}
      className="fixed inset-0 overflow-hidden bg-black"
    >
      <motion.div
        className="absolute inset-0 z-[1] cursor-pointer"
        onClick={handleOpen}
      >
        <video
          ref={videoRef}
          src="https://sj0vhlkvbrjeks9b.public.blob.vercel-storage.com/envelope.mp4"
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
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="font-sans text-sm uppercase tracking-[0.3em] text-white/45 sm:text-sm"
        >
          {t.saveTheDate.tapSeal}
        </motion.p>
      </motion.div>

      {/* Fade to white after video ends */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase === "fading" || phase === "done" ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-30 pointer-events-none bg-white"
      />
    </motion.div>
  );
}

function SaveTheDateContent({ bgAudio }: { bgAudio: HTMLAudioElement | null }) {
  const { t } = useI18n();
  const countdown = useCountdown(new Date("2027-06-19T16:00:00").getTime());

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
  const [guestSubmitted, setGuestSubmitted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("rr-guest-submitted") === "true";
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 80]);

  return (
    <>
      <section ref={heroRef} className="relative flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="absolute inset-0"
        >
          <img
            src="/save-the-date-bg.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep/70 via-deep/40 to-deep/70" />
          <div className="std-grain absolute inset-0 opacity-[0.03]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className={`${inter.className} text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 sm:text-xs`}
          >
            {t.saveTheDate.saveTheDate}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 flex justify-center"
          >
            <img
              src="/rr-logo.png"
              alt="Riccardo & Rosa"
              className="w-[208px] opacity-90 sm:w-[288px] md:w-[368px] lg:w-[416px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.25 }}
            className="mt-3 text-center"
          >
            <p
              className={`${playfair.className} text-4xl font-light tracking-[0.08em] text-white/95 sm:text-5xl md:text-6xl lg:text-7xl leading-tight`}
            >
              {t.saveTheDate.date}
            </p>
            <p
              className={`${inter.className} mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60 sm:text-xs`}
            >
              {t.saveTheDate.location}
            </p>
            <CalendarButton />
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.75, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="font-serif text-[10px] uppercase tracking-[0.4em] text-white/25 sm:text-[8px]">
              {t.saveTheDate.scroll}
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-white/25 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Guest Details + Countdown ─── */}
      <section className="relative px-6 py-28 sm:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a3d2e] via-[#1e3025] to-deep" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <Flourish className="mx-auto mb-10 opacity-40" />
            <p className="font-serif text-lg font-medium uppercase tracking-[0.5em] text-gold/70 sm:text-lg">
              {t.guestForm.title}
            </p>
            <p className="mx-auto mt-6 max-w-md font-serif text-lg font-light italic text-white/45 sm:text-lg">
              {t.guestForm.subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mt-14">
              <GuestInfoForm onSubmitted={() => setGuestSubmitted(true)} />
            </div>
          </ScrollReveal>

          <AnimatePresence>
            {guestSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-20"
              >
                <div className="mx-auto mb-10 h-px w-20 bg-gold/20" />

                <p className="font-serif text-xs font-medium uppercase tracking-[0.5em] text-gold/60 sm:text-[10px]">
                  {t.saveTheDate.countingDown}
                </p>

                <div className="mt-12 flex items-center justify-center gap-6 sm:gap-10 md:gap-14">
                  <CountdownUnit value={countdown.days} label={t.saveTheDate.days} />
                  <span className="mt-[-20px] font-serif text-3xl font-light text-white/15">:</span>
                  <CountdownUnit value={countdown.hours} label={t.saveTheDate.hours} />
                  <span className="mt-[-20px] font-serif text-3xl font-light text-white/15">:</span>
                  <CountdownUnit value={countdown.minutes} label={t.saveTheDate.minutes} />
                  <span className="mt-[-20px] font-serif text-3xl font-light text-white/15 hidden sm:block">:</span>
                  <div className="hidden sm:block">
                    <CountdownUnit value={countdown.seconds} label={t.saveTheDate.seconds} />
                  </div>
                </div>

                <p className="mt-14 font-serif text-xl font-light italic tracking-wide text-white/35 sm:text-lg">
                  {t.saveTheDate.untilCelebrate}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

export default function SaveTheDate() {
  const [isOpened, setIsOpened] = useState(false);
  const [bgAudio, setBgAudio] = useState<HTMLAudioElement | null>(null);

  return (
    <div className="std-page bg-deep">
      <AnimatePresence mode="wait">
        {!isOpened && (
          <motion.section
            key="envelope"
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <Envelope onOpen={(audio) => { setBgAudio(audio); setIsOpened(true); }} />
          </motion.section>
        )}
      </AnimatePresence>

      {isOpened && <SaveTheDateContent bgAudio={bgAudio} />}
    </div>
  );
}
