import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout";
import "./globals.css";

/**
 * Typography setup for Pari Moana:
 * - Feature: Custom font for both display and body text
 */

const feature = localFont({
  src: [
    {
      path: "../fonts/feature-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/feature-medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-feature",
  display: "swap",
});

const basisGrotesque = localFont({
  src: "../fonts/basis-grotesque-medium-trial.woff2",
  weight: "500",
  style: "normal",
  variable: "--font-basis",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pari Moana",
  description: "Where the sea meets the sky",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${feature.variable} ${basisGrotesque.variable} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
