import { NextResponse } from "next/server";
import { fetchSupremeCourtCases } from "@/lib/ingest/oyez";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term") || undefined;
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  try {
    const cases = await fetchSupremeCourtCases(term, limit, {
      next: { revalidate: 3600 },
    });

    return NextResponse.json({
      cases,
      term: term || "all",
      status: "live",
    });
  } catch (error) {
    console.error("Failed to fetch SCOTUS cases:", error);
    return NextResponse.json(
      { cases: [], term: term || "all", status: "unavailable" },
      { status: 500 }
    );
  }
}
