import type { NextConfig } from "next";

const showAllPages = process.env.NEXT_PUBLIC_SHOW_ALL_PAGES === "true";

const hiddenPageRedirects = [
  { source: "/events", destination: "/", permanent: false },
  { source: "/events/:path*", destination: "/", permanent: false },
  { source: "/bologna-guide", destination: "/", permanent: false },
  { source: "/bologna-guide/:path*", destination: "/", permanent: false },
  { source: "/our-story", destination: "/", permanent: false },
  { source: "/our-story/:path*", destination: "/", permanent: false },
  { source: "/reverse-registry", destination: "/", permanent: false },
  { source: "/reverse-registry/:path*", destination: "/", permanent: false },
  { source: "/singles", destination: "/", permanent: false },
  { source: "/singles/:path*", destination: "/", permanent: false },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rickyandrosa.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  async redirects() {
    if (showAllPages) return [];
    return hiddenPageRedirects;
  },
};

export default nextConfig;
