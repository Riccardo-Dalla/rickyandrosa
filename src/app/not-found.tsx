"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return <div className="fixed inset-0 z-[999] bg-deep" />;
}
