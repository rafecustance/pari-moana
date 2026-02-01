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

const SITE_URL = "https://www.parimoana.co.nz";
const OG_IMAGE = "https://assets.parimoana.co.nz/assets/hero/hero-a8sdjc.jpg";
const SITE_TITLE = "Pari Moana | 360 Paremata Road, Pauatahanui";
const SITE_DESCRIPTION = "A private architectural estate above the Pauatahanui Inlet, now offered for sale. 360 Paremata Road delivers refined indoor-outdoor living, established grounds and expansive water views.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Pari Moana",
  },
  description: SITE_DESCRIPTION,
  keywords: ["Pari Moana", "360 Paremata Road", "Pauatahanui", "luxury home", "Porirua", "Wellington"],
  authors: [{ name: "Team Group Realty" }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Pari Moana",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Aerial view of Pari Moana estate above the Pauatahanui Inlet",
      },
    ],
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
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
