"use client";
import React, { useEffect, useState } from "react";

type PhotoImage = {
  id: string;
  url: string;
  caption: string;
};

export default function HomepagePhotoShowcaseSection() {
  const [images, setImages] = useState<PhotoImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photo-gallery", { cache: "no-store" });
        const data = await res.json();
        const cleaned = Array.isArray(data)
          ? data
              .map((item: { id?: unknown; url?: unknown; caption?: unknown }) => ({
                id: String(item?.id ?? ""),
                url: String(item?.url ?? "").trim(),
                caption: String(item?.caption ?? "").trim(),
              }))
              .filter((item) => item.id && item.url)
          : [];
        setImages(cleaned.slice(0, 10));
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  return (
    <section id="photo-highlights" className="py-16 sm:py-20 px-4 sm:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Gallery Highlights
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/60 max-w-2xl">
              A quick glimpse of portrait moments from live events.
            </p>
          </div>
          <a
            href="/photo-gallery"
            className="inline-flex items-center rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"
          >
            View Full Photo Gallery
          </a>
        </div>

        {loading && <p className="text-white/55">Loading gallery photos...</p>}

        {!loading && images.length === 0 && (
          <div className="rounded-xl border border-dashed border-amber-500/20 bg-zinc-900/60 px-4 py-10 text-center text-white/50">
            Photo highlights will appear here once images are added.
          </div>
        )}

        {!loading && images.length > 0 && (
          <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory">
            {images.map((img, idx) => (
              <article
                key={img.id}
                className="group snap-start shrink-0 w-[290px] sm:w-[360px] md:w-[430px]"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg">
                  <img
                    src={img.url}
                    alt={img.caption || `Gallery photo ${idx + 1}`}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
