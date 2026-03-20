"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n/context";

function useNavItems() {
  const { t } = useI18n();
  return [
    { label: t.nav.home, href: "/" },
    { label: t.nav.events, href: "/events" },
    { label: t.nav.bolognaGuide, href: "/bologna-guide" },
    { label: t.nav.ourStory, href: "/our-story" },
    { label: t.nav.reverseRegistry, href: "/reverse-registry" },
    { label: t.nav.gallery, href: "https://gallery.rickyandrosa.com", external: true },
    { label: t.nav.rsvp, href: "https://rsvp.rickyandrosa.com", external: true },
  ];
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSaveTheDate = pathname === "/save-the-date";
  const { t } = useI18n();
  const NAV_ITEMS = useNavItems();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (isSaveTheDate) return null;

  const showSolid = scrolled || !isHome;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showSolid
            ? "bg-ivory/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-4 py-4 sm:px-6">
          {/* Left — R&R logo */}
          <Link
            href="/"
            className="block h-10 w-20 shrink-0 bg-gold"
            style={{
              WebkitMaskImage: "url(/rr-logo.png)",
              maskImage: "url(/rr-logo.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
            aria-label="R&R Home"
          />

          {/* Center — Desktop nav */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {"external" in item && item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs font-sans font-medium uppercase tracking-[0.2em] transition-colors hover:text-gold ${
                      showSolid ? "text-charcoal" : "text-white/90"
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-xs font-sans font-medium uppercase tracking-[0.2em] transition-colors hover:text-gold ${
                      pathname === item.href
                        ? "text-gold"
                        : showSolid
                        ? "text-charcoal"
                        : "text-white/90"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right — Language toggle + mobile burger */}
          <div className="flex items-center gap-3">
            {/* Mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-label={t.nav.toggleMenu}
            >
              <span
                className={`block h-[1.5px] w-6 transition-all duration-300 ${
                  isOpen
                    ? "translate-y-[3px] rotate-45 bg-charcoal"
                    : showSolid
                    ? "bg-charcoal"
                    : "bg-white"
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 transition-all duration-300 ${
                  isOpen
                    ? "-translate-y-[3px] -rotate-45 bg-charcoal"
                    : showSolid
                    ? "bg-charcoal"
                    : "bg-white"
                }`}
              />
            </button>

            <LanguageToggle className={`relative z-50 ${showSolid || isOpen ? "text-charcoal" : "text-white/90"}`} />
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ivory/98 backdrop-blur-lg lg:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  {"external" in item && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif text-3xl font-light tracking-wide text-charcoal transition-colors hover:text-gold"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={`font-serif text-3xl font-light tracking-wide transition-colors hover:text-gold ${
                        pathname === item.href ? "text-gold" : "text-charcoal"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
