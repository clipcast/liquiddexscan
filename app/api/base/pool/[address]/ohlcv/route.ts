import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const tf = request.nextUrl.searchParams.get("tf") || "1h";
    const url = `https://api.geckoterminal.com/api/v2/networks/base/pools/${address}/ohlcv/${tf}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
