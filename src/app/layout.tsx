import type { Metadata } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import "./globals.css";

/**
 * Typography setup for Pari Moana:
 * - Cormorant Garamond: Refined serif for headings - elegant, editorial
 * - Karla: Clean, neutral sans-serif for body - excellent readability
 *
 * Both fonts are variable fonts for optimal performance.
 */

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const body = Karla({
  variable: "--font-body",
  subsets: ["latin"],
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
      <body className={`${display.variable} ${body.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
