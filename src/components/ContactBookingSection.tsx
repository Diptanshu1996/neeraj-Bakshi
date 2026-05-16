
import { useRef, useState } from "react";
import { Mail, Phone, Star, Globe, Music2, MapPin } from "lucide-react";

function getTomorrowIsoDate(): string {
  const next = new Date();
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + 1);
  return next.toISOString().split("T")[0];
}

export default function ContactBookingSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    event: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const eventDateRef = useRef<HTMLInputElement | null>(null);
  const minEventDate = getTomorrowIsoDate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    if (form.eventDate && form.eventDate < minEventDate) {
      setLoading(false);
      setError("Please choose a future date.");
      return;
    }

    try {
      const res = await fetch("/api/booking-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          event: form.event,
          eventDate: form.eventDate,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Your inquiry has been sent!");
        setForm({ name: "", email: "", phone: "", eventDate: "", event: "", message: "" });
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to send inquiry.");
    } finally {
      setLoading(false);
    }
  };

  const openDatePicker = () => {
    const input = eventDateRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    input?.showPicker?.();
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Let's Make Your Event Legendary
        </h2>
        <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
          Ready to create unforgettable moments? Get in touch and let's discuss your vision
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-zinc-900/80 to-black/80 rounded-2xl border border-amber-500/20 p-6 sm:p-8 shadow-lg flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white mb-2">Book Now</h3>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="bg-black/60 rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-amber-400 outline-none"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            className="bg-black/60 rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-amber-400 outline-none"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="+91 XXXXX XXXXX"
            className="bg-black/60 rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-amber-400 outline-none"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <div className="flex gap-2">
            <input
              ref={eventDateRef}
              type="date"
              name="eventDate"
              min={minEventDate}
              className="flex-1 bg-black/60 rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-amber-400 outline-none"
              value={form.eventDate}
              onChange={handleChange}
              onClick={openDatePicker}
              onFocus={openDatePicker}
            />
            <select
              name="event"
              className="flex-1 bg-black/60 rounded-md px-4 py-2 text-white border border-white/10 focus:border-amber-400 outline-none"
              value={form.event}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option>Wedding</option>
              <option>Corporate</option>
              <option>Private Party</option>
              <option>Garba</option>
              <option>Sufi Night</option>
            </select>
          </div>
          <textarea
            name="message"
            placeholder="Tell us about your event..."
            rows={3}
            className="bg-black/60 rounded-md px-4 py-2 text-white placeholder-white/50 border border-white/10 focus:border-amber-400 outline-none"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="mt-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 font-semibold flex items-center gap-2 justify-center disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : <>Send Inquiry <span><Music2 className="w-5 h-5" /></span></>}
          </button>
          {success && <div className="text-green-400 text-sm mt-2">{success}</div>}
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        </form>
        {/* Direct Contact */}
        <div className="flex flex-col gap-6 justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Direct Contact</h3>
            <div className="flex items-center gap-3 bg-black/60 rounded-md px-4 py-3 mb-3 border border-white/10">
              <Mail className="w-5 h-5 text-amber-400" />
              <a href="mailto:bakshi.neer@gmail.com" className="text-white underline decoration-white/30 hover:text-amber-200">
                bakshi.neer@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 bg-black/60 rounded-md px-4 py-3 border border-white/10">
              <Phone className="w-5 h-5 text-amber-400" />
              <a href="tel:+917303055192" className="text-white underline decoration-white/30 hover:text-amber-200">
                +91 7303055192 / 9650036003
              </a>
            </div>
            <div className="flex items-start gap-3 bg-black/60 rounded-md px-4 py-3 mt-3 border border-white/10">
              <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
              <div className="text-white leading-6">
                <div>Delhi NCR, 201014</div>
                <div>Mira Road, Mumbai, 401107</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Follow the Journey</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/singeperformerrneerajbakshi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="bg-black/60 rounded-full p-2 border border-white/10 hover:bg-amber-400/10"
              >
                <Star className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/neerajbakshiofficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="bg-black/60 rounded-full p-2 border border-white/10 hover:bg-amber-400/10"
              >
                <Globe className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@neerajbakshi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="bg-black/60 rounded-full p-2 border border-white/10 hover:bg-amber-400/10"
              >
                <Music2 className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
