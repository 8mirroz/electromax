import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isValidRuPhone, type LeadApiResponse, type LeadPayload } from "@/lib/leads";

function errorResponse(
  status: number,
  error: string,
  code: LeadApiResponse["code"],
  extra?: Partial<LeadApiResponse>,
) {
  return NextResponse.json<LeadApiResponse>({ success: false, error, code, ...extra }, { status });
}

type DeliveryChannelStatus = {
  configured: boolean;
  attempted: boolean;
  ok: boolean;
  error?: string;
};

type DeliveryStatus = {
  telegram: DeliveryChannelStatus;
  email: DeliveryChannelStatus;
  attemptedChannels: string[];
  deliveredChannels: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;
    const hasRequiredNumericFields =
      Number.isFinite(body.estimatedPrice) &&
      Number.isFinite(body.areaSquareMeters) &&
      Number.isFinite(body.complexityCoef);

    // Validate essential fields
    if (!body.contactPhone || !body.objectType || !hasRequiredNumericFields) {
      return errorResponse(400, "Не заполнены обязательные поля", "validation_error");
    }

    if (!isValidRuPhone(body.contactPhone)) {
      return errorResponse(400, "Некорректный формат телефона", "validation_error");
    }

    const projectSummaryText = (() => {
      if (!body.projectTraySummary || typeof body.projectTraySummary !== "object") {
        return "";
      }

      const summary = body.projectTraySummary as {
        serviceSlug?: string;
        serviceTitle?: string;
        items?: Array<{ itemCode?: string; itemName?: string; qty?: number; unit?: string }>;
        selectedKitIds?: string[];
        notes?: string;
        estimatedRange?: { min?: number; max?: number; currency?: string } | null;
      };

      const lines: string[] = [];

      if (summary.serviceTitle || summary.serviceSlug) {
        lines.push(`*Проект (страница)*: ${summary.serviceTitle || summary.serviceSlug}`);
      }

      if (summary.items?.length) {
        lines.push(`*Позиции проекта* (${summary.items.length}):`);
        for (const item of summary.items.slice(0, 10)) {
          lines.push(
            `- ${item.itemName || item.itemCode || "Позиция"} x${item.qty ?? 1} ${item.unit || ""}`.trim(),
          );
        }
        if (summary.items.length > 10) {
          lines.push(`- ... еще ${summary.items.length - 10} поз.`);
        }
      }

      if (summary.selectedKitIds?.length) {
        lines.push(`*Наборы*: ${summary.selectedKitIds.join(", ")}`);
      }

      if (summary.estimatedRange) {
        const min = summary.estimatedRange.min;
        const max = summary.estimatedRange.max;
        const currency = summary.estimatedRange.currency || "RUB";
        if (Number.isFinite(min) && Number.isFinite(max)) {
          lines.push(
            `*Ориентир проекта*: ${Number(min).toLocaleString("ru-RU")}–${Number(max).toLocaleString("ru-RU")} ${currency}`,
          );
        }
      }

      if (summary.notes) {
        lines.push(`*Комментарий к проекту*: ${summary.notes}`);
      }

      return lines.length ? `\n\n${lines.join("\n")}` : "";
    })();

    // Turnstile Verification
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && body.turnstileToken) {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${turnstileSecret}&response=${body.turnstileToken}`,
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return errorResponse(400, "Подтвердите, что вы не робот", "captcha_failed");
      }
    } else if (turnstileSecret && !body.turnstileToken) {
      return errorResponse(400, "Требуется токен проверки", "captcha_failed");
    }

    const message = [
      `🚨 *Новая заявка (Electromax)* 🚨`,
      `*Тип объекта*: ${body.objectType}`,
      `*Площадь*: ${body.areaSquareMeters} м²`,
      `*Коэффициент сложности*: ${body.complexityCoef}`,
      `*Предварительная цена*: ${body.estimatedPrice.toLocaleString("ru-RU")} RUB`,
      ``,
      `📞 *Телефон*: [${body.contactPhone}](tel:${body.contactPhone.replace(/[\\+\\s\\(\\)-]/g, "")})`,
      body.leadNote ? `*Комментарий клиента*: ${body.leadNote}` : undefined,
      projectSummaryText || undefined,
    ]
      .filter(Boolean)
      .join("\n");

    const delivery: DeliveryStatus = {
      telegram: { configured: false, attempted: false, ok: false },
      email: { configured: false, attempted: false, ok: false },
      attemptedChannels: [],
      deliveredChannels: [],
    };

    // 1. Send via Telegram (if token exists)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgToken && tgChatId) {
      delivery.telegram.configured = true;
      const tgUrl = `https://api.telegram.org/bot${tgToken}/sendMessage`;
      delivery.telegram.attempted = true;
      delivery.attemptedChannels.push("telegram");
      try {
        const tgRes = await fetch(tgUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: message,
            parse_mode: "Markdown",
          }),
        });
        const tgJson = await tgRes.json().catch(() => null);
        if (tgRes.ok && tgJson?.ok !== false) {
          delivery.telegram.ok = true;
          delivery.deliveredChannels.push("telegram");
        } else {
          const tgError = tgJson?.description || `HTTP ${tgRes.status}`;
          delivery.telegram.error = tgError;
          console.error("Telegram error:", tgError);
        }
      } catch (err) {
        const tgError = err instanceof Error ? err.message : "Telegram request failed";
        delivery.telegram.error = tgError;
        console.error("Telegram error:", tgError);
      }
    } else {
      console.warn("Telegram tokens missing. Skipping Telegram notification.");
    }

    // 2. Send via Email (if SMTP config exists)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const smtpTo = process.env.SMTP_TO;

    if (smtpHost && smtpUser && smtpPass && smtpTo) {
      delivery.email.configured = true;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      delivery.email.attempted = true;
      delivery.attemptedChannels.push("email");
      try {
        await transporter.sendMail({
          from: `"Electromax Leads" <${smtpFrom}>`,
          to: smtpTo,
          subject: `Новая заявка: ${body.objectType} (${body.areaSquareMeters} м²)`,
          text: message.replace(/\\*/g, ""), // text version without markdown stars
        });
        delivery.email.ok = true;
        delivery.deliveredChannels.push("email");
      } catch (err) {
        const smtpError = err instanceof Error ? err.message : "SMTP send failed";
        delivery.email.error = smtpError;
        console.error("SMTP error:", smtpError);
      }
    } else {
      console.warn("SMTP tokens missing. Skipping Email notification.");
    }

    const hasAnyChannelConfigured = delivery.telegram.configured || delivery.email.configured;
    const hasAnyDelivered = delivery.deliveredChannels.length > 0;

    if (!hasAnyChannelConfigured) {
      return errorResponse(503, "Каналы доставки не настроены", "upstream_error", { delivery });
    }

    if (!hasAnyDelivered) {
      return NextResponse.json<LeadApiResponse>(
        {
          success: false,
          error: "Не удалось доставить заявку",
          code: "upstream_error",
          delivery,
        },
        { status: 502 },
      );
    }

    return NextResponse.json<LeadApiResponse>({
      success: true,
      message: "Заявка успешно обработана",
      delivery,
    });
  } catch (error) {
    console.error("[Lead API Error]:", error);
    return errorResponse(500, "Внутренняя ошибка сервера", "internal_error");
  }
}
