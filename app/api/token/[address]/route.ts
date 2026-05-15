import { NextRequest, NextResponse } from "next/server";
import { getTokenDetail } from "@/lib/scanner";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { success: false, error: "Invalid token address" },
        { status: 400 }
      );
    }

    const detail = await getTokenDetail(address as `0x${string}`);

    if (!detail) {
      return NextResponse.json(
        { success: false, error: "Token not found or not a Liquid Protocol token" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, token: detail });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
