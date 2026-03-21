import type { Metadata } from "next";
import "./globals.css";
import { spectral, inter, greatVibes, pinyonScript } from "@/lib/fonts";
import { I18nProvider } from "@/lib/i18n/context";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "R&R Wedding | Summer 2027 | Bologna, Italy",
  description: "The wedding of Riccardo & Rosa — Summer 2027 in Bologna, Italy",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body
        className={`${spectral.variable} ${inter.variable} ${greatVibes.variable} ${pinyonScript.variable} antialiased`}
      >
        <I18nProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
