import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { defaultOgImage, getSiteUrl } from "@/lib/seo";
import { getServicePageModel, getServicePageSlugs } from "@/lib/services-content";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const url = siteUrl ? `${siteUrl}/services` : undefined;

  return {
    title: "Услуги",
    description:
      "Каталог инженерных систем Electromax: проектирование, монтаж, пусконаладка и техническое обслуживание под ключ.",
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: "Услуги | Electromax",
      description:
        "Каталог инженерных систем Electromax: проектирование, монтаж, пусконаладка и техническое обслуживание под ключ.",
      type: "website",
      locale: "ru_RU",
      url,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Услуги | Electromax",
      description:
        "Каталог инженерных систем Electromax: проектирование, монтаж, пусконаладка и техническое обслуживание под ключ.",
      images: [defaultOgImage],
    },
  };
}

export default function ServicesIndexPage() {
  const services = getServicePageSlugs()
    .map((slug) => getServicePageModel(slug))
    .filter((model): model is NonNullable<ReturnType<typeof getServicePageModel>> =>
      Boolean(model),
    );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-14 border-b border-border bg-muted/20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
              Инженерные решения Electromax
            </p>
            <h1 className="text-balance text-4xl md:text-6xl font-display font-black leading-[1.05]">
              Каталог услуг и систем
            </h1>
            <p className="text-lg text-muted-foreground">
              Проектирование, монтаж, пусконаладка и обслуживание систем безопасности и инженерной
              инфраструктуры.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 transition hover:border-primary/60 hover:shadow-xl"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {service.shortName}
                  </div>
                  <h2 className="mt-3 text-2xl font-display font-black leading-snug text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Перейти к услуге
                  <span aria-hidden="true" className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-border bg-muted/30 p-8 md:p-10">
            <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-black">
                  Нужна консультация инженера?
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Оставьте заявку — подготовим оценку бюджета и сроков под ваш объект.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contacts"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-white shadow-md transition hover:bg-primary/90"
                >
                  Связаться
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-bold text-foreground transition hover:border-primary/60"
                >
                  Смотреть проекты
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
