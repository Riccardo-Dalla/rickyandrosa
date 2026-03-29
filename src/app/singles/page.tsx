"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveGlobe } from "@/components/singles/InteractiveGlobe";
import type { GlobeLocation } from "@/components/singles/InteractiveGlobe";
import { playfairDisplay } from "@/lib/fonts";

interface SinglesProfile {
  id: string;
  name: string;
  age?: number;
  location: string;
  latitude: number;
  longitude: number;
  photo: string;
  description?: string;
  instagram?: string;
}

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

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ProfileCard({
  profile,
  isEditMode,
  onEdit,
  onDelete,
}: {
  profile: SinglesProfile;
  isEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
      {/* Edit controls */}
      {isEditMode && (
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <EditIcon className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-red-500/50 backdrop-blur-sm hover:bg-red-500/70 transition-colors"
          >
            <TrashIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Fallback gradient with initial */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1f3d] to-[#1a1428] flex items-center justify-center">
        <span className="font-serif text-7xl text-white/10 select-none">
          {profile.name[0]}
        </span>
      </div>

      {/* Photo */}
      {!imgError && profile.photo && (
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
            {profile.age != null && profile.age > 0 && (
              <span className="text-white/50">, {profile.age}</span>
            )}
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

        <p className="font-sans text-sm text-white/60 mt-3 leading-relaxed line-clamp-3 min-h-[3.5em]">
          {profile.description || ""}
        </p>
      </div>
    </motion.div>
  );
}

interface PlaceSuggestion {
  text: string;
  placeId: string;
}

function ProfileModal({
  profile,
  adminKey,
  onClose,
  onSave,
}: {
  profile: SinglesProfile | null;
  adminKey: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    age: profile?.age?.toString() || "",
    location: profile?.location || "",
    latitude: profile?.latitude?.toString() || "",
    longitude: profile?.longitude?.toString() || "",
    photo: profile?.photo || "",
    description: profile?.description || "",
    instagram: profile?.instagram || "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationDebounceRef = useRef<NodeJS.Timeout>(null);

  const handleLocationChange = (value: string) => {
    setForm((f) => ({ ...f, location: value }));
    
    if (locationDebounceRef.current) {
      clearTimeout(locationDebounceRef.current);
    }

    if (value.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    locationDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(value)}`);
        const data = await res.json();
        setLocationSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch {
        setLocationSuggestions([]);
      }
    }, 300);
  };

  const handleSelectLocation = async (suggestion: PlaceSuggestion) => {
    setShowSuggestions(false);
    
    // Extract just the city name (first part before comma)
    const cityName = suggestion.text.split(",")[0].trim();
    setForm((f) => ({ ...f, location: cityName }));

    // Fetch coordinates
    try {
      const res = await fetch(`/api/places-autocomplete?placeId=${suggestion.placeId}`);
      const data = await res.json();
      if (data.latitude && data.longitude) {
        setForm((f) => ({
          ...f,
          latitude: data.latitude.toString(),
          longitude: data.longitude.toString(),
        }));
      }
    } catch {
      console.error("Failed to fetch coordinates");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/singles/upload?key=${adminKey}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setForm((f) => ({ ...f, photo: url }));
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = profile
        ? `/api/singles/${profile.id}?key=${adminKey}`
        : `/api/singles?key=${adminKey}`;

      const res = await fetch(url, {
        method: profile ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          location: form.location,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          photo: form.photo,
          description: form.description,
          instagram: form.instagram || undefined,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      onSave();
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1a1428] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <h2 className="font-serif text-2xl text-white mb-6">
          {profile ? "Edit Profile" : "Add Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo upload */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Photo</label>
            <div className="flex items-center gap-4">
              {form.photo && (
                <div className="relative">
                  <img
                    src={form.photo}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, photo: "" }))}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <span className="text-xs font-bold">×</span>
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:border-gold/50 focus:outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              min="18"
              max="100"
              placeholder="Optional"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:border-gold/50 focus:outline-none"
            />
          </div>

          {/* Location with autocomplete */}
          <div className="relative">
            <label className="block text-white/60 text-sm mb-2">Location *</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              required
              placeholder="Start typing a city..."
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:border-gold/50 focus:outline-none"
            />
            {showSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[#2a1f3d] border border-white/10 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {locationSuggestions.map((s) => (
                  <button
                    key={s.placeId}
                    type="button"
                    onClick={() => handleSelectLocation(s)}
                    className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 transition-colors text-sm"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            )}
            {form.latitude && form.longitude && (
              <p className="text-white/30 text-xs mt-1">
                Coordinates: {form.latitude}, {form.longitude}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Optional"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:border-gold/50 focus:outline-none resize-none"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Instagram (optional)</label>
            <div className="flex items-center">
              <span className="text-white/40 mr-2">@</span>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                placeholder="username"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:border-gold/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-white/20 text-white/70 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 rounded-lg bg-gold text-[#141220] font-medium hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DatingPageContent() {
  const searchParams = useSearchParams();
  const adminKey = searchParams.get("key") || "";
  const isEditMode = !!adminKey;

  const [profiles, setProfiles] = useState<SinglesProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<SinglesProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const profilesRef = useRef<HTMLDivElement>(null);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/singles");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      console.error("Failed to load profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const uniqueLocations = useMemo<GlobeLocation[]>(() => {
    const map = new Map<string, { coordinates: [number, number]; count: number }>();
    profiles.forEach((p) => {
      const existing = map.get(p.location);
      if (existing) {
        existing.count++;
      } else {
        map.set(p.location, { coordinates: [p.latitude, p.longitude], count: 1 });
      }
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      coordinates: data.coordinates,
      count: data.count,
    }));
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    if (!selectedLocation) return profiles;
    return profiles.filter((p) => p.location === selectedLocation);
  }, [selectedLocation, profiles]);

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

  const handleDelete = async (profile: SinglesProfile) => {
    if (!confirm(`Delete ${profile.name}'s profile?`)) return;

    try {
      const res = await fetch(`/api/singles/${profile.id}?key=${adminKey}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchProfiles();
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile");
    }
  };

  const handleSave = () => {
    setEditingProfile(null);
    setShowAddModal(false);
    fetchProfiles();
  };

  return (
    <div className="min-h-screen bg-[#141220] text-white">
      {/* Grain overlay */}
      <div className="fixed inset-0 std-grain opacity-[0.02] pointer-events-none z-50" />

      {/* Edit mode banner */}
      {isEditMode && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-gold/90 text-[#141220] text-center py-2 text-sm font-medium">
          Edit Mode — Click profiles to edit, or add new ones below
        </div>
      )}

      {/* Hero */}
      <section className={`relative flex min-h-dvh flex-col items-center px-6 pt-16 pb-6 ${isEditMode ? "mt-10" : ""}`}>
        <Link
          href="/"
          className="absolute top-6 left-6 z-10 transition-opacity hover:opacity-70"
        >
          <img src="https://media.rickyandrosa.com/rr-logo-gold.png" alt="R&R" className="h-8 w-auto" />
        </Link>

        <div className="flex-1" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className={`${playfairDisplay.className} text-5xl sm:text-6xl lg:text-7xl text-gold italic font-light tracking-wide`}>
            Singles at R<span className="text-[0.75em]">&amp;</span>R Wedding
          </h1>
          <p className="font-sans text-[11px] sm:text-xs text-white/40 mt-4 tracking-[0.15em]">
            Here are the single guests coming from all over the world!
          </p>
        </motion.div>

        {!loading && (
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
        )}

        {/* Location chips */}
        {!loading && (
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
                  handleSelectLocation(selectedLocation === loc.name ? null : loc.name)
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
        )}

        <div className="flex-1" />

        {/* Scroll indicator */}
        {!loading && profiles.length > 0 && (
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
        )}
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
            {filteredProfiles.length} {filteredProfiles.length === 1 ? "single" : "singles"}
          </p>
        </motion.div>

        {/* Add profile button */}
        {isEditMode && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-[#141220] font-medium hover:bg-gold/90 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Profile
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center text-white/25 font-sans text-sm py-20">
            Loading profiles...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  isEditMode={isEditMode}
                  onEdit={() => setEditingProfile(profile)}
                  onDelete={() => handleDelete(profile)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProfiles.length === 0 && (
          <p className="text-center text-white/25 font-sans text-sm py-20">
            {profiles.length === 0
              ? "No singles yet. Be the first to add one!"
              : "No singles in this location yet."}
          </p>
        )}
      </section>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {(editingProfile || showAddModal) && (
          <ProfileModal
            profile={editingProfile}
            adminKey={adminKey}
            onClose={() => {
              setEditingProfile(null);
              setShowAddModal(false);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DatingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#141220]" />}>
      <DatingPageContent />
    </Suspense>
  );
}
