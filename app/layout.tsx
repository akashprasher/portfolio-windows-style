import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

const siteUrl = new URL("https://www.akashprasher.com");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Akash Prasher - Senior Software Engineer",
  description:
    "Akash Prasher is a Senior Software Engineer in Delhi, India, building scalable full-stack products with React, Next.js, TypeScript, Node.js, and FastAPI.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Akash Prasher",
    "Senior Software Engineer",
    "Full-Stack Engineer",
    "Software Engineer in Delhi",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "FastAPI",
    "Backend Engineering",
    "Frontend Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
