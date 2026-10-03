import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akash Prasher — Senior Software Engineer",
  description:
    "Akash Prasher is a Senior Software Engineer in Delhi, India, building scalable full-stack products with React, Next.js, TypeScript, Node.js, and FastAPI.",
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
