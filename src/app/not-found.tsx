import Link from "next/link";
import { AlertCircle, Home, Mail, Wrench } from "lucide-react";
import { Footer } from "@/components/sections/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="bg-background border-b border-border">
        <div className="container mx-auto max-w-7xl h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Wrench className="text-primary w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              ELECTRO<span className="text-primary">MAX</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-[10px] font-bold text-muted-foreground hover:text-primary lowercase first-letter:uppercase tracking-tight"
          >
            На главную
          </Link>
        </div>
      </nav>

      {/* 404 Content */}
      <section className="flex-1 flex items-center justify-center py-24">
        <div className="text-center px-6">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="text-primary w-14 h-14" />
          </div>
          <h1 className="text-9xl font-display font-black text-primary mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
            Страница не найдена
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto font-medium">
            Возможно, она была удалена или перемещена
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 h-14 rounded-full bg-primary text-white font-bold text-base hover:bg-blue-700 transition shadow-lg shadow-primary/25"
            >
              <Home className="w-5 h-5 mr-2" />
              На главную
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center px-8 py-4 h-14 rounded-full border-2 border-primary text-primary font-bold text-base hover:bg-primary hover:text-white transition"
            >
              <Mail className="w-5 h-5 mr-2" />
              Написать нам
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
