"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

type PhotoImage = {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
};

export default function PhotoGalleryPage() {
  const [images, setImages] = useState<PhotoImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/photo-gallery", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i !== null ? Math.min(i + 1, images.length - 1) : null));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i !== null ? Math.max(i - 1, 0) : null));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, images.length, closeLightbox]);

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-8">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(251,146,60,0.12),_transparent_70%)]" />
        <div className="relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 mb-5">
            Photo Gallery
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Captured Moments
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            A glimpse into the magic of every performance
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 pb-24 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="text-center py-20 text-white/50">Loading photos...</div>
          )}

          {!loading && images.length === 0 && (
            <div className="text-center py-20 rounded-xl border border-dashed border-amber-500/20 bg-black/40">
              <p className="text-white/50 text-lg">No photos yet. Check back soon!</p>
            </div>
          )}

          {!loading && images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  className="group relative overflow-hidden rounded-xl border border-amber-500/20 hover:border-amber-500/50 bg-zinc-950 transition-all hover:shadow-xl hover:shadow-orange-500/10 text-left"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-black/70">
                    <img
                      src={img.url}
                      alt={img.caption || `Photo ${idx + 1}`}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs sm:text-sm text-white/90 truncate">{img.caption}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-5 right-5 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:text-white transition"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-white/80 hover:text-white text-xl transition"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i !== null ? i - 1 : null)); }}
              aria-label="Previous"
            >
              &#8592;
            </button>
          )}

          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].caption || `Photo ${lightboxIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {images[lightboxIndex].caption && (
              <p className="mt-3 text-center text-sm text-white/75">{images[lightboxIndex].caption}</p>
            )}
            <p className="mt-1 text-center text-xs text-white/40">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          {lightboxIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-white/80 hover:text-white text-xl transition"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i !== null ? i + 1 : null)); }}
              aria-label="Next"
            >
              &#8594;
            </button>
          )}
        </div>
      )}
    </main>
  );
}
