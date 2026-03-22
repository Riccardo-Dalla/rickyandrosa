"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

export function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === "/" || pathname === "/save-the-date" || pathname?.startsWith("/singles")) return null;

  return (
    <footer className="border-t border-divider bg-ivory py-16">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">
        <div
          className="mx-auto h-20 w-40 bg-gold"
          role="img"
          aria-label="R&R"
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
        />
        <div className="editorial-divider" />
        <p className="font-sans text-xs font-light uppercase tracking-[0.3em] text-warm-gray">
          {t.footer.summerBologna}
        </p>
        <p className="mt-8 font-sans text-[11px] font-light text-warm-gray/60">
          {t.footer.madeWithLove}
        </p>
      </div>
    </footer>
  );
}
