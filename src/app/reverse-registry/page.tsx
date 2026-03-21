"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedSection, FadeIn } from "@/components/AnimatedSection";
import { useI18n } from "@/lib/i18n/context";

export default function ReverseRegistry() {
  const { t } = useI18n();
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[70vh] items-center justify-center bg-deep px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-deep via-charcoal/90 to-deep" />
        <div className="relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-gold"
          >
            {t.reverseRegistry.reverseRegistry}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 font-serif text-5xl font-light tracking-wide text-white sm:text-6xl md:text-7xl"
          >
            {t.reverseRegistry.title}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mx-auto mt-8 h-px w-16 bg-gold"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mx-auto mt-8 max-w-lg font-sans text-sm font-light leading-relaxed text-white/70"
          >
            {t.reverseRegistry.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/reverse-registry/activities"
              className="inline-block border border-gold bg-gold/10 px-10 py-3.5 font-sans text-[11px] font-medium uppercase text-gold transition-all duration-300 hover:bg-gold hover:text-white"
            >
              {t.reverseRegistry.browseActivities}
            </Link>
            <Link
              href="/reverse-registry/feed"
              className="inline-block border border-white/20 px-10 py-3.5 font-sans text-[11px] font-medium uppercase text-white/70 transition-all duration-300 hover:border-white/40 hover:text-white"
            >
              {t.reverseRegistry.liveFeed}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="bg-ivory px-6 py-28 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="text-center">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
                {t.reverseRegistry.aDifferentKind}
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light tracking-wide text-charcoal sm:text-5xl">
                {t.reverseRegistry.howItWorks}
              </h2>
              <div className="editorial-divider" />
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {t.reverseRegistry.steps.map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.15}>
                <div className="border border-divider bg-white p-8 text-center transition-all duration-300 hover:shadow-md">
                  <span className="font-serif text-5xl font-light text-gold/30">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-light tracking-wide text-charcoal">
                    {item.title}
                  </h3>
                  <div className="mx-auto mt-3 h-px w-8 bg-gold/30" />
                  <p className="mt-4 font-sans text-sm font-light leading-relaxed text-warm-gray">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Preview ─── */}
      <section className="bg-white px-6 py-24 lg:px-12">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-serif text-3xl font-light italic leading-relaxed tracking-wide text-charcoal sm:text-4xl">
              {t.reverseRegistry.quote}
            </p>
            <div className="editorial-divider" />
            <Link
              href="/reverse-registry/activities"
              className="mt-6 inline-block font-sans text-xs font-medium uppercase text-gold transition-colors duration-300 hover:text-charcoal"
            >
              {t.reverseRegistry.exploreActivities}
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
