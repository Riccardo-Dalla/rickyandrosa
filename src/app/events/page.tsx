"use client";

import { motion } from "framer-motion";
import { AnimatedSection, FadeIn } from "@/components/AnimatedSection";
import { useI18n } from "@/lib/i18n/context";

const MOODBOARD_ASPECTS = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[2/3]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[5/6]",
  "aspect-[3/4]",
];

export default function Events() {
  const { t } = useI18n();
  const moodboardItems = t.events.moodboard.map((label, i) => ({
    aspect: MOODBOARD_ASPECTS[i],
    label,
  }));

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
            {t.events.theWeekend}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 font-serif text-5xl font-light tracking-wide text-white sm:text-6xl md:text-7xl"
          >
            {t.events.theCelebration}
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
            className="mt-6 font-sans text-sm font-light text-white/60"
          >
            {t.events.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ─── Events ─── */}
      <section className="bg-ivory px-6 py-28 lg:px-12">
        <div className="mx-auto max-w-4xl">
          {t.events.eventList.map((event, i) => (
            <AnimatedSection
              key={event.name}
              delay={i * 0.1}
              className="mb-20 last:mb-0"
            >
              <div className="border border-divider bg-white p-8 sm:p-12">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-gold">
                  {event.tag}
                </p>
                <h2 className="mt-3 font-serif text-4xl font-light tracking-wide text-charcoal sm:text-5xl">
                  {event.name}
                </h2>
                <div className="mt-6 h-px w-12 bg-gold/40" />

                <p className="mt-6 font-sans text-sm font-light leading-relaxed text-warm-gray">
                  {event.description}
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-warm-gray/60">
                      {t.events.date}
                    </p>
                    <p className="mt-1 font-serif text-lg text-charcoal">
                      {event.date}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-warm-gray/60">
                      {t.events.time}
                    </p>
                    <p className="mt-1 font-serif text-lg text-charcoal">
                      {event.time}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-warm-gray/60">
                      {t.events.venue}
                    </p>
                    <p className="mt-1 font-serif text-lg text-charcoal">
                      {event.venue}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-warm-gray/60">
                      {t.events.dressCode}
                    </p>
                    <p className="mt-1 font-serif text-lg text-charcoal">
                      {event.dresscode}
                    </p>
                  </div>
                </div>

                {/* Map placeholder — replace src with actual Google Maps embed URL */}
                <div className="mt-8 overflow-hidden rounded-sm border border-divider">
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-sage/10 to-ivory">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-8 w-8 text-warm-gray/30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="mt-2 font-sans text-xs text-warm-gray/40">
                        {event.address}
                      </p>
                      {/* <iframe src="GOOGLE_MAPS_EMBED_URL" width="100%" height="192" style={{border:0}} allowFullScreen loading="lazy" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ─── Dress Code Inspiration ─── */}
      <section className="bg-white px-6 py-28 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
                {t.events.whatToWear}
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light tracking-wide text-charcoal sm:text-5xl">
                {t.events.dressCodeInspiration}
              </h2>
              <div className="editorial-divider" />
              <p className="mx-auto mt-4 max-w-lg font-sans text-sm font-light leading-relaxed text-warm-gray">
                {t.events.dressCodeDescription}
              </p>
            </div>
          </FadeIn>

          {/* Moodboard grid */}
          <div className="mt-16 columns-2 gap-4 sm:columns-3 lg:columns-4">
            {moodboardItems.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="group mb-4 break-inside-avoid">
                  <div
                    className={`${item.aspect} relative overflow-hidden rounded-sm bg-gradient-to-br from-rose/20 via-divider to-sage/20`}
                  >
                    {/* Replace with real images: <Image src={item.image} fill className="object-cover" alt={item.label} /> */}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/40 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <p className="font-sans text-xs font-light text-white">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <FadeIn>
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-4 border border-divider px-8 py-4">
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-warm-gray">
                  {t.events.suggestedAttire}
                </span>
                <span className="h-4 w-px bg-divider" />
                <span className="font-serif text-lg text-charcoal">
                  {t.events.gardenFormal}
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
