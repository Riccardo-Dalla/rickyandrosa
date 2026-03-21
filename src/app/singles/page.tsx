"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveGlobe } from "@/components/singles/InteractiveGlobe";
import type { GlobeLocation } from "@/components/singles/InteractiveGlobe";
import { profiles, type SinglesProfile } from "@/data/singles-profiles";

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function ProfileCard({ profile }: { profile: SinglesProfile }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, layout: { duration: 0.3 } }}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Fallback gradient with initial */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1f3d] to-[#1a1428] flex items-center justify-center">
        <span className="font-serif text-7xl text-white/10 select-none">
          {profile.name[0]}
        </span>
      </div>

      {/* Photo */}
      {!imgError && (
        <img
          src={profile.photo}
          alt={profile.name}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-2xl font-light text-white tracking-wide">
            {profile.name}
            <span className="text-white/50">, {profile.age}</span>
          </h3>
          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-gold transition-colors shrink-0"
              aria-label={`${profile.name} on Instagram`}
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-1.5">
          <PinIcon className="w-3 h-3 text-gold shrink-0" />
          <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-gold/80">
            {profile.location}
          </span>
        </div>

        <p className="font-sans text-sm text-white/60 mt-3 leading-relaxed line-clamp-3">
          {profile.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function DatingPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    null,
  );
  const profilesRef = useRef<HTMLDivElement>(null);

  const uniqueLocations = useMemo<GlobeLocation[]>(() => {
    const map = new Map<
      string,
      { coordinates: [number, number]; count: number }
    >();
    profiles.forEach((p) => {
      const existing = map.get(p.location);
      if (existing) {
        existing.count++;
      } else {
        map.set(p.location, { coordinates: p.coordinates, count: 1 });
      }
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      coordinates: data.coordinates,
      count: data.count,
    }));
  }, []);

  const filteredProfiles = useMemo(() => {
    if (!selectedLocation) return profiles;
    return profiles.filter((p) => p.location === selectedLocation);
  }, [selectedLocation]);

  const handleSelectLocation = (name: string | null) => {
    setSelectedLocation(name);
    if (name && profilesRef.current) {
      setTimeout(() => {
        profilesRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#141220] text-white">
      {/* Grain overlay */}
      <div className="fixed inset-0 std-grain opacity-[0.02] pointer-events-none z-50" />

      {/* Hero */}
      <section className="relative flex min-h-dvh flex-col items-center px-6 pt-16 pb-6">
        <Link
          href="/"
          className="absolute top-6 left-6 z-10 text-[10px] text-white/25 hover:text-white/60 transition-colors font-sans uppercase tracking-[0.25em]"
        >
          &larr; R&amp;R
        </Link>

        <div className="flex-1" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="font-script text-5xl sm:text-6xl lg:text-7xl text-gold">
            Singles at R&amp;R Wedding
          </h1>
          <p className="font-sans text-[11px] sm:text-xs text-white/40 mt-4 tracking-[0.15em]">
            Here are the single guests coming from all over the world!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <InteractiveGlobe
            locations={uniqueLocations}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
          />
        </motion.div>

        {/* Location chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 max-w-xl"
        >
          <button
            onClick={() => handleSelectLocation(null)}
            className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-sans font-medium uppercase transition-all border cursor-pointer ${
              selectedLocation === null
                ? "bg-gold/90 text-[#141220] border-gold"
                : "bg-transparent text-white/45 border-white/15 hover:border-gold/40 hover:text-white/70"
            }`}
          >
            All
          </button>
          {uniqueLocations.map((loc) => (
            <button
              key={loc.name}
              onClick={() =>
                handleSelectLocation(
                  selectedLocation === loc.name ? null : loc.name,
                )
              }
              className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-sans font-medium uppercase transition-all border cursor-pointer ${
                selectedLocation === loc.name
                  ? "bg-gold/90 text-[#141220] border-gold"
                  : "bg-transparent text-white/45 border-white/15 hover:border-gold/40 hover:text-white/70"
              }`}
            >
              {loc.name}
            </button>
          ))}
        </motion.div>

        <div className="flex-1" />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-sans uppercase tracking-[0.35em] text-white/20">
            Scroll
          </span>
          <motion.svg
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-5 text-white/20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.div>
      </section>

      {/* Profiles */}
      <section
        ref={profilesRef}
        className="px-6 sm:px-8 lg:px-12 py-20 sm:py-28 max-w-7xl mx-auto scroll-mt-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="w-12 h-px bg-gold/60 mx-auto mb-6" />
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-white/90 tracking-wide">
            {selectedLocation ?? "Everyone"}
          </h2>
          <p className="font-sans text-[10px] text-white/30 mt-3 tracking-[0.25em] uppercase">
            {filteredProfiles.length}{" "}
            {filteredProfiles.length === 1 ? "single" : "singles"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProfiles.length === 0 && (
          <p className="text-center text-white/25 font-sans text-sm py-20">
            No singles in this location yet.
          </p>
        )}
      </section>
    </div>
  );
}
