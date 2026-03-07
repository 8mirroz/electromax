import { NextResponse } from "next/server";
import { z } from "zod";

const cspReportSchema = z.object({
  "csp-report": z
    .object({
      "document-uri": z.string().optional(),
      referrer: z.string().optional(),
      "violated-directive": z.string().optional(),
      "effective-directive": z.string().optional(),
      "original-policy": z.string().optional(),
      disposition: z.string().optional(),
      "blocked-uri": z.string().optional(),
      "line-number": z.number().optional(),
      "column-number": z.number().optional(),
      "source-file": z.string().optional(),
      "status-code": z.number().optional(),
      "script-sample": z.string().optional(),
    })
    .passthrough()
    .optional(),
});

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => ({}));
    const parsed = cspReportSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid CSP report" }, { status: 400 });
    }

    const report = parsed.data["csp-report"];
    if (report) {
      console.warn("[CSP-REPORT]", {
        documentUri: report["document-uri"],
        violatedDirective: report["violated-directive"] || report["effective-directive"],
        blockedUri: report["blocked-uri"],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process CSP report",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "csp-report" });
}
