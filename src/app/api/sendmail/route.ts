import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, event, message } = body;

  const msg = {
    to: "your@email.com", // Replace with Neeraj Bakshi's booking email
    from: "no-reply@neerajbakshi.co.in", // Use a verified sender
    subject: `Booking Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nEvent: ${event}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Event:</strong> ${event}</p><p><strong>Message:</strong> ${message}</p>`
  };

  try {
    await sgMail.send(msg);
    return NextResponse.json({ success: true });
  } catch (error) {
    let errorMsg = "Unknown error";
    if (error instanceof Error) errorMsg = error.message;
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
