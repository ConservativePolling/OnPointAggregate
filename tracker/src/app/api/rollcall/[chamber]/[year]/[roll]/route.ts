import { NextResponse } from "next/server";
import { fetchHouseRollCall, fetchSenateRollCall } from "@/lib/ingest/rollCalls";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chamber: string; year: string; roll: string }> }
) {
  const { chamber, year, roll } = await params;

  try {
    let rollCall = null;

    if (chamber.toLowerCase() === "house") {
      rollCall = await fetchHouseRollCall(year, roll, {
        next: { revalidate: 3600 },
      });
    } else if (chamber.toLowerCase() === "senate") {
      // For Senate, year is congress number and we need session
      // Format: /api/rollcall/senate/119-1/00001
      const [congress, session] = year.split("-");
      rollCall = await fetchSenateRollCall(congress, session || "1", roll, {
        next: { revalidate: 3600 },
      });
    }

    if (!rollCall) {
      return NextResponse.json(
        { rollCall: null, status: "not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      rollCall,
      status: "live",
    });
  } catch (error) {
    console.error("Failed to fetch roll call:", error);
    return NextResponse.json(
      { rollCall: null, status: "unavailable" },
      { status: 500 }
    );
  }
}
