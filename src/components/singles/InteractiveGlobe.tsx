"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

export interface GlobeLocation {
  name: string;
  coordinates: [number, number];
  count: number;
}

interface InteractiveGlobeProps {
  locations: GlobeLocation[];
  selectedLocation: string | null;
  onSelectLocation: (name: string | null) => void;
}

const RADIUS_FACTOR = 0.40;
const ROTATE_SPEED = 0.002;
const LERP_SPEED = 0.04;
const FRICTION = 0.96;
const MIN_VELOCITY = 0.0002;

function project(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
) {
  const lr = (lat * Math.PI) / 180;
  const lgr = (lng * Math.PI) / 180;
  const cl = Math.cos(lr);
  const sl = Math.sin(lr);
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const a = lgr + phi;

  return {
    x: cl * Math.cos(a),
    y: -(ct * sl + st * cl * Math.sin(a)),
    zDepth: st * sl - ct * cl * Math.sin(a),
  };
}

export function InteractiveGlobe({
  locations,
  selectedLocation,
  onSelectLocation,
}: InteractiveGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const phiRef = useRef(-Math.PI / 2 - (11.34 * Math.PI) / 180);
  const targetPhiRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const pointerXRef = useRef(0);
  const velocityRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const [size, setSize] = useState(480);
  const theta = 0.25;

  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const calc = () => {
      const w = window.innerWidth;
      let s = w < 640 ? w - 48 : w < 1024 ? 420 : 520;
      s = Math.min(s, 520);
      setSize(Math.floor(s / 2) * 2);
    };
    calc();
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(calc, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      draggingRef.current = true;
      pointerXRef.current = e.clientX;
      velocityRef.current = 0;
      lastMoveTimeRef.current = performance.now();
      targetPhiRef.current = null;
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const now = performance.now();
      const dt = now - lastMoveTimeRef.current;
      const dx = e.clientX - pointerXRef.current;
      pointerXRef.current = e.clientX;
      lastMoveTimeRef.current = now;

      const instantVelocity = dt > 0 ? dx / (size * 0.25) / (dt / 16) : 0;
      velocityRef.current = velocityRef.current * 0.3 + instantVelocity * 0.7;
      phiRef.current += dx / (size * 0.25);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      el.releasePointerCapture(e.pointerId);
      const timeSinceLastMove = performance.now() - lastMoveTimeRef.current;
      if (timeSinceLastMove > 80) velocityRef.current = 0;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [size, selectedLocation]);

  useEffect(() => {
    if (selectedLocation) {
      const loc = locations.find((l) => l.name === selectedLocation);
      if (loc)
        targetPhiRef.current =
          -Math.PI / 2 - (loc.coordinates[1] * Math.PI) / 180;
    } else {
      targetPhiRef.current = null;
    }
  }, [selectedLocation, locations]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: size * 2,
      height: size * 2,
      phi: phiRef.current,
      theta,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 16000,
      mapBrightness: 5,
      baseColor: [0.15, 0.15, 0.2],
      markerColor: [0.77, 0.64, 0.49],
      glowColor: [0.12, 0.1, 0.18],
    });

    let frameId: number;

    const animate = () => {
      if (draggingRef.current) {
        // phi is updated directly by pointer events
      } else if (Math.abs(velocityRef.current) > MIN_VELOCITY) {
        phiRef.current += velocityRef.current;
        velocityRef.current *= FRICTION;
      } else if (targetPhiRef.current !== null) {
        velocityRef.current = 0;
        let d = targetPhiRef.current - phiRef.current;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        phiRef.current += d * LERP_SPEED;
      } else {
        velocityRef.current = 0;
        phiRef.current += ROTATE_SPEED;
      }

      globe.update({ phi: phiRef.current });

      const r = size * RADIUS_FACTOR;
      const cx = size / 2;
      const cy = size / 2;

      locations.forEach((loc) => {
        const el = pinRefs.current.get(loc.name);
        if (!el) return;
        const pt = project(
          loc.coordinates[0],
          loc.coordinates[1],
          phiRef.current,
          theta,
        );
        const opacity = Math.max(0, Math.min(1, (pt.zDepth + 0.2) * 3));
        el.style.transform = `translate(${cx + pt.x * r}px, ${cy + pt.y * r}px) translate(-50%, -50%)`;
        el.style.opacity = String(opacity);
        el.style.pointerEvents = opacity > 0.1 ? "auto" : "none";
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      globe.destroy();
    };
  }, [size, locations, theta]);

  return (
    <div ref={containerRef} className="relative mx-auto cursor-grab active:cursor-grabbing touch-pan-y" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
      <div className="absolute inset-0 pointer-events-none">
        {locations.map((loc) => (
          <button
            key={loc.name}
            ref={(el) => {
              if (el) pinRefs.current.set(loc.name, el);
            }}
            onClick={() =>
              onSelectLocation(
                selectedLocation === loc.name ? null : loc.name,
              )
            }
            className="absolute top-0 left-0 opacity-0 pointer-events-auto group flex items-center justify-center w-10 h-10 cursor-pointer"
            aria-label={`${loc.name} — ${loc.count} ${loc.count === 1 ? "person" : "people"}`}
          >
            <span
              className={`relative block rounded-full transition-all duration-300 ${selectedLocation === loc.name
                ? "w-4 h-4 bg-gold shadow-[0_0_16px_4px_rgba(197,164,126,0.6)]"
                : "w-2.5 h-2.5 bg-gold/80 shadow-[0_0_8px_2px_rgba(197,164,126,0.4)] group-hover:w-3.5 group-hover:h-3.5 group-hover:bg-gold"
                }`}
            >
              {selectedLocation === loc.name && (
                <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
              )}
            </span>
            <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-purple-900/90 text-[11px] font-sans font-semibold tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md shadow-[0_0_12px_rgba(147,51,234,0.3)] text-fuchsia-300 [text-shadow:0_0_8px_rgba(232,121,249,0.7),0_0_20px_rgba(192,38,211,0.4)]">
              {loc.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
