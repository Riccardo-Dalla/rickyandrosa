"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

export function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === "/" || pathname === "/save-the-date" || pathname?.startsWith("/singles")) return null;

  return (
    <footer className="border-t border-divider bg-ivory py-16">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">
        <Image
          src="/seal-logo.png"
          alt="R&R"
          width={80}
          height={80}
          className="mx-auto h-20 w-20 object-contain"
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
