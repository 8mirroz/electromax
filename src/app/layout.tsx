import "@/styles/globals.css";
import { Analytics } from "@/components/Analytics";
import { TelegramWidget } from "@/components/ui/TelegramWidget";
import { ScrollProgress } from "@/components/ui/PremiumAnimations";
import { AdaptiveProvider } from "@/components/AdaptiveProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { defaultMetadata, getSiteUrl, defaultOgImage } from "@/lib/seo";

const fontSans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: getSiteUrl() ? new URL(getSiteUrl()) : undefined,
  openGraph: {
    ...defaultMetadata.openGraph,
    siteName: "Electromax",
    images: [defaultOgImage],
  },
  twitter: {
    ...defaultMetadata.twitter,
    images: [defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Electromax",
    url: siteUrl || undefined,
    logo: siteUrl ? `${siteUrl}/logo.png` : undefined,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+7 (495) 123-45-67",
        contactType: "sales",
        areaServed: "RU",
        availableLanguage: ["ru"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Москва",
      addressCountry: "RU",
    },
  };

  return (
    <html lang="ru" className={fontSans?.variable || "font-sans"} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className="antialiased selection:bg-primary/20 selection:text-primary bg-background text-foreground transition-colors duration-300"
        suppressHydrationWarning
      >
        <AdaptiveProvider>
          <ScrollProgress />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-full focus:shadow-lg"
          >
            Перейти к основному содержанию
          </a>
          <div id="main-content" className="contents">
            {children}
          </div>
          <Analytics />
          <TelegramWidget />
        </AdaptiveProvider>
      </body>
    </html>
  );
}
