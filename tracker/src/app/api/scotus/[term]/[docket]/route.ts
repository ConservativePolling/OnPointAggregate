import { NextResponse } from "next/server";
import { fetchSupremeCourtCaseByDocket } from "@/lib/ingest/oyez";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ term: string; docket: string }> }
) {
  const { term, docket } = await params;

  try {
    const caseData = await fetchSupremeCourtCaseByDocket(term, docket, {
      next: { revalidate: 3600 },
    });

    if (!caseData) {
      return NextResponse.json(
        { case: null, status: "not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      case: caseData,
      status: "live",
    });
  } catch (error) {
    console.error("Failed to fetch SCOTUS case:", error);
    return NextResponse.json(
      { case: null, status: "unavailable" },
      { status: 500 }
    );
  }
}
