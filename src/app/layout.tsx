import type { Metadata, Viewport } from "next";
import "./globals.css";
import { spectral, inter, greatVibes, pinyonScript } from "@/lib/fonts";
import { I18nProvider } from "@/lib/i18n/context";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const OG_LOGO = "https://media.rickyandrosa.com/rr-logo-gold.png";

export const metadata: Metadata = {
  title: "R&R Wedding",
  description: "",
  openGraph: {
    title: "R&R Wedding",
    description: "",
    type: "website",
    url: "https://rickyandrosa.com",
    images: [
      {
        url: OG_LOGO,
        width: 1024,
        height: 512,
        alt: "Rosa & Riccardo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "R&R Wedding",
    description: "",
    images: [OG_LOGO],
  },
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
        <meta name="theme-color" content="#1A1614" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${spectral.variable} ${inter.variable} ${greatVibes.variable} ${pinyonScript.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener("beforeinstallprompt",function(e){e.preventDefault()});if("serviceWorker"in navigator){navigator.serviceWorker.register("/sw.js")}`,
          }}
        />
        <I18nProvider>
          <Navigation />
          <main className="bg-ivory">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
