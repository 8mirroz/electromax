import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/layout/Navbar";

type LicenseDoc = {
  title: string;
  number: string;
  validUntil: string;
  scope: string;
  note: string;
  status: "active" | "permanent";
};

const docs: LicenseDoc[] = [
  {
    title: "Лицензия МЧС",
    number: "№ 77-Б/01234",
    validUntil: "до 2029",
    scope: "Работы по монтажу, техническому обслуживанию и ремонту средств обеспечения пожарной безопасности зданий и сооружений.",
    note: "Критична для работ по АПС/СОУЭ и сервисному сопровождению, когда требуется подтверждение допуска исполнителя.",
    status: "active",
  },
  {
    title: "Допуск СРО",
    number: "№ П.012.77.1234.05.2024",
    validUntil: "бессрочно",
    scope: "Выполнение проектных и строительно-монтажных работ в рамках допусков и регламентов саморегулируемой организации.",
    note: "Используется в составе пакета документов для коммерческих объектов и подрядных процедур.",
    status: "permanent",
  },
  {
    title: "ISO 9001:2015",
    number: "№ RU.MS.01.2345",
    validUntil: "до 2027",
    scope: "Система менеджмента качества для процессов проектирования, реализации и сопровождения инженерных решений.",
    note: "Подтверждает процессный подход к качеству и управлению изменениями по проекту.",
    status: "active",
  },
];

const complianceSteps = [
  "Проверяем комплект документов до старта проекта и обновляем данные по срокам действия.",
  "Закрепляем в договоре состав работ и ответственность сторон по этапам.",
  "Передаем заказчику пакет документов, связанных с выполненными работами и сдачей.",
];

export default function LicensesPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-28 pb-12 md:pt-32 md:pb-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-6">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] border border-primary/20">
              Лицензии и допуски
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[1.05]">
              Документы, подтверждающие допуски и управляемость работ
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              На этой странице собраны ключевые документы, которые чаще всего требуются заказчикам, службе безопасности, внутреннему аудиту и закупочным подразделениям. По запросу предоставляем расширенный пакет сведений для тендеров и согласований.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              <div className="space-y-6">
                {docs.map((doc) => (
                  <article
                    key={doc.number}
                    className="rounded-[2rem] border border-border bg-card p-6 md:p-8 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">{doc.title}</h2>
                        <div className="text-sm font-bold text-primary">{doc.number}</div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] border ${
                          doc.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                      >
                        {doc.validUntil}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-2">
                          Что подтверждает
                        </div>
                        <p className="text-sm text-foreground font-medium leading-relaxed">{doc.scope}</p>
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-2">
                          Для заказчика
                        </div>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{doc.note}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.14em]">
                        Копии и подтверждения — по запросу в отдел продаж
                      </p>
                      <Link
                        href="/contacts"
                        className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-blue-700 transition"
                      >
                        Запросить пакет документов
                        <span className="material-icons-outlined text-base">arrow_forward</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <section className="rounded-[2rem] border border-border bg-card p-6">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-4">
                    Почему это важно
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Снижает риск отклонения подрядчика на этапе проверки",
                      "Ускоряет согласование службой безопасности и закупками",
                      "Повышает предсказуемость сдачи и документооборота",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="material-icons-outlined text-primary text-xl mt-0.5">verified</span>
                        <span className="text-sm font-medium text-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-[2rem] border border-border bg-card p-6">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-4">
                    Наш подход к compliance
                  </div>
                  <ol className="space-y-4">
                    {complianceSteps.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-foreground leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="rounded-[2rem] border border-primary/20 bg-primary/5 p-6">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-primary mb-3">Нужны документы под тендер?</div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-4">
                    Напишите, какой комплект требуется: допуски, лицензии, карточка компании, реквизиты, подтверждение опыта, сведения о работах и объектах.
                  </p>
                  <Link
                    href="/contacts"
                    className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-primary text-white font-bold hover:bg-blue-700 transition w-full"
                  >
                    Отправить запрос
                  </Link>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
