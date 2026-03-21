"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

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

export type WeddingCalendarVariant = "hero" | "forestGold";

const triggerStyles: Record<WeddingCalendarVariant, string> = {
  hero:
    "inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-2.5 font-sans text-[10px] font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:text-gold",
  forestGold:
    "inline-flex items-center gap-2.5 rounded-full border border-gold/45 px-7 py-2.5 font-sans text-[10px] font-semibold text-gold/90 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold",
};

const menuItemStyles: Record<WeddingCalendarVariant, string> = {
  hero:
    "inline-flex items-center gap-2 rounded-full border border-white/15 bg-deep/90 px-5 py-2 font-sans text-[10px] font-medium uppercase text-white/70 backdrop-blur-md transition-colors hover:border-gold/50 hover:text-gold",
  forestGold:
    "inline-flex items-center gap-2 rounded-full border border-gold/25 bg-forest px-5 py-2 font-sans text-[10px] font-medium uppercase text-gold/85 backdrop-blur-md transition-colors hover:border-gold/50 hover:bg-gold/5 hover:text-gold",
};

export function WeddingCalendarButton({
  className = "",
  variant = "hero",
  onOpenChange,
}: {
  className?: string;
  variant?: WeddingCalendarVariant;
  /** Fires when the calendar menu opens or closes (e.g. to grow a parent modal). */
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

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
    <div ref={wrapperRef} className={`relative inline-block ${className}`}>
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={triggerStyles[variant]}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
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
            className="absolute top-full left-1/2 z-[200] mt-2 flex -translate-x-1/2 flex-col gap-2 whitespace-nowrap"
          >
            <a
              href={GOOGLE_CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={menuItemStyles[variant]}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t.saveTheDate.googleCalendar}
            </a>
            <button
              type="button"
              onClick={downloadICS}
              className={menuItemStyles[variant]}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              {t.saveTheDate.appleCalendar}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
