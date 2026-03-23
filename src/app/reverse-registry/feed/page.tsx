"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
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
  photoUrl?: string;
  isPrivate: boolean;
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
  statusLabel,
  anonymousLabel,
}: {
  commitment: Commitment;
  index: number;
  activityIcon: string;
  onSelect: () => void;
  timeAgoText: string;
  statusLabel: string;
  anonymousLabel: string;
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
        {/* Activity icon, photo, or initials */}
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/80 text-2xl shadow-inner sm:h-16 sm:w-16 sm:text-3xl">
          {commitment.photoUrl ? (
            <Image
              src={commitment.photoUrl}
              alt={commitment.activityName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : activityIcon ? (
            activityIcon
          ) : (
            <span className="font-serif text-base font-semibold text-gold">
              {commitment.name ? getInitials(commitment.name) : "?"}
            </span>
          )}
        </div>

        {/* Activity name */}
        <p className="max-w-[140px] text-center font-serif text-sm font-medium leading-snug tracking-wide text-charcoal sm:max-w-[160px] sm:text-base">
          {commitment.activityName}
        </p>

        {/* Status tag */}
        <span className={`rounded-full px-2.5 py-0.5 font-sans text-[9px] font-medium uppercase tracking-wide ${commitment.completed ? "bg-sage/15 text-sage" : "bg-gold/10 text-gold"}`}>
          {statusLabel}
        </span>

        {/* Person name + time */}
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[10px] font-medium text-warm-gray sm:text-[11px]">
            {commitment.name || anonymousLabel}
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
  anonymousLabel,
}: {
  commitment: Commitment;
  activityIcon: string;
  timeAgoText: string;
  onClose: () => void;
  commitLabel: { committed: string; completed: string };
  anonymousLabel: string;
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
          {commitment.photoUrl ? (
            <div className="h-40 w-full overflow-hidden rounded-xl">
              <Image
                src={commitment.photoUrl}
                alt={commitment.activityName}
                width={400}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold/15 to-gold/5 text-4xl shadow-inner">
              {activityIcon || (
                <span className="font-serif text-2xl font-semibold text-gold">
                  {commitment.name ? getInitials(commitment.name) : "?"}
                </span>
              )}
            </div>
          )}

          <h3 className="mt-5 font-serif text-2xl font-light tracking-wide text-charcoal">
            {commitment.activityName}
          </h3>

          <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${commitment.completed ? "bg-sage/15" : "bg-gold/10"}`}>
            <span className={`font-sans text-[10px] font-medium uppercase tracking-[0.15em] ${commitment.completed ? "text-sage" : "text-gold"}`}>
              {commitment.completed ? commitLabel.completed : commitLabel.committed}
            </span>
          </div>

          <div className="mt-6 w-full space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-divider pb-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-warm-gray/50">
                Person
              </span>
              <span className="font-sans text-sm font-medium text-charcoal">
                {commitment.name || anonymousLabel}
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

type UploadStep = "search" | "pick" | "confirm" | "done";

function UploadModal({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: () => void;
}) {
  const { t } = useI18n();
  const u = t.feed.upload;
  const [step, setStep] = useState<UploadStep>("search");
  const [query, setQuery] = useState("");
  const [myCommitments, setMyCommitments] = useState<Commitment[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedCommitment = myCommitments.find((c) => c.id === selectedId);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/commitments/mine?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.length === 0) {
          setError(u.noCommitments);
          return;
        }
        setMyCommitments(data);
        setStep("pick");
      } catch {
        setError(u.error);
      } finally {
        setLoading(false);
      }
    },
    [query, u]
  );

  const handleFileChange = (f: File | null) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError(u.maxSize);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const handleComplete = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("commitmentId", selectedId);
      if (file) form.append("file", file);
      const res = await fetch("/api/upload-photo", { method: "POST", body: form });
      if (!res.ok) throw new Error("Failed");
      setStep("done");
      onUploaded();
    } catch {
      setError(u.error);
    } finally {
      setLoading(false);
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
        {step === "done" ? (
          <div className="py-8 text-center">
            <span className="text-4xl">🎉</span>
            <h3 className="mt-4 font-serif text-2xl font-light tracking-wide text-charcoal">
              {u.success}
            </h3>
            <p className="mt-3 font-sans text-sm font-light text-warm-gray">
              {u.successMessage}
            </p>
            <button
              onClick={onClose}
              className="mt-8 border border-divider px-8 py-3 font-sans text-[11px] font-medium uppercase text-charcoal transition-colors duration-300 hover:bg-charcoal hover:text-white"
            >
              {u.close}
            </button>
          </div>
        ) : (
          <>
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-gold">
              {t.feed.completedActivity}
            </p>
            <h3 className="mt-2 font-serif text-3xl font-light tracking-wide text-charcoal">
              {u.title}
            </h3>
            <div className="mt-3 h-px w-8 bg-gold/30" />

            {step === "search" && (
              <form onSubmit={handleSearch} className="mt-8 space-y-4">
                <div>
                  <label className="block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-warm-gray/60">
                    {u.enterNameOrEmail}
                  </label>
                  <input
                    type="text"
                    required
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mt-1 w-full border-b border-divider bg-transparent py-2 font-sans text-sm text-charcoal outline-none transition-colors focus:border-gold"
                    placeholder={u.placeholder}
                  />
                </div>
                {error && <p className="text-xs text-rose">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-charcoal py-3 font-sans text-[11px] font-medium uppercase text-white transition-colors duration-300 hover:bg-gold disabled:opacity-50"
                >
                  {loading ? u.searching : u.findCommitments}
                </button>
              </form>
            )}

            {step === "pick" && (
              <div className="mt-8 space-y-3">
                <p className="font-sans text-sm font-light text-warm-gray">
                  {u.selectCommitment}
                </p>
                {myCommitments.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedId(c.id);
                      setStep("confirm");
                    }}
                    className="w-full border border-divider p-4 text-left transition-all duration-200 hover:border-gold/50 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-base font-light tracking-wide text-charcoal">
                        {c.activityName}
                      </span>
                      {c.completed && (
                        <span className="rounded-full bg-sage/15 px-2 py-0.5 font-sans text-[9px] font-medium uppercase text-sage">
                          {t.feed.completed}
                        </span>
                      )}
                    </div>
                    <span className="mt-1 block font-sans text-xs text-warm-gray/60">
                      {c.costRange}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setStep("search");
                    setMyCommitments([]);
                  }}
                  className="mt-2 font-sans text-xs text-warm-gray/60 transition-colors hover:text-charcoal"
                >
                  {u.back}
                </button>
              </div>
            )}

            {step === "confirm" && selectedCommitment && (
              <div className="mt-8 space-y-4">
                <div className="rounded-lg bg-ivory p-4 text-center">
                  <span className="font-serif text-lg font-light tracking-wide text-charcoal">
                    {selectedCommitment.activityName}
                  </span>
                  <span className="mt-1 block font-sans text-xs text-warm-gray/60">
                    {selectedCommitment.costRange}
                  </span>
                </div>

                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-warm-gray/60">
                  {u.addPhoto}
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />

                {preview ? (
                  <div className="relative">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={400}
                      height={300}
                      className="h-48 w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-md transition-colors hover:bg-white"
                    >
                      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M1 1l12 12M13 1L1 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileChange(e.dataTransfer.files?.[0] ?? null);
                    }}
                    className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-divider py-8 text-center transition-colors hover:border-gold/40"
                  >
                    <span className="text-2xl">📷</span>
                    <span className="font-sans text-sm font-light text-warm-gray">
                      {u.dragOrClick}
                    </span>
                    <span className="font-sans text-[10px] text-warm-gray/50">
                      {u.maxSize}
                    </span>
                  </button>
                )}

                {error && <p className="text-xs text-rose">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="flex-1 bg-charcoal py-3 font-sans text-[11px] font-medium uppercase text-white transition-colors duration-300 hover:bg-gold disabled:opacity-50"
                  >
                    {loading ? u.uploading : u.submit}
                  </button>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setSelectedId("");
                      setStep("pick");
                    }}
                    className="border border-divider px-6 py-3 font-sans text-[11px] font-medium uppercase text-warm-gray transition-colors duration-300 hover:border-charcoal hover:text-charcoal"
                  >
                    {u.back}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Feed() {
  const { t } = useI18n();
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Commitment | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const loadCommitments = useCallback(() => {
    fetch("/api/commitments")
      .then((res) => res.json())
      .then((data) => setCommitments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCommitments();
  }, [loadCommitments]);

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
                  statusLabel={item.completed ? t.feed.completed : t.feed.committed}
                  anonymousLabel={t.feed.anonymous}
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
              <button
                onClick={() => setShowUpload(true)}
                className="mt-6 rounded-full bg-charcoal px-8 py-3 font-sans text-[11px] font-medium uppercase text-white transition-colors duration-300 hover:bg-gold"
              >
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
            commitLabel={{ committed: t.feed.committed, completed: t.feed.completed }}
            anonymousLabel={t.feed.anonymous}
          />
        )}
      </AnimatePresence>

      {/* ─── Upload Modal ─── */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
            onUploaded={loadCommitments}
          />
        )}
      </AnimatePresence>
    </>
  );
}
