import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rickyandrosa.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/events/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/bologna-guide/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/our-story/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/reverse-registry/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/singles/:path*",
        destination: "/",
        permanent: false,
      },
    ];
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
};

export default nextConfig;
