import { SERVICES_DB } from "@/data/services";
import { notFound } from "next/navigation";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { Footer } from "@/components/sections/Footer";
import { Pricing } from "@/components/ui/Pricing";
import { CalculatorForm } from "@/components/forms/CalculatorForm";
import { AnimatedTabs } from "@/components/ui/Tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(SERVICES_DB).map((slug) => ({
    slug,
  }));
}

export default function ServicePage({ params }: PageProps) {
  const service = SERVICES_DB[params.slug];

  if (!service) {
    notFound();
  }

  const tabsContent = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-2xl font-bold">О системе</h2>
          <p className="text-muted-foreground leading-relaxed">{service.description}</p>
        </div>
      ),
    },
    {
      id: "process",
      label: "Process",
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-2xl font-bold">Этапы работы</h2>
          <div className="grid gap-4">
            {service.includedSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4 p-4 border rounded-xl bg-card">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Dynamic SEO Meta title managed in layout or metadata export, keeping simple here */}

      <div className="absolute top-0 w-full z-50 pt-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/services">Услуги</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{service.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <HeroBanner title={service.title} subtitle={service.description}>
        <a
          href="#calculator"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
        >
          Рассчитать стоимость
        </a>
      </HeroBanner>

      <section className="py-20 container mx-auto px-6 max-w-6xl grid lg:grid-cols-2 gap-16">
        <div>
          <AnimatedTabs tabs={tabsContent} />
        </div>

        <div id="calculator" className="scroll-mt-24">
          <CalculatorForm basePrice={service.basePricePerSqm} serviceSlug={service.id} />
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Тарифы и цены</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Мы предлагаем прозрачное ценообразование на установку систем {service.title} с
              гарантией 1 год.
            </p>
          </div>
          <Pricing packages={service.packages} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
