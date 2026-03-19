import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Singles at R&R Wedding",
  robots: { index: false, follow: false },
};

export default function DatingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
