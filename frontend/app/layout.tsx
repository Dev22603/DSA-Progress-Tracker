import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import GridBackground from "@/components/GridBackground";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "DSA Progress Tracker",
  description: "Track your Data Structures and Algorithms learning progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <GridBackground />
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
