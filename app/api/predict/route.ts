import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์ภาพ" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadForm = new FormData();
    uploadForm.append("file", new Blob([buffer], { type: file.type }), file.name);

    const fastApiUrl = process.env.FASTAPI_URL || "http://127.0.0.1:8000/predict";

    const response = await fetch(fastApiUrl, {
      method: "POST",
      body: uploadForm,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "การเชื่อมต่อ FastAPI ล้มเหลว",
          details: errorText,
        },
        { status: 502 },
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "เกิดข้อผิดพลาดในการประมวลผล",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
