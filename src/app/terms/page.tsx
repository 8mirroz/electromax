import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { defaultOgImage, getSiteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const url = siteUrl ? `${siteUrl}/terms` : undefined;

  return {
    title: "Пользовательское соглашение",
    description:
      "Пользовательское соглашение OneDim: условия использования сайта и размещённой информации.",
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: "Пользовательское соглашение | OneDim",
      description:
        "Пользовательское соглашение OneDim: условия использования сайта и размещённой информации.",
      type: "article",
      locale: "ru_RU",
      url,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Пользовательское соглашение | OneDim",
      description:
        "Пользовательское соглашение OneDim: условия использования сайта и размещённой информации.",
      images: [defaultOgImage],
    },
  };
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-14 border-b border-border bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black leading-tight">
              Пользовательское соглашение
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Действует с 25 февраля 2026 года. Используя сайт, вы соглашаетесь с условиями ниже.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8 text-sm leading-relaxed text-foreground">
            <div className="space-y-3">
              <h2 className="text-xl font-bold">1. Термины и стороны</h2>
              <p>
                Сайт принадлежит ООО «УАНДИМ» (далее — «Компания»). Пользователь — любое лицо,
                посещающее сайт и/или отправляющее запрос через формы.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold">2. Использование сайта</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Информация на сайте носит справочный характер.</li>
                <li>
                  Пользователь обязуется не нарушать работоспособность сайта и не использовать его
                  во вред третьим лицам.
                </li>
                <li>
                  Компания вправе изменять структуру и содержание сайта без предварительного
                  уведомления.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold">3. Коммерческие предложения</h2>
              <p>
                Размещённые цены и описания не являются публичной офертой (ст. 437 ГК РФ). Итоговые
                условия определяются в коммерческом предложении после уточнения задачи и
                обследования объекта.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold">4. Интеллектуальная собственность</h2>
              <p>
                Все тексты, изображения, схемы и элементы дизайна являются объектами авторского
                права. Копирование допускается только с письменного разрешения Компании.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold">5. Ответственность</h2>
              <p>
                Компания не несёт ответственность за возможные убытки, возникшие в результате
                использования или невозможности использования сайта, а также за задержки, вызванные
                техническими сбоями.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold">6. Обратная связь</h2>
              <p>
                Запросы и претензии направляйте на
                <Link href="mailto:info@electromax.ru" className="text-primary font-semibold">
                  {" "}
                  info@onedim.ru
                </Link>{" "}
                или по телефону +7 (495) 123-45-67.
              </p>
              <p className="text-muted-foreground">
                Юридический адрес: 109012, г. Москва, ул. Индустриальная 42, БЦ «Технопарк», оф.
                304.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
