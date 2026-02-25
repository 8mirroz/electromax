import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { defaultOgImage, getSiteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const url = siteUrl ? `${siteUrl}/privacy` : undefined;

  return {
    title: "Политика конфиденциальности",
    description:
      "Политика конфиденциальности Electromax: какие данные мы собираем, как используем и защищаем.",
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: "Политика конфиденциальности | Electromax",
      description:
        "Политика конфиденциальности Electromax: какие данные мы собираем, как используем и защищаем.",
      type: "article",
      locale: "ru_RU",
      url,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Политика конфиденциальности | Electromax",
      description:
        "Политика конфиденциальности Electromax: какие данные мы собираем, как используем и защищаем.",
      images: [defaultOgImage],
    },
  };
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-14 border-b border-border bg-muted/20">
        <div className="container mx-auto max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-display font-black leading-tight">
            Политика конфиденциальности
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Действует с 25 февраля 2026 года. Обновления публикуются на этой странице.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-6 space-y-8 text-sm leading-relaxed text-foreground">
          <div className="space-y-3">
            <h2 className="text-xl font-bold">1. Общие положения</h2>
            <p>
              ООО «Электромакс» (далее — «Компания») уважает вашу конфиденциальность и обеспечивает
              защиту персональных данных в соответствии с требованиями законодательства РФ.
              Настоящая политика описывает, какие данные мы собираем, как их используем и какие
              права есть у пользователей.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold">2. Какие данные мы собираем</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Контактные данные: имя, телефон, e-mail (при заполнении форм).</li>
              <li>Данные заявки: тип объекта, площадь, комментарии и состав проекта.</li>
              <li>Технические данные: IP-адрес, cookie, данные браузера и устройства.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold">3. Цели обработки</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Подготовка коммерческих предложений и консультаций.</li>
              <li>Связь с клиентом по заявкам и запросам.</li>
              <li>Улучшение качества сервиса и контента сайта.</li>
              <li>Соблюдение требований законодательства.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold">4. Правовые основания</h2>
            <p>
              Мы обрабатываем данные на основании вашего согласия, а также для исполнения договора
              или преддоговорных обязательств по запросу пользователя.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold">5. Передача и хранение</h2>
            <p>
              Данные могут передаваться подрядчикам (хостинг, email, мессенджеры) только в объёме,
              необходимом для обработки заявки. Мы применяем организационные и технические меры
              защиты от несанкционированного доступа и утечки.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold">6. Сроки хранения</h2>
            <p>
              Персональные данные хранятся не дольше, чем это требуется для целей обработки, либо до
              отзыва согласия, если иное не предусмотрено законом.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold">7. Права пользователя</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Запросить копию, уточнение или удаление своих данных.</li>
              <li>Отозвать согласие на обработку.</li>
              <li>Получить информацию о передаче данных третьим лицам.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold">8. Контакты</h2>
            <p>
              Вопросы по обработке данных направляйте на
              <Link href="mailto:info@electromax.ru" className="text-primary font-semibold">
                {" "}
                info@electromax.ru
              </Link>{" "}
              или по телефону +7 (495) 123-45-67.
            </p>
            <p className="text-muted-foreground">
              Юридический адрес: 109012, г. Москва, ул. Индустриальная 42, БЦ «Технопарк», оф. 304.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
