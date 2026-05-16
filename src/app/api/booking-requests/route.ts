import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type LeadStatus = "new" | "followed";

type BookingRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  event: string;
  eventDate: string;
  eventLocation: string;
  budget: string;
  message: string;
  leadStatus: LeadStatus;
  called: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function GET() {
  try {
    const items = await prisma.bookingLead.findMany({
      orderBy: { createdAt: "desc" },
    });

    const response: BookingRequest[] = items.map((item) => ({
      ...item,
      leadStatus: item.leadStatus,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to read booking requests:", error);
    return NextResponse.json({ error: "Failed to read booking requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const event = String(body?.event ?? "").trim();
    const eventDate = String(body?.eventDate ?? "").trim();
    const eventLocation = String(body?.eventLocation ?? "").trim();
    const budget = String(body?.budget ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const next = await prisma.bookingLead.create({
      data: {
        name,
        email,
        phone,
        event,
        eventDate,
        eventLocation,
        budget,
        message,
        leadStatus: "new",
        called: false,
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        ...next,
        createdAt: next.createdAt.toISOString(),
        updatedAt: next.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to create booking request:", error);
    return NextResponse.json({ success: false, error: "Failed to create booking request" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body?.id ?? "").trim();

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const existing = await prisma.bookingLead.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Booking request not found" }, { status: 404 });
    }

    const nextLeadStatus = body?.leadStatus;
    const nextCalled = body?.called;

    if (nextLeadStatus !== undefined && nextLeadStatus !== "new" && nextLeadStatus !== "followed") {
      return NextResponse.json({ success: false, error: "Invalid lead status" }, { status: 400 });
    }

    if (nextCalled !== undefined && typeof nextCalled !== "boolean") {
      return NextResponse.json({ success: false, error: "Invalid called value" }, { status: 400 });
    }

    const updated = await prisma.bookingLead.update({
      where: { id },
      data: {
        leadStatus: nextLeadStatus ?? existing.leadStatus,
        called: nextCalled ?? existing.called,
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to update booking request:", error);
    return NextResponse.json({ success: false, error: "Failed to update booking request" }, { status: 500 });
  }
}
