import type { Metadata } from "next";
import { listCmsCollection } from "@/lib/cms/client";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Видео",
  description: "Видеоразборы аудитов, проектов и внедрений инженерных систем OneDim.",
};

export default async function VideosPage() {
  const videos = await listCmsCollection("videos", { locale: "ru", limit: 50 });
  const siteUrl = getSiteUrl();

  const videoSchemas = videos.map((video) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.summary,
    contentUrl: video.videoUrl,
    uploadDate: new Date().toISOString(),
  }));
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl || "/" },
      { "@type": "ListItem", position: 2, name: "Видео" },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchemas) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="border-b border-border bg-muted/20 pt-28 pb-14">
        <div className="container mx-auto max-w-6xl px-6">
          <h1 className="text-4xl font-display font-black md:text-5xl">Видеоразборы</h1>
          <p className="mt-4 text-muted-foreground">
            Форматы: аудит объекта, кейс внедрения, инженерные решения и эксплуатация.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {videos.map((video) => (
            <article key={video.id} className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl font-display font-black">{video.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{video.summary}</p>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
              >
                Смотреть видео
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
