"use client";

import { motion } from "framer-motion";
import { AnimatedSection, FadeIn } from "@/components/AnimatedSection";
import { useI18n } from "@/lib/i18n/context";

export default function OurStory() {
  const { t } = useI18n();
  const milestones = t.ourStory.milestones.map((m, i) => ({
    ...m,
    side: i % 2 === 0 ? ("left" as const) : ("right" as const),
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
            {t.ourStory.riccardoRosa}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 font-serif text-5xl font-light tracking-wide text-white sm:text-6xl md:text-7xl"
          >
            {t.ourStory.ourStory}
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
            className="mx-auto mt-6 max-w-md font-sans text-sm font-light text-white/60"
          >
            {t.ourStory.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ─── Timeline ─── */}
      <section className="bg-ivory px-6 py-28 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-divider md:left-1/2 md:-translate-x-px" />

            {milestones.map((milestone, i) => (
              <AnimatedSection
                key={milestone.year}
                delay={i * 0.1}
                className="relative mb-16 last:mb-0"
              >
                <div
                  className={`flex flex-col md:flex-row md:items-center ${
                    milestone.side === "right"
                      ? "md:flex-row-reverse"
                      : ""
                  }`}
                >
                  {/* Content */}
                  <div className="ml-12 md:ml-0 md:w-[calc(50%-2rem)]">
                    <div
                      className={`border border-divider bg-white p-6 transition-all duration-500 hover:shadow-md sm:p-8 ${
                        milestone.side === "right"
                          ? "md:ml-auto md:mr-0"
                          : ""
                      }`}
                    >
                      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-gold">
                        {milestone.year}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl font-light tracking-wide text-charcoal sm:text-3xl">
                        {milestone.title}
                      </h3>
                      <div className="mt-4 h-px w-8 bg-gold/30" />
                      <p className="mt-4 font-sans text-sm font-light leading-relaxed text-warm-gray">
                        {milestone.description}
                      </p>

                      {/* Image placeholder */}
                      <div className="mt-6 aspect-[16/10] overflow-hidden rounded-sm bg-gradient-to-br from-rose/10 via-divider/50 to-sage/10">
                        {/* Replace with: <Image src={`/story/${milestone.year}.jpg`} fill className="object-cover" alt={milestone.title} /> */}
                        <div className="flex h-full items-center justify-center">
                          <span className="font-serif text-2xl text-divider">
                            {milestone.year}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-ivory"
                    >
                      <div className="h-2 w-2 rounded-full bg-gold" />
                    </motion.div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Closing ─── */}
      <section className="bg-white px-6 py-24 lg:px-12">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-serif text-3xl font-light italic leading-relaxed tracking-wide text-charcoal sm:text-4xl">
              {t.ourStory.quote}
            </p>
            <p className="mt-6 font-sans text-xs uppercase tracking-[0.3em] text-warm-gray">
              {t.ourStory.quoteAuthor}
            </p>
            <div className="editorial-divider" />
          </div>
        </FadeIn>
      </section>
    </>
  );
}
