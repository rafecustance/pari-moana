import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Footer } from "@/components/layout";
import "./globals.css";

const META_PIXEL_ID = "1171566535058180";

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
        
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
