import type { Metadata } from "next";

const OG_IMAGE = "https://media.rickyandrosa.com/save-the-date-bg.jpg";

export const metadata: Metadata = {
  title: "Save the Date — R&R Wedding",
  description: "",
  openGraph: {
    title: "Save the Date — Rosa & Riccardo",
    description: "",
    type: "website",
    url: "https://rickyandrosa.com/save-the-date",
    images: [
      {
        url: OG_IMAGE,
        width: 2362,
        height: 3537,
        alt: "Save the date — Rosa & Riccardo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Save the Date — Rosa & Riccardo",
    description: "",
    images: [OG_IMAGE],
  },
};

export default function SaveTheDateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
