import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), "public/gallery/videos.json");
    if (body.overwrite && body.data) {
      fs.writeFileSync(filePath, JSON.stringify(body.data, null, 2), "utf-8");
      return NextResponse.json({ success: true });
    }
    const { category, links } = body;
    let data: any = {};
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    data[category] = links;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
