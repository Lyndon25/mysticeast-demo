import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MysticEast AI — Unlock Your Ancient Blueprint",
  description: "Discover your true elemental nature through 5,000-year-old Eastern wisdom. Move beyond generic horoscopes with personalized energy blueprint readings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
