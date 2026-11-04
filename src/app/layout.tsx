import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Moses Abraham — Systems Engineer",
  description: "High-performance systems and precision interfaces by Moses Owalama Abraham.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-[var(--canvas)] font-sans text-[var(--ink)]"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}


