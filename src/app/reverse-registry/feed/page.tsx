"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/AnimatedSection";
import { useI18n } from "@/lib/i18n/context";

interface Commitment {
  id: string;
  name: string;
  email: string;
  activityId: string;
  activityName: string;
  costRange: string;
  message?: string;
  completed: boolean;
  createdAt: string;
}

function timeAgo(
  dateStr: string,
  ta: { justNow: string; mAgo: string; hAgo: string; dAgo: string; moAgo: string }
): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return ta.justNow;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}${ta.mAgo}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}${ta.hAgo}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}${ta.dAgo}`;
  const months = Math.floor(days / 30);
  return `${months}${ta.moAgo}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const BUBBLE_COLORS = [
  "from-gold/20 to-gold/5",
  "from-sage/25 to-sage/8",
  "from-rose/20 to-rose/5",
  "from-[#b8cce0]/25 to-[#b8cce0]/8",
  "from-[#e0c8a8]/25 to-[#e0c8a8]/8",
  "from-[#c5b5d4]/20 to-[#c5b5d4]/5",
];

function Bubble({
  commitment,
  index,
  activityIcon,
  onSelect,
  timeAgoText,
}: {
  commitment: Commitment;
  index: number;
  activityIcon: string;
  onSelect: () => void;
  timeAgoText: string;
}) {
  const colorClass = BUBBLE_COLORS[index % BUBBLE_COLORS.length];

  const floatDuration = 4 + (index % 3) * 1.5;
  const floatDelay = index * 0.4;
  const xDrift = index % 2 === 0 ? 6 : -6;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      <motion.button
        onClick={onSelect}
        animate={{
          y: [0, -10, 0, -6, 0],
          x: [0, xDrift, 0, -xDrift * 0.5, 0],
        }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className={`group relative flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br ${colorClass} border border-white/60 px-5 py-5 shadow-md backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl sm:px-6 sm:py-6`}
      >
        {/* Activity icon or initials */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-2xl shadow-inner sm:h-16 sm:w-16 sm:text-3xl">
          {activityIcon || (
            <span className="font-serif text-base font-semibold text-gold">
              {getInitials(commitment.name)}
            </span>
          )}
        </div>

        {/* Activity name */}
        <p className="max-w-[140px] text-center font-serif text-sm font-medium leading-snug tracking-wide text-charcoal sm:max-w-[160px] sm:text-base">
          {commitment.activityName}
        </p>

        {/* Person name + time */}
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[10px] font-medium text-warm-gray sm:text-[11px]">
            {commitment.name}
          </span>
          <span className="text-warm-gray/30">·</span>
          <span className="font-sans text-[9px] text-warm-gray/50 sm:text-[10px]">
            {timeAgoText}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}

function BubbleDetail({
  commitment,
  activityIcon,
  timeAgoText,
  onClose,
  commitLabel,
}: {
  commitment: Commitment;
  activityIcon: string;
  timeAgoText: string;
  onClose: () => void;
  commitLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-warm-gray/40 transition-colors hover:bg-ivory hover:text-charcoal"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold/15 to-gold/5 text-4xl shadow-inner">
            {activityIcon || (
              <span className="font-serif text-2xl font-semibold text-gold">
                {getInitials(commitment.name)}
              </span>
            )}
          </div>

          <h3 className="mt-5 font-serif text-2xl font-light tracking-wide text-charcoal">
            {commitment.activityName}
          </h3>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5">
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-gold">
              {commitLabel}
            </span>
          </div>

          <div className="mt-6 w-full space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-divider pb-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-warm-gray/50">
                Person
              </span>
              <span className="font-sans text-sm font-medium text-charcoal">
                {commitment.name}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-divider pb-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-warm-gray/50">
                Budget
              </span>
              <span className="font-sans text-sm text-charcoal">
                {commitment.costRange}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-warm-gray/50">
                When
              </span>
              <span className="font-sans text-sm text-charcoal">
                {timeAgoText}
              </span>
            </div>
          </div>

          {commitment.message && (
            <p className="mt-5 rounded-lg bg-ivory px-4 py-3 font-sans text-sm font-light italic leading-relaxed text-warm-gray">
              &ldquo;{commitment.message}&rdquo;
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Feed() {
  const { t } = useI18n();
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Commitment | null>(null);

  useEffect(() => {
    fetch("/api/commitments")
      .then((res) => res.json())
      .then((data) => setCommitments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activityIconMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of t.activities.activityList) {
      map[a.id] = a.icon;
    }
    return map;
  }, [t.activities.activityList]);

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
            {t.feed.liveFeed}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-4 font-serif text-4xl font-light tracking-wide text-white sm:text-5xl"
          >
            {t.feed.guestAdventures}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mx-auto mt-6 h-px w-12 bg-gold"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6 font-sans text-sm font-light text-white/60"
          >
            {t.feed.seeWhat}
          </motion.p>
        </div>
      </section>

      {/* ─── Floating Bubbles Feed ─── */}
      <section className="relative min-h-[60vh] bg-gradient-to-b from-ivory via-white to-ivory px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <div className="py-20 text-center">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="font-sans text-sm text-warm-gray/60"
              >
                {t.feed.loading}
              </motion.div>
            </div>
          ) : commitments.length === 0 ? (
            <FadeIn>
              <div className="border border-dashed border-divider bg-white p-12 text-center rounded-2xl">
                <span className="text-4xl">🌟</span>
                <h3 className="mt-4 font-serif text-2xl font-light tracking-wide text-charcoal">
                  {t.feed.noAdventures}
                </h3>
                <p className="mt-3 font-sans text-sm font-light text-warm-gray">
                  {t.feed.beFirst}
                </p>
                <a
                  href="/reverse-registry/activities"
                  className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3 font-sans text-[11px] font-medium uppercase text-white transition-colors duration-300 hover:bg-gold"
                >
                  {t.feed.browseActivities}
                </a>
              </div>
            </FadeIn>
          ) : (
            <div className="flex flex-wrap items-start justify-center gap-5 sm:gap-6 md:gap-8">
              {commitments.map((item, i) => (
                <Bubble
                  key={item.id}
                  commitment={item}
                  index={i}
                  activityIcon={activityIconMap[item.activityId] || ""}
                  onSelect={() => setSelected(item)}
                  timeAgoText={timeAgo(item.createdAt, t.feed.timeAgo)}
                />
              ))}
            </div>
          )}

          {/* Share CTA */}
          <FadeIn>
            <div className="mt-20 rounded-2xl border border-dashed border-gold/30 bg-white p-8 text-center">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
                {t.feed.completedActivity}
              </p>
              <h3 className="mt-3 font-serif text-2xl font-light tracking-wide text-charcoal">
                {t.feed.shareExperience}
              </h3>
              <p className="mt-3 font-sans text-sm font-light text-warm-gray">
                {t.feed.shareDescription}
              </p>
              <button className="mt-6 rounded-full bg-charcoal px-8 py-3 font-sans text-[11px] font-medium uppercase text-white transition-colors duration-300 hover:bg-gold">
                {t.feed.uploadPhoto}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Detail Modal ─── */}
      <AnimatePresence>
        {selected && (
          <BubbleDetail
            commitment={selected}
            activityIcon={activityIconMap[selected.activityId] || ""}
            timeAgoText={timeAgo(selected.createdAt, t.feed.timeAgo)}
            onClose={() => setSelected(null)}
            commitLabel={t.feed.committed}
          />
        )}
      </AnimatePresence>
    </>
  );
}
