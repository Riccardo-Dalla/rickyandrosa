"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, FadeIn } from "@/components/AnimatedSection";
import { useI18n } from "@/lib/i18n/context";
import type { Translations } from "@/lib/i18n/en";

type ActivityItem = Translations["activities"]["activityList"][number];

interface CommitModalProps {
  activity: (ActivityItem & { id: string }) | null;
  onClose: () => void;
  t: Translations["activities"];
}

function CommitModal({ activity, onClose, t }: CommitModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!activity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/commitments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          activityId: activity.id,
          activityName: activity.name,
          costRange: activity.costRange,
          isPrivate,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError(t.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md border border-divider bg-white p-8 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {!submitted ? (
          <>
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-gold">
              {t.commitTo}
            </p>
            <h3 className="mt-2 font-serif text-3xl font-light tracking-wide text-charcoal">
              {activity.name}
            </h3>
            <div className="mt-3 h-px w-8 bg-gold/30" />
            <p className="mt-4 font-sans text-sm font-light text-warm-gray">
              {activity.costRange}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-warm-gray/60">
                  {t.yourName}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border-b border-divider bg-transparent py-2 font-sans text-sm text-charcoal outline-none transition-colors focus:border-gold"
                  placeholder={t.placeholders.name}
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-warm-gray/60">
                  {t.email}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full border-b border-divider bg-transparent py-2 font-sans text-sm text-charcoal outline-none transition-colors focus:border-gold"
                  placeholder={t.placeholders.email}
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-gold"
                />
                <span className="select-none">
                  <span className="font-sans text-sm font-light text-charcoal">
                    {t.keepPrivate}
                  </span>
                  <span className="mt-0.5 block font-sans text-[11px] font-light text-warm-gray/60">
                    {t.privateHint}
                  </span>
                </span>
              </label>

              {error && (
                <p className="text-xs text-rose">{error}</p>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-charcoal py-3 font-sans text-[11px] font-medium uppercase text-white transition-colors duration-300 hover:bg-gold disabled:opacity-50"
                >
                  {submitting ? t.submitting : t.iCommit}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-divider px-6 py-3 font-sans text-[11px] font-medium uppercase text-warm-gray transition-colors duration-300 hover:border-charcoal hover:text-charcoal"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-8 text-center">
            <span className="text-4xl">✨</span>
            <h3 className="mt-4 font-serif text-2xl font-light tracking-wide text-charcoal">
              {t.committed}
            </h3>
            <p className="mt-3 font-sans text-sm font-light text-warm-gray">
              {t.committedMessage}
            </p>
            <button
              onClick={onClose}
              className="mt-8 border border-divider px-8 py-3 font-sans text-[11px] font-medium uppercase text-charcoal transition-colors duration-300 hover:bg-charcoal hover:text-white"
            >
              {t.close}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Activities() {
  const { t } = useI18n();
  const activities = t.activities.activityList;
  const [selectedActivity, setSelectedActivity] = useState<
    (ActivityItem & { id: string }) | null
  >(null);
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customCost, setCustomCost] = useState("");

  return (
    <>
      {/* ─── Header ─── */}
      <section className="bg-deep px-6 pb-16 pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-gold"
          >
            {t.activities.reverseRegistry}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-4 font-serif text-4xl font-light tracking-wide text-white sm:text-5xl"
          >
            {t.activities.chooseYourAdventure}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mx-auto mt-6 h-px w-12 bg-gold"
          />
        </div>
      </section>

      {/* ─── Activities Grid ─── */}
      <section className="bg-ivory px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity, i) => (
              <AnimatedSection key={activity.id} delay={i * 0.06}>
                <div className="group flex h-full flex-col border border-divider bg-white p-6 transition-all duration-300 hover:border-gold/30 hover:shadow-md sm:p-8">
                  <span className="text-3xl">{activity.icon}</span>
                  <h3 className="mt-4 font-serif text-xl font-light tracking-wide text-charcoal transition-colors group-hover:text-gold">
                    {activity.name}
                  </h3>
                  <p className="mt-2 flex-1 font-sans text-sm font-light leading-relaxed text-warm-gray">
                    {activity.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-sans text-xs font-light text-warm-gray/60">
                      {activity.costRange}
                    </span>
                    <button
                      onClick={() => setSelectedActivity(activity)}
                      className="font-sans text-[10px] font-medium uppercase text-gold transition-colors hover:text-charcoal"
                    >
                      {t.activities.commit}
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* ─── Custom Activity ─── */}
          <AnimatedSection delay={0.3} className="mt-16">
            <div className="border border-dashed border-gold/30 bg-white p-8 sm:p-10">
              <FadeIn>
                <div className="text-center">
                  <p className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
                    {t.activities.yourIdea}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-light tracking-wide text-charcoal sm:text-3xl">
                    {t.activities.addCustomActivity}
                  </h3>
                  <p className="mt-3 font-sans text-sm font-light text-warm-gray">
                    {t.activities.addCustomDescription}
                  </p>
                </div>
              </FadeIn>

              <div className="mx-auto mt-8 max-w-md space-y-4">
                <div>
                  <label className="block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-warm-gray/60">
                    {t.activities.activityName}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="mt-1 w-full border-b border-divider bg-transparent py-2 font-sans text-sm text-charcoal outline-none transition-colors focus:border-gold"
                    placeholder={t.activities.placeholders.activityName}
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-warm-gray/60">
                    {t.activities.description}
                  </label>
                  <textarea
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    className="mt-1 w-full resize-none border-b border-divider bg-transparent py-2 font-sans text-sm text-charcoal outline-none transition-colors focus:border-gold"
                    rows={2}
                    placeholder={t.activities.placeholders.description}
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-warm-gray/60">
                    {t.activities.estimatedCost}
                  </label>
                  <input
                    type="text"
                    value={customCost}
                    onChange={(e) => setCustomCost(e.target.value)}
                    className="mt-1 w-full border-b border-divider bg-transparent py-2 font-sans text-sm text-charcoal outline-none transition-colors focus:border-gold"
                    placeholder={t.activities.placeholders.cost}
                  />
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (customName) {
                        setSelectedActivity({
                          id: `custom-${Date.now()}`,
                          name: customName,
                          description: customDesc,
                          costRange: customCost || "Varies",
                          icon: "✨",
                        });
                      }
                    }}
                    className="w-full bg-charcoal py-3 font-sans text-[11px] font-medium uppercase text-white transition-colors duration-300 hover:bg-gold"
                  >
                    {t.activities.commitToThis}
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Commit Modal ─── */}
      <AnimatePresence>
        {selectedActivity && (
          <CommitModal
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
            t={t.activities}
          />
        )}
      </AnimatePresence>
    </>
  );
}
