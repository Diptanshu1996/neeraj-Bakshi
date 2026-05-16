import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type HighlightBody = {
  title?: unknown;
  youtubeUrl?: unknown;
  thumbnail?: unknown;
  id?: unknown;
};

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const items = await prisma.performanceHighlight.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to read performance highlights:", error);
    return NextResponse.json({ error: "Failed to read performance highlights" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HighlightBody;
    const title = toText(body.title);
    const youtubeUrl = toText(body.youtubeUrl);
    const thumbnail = toText(body.thumbnail);

    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: "Title and YouTube URL are required" }, { status: 400 });
    }

    if (!isValidHttpUrl(youtubeUrl)) {
      return NextResponse.json({ error: "Please provide a valid http/https URL for YouTube" }, { status: 400 });
    }

    const created = await prisma.performanceHighlight.create({
      data: {
        title,
        youtubeUrl,
        thumbnail,
      },
    });

    return NextResponse.json({ success: true, item: created });
  } catch (error) {
    console.error("Failed to create performance highlight:", error);
    return NextResponse.json({ error: "Failed to create performance highlight" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as HighlightBody;
    const id = toText(body.id);

    if (!id) {
      return NextResponse.json({ error: "Highlight id is required" }, { status: 400 });
    }

    const title = toText(body.title);
    const youtubeUrl = toText(body.youtubeUrl);
    const thumbnail = toText(body.thumbnail);

    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: "Title and YouTube URL are required" }, { status: 400 });
    }

    if (!isValidHttpUrl(youtubeUrl)) {
      return NextResponse.json({ error: "Please provide a valid http/https URL for YouTube" }, { status: 400 });
    }

    const updated = await prisma.performanceHighlight.update({
      where: { id },
      data: {
        title,
        youtubeUrl,
        thumbnail,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Failed to update performance highlight:", error);
    return NextResponse.json({ error: "Failed to update performance highlight" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = toText(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "Highlight id is required" }, { status: 400 });
    }

    await prisma.performanceHighlight.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete performance highlight:", error);
    return NextResponse.json({ error: "Failed to delete performance highlight" }, { status: 500 });
  }
}
