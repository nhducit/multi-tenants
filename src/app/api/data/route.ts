import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  NextResponse.json({ response: "ok" });
}
