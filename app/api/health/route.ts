import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "myeye",
    timestamp: new Date().toISOString(),
  });
}
