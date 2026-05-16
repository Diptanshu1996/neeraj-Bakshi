import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type StatusValue = "pending" | "approved";

type TestimonialBody = {
  id?: unknown;
  name?: unknown;
  role?: unknown;
  text?: unknown;
  rating?: unknown;
  status?: unknown;
};

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function toRating(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(5, Math.max(1, Math.round(parsed)));
}

function normalizeStatus(value: unknown): StatusValue | null {
  const text = toText(value).toLowerCase();
  if (text === "pending" || text === "approved") return text;
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = toText(searchParams.get("scope"));

    const where = scope === "all" ? {} : { status: "approved" as const };

    const items = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to read testimonials:", error);
    return NextResponse.json({ error: "Failed to read testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TestimonialBody;
    const name = toText(body.name);
    const role = toText(body.role);
    const text = toText(body.text);
    const rating = toRating(body.rating);

    if (!name || !text) {
      return NextResponse.json({ error: "Name and testimonial are required" }, { status: 400 });
    }

    const created = await prisma.testimonial.create({
      data: {
        name,
        role,
        text,
        rating,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, item: created });
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as TestimonialBody;
    const id = toText(body.id);

    if (!id) {
      return NextResponse.json({ error: "Testimonial id is required" }, { status: 400 });
    }

    const status = normalizeStatus(body.status);

    if (!status) {
      return NextResponse.json({ error: "Status must be pending or approved" }, { status: 400 });
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = toText(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "Testimonial id is required" }, { status: 400 });
    }

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
