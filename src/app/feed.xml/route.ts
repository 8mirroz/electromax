import { listCmsCollection } from "@/lib/cms/client";
import { getSiteUrl } from "@/lib/seo";

export async function GET() {
  const siteUrl = getSiteUrl() || "https://electromax.pro";
  const articles = await listCmsCollection("articles", { locale: "ru", limit: 50 });

  const items = articles
    .map(
      (a) => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/knowledge/${a.slug}</link>
      <description><![CDATA[${a.excerpt}]]></description>
      <pubDate>${new Date(a.updatedAt || a.publishedAt).toUTCString()}</pubDate>
      <guid>${siteUrl}/knowledge/${a.slug}</guid>
    </item>`,
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Electromax — База знаний</title>
    <link>${siteUrl}</link>
    <description>Статьи и материалы по инженерным системам безопасности</description>
    <language>ru</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
