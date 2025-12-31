import { NextResponse } from "next/server";
import { getLiveExecutiveOrders } from "@/lib/data/live";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getLiveExecutiveOrders();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch executive orders:", error);
    return NextResponse.json(
      { orders: [], status: "unavailable" },
      { status: 500 }
    );
  }
}
