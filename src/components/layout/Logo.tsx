import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex flex-col gap-0 group">
      <span className="font-display text-lg font-black tracking-tighter leading-none text-foreground">
        ELECTRO<span className="text-primary">MAX</span>
      </span>
      <span className="mt-1 text-[11px] font-bold tracking-[0.22em] text-muted-foreground uppercase leading-none">
        Инжиниринг
      </span>
    </Link>
  );
}
