
"use client";
import { useState } from "react";

export default function BookingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    event: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("/api/sendmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", event: "", message: "" });
      } else {
        setStatus("Failed to send. Please try again later.");
      }
    } catch {
      setStatus("Failed to send. Please try again later.");
    }
  };

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4">Booking</h1>
      <p className="text-lg mb-6">Book Neeraj Bakshi for your event or send a message.</p>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-transparent p-6 rounded shadow flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="p-2 rounded border border-gray-700 bg-transparent text-white"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="p-2 rounded border border-gray-700 bg-transparent text-white"
        />
        <input
          type="text"
          name="event"
          placeholder="Event Details (optional)"
          value={form.event}
          onChange={handleChange}
          className="p-2 rounded border border-gray-700 bg-transparent text-white"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          className="p-2 rounded border border-gray-700 bg-transparent text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Send Message
        </button>
        {status && <p className="text-green-600 dark:text-green-400 mt-2">{status}</p>}
      </form>
    </main>
  );
}
