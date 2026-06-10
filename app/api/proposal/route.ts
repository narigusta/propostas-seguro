import { NextRequest, NextResponse } from "next/server";
import { getProposal, createProposal, updateProposal, getProposalsByConsultant } from "@/lib/sheets";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const consultantId = req.nextUrl.searchParams.get("consultantId");

  if (id) {
    const proposal = await getProposal(id);
    if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(proposal);
  }

  if (consultantId) {
    const proposals = await getProposalsByConsultant(consultantId);
    return NextResponse.json(proposals);
  }

  return NextResponse.json({ error: "Missing params" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = Date.now().toString();
  const data = { ...body, id, createdAt: new Date().toISOString() };
  await createProposal(data);
  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, consultantId, ...rest } = body;
  if (!id || !consultantId) return NextResponse.json({ error: "Missing id or consultantId" }, { status: 400 });

  // Verify ownership
  const existing = await getProposal(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.consultantId !== consultantId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await updateProposal(id, { ...existing, ...rest, id, consultantId });
  return NextResponse.json({ success: true });
}
