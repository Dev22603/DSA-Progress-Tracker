import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import GridBackground from "@/components/GridBackground";
import ThemeToggle from "@/components/ThemeToggle";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DSA Tracker — Master Data Structures & Algorithms",
  description: "Track your Data Structures and Algorithms learning progress across LeetCode, GFG, and Code360",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <GridBackground />
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
