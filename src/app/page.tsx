"use client";
import EventVersatilitySection from "../components/EventVersatilitySection";
import ContactBookingSection from "../components/ContactBookingSection";
import React, { useEffect, useMemo, useState } from "react";
import { Play, Image as ImageIcon, Mic2, Globe, Award, Star, Quote } from "lucide-react";
import HomepageGallerySection from "../components/HomepageGallerySection";
import MusicShowcaseSection from "../components/MusicShowcaseSection";
import HomepagePhotoShowcaseSection from "../components/HomepagePhotoShowcaseSection";

const stats = [
  { icon: Mic2, value: "500+", label: "Shows Performed" },
  { icon: Globe, value: "10+", label: "Countries" },
  { icon: Award, value: "100%", label: "Crowd Satisfaction" },
];

type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  status?: "pending" | "approved";
};

const initialTestimonials: Testimonial[] = [
  {
    id: "fallback-1",
    name: "Rajesh Sharma",
    role: "CEO, Tech Innovations",
    text: "Neeraj transformed our annual gala into an unforgettable experience. His voice, stage presence, and ability to connect with the audience were simply outstanding.",
    rating: 5,
  },
  {
    id: "fallback-2",
    name: "Priya & Arjun",
    role: "Wedding Couple",
    text: "Our sangeet night was magical, all thanks to Neeraj! He performed every song with such emotion and energy. Our guests are still talking about it!",
    rating: 5,
  },
  {
    id: "fallback-3",
    name: "Sarah Mitchell",
    role: "Event Planner, Luxe Events",
    text: "Working with Neeraj is always a pleasure. Professional, versatile, and incredibly talented. He elevates every event to legendary status.",
    rating: 5,
  },
  {
    id: "fallback-4",
    name: "Vikram Patel",
    role: "Corporate Relations Director",
    text: "We've hired Neeraj for multiple corporate events. His adaptability and crowd engagement are unmatched. A true professional who delivers every single time.",
    rating: 5,
  },
  {
    id: "fallback-5",
    name: "Anjali Desai",
    role: "Birthday Celebration Host",
    text: "Neeraj made my milestone birthday party absolutely spectacular. The acoustic session was intimate and beautiful. Highly recommend!",
    rating: 5,
  },
  {
    id: "fallback-6",
    name: "Rahul Kapoor",
    role: "Festival Organizer",
    text: "The energy Neeraj brings to Garba nights is electric! The crowd was dancing non-stop. He truly understands how to create an authentic cultural celebration.",
    rating: 5,
  },
];

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [cardWidth, setCardWidth] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [testimonialForm, setTestimonialForm] = useState({ name: "", role: "", text: "", rating: 5 });
  const [testimonialStatus, setTestimonialStatus] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);

  const needsLoop = testimonials.length > visibleCount;

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials", { cache: "no-store" });
        const data = await res.json();
        const cleaned = Array.isArray(data)
          ? data
              .map((item: { id?: unknown; name?: unknown; role?: unknown; text?: unknown; rating?: unknown }) => ({
                id: String(item?.id ?? ""),
                name: String(item?.name ?? "").trim(),
                role: String(item?.role ?? "").trim(),
                text: String(item?.text ?? "").trim(),
                rating: Math.min(5, Math.max(1, Number(item?.rating ?? 5) || 5)),
              }))
              .filter((item) => item.id && item.name && item.text)
          : [];
        setTestimonials(cleaned);
      } catch {
        setTestimonials([]);
      }
    }

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!needsLoop) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 4200);

    return () => clearInterval(timer);
  }, [needsLoop]);

  useEffect(() => {
    function updateCarouselLayout() {
      const nextVisibleCount = window.innerWidth >= 768 ? 3 : 1;
      const container = document.getElementById("testimonials-carousel-viewport");
      const width = container ? container.clientWidth : 0;
      setVisibleCount(nextVisibleCount);
      setCardWidth(width > 0 ? width / nextVisibleCount : 0);
    }

    updateCarouselLayout();
    window.addEventListener("resize", updateCarouselLayout);
    return () => window.removeEventListener("resize", updateCarouselLayout);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setTransitionEnabled(true);
  }, [testimonials.length, visibleCount]);

  const loopedTestimonials = useMemo(() => {
    if (testimonials.length === 0) return [];
    if (!needsLoop) return testimonials;
    return [...testimonials, ...testimonials.slice(0, visibleCount)];
  }, [testimonials, visibleCount, needsLoop]);

  function handleTrackTransitionEnd() {
    if (activeIndex < testimonials.length) return;
    setTransitionEnabled(false);
    setActiveIndex(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionEnabled(true));
    });
  }

  async function submitTestimonial(e: React.FormEvent) {
    e.preventDefault();

    const name = testimonialForm.name.trim();
    const role = testimonialForm.role.trim();
    const text = testimonialForm.text.trim();
    const rating = testimonialForm.rating;

    if (!name || !text) {
      setTestimonialStatus({ kind: "error", text: "Name and testimonial are required." });
      return;
    }

    setTestimonialStatus({ kind: "info", text: "Submitting your testimonial..." });

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, text, rating }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setTestimonialStatus({ kind: "error", text: data?.error || "Failed to submit testimonial." });
        return;
      }

      setTestimonialForm({ name: "", role: "", text: "", rating: 5 });
      setTestimonialStatus({ kind: "success", text: "Thanks! Your testimonial was submitted for admin approval." });
    } catch {
      setTestimonialStatus({ kind: "error", text: "Failed to submit testimonial." });
    }
  }

  return (
    <main className="min-h-screen w-full bg-black text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex flex-col pt-32 md:pt-40">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 top-20 md:top-24">
          <img
            src="/hero-bg.JPG"
            alt="Neeraj Bakshi performing live"
            className="w-full h-full object-cover object-[center_12%] md:object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"></div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 flex-1 flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 text-center">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-amber-100 to-orange-200 bg-clip-text text-transparent leading-tight">
              The Voice for Your
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent leading-tight">
              Unforgettable Moments
            </h2>


            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <a
                href="https://www.instagram.com/neerajbakshiofficial/reels/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-2xl shadow-orange-500/40 text-sm sm:text-base lg:text-lg font-semibold whitespace-nowrap"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Live Reel
              </a>
              <a href="/gallery" className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-amber-400/50 rounded-lg hover:bg-amber-400/20 hover:border-amber-400 transition-all text-sm sm:text-base lg:text-lg font-semibold whitespace-nowrap">
                <ImageIcon className="w-5 h-5" />
                Check Gallery
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-amber-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Event Versatility Section */}
      <EventVersatilitySection />

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left: Portrait */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-orange-500/20">
                <img
                  src="/IMG_4603.JPG"
                  alt="Neeraj Bakshi"
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-orange-500/30 to-amber-600/30 rounded-full blur-3xl"></div>
            </div>

            {/* Right: Bio & Stats */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                The Artist Behind the Magic
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/80 mb-4 sm:mb-6 leading-relaxed">
                Neeraj Bakshi is known for his versatile voice and electrifying stage presence. He blends emotion and energy, captivating audiences worldwide. His Punjabi hits &quot;Supna&quot;, &quot;Fail Kare Garmi&quot;, and &quot;Peg Mukni Ni&quot; have won many hearts.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-white/80 mb-4 sm:mb-6 leading-relaxed">
                Neeraj&apos;s voice has graced radio, television, and countless live concerts. With over 1,000 shows globally, he is a household name among music lovers. His journey is a testament to passion, dedication, and unmatched talent.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-white/80 mb-4 sm:mb-6 leading-relaxed">
                Whether it&apos;s a soulful melody or a high-energy number, Neeraj leaves every stage on fire. He has performed at weddings, corporate events, and festivals. Fans admire his ability to connect with every audience.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 leading-relaxed">
                A true product of hard work and heart, Neeraj honed his craft over years of relentless practice before earning national recognition on Indian Idol. Today, he carries that legacy into every stage he steps on — performing with the same fire whether it&apos;s an intimate gathering of fifty or a grand arena of thousands.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-amber-500/20">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 mb-2 sm:mb-3 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                        <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Highlights Section */}
      <HomepagePhotoShowcaseSection />

      {/* Music Showcase Section */}
      <MusicShowcaseSection />

      {/* Gallery Section */}
      <HomepageGallerySection />

      {/* Testimonials Section */}
      <section id="testimonials" className="pt-8 pb-16 sm:pt-10 sm:pb-24 px-4 sm:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              What Clients Say
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto px-2">
              Real experiences from those who've witnessed the magic
            </p>
          </div>

          {/* Testimonials Loop: smooth horizontal, one-by-one */}
          <div id="testimonials-carousel-viewport" className="overflow-hidden">
            <div
              className={needsLoop ? "flex" : "flex justify-center"}
              style={needsLoop ? {
                transform: `translateX(-${activeIndex * cardWidth}px)`,
                transition: transitionEnabled ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
              } : {}}
              onTransitionEnd={needsLoop ? handleTrackTransitionEnd : undefined}
            >
              {loopedTestimonials.map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${idx}`}
                  className="shrink-0 p-2 sm:p-3"
                  style={{ width: cardWidth || undefined }}
                >
                  <div className="relative h-full p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-amber-500/20 hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-orange-500/10">
                    <div className="absolute top-6 right-6 opacity-20">
                      <Quote className="w-12 h-12 text-amber-400" />
                    </div>

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-orange-500/15 px-3 py-1.5">
                      <span className="text-xs font-semibold text-amber-200">{testimonial.rating.toFixed(1)}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-amber-400/35"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] uppercase tracking-wide text-amber-100/75">Rated</span>
                    </div>

                    <p className="text-xs sm:text-sm md:text-base text-white/80 mb-4 sm:mb-6 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>

                    <div>
                      <h4 className="text-sm sm:text-base text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-amber-400/80 text-xs sm:text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testimonials.length > visibleCount && (
            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: testimonials.length }).map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  type="button"
                  onClick={() => {
                    setTransitionEnabled(true);
                    setActiveIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all ${idx === (activeIndex % testimonials.length) ? "w-8 bg-amber-400" : "w-2.5 bg-white/35 hover:bg-white/60"}`}
                  aria-label={`Show testimonial set ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <div className="mt-10 sm:mt-12 rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-4 sm:p-6 lg:p-8">
            <div className="mb-5">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Share Your Experience</h3>
              <p className="mt-1 text-sm sm:text-base text-white/65">Submit a testimonial for Neeraj. It will appear after admin approval.</p>
            </div>

            {testimonialStatus && (
              <div
                className={`mb-4 rounded-lg border px-4 py-2 text-sm ${
                  testimonialStatus.kind === "success"
                    ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
                    : testimonialStatus.kind === "error"
                      ? "border-orange-400/40 bg-orange-500/10 text-orange-200"
                      : "border-white/25 bg-white/10 text-white/80"
                }`}
              >
                {testimonialStatus.text}
              </div>
            )}

            <form onSubmit={submitTestimonial} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl border border-amber-500/20 bg-black/45 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                placeholder="Your name"
                required
              />
              <input
                type="text"
                value={testimonialForm.role}
                onChange={(e) => setTestimonialForm((prev) => ({ ...prev, role: e.target.value }))}
                className="rounded-xl border border-amber-500/20 bg-black/45 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                placeholder="Role or event (optional)"
              />
              <div className="md:col-span-2 rounded-xl border border-amber-500/20 bg-black/45 px-3 py-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-100/80">Your Rating</div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((ratingValue) => (
                    <button
                      key={ratingValue}
                      type="button"
                      onClick={() => setTestimonialForm((prev) => ({ ...prev, rating: ratingValue }))}
                      className="rounded-md p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400/35"
                      aria-label={`Set rating ${ratingValue}`}
                    >
                      <Star
                        className={`h-6 w-6 ${ratingValue <= testimonialForm.rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-amber-400/40"}`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-amber-200">{testimonialForm.rating}.0 / 5</span>
                </div>
              </div>
              <textarea
                value={testimonialForm.text}
                onChange={(e) => setTestimonialForm((prev) => ({ ...prev, text: e.target.value }))}
                className="rounded-xl border border-amber-500/20 bg-black/45 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25 md:col-span-2"
                rows={4}
                placeholder="Share your experience..."
                required
              />
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-700/30 transition hover:brightness-110"
                >
                  Submit Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>


      {/* Contact/Booking Section */}
      <ContactBookingSection />

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-8 bg-black border-t border-amber-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-3 sm:mb-4">
                Neeraj Bakshi
              </h3>
              <p className="text-xs sm:text-sm text-white/60">
                India's most versatile performer crafting unforgettable musical experiences
              </p>
            </div>
            <div>
              <h4 className="text-sm sm:text-base text-white font-semibold mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2 text-white/60 text-xs sm:text-sm">
                <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-amber-400 transition-colors">About</a></li>
                <li><a href="/gallery" className="hover:text-amber-400 transition-colors">Gallery</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base text-white font-semibold mb-3 sm:mb-4">Connect</h4>
              <ul className="space-y-1 sm:space-y-2 text-white/60 text-xs sm:text-sm">
                <li><a href="https://www.facebook.com/singeperformerrneerajbakshi" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Facebook</a></li>
                <li><a href="https://www.instagram.com/neerajbakshiofficial" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Instagram</a></li>
                <li><a href="https://www.youtube.com/@neerajbakshi" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">YouTube</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base text-white font-semibold mb-3 sm:mb-4">Services</h4>
              <ul className="space-y-1 sm:space-y-2 text-white/60 text-xs sm:text-sm">
                <li>Weddings & Sangeet</li>
                <li>Corporate Events</li>
                <li>Private Performances</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-500/10 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-white/60">
            <p>&copy; 2026 Neeraj Bakshi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
