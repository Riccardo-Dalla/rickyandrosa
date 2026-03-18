"use client";

import { motion } from "framer-motion";
import { RRLogo } from "@/components/RRLogo";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const { t } = useI18n();
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Video background — drop your video at public/hero-video.mp4 */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 via-gray-800/30 to-gray-800/50" />

      <div className="relative z-10 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-8xl sm:text-9xl md:text-[10rem]"
        >
          <RRLogo />
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mx-auto mt-8 h-px w-20 bg-gold"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-8 font-sans text-xs font-light uppercase tracking-[0.35em] text-white/80"
        >
          {t.home.summerBologna}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-4 font-serif text-lg font-light italic tracking-wide text-white/60"
        >
          {t.home.detailsToCome}
        </motion.p>
      </div>
    </section>
  );
}
