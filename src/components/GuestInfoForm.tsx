"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

const STORAGE_KEY = "rr-guest-submitted";

type FormStatus = "idle" | "submitting" | "success" | "duplicate" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  address?: string;
}

interface Suggestion {
  text: string;
  placeId: string;
}

export function GuestInfoForm({
  onSubmitted,
}: {
  onSubmitted?: () => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        addressRef.current &&
        !addressRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/places-autocomplete?input=${encodeURIComponent(input)}`,
      );
      const data = await res.json();
      const items: Suggestion[] = data.suggestions || [];
      setSuggestions(items);
      setShowSuggestions(items.length > 0);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setAddressConfirmed(false);
    if (errors.address) setErrors((p) => ({ ...p, address: undefined }));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const selectSuggestion = async (placeId: string, fallbackText: string) => {
    setAddress(fallbackText);
    setAddressConfirmed(true);
    setShowSuggestions(false);
    setSuggestions([]);

    try {
      const res = await fetch(
        `/api/places-autocomplete?placeId=${encodeURIComponent(placeId)}`,
      );
      const data = await res.json();
      if (data.formattedAddress) {
        setAddress(data.formattedAddress);
      }
    } catch {
      /* keep fallback text */
    }
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!name.trim()) newErrors.name = t.guestForm.required;
    if (!email.trim()) {
      newErrors.email = t.guestForm.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = t.guestForm.invalidEmail;
    }
    if (!address.trim()) {
      newErrors.address = t.guestForm.required;
    } else if (!addressConfirmed) {
      newErrors.address = t.guestForm.selectAddress;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    if (!validate()) return;

    const payload = JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      address: address.trim(),
    });

    // Safety net: if the page closes mid-request, sendBeacon delivers the data
    const beaconGuard = () => {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/guest-info", blob);
      }
    };
    window.addEventListener("beforeunload", beaconGuard);

    const fetchPromise = fetch("/api/guest-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    })
      .then((res) => {
        window.removeEventListener("beforeunload", beaconGuard);
        return res.json();
      })
      .catch(() => {
        window.removeEventListener("beforeunload", beaconGuard);
        return { status: "success" };
      });

    setStatus("submitting");

    const result = await fetchPromise;

    if (result.status === "duplicate") {
      setStatus("duplicate");
    } else {
      setStatus("success");
    }
    localStorage.setItem(STORAGE_KEY, "true");
    onSubmitted?.();
  };

  const showResult = status === "success" || status === "duplicate";

  const resultTitle =
    status === "duplicate"
      ? t.guestForm.duplicateTitle
      : t.guestForm.successTitle;

  const resultMessage =
    status === "duplicate"
      ? t.guestForm.duplicateMessage
      : t.guestForm.successMessage;

  const inputClass = (hasError: boolean) =>
    `mt-2 w-full border-0 border-b-2 bg-transparent py-3 font-serif text-base font-light text-white placeholder-white/20 outline-none transition-colors duration-300 sm:text-lg ${
      hasError ? "border-red-400" : "border-white/15 focus:border-gold/50"
    }`;

  return (
    <div className="mx-auto max-w-md px-4 sm:px-0">
      <AnimatePresence mode="wait">
        {showResult ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gold"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-light tracking-wide text-white sm:text-2xl">
              {resultTitle}
            </h3>
            <p className="mt-4 font-serif text-base font-light text-white/40 sm:text-sm">
              {resultMessage}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (e.target as HTMLElement).tagName !== "BUTTON"
              ) {
                e.preventDefault();
              }
            }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <label className="block font-sans text-xs font-medium uppercase tracking-[0.3em] text-white/40 sm:text-[10px]">
                {t.guestForm.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
                placeholder={t.guestForm.namePlaceholder}
                className={inputClass(!!errors.name)}
                autoComplete="name"
              />
              {errors.name && (
                <p className="mt-2 font-sans text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block font-sans text-xs font-medium uppercase tracking-[0.3em] text-white/40 sm:text-[10px]">
                {t.guestForm.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder={t.guestForm.emailPlaceholder}
                className={inputClass(!!errors.email)}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-2 font-sans text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label className="block font-sans text-xs font-medium uppercase tracking-[0.3em] text-white/40 sm:text-[10px]">
                {t.guestForm.address}
              </label>
              <input
                ref={addressRef}
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                placeholder={t.guestForm.addressPlaceholder}
                className={inputClass(!!errors.address)}
                autoComplete="off"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 z-50 mt-1 overflow-hidden border border-white/[0.08] bg-deep shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                >
                  {suggestions.map((s) => (
                    <button
                      key={s.placeId}
                      type="button"
                      onClick={() => selectSuggestion(s.placeId, s.text)}
                      className="block w-full border-t border-white/[0.04] px-4 py-4 text-left font-sans text-sm text-white/60 transition-colors first:border-t-0 hover:bg-white/[0.06] hover:text-white/85 sm:py-3 sm:text-[13px]"
                    >
                      {s.text}
                    </button>
                  ))}
                </div>
              )}
              {errors.address && (
                <p className="mt-2 font-sans text-xs text-red-400">{errors.address}</p>
              )}
            </div>

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center font-sans text-sm text-rose/80 sm:text-xs"
                >
                  {t.guestForm.errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="pt-4 text-center">
              {status === "submitting" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3 px-10 py-3"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block h-5 w-5 rounded-full border-2 border-gold/30 border-t-gold"
                  />
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold/70 sm:text-[10px]">
                    Submitting...
                  </span>
                </motion.div>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-2.5 font-sans text-[10px] font-semibold tracking-[0.08em] text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:text-gold"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                  {t.guestForm.submit}
                </motion.button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
