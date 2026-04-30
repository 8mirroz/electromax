import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Info } from "lucide-react";

const stats = [
  {
    value: "12+",
    label: "лет на рынке",
    note: "работаем с коммерческими и промышленными объектами",
  },
  { value: "500+", label: "объектов", note: "проектирование, монтаж, ПНР и обслуживание" },
  { value: "24/7", label: "поддержка", note: "для сервисных и аварийных сценариев" },
  { value: "ISO 9001", label: "контроль качества", note: "процессы и документация по регламенту" },
];

const principles = [
  {
    title: "Единая ответственность за результат",
    description:
      "Берем на себя обследование, проектные решения, поставку, монтаж, пусконаладку и сопровождение. Заказчику не нужно координировать несколько подрядчиков.",
  },
  {
    title: "Инженерная прозрачность",
    description:
      "Поясняем, из чего состоит бюджет, что входит в базовый объем и какие факторы влияют на итоговую стоимость и сроки.",
  },
  {
    title: "Работа на действующих объектах",
    description:
      "Планируем окна работ, поэтапный ввод и сценарии миграции, чтобы снизить риск остановки бизнеса и сбоев эксплуатации.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Аудит и постановка задачи",
    description: "Уточняем цель проекта, ограничения объекта, требования по срокам и нормативам.",
  },
  {
    step: "02",
    title: "Техническое решение и КП",
    description:
      "Предлагаем 1–3 варианта реализации с диапазоном бюджета, сроками и составом работ.",
  },
  {
    step: "03",
    title: "Реализация и сдача",
    description:
      "Выполняем работы по графику, проводим ПНР, передаем исполнительную документацию и инструкции.",
  },
];

const sectors = [
  "Офисные и бизнес-центры",
  "Складские и логистические комплексы",
  "Промышленные предприятия",
  "Торговые центры и ритейл",
  "Сетевые объекты и распределенные площадки",
  "Объекты с повышенными требованиями к режиму доступа",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <section className="pt-28 pb-12 md:pt-32 md:pb-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-6">
            <Badge icon={Info}>О компании</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[1.05]">
              Инженерная интеграция систем безопасности и электромонтажа
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              OneDim проектирует, внедряет и обслуживает комплексные системы безопасности и
              электротехнические решения для коммерческих и промышленных объектов. Мы работаем не
              только с оборудованием, но и с логикой эксплуатации объекта: режимами доступа,
              сценариями аварий, требованиями аудита и сдачи.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg">
                <Link href="/contacts">
                  Обсудить проект
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">Посмотреть кейсы</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-border bg-foreground/[0.02]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-border bg-card p-6">
                <div className="text-3xl md:text-4xl font-display font-black text-primary mb-2">
                  {item.value}
                </div>
                <div className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-foreground mb-3">
                  {item.label}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight mb-6">
                Как мы подходим к проектам
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-10">
                Наша задача — не просто “смонтировать систему”, а обеспечить работоспособность,
                документальную прозрачность и управляемую эксплуатацию. Поэтому мы строим работу
                через техническую декомпозицию, понятные этапы и единый контур ответственности.
              </p>

              <div className="space-y-6">
                {principles.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.75rem] border border-border bg-card p-6"
                  >
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-[2rem] border border-border bg-card p-8 sticky top-24">
                <div className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-muted-foreground mb-4">
                  Отрасли и типы объектов
                </div>
                <ul className="space-y-3 mb-8">
                  {sectors.map((sector) => (
                    <li key={sector} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span className="font-medium text-foreground">{sector}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl bg-muted/40 border border-border p-5">
                  <div className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-muted-foreground mb-2">
                    Документы и допуски
                  </div>
                  <p className="text-sm text-foreground font-medium leading-relaxed mb-4">
                    По запросу предоставляем сведения о лицензиях, допусках и подтверждающих
                    документах под тендерную или внутреннюю проверку.
                  </p>
                  <Link
                    href="/licenses"
                    className="text-sm font-black text-primary hover:text-blue-700 transition"
                  >
                    Перейти к документам →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight mb-4">
              Типовой сценарий работы с заказчиком
            </h2>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Сохраняем низкую когнитивную нагрузку и прозрачность процесса: на каждом этапе
              понятно, кто отвечает, какой результат на выходе и что требуется от заказчика.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {workflow.map((item) => (
              <article key={item.step} className="rounded-[2rem] border border-border bg-card p-8">
                <div className="text-[10px] font-bold tracking-tight text-primary mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-8 md:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-primary mb-3">
                Следующий шаг
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-foreground mb-4">
                Нужен подрядчик для нового объекта или модернизации?
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Напишите нам задачу, площадь и сроки запуска. Подготовим предварительную структуру
                работ и подскажем, с чего начать, чтобы не тратить бюджет на лишние переделки.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
              <Button asChild size="lg">
                <Link href="/contacts">Получить консультацию</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">Смотреть проекты</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
