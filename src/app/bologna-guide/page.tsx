"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/AnimatedSection";
import { useI18n } from "@/lib/i18n/context";

export default function BolognaGuide() {
  const { t } = useI18n();
  const categoryKeys = Object.keys(t.bolognaGuide.categories);
  const recommendations = t.bolognaGuide.recommendations;
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(t.bolognaGuide.categories)[0] ?? ""
  );

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-deep px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-deep via-charcoal/90 to-deep" />
        <div className="relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-gold"
          >
            {t.bolognaGuide.aCuratedGuide}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 font-serif text-5xl font-light tracking-wide text-white sm:text-6xl md:text-7xl"
          >
            {t.bolognaGuide.bologna}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mx-auto mt-6 h-px w-16 bg-gold"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mx-auto mt-6 max-w-md font-sans text-sm font-light leading-relaxed text-white/60"
          >
            {t.bolognaGuide.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ─── Category Navigation ─── */}
      <section className="sticky top-[72px] z-30 border-b border-divider bg-ivory/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl overflow-x-auto px-6">
          <div className="flex gap-1 py-3">
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-sm px-4 py-2 font-sans text-[11px] font-medium uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-charcoal text-white"
                    : "text-warm-gray hover:bg-charcoal/5 hover:text-charcoal"
                }`}
              >
                {t.bolognaGuide.categories[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recommendations ─── */}
      <section className="bg-ivory px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-serif text-4xl font-light tracking-wide text-charcoal sm:text-5xl">
                {t.bolognaGuide.categories[activeCategory]}
              </h2>
              <div className="mt-4 h-px w-12 bg-gold/40" />

              <div className="mt-10 space-y-6">
                {(recommendations[activeCategory] ?? []).map((rec, i) => (
                  <motion.div
                    key={rec.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className={`group border bg-white p-6 transition-all duration-300 hover:shadow-md sm:p-8 ${
                      rec.highlight
                        ? "border-gold/40 ring-1 ring-gold/10"
                        : "border-divider"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-serif text-2xl font-light tracking-wide text-charcoal transition-colors duration-300 group-hover:text-gold">
                        {rec.name}
                      </h3>
                      {rec.tag && (
                        <span className="rounded-sm bg-gold/10 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                          {rec.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 font-sans text-sm font-light leading-relaxed text-warm-gray">
                      {rec.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Closing Note ─── */}
      <section className="bg-white px-6 py-24 lg:px-12">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
              {t.bolognaGuide.fromUsToYou}
            </p>
            <h2 className="mt-4 font-serif text-3xl font-light tracking-wide text-charcoal sm:text-4xl">
              {t.bolognaGuide.makeItYourOwn}
            </h2>
            <div className="editorial-divider" />
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-warm-gray">
              {t.bolognaGuide.closingNote}
            </p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
