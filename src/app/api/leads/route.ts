import { NextResponse } from "next/server";
import type { LeadPayload } from "@/components/forms/CalculatorForm";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;

    // Validate essential fields
    if (!body.contactPhone || !body.estimatedPrice) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Mock sending to Telegram/CRM
    console.log("===============================");
    console.log("🚨 [MOCK CRM] NEW LEAD REPORT 🚨");
    console.log(`- Type: ${body.objectType}`);
    console.log(`- Area: ${body.areaSquareMeters} m2`);
    console.log(`- Phone: ${body.contactPhone}`);
    console.log(`- Price Estimate: ${body.estimatedPrice} RUB`);
    console.log(`- Complexity: ${body.complexityCoef}`);
    console.log("===============================");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, message: "Lead processed successfully" });
  } catch (error) {
    console.error("[Lead API Error]:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
