"use client";

import { useState } from "react";
import { formatPhone } from "@/lib/phone";
import { isValidRuPhone, type LeadApiResponse, type LeadPayload } from "@/lib/leads";
import { formatProjectTrayRange } from "@/lib/project-tray";
import type { ProjectTrayState } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceSlug: string;
  serviceTitle: string;
  tray: ProjectTrayState;
  onRemoveItem: (itemId: string) => void;
  onUpdateQty: (itemId: string, qty: number) => void;
  onUpdateItemNotes: (itemId: string, comment: string) => void;
  onNotesChange: (notes: string) => void;
  onClear: () => void;
}

export function ProjectTrayDrawer(props: Props) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const submitLead = async () => {
    if (!isValidRuPhone(phone)) {
      setStatus("error");
      setError("Введите телефон в формате +7 (999) 123-45-67");
      return;
    }

    setStatus("loading");
    setError("");

    const summary = {
      serviceSlug: props.serviceSlug,
      serviceTitle: props.serviceTitle,
      items: props.tray.items.map((item) => ({
        itemCode: item.itemCode,
        itemName: item.itemName,
        qty: item.qty,
        unit: item.unit,
        sourceKind: item.sourceKind,
        sourceLabel: item.sourceLabel,
      })),
      selectedKitIds: props.tray.selectedKitIds,
      notes: props.tray.notes,
      estimatedRange: props.tray.estimatedRange,
      updatedAt: props.tray.updatedAt,
    };

    const payload: LeadPayload = {
      objectType: "project",
      areaSquareMeters: 0,
      complexityCoef: 1,
      estimatedPrice: props.tray.estimatedRange?.max ?? props.tray.estimatedRange?.min ?? 0,
      contactPhone: phone,
      projectTraySummary: summary,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as LeadApiResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Не удалось отправить заявку");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ошибка сети");
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Закрыть проект-трей оверлей"
        onClick={props.onClose}
        aria-hidden={!props.isOpen}
        disabled={!props.isOpen}
        tabIndex={props.isOpen ? 0 : -1}
        className={`fixed inset-0 z-50 bg-[#0b1020]/40 transition md:hidden ${props.isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        data-testid="project-tray-drawer"
        aria-hidden={!props.isOpen}
        // @ts-expect-error inert is supported by modern browsers, but not yet typed in React.
        inert={!props.isOpen ? "" : undefined}
        className={`fixed bottom-0 left-0 right-0 z-[60] max-h-[88vh] rounded-t-3xl border border-border bg-white shadow-2xl transition-transform md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:max-h-none md:w-[420px] md:rounded-none md:border-l ${props.isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Project Tray v1
              </div>
              <h2 className="text-lg font-display font-black uppercase tracking-tight">
                Проект по {props.serviceSlug.toUpperCase()}
              </h2>
            </div>
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold"
            >
              Закрыть
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            <div className="rounded-xl bg-muted p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ориентир суммы
              </div>
              <div className="mt-1 text-base font-semibold text-foreground">
                {formatProjectTrayRange(props.tray.estimatedRange)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Точный расчет после аудита/ТЗ.
              </div>
            </div>

            {props.tray.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Проект пуст. Добавьте позиции из каталога или готовый набор.
              </div>
            ) : (
              <div className="space-y-3">
                {props.tray.items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{item.itemName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.itemCode} •{" "}
                          {item.sourceKind === "kit" ? `Набор: ${item.sourceLabel}` : "Каталог"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => props.onRemoveItem(item.id)}
                        className="text-xs font-semibold text-rose-600"
                      >
                        Удалить
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-[90px_1fr] gap-2">
                      <label className="text-xs text-muted-foreground">
                        Кол-во
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => props.onUpdateQty(item.id, Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-border px-2 py-1 text-sm"
                        />
                      </label>
                      <label className="text-xs text-muted-foreground">
                        Комментарий
                        <input
                          type="text"
                          value={item.comment ?? ""}
                          onChange={(e) => props.onUpdateItemNotes(item.id, e.target.value)}
                          placeholder="Например: 2 этаж, ночное окно"
                          className="mt-1 w-full rounded-lg border border-border px-2 py-1 text-sm"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <label className="block text-xs text-muted-foreground">
              Комментарий к проекту
              <textarea
                value={props.tray.notes}
                onChange={(e) => props.onNotesChange(e.target.value)}
                rows={3}
                placeholder="Объект, сроки, ограничения доступа, желаемый этап"
                className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
              />
            </label>

            <div className="rounded-xl border border-border p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Перейти к заявке
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Отправим состав проекта в текущую лид-форму API как summary. Данные не
                синхронизируются на сервер до отправки заявки.
              </p>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="+7 (___) ___-__-__"
                className="mt-3 w-full rounded-xl border border-border px-3 py-2 text-sm"
              />
              {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
              {status === "success" ? (
                <p className="mt-2 text-xs text-emerald-700">
                  Заявка по проекту отправлена. Инженер свяжется с вами.
                </p>
              ) : null}
              <button
                type="button"
                disabled={status === "loading"}
                onClick={submitLead}
                className="mt-3 h-10 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {status === "loading" ? "Отправка..." : "Отправить заявку по проекту"}
              </button>
            </div>
          </div>

          <div className="border-t border-border px-4 py-3">
            <button
              type="button"
              onClick={props.onClear}
              className="w-full rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground"
            >
              Очистить проект
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
