import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import { AdaptiveProvider } from "@/components/AdaptiveProvider";
import { ScrollProgress } from "@/components/ui/PremiumAnimations";
import { defaultOgImage, getSiteUrl } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { GlobalProjectTray } from "@/components/services/GlobalProjectTray";
import { Analytics } from "@/components/Analytics";
import { AnalyticsConsentBanner } from "@/components/AnalyticsConsentBanner";

const fontSans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Electromax | Инженерная интеграция систем безопасности",
    template: "%s | Electromax",
  },
  description:
    "Проектирование и монтаж систем безопасности, видеонаблюдения и электроснабжения в Москве. Комплексные инженерные решения для бизнеса.",
  metadataBase: new URL(getSiteUrl() || "http://localhost:3000"),
  openGraph: {
    siteName: "Electromax",
    images: [defaultOgImage],
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
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
    "@type": ["Organization", "LocalBusiness"],
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: 55.7558,
      longitude: 37.6173,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "₽₽₽",
  };

  return (
    <html
      lang="ru"
      className={`${fontSans.variable} ${fontDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="application/rss+xml" title="Electromax — База знаний" href="/feed.xml" />
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
          <AnalyticsConsentBanner />
          <Analytics />
          <ScrollProgress />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-full focus:shadow-lg"
          >
            Перейти к основному содержанию
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <GlobalProjectTray />
        </AdaptiveProvider>
      </body>
    </html>
  );
}
