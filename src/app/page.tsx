"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const { t } = useI18n();
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover brightness-[0.85] saturate-[0.9]"
      >
        <source src="https://sj0vhlkvbrjeks9b.public.blob.vercel-storage.com/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-800/40 to-gray-900/50" />

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
          Wedding
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
