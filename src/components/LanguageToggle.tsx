"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const isIT = locale === "it";

  return (
    <button
      onClick={() => setLocale(isIT ? "en" : "it")}
      className={`relative inline-flex h-7 w-[52px] items-center rounded-full bg-current/10 p-0.5 transition-colors duration-300 hover:bg-current/15 ${className}`}
      role="switch"
      aria-checked={isIT}
      aria-label={isIT ? "Switch to English" : "Passa all'Italiano"}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-gold shadow-sm"
        style={{ left: isIT ? "calc(100% - 1.625rem)" : "0.125rem" }}
      />
      <span
        className={`relative z-10 w-6 text-center font-sans text-[9px] font-light tracking-wider transition-colors duration-200 ${
          !isIT ? "text-white" : "text-current/40"
        }`}
      >
        EN
      </span>
      <span
        className={`relative z-10 w-6 text-center font-sans text-[9px] font-light tracking-wider transition-colors duration-200 ${
          isIT ? "text-white" : "text-current/40"
        }`}
      >
        IT
      </span>
    </button>
  );
}
