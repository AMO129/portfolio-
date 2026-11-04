import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moses Abraham — Systems Engineer",
  description: "High-performance systems and precision interfaces by Moses Owalama Abraham.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#0f0f0f] font-sans text-[#f2f3ee]">{children}</body>
    </html>
  );
}


