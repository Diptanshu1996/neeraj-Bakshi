"use client";

import { useEffect, useState } from "react";

type BookingFormState = {
  name: string;
  email: string;
  phone: string;
  event: string;
  eventDate: string;
  eventLocation: string;
  budget: string;
  message: string;
};

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
};

const initialForm: BookingFormState = {
  name: "",
  email: "",
  phone: "",
  event: "",
  eventDate: "",
  eventLocation: "",
  budget: "",
  message: "",
};

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const [form, setForm] = useState<BookingFormState>(initialForm);
  const [status, setStatus] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setStatus(null);
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ kind: "info", text: "Submitting booking request..." });

    try {
      const res = await fetch("/api/booking-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ kind: "success", text: "Booking request sent. We will contact you soon." });
        setForm(initialForm);
        setTimeout(() => onClose(), 900);
      } else {
        setStatus({ kind: "error", text: "Failed to submit request. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", text: "Failed to submit request. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-3xl border border-amber-500/30 bg-gradient-to-br from-zinc-900 to-black p-5 sm:p-7 shadow-2xl shadow-orange-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Booking Desk</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Book Neeraj Bakshi</h2>
          </div>
          <button
            type="button"
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/80 hover:bg-white/20 border border-white/10"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {status && (
          <div
            className={`mb-4 rounded-lg border px-4 py-2 text-sm ${
              status.kind === "success"
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                : status.kind === "error"
                  ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                  : "border-amber-400/30 bg-amber-400/10 text-amber-200"
            }`}
          >
            {status.text}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[0.9fr,1.1fr]">
          <aside className="hidden lg:flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-black/50 p-6 shadow-inner">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Why book Neeraj</p>
              <h3 className="mt-2 text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">A smoother booking experience</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Send your event details in under a minute. We review every request manually and respond with availability, pricing, and next steps.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {[
                "Fast response from the team",
                "Best for weddings, corporate shows, and private events",
                "Follow-up tracking handled in admin",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-white/5 px-4 py-3 text-sm text-white/70">
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-amber-500/30 bg-white/5 p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
              />
              <select
                name="event"
                value={form.event}
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
              >
                <option value="" className="bg-black">Event Type</option>
                <option value="Wedding" className="bg-black">Wedding</option>
                <option value="Corporate" className="bg-black">Corporate</option>
                <option value="Private Party" className="bg-black">Private Party</option>
                <option value="Concert" className="bg-black">Concert</option>
                <option value="Other" className="bg-black">Other</option>
              </select>
            </div>

            <details className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 lg:open:pb-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white/80">
                Optional event details
                <span className="ml-2 text-xs font-normal text-white/50">date, location, budget</span>
              </summary>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
                />
                <input
                  type="text"
                  name="eventLocation"
                  placeholder="Event Location"
                  value={form.eventLocation}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
                />
                <input
                  type="text"
                  name="budget"
                  placeholder="Expected Budget (optional)"
                  value={form.budget}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 sm:col-span-2"
                />
              </div>
            </details>

            <textarea
              name="message"
              placeholder="Tell us your requirements"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
            />

            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-xs text-white/50">We usually respond quickly during business hours.</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-amber-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}