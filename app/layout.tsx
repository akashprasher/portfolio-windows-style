import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akash Prasher — Senior Software Engineer",
  description:
    "Portfolio of Akash Prasher, a senior software engineer building thoughtful frontend, backend, and full-stack products.",
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
