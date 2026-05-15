import { NextResponse } from "next/server";
import { scanNewTokens } from "@/lib/scanner";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  try {
    const tokens = await scanNewTokens();
    return NextResponse.json({ success: true, tokens, count: tokens.length });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
