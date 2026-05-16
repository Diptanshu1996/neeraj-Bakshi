
"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-12">
          <a href="/" className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent hover:from-amber-300 hover:to-orange-400 transition-all">
            Neeraj Bakshi
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/#home" className="text-white/90 hover:text-amber-400 transition-colors">Home</a>
            <a href="/#about" className="text-white/90 hover:text-amber-400 transition-colors">About</a>

            {/* Gallery Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-white/90 hover:text-amber-400 transition-colors"
                aria-haspopup="true"
              >
                Gallery
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              {/* invisible bridge so cursor doesn't lose hover when moving to menu */}
              <div className="absolute top-full left-0 h-3 w-full" />
              <div className="absolute top-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2 w-52 rounded-xl border border-amber-500/20 bg-black/95 backdrop-blur-sm shadow-xl shadow-black/60 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden">
                <a
                  href="/gallery"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-amber-400 hover:bg-amber-500/10 transition-colors border-b border-white/5"
                >
                  <span className="text-amber-400">▶</span>
                  Performance Gallery
                </a>
                <a
                  href="/photo-gallery"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  <span className="text-amber-400">📷</span>
                  Photo Gallery
                </a>
              </div>
            </div>

            <a href="/#testimonials" className="text-white/90 hover:text-amber-400 transition-colors">Testimonials</a>
          </div>
        </div>
        
        {/* Desktop Book Now Button */}
        <a
          href="#contact"
          className="hidden md:block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 font-semibold"
        >
          Book Now
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white/90 hover:text-amber-400 transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 pt-24 bg-black/80 backdrop-blur-sm md:hidden">
          <div className="flex flex-col items-center gap-8 py-8">
            <a href="/#home" className="text-white/90 hover:text-amber-400 transition-colors text-lg" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="/#about" className="text-white/90 hover:text-amber-400 transition-colors text-lg" onClick={() => setMenuOpen(false)}>About</a>

            {/* Mobile Gallery expandable */}
            <div className="flex flex-col items-center gap-3">
              <button
                className="flex items-center gap-1 text-white/90 hover:text-amber-400 transition-colors text-lg"
                onClick={() => setGalleryOpen((v) => !v)}
              >
                Gallery
                <ChevronDown className={`w-5 h-5 transition-transform ${galleryOpen ? "rotate-180" : ""}`} />
              </button>
              {galleryOpen && (
                <div className="flex flex-col items-center gap-3">
                  <a href="/gallery" className="text-amber-400/90 hover:text-amber-300 transition-colors" onClick={() => setMenuOpen(false)}>
                    ▶ Performance Gallery
                  </a>
                  <a href="/photo-gallery" className="text-amber-400/90 hover:text-amber-300 transition-colors" onClick={() => setMenuOpen(false)}>
                    📷 Photo Gallery
                  </a>
                </div>
              )}
            </div>

            <a href="/#testimonials" className="text-white/90 hover:text-amber-400 transition-colors text-lg" onClick={() => setMenuOpen(false)}>Testimonials</a>
            <a
              href="#contact"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Book Now
            </a>
          </div>
        </div>
      )}

    </>
  );
}

