import { NextRequest, NextResponse } from "next/server";
import { getConsultant, createConsultant } from "@/lib/sheets";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const consultant = await getConsultant(id);
    if (!consultant) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(consultant);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("GET /api/consultant error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, whatsapp } = body;
    if (!name || !whatsapp) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const id = Date.now().toString().slice(-8) + Math.floor(Math.random() * 100).toString().padStart(2, "0");
    await createConsultant({ id, name, whatsapp });
    return NextResponse.json({ id, name, whatsapp });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("POST /api/consultant error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
