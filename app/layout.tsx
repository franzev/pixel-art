import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host
    ? new URL(`${protocol}://${host}`)
    : new URL("http://localhost:3000");

  return {
    metadataBase,
    title: "The Ashen Archive",
    description:
      "A private, responsive contact sheet for browsing pixel-art renders.",
    icons: {
      icon:
        "/art/protagonist/crimson-knight-player-character/drafts/01-crimson-knight-player-character-v01-reference-256.png",
      shortcut:
        "/art/protagonist/crimson-knight-player-character/drafts/01-crimson-knight-player-character-v01-reference-256.png",
    },
    openGraph: {
      title: "The Ashen Archive",
      description:
        "A private, responsive contact sheet for browsing pixel-art renders.",
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Ashen Archive",
      description:
        "A private, responsive contact sheet for browsing pixel-art renders.",
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#171512",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
