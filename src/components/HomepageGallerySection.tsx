import React, { useEffect, useState } from "react";

export default function HomepageGallerySection() {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    async function fetchHomepageGalleryVideos() {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        if (!res.ok) {
          setVideos([]);
          return;
        }

        const data: unknown = await res.json();
        if (!Array.isArray(data)) {
          setVideos([]);
          return;
        }

        // Find the 'Homepage Gallery Videos' category and get its links
        const homepageCat = data.find(
          (row: { category?: string }) => row?.category === "Homepage Gallery Videos",
        ) as { links?: unknown } | undefined;

        let homepageLinks: string[] = [];
        if (homepageCat) {
          if (
            typeof homepageCat.links === "object" &&
            homepageCat.links !== null &&
            Array.isArray((homepageCat.links as { links?: unknown }).links)
          ) {
            homepageLinks = (homepageCat.links as { links: unknown[] }).links
              .map((item) => String(item ?? "").trim())
              .filter(Boolean);
          } else if (Array.isArray(homepageCat.links)) {
            homepageLinks = homepageCat.links
              .map((item) => String(item ?? "").trim())
              .filter(Boolean);
          }
        }

        setVideos(homepageLinks);
      } catch {
        setVideos([]);
      }
    }
    fetchHomepageGalleryVideos();
  }, []);

  // Convert YouTube URLs to embed format
  function toEmbedUrl(url: string): string {
    if (!url) return "";
    const youtuMatch = url.match(/youtu\.be\/([\w-]+)/);
    if (youtuMatch) return `https://www.youtube.com/embed/${youtuMatch[1]}`;
    const watchMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    if (url.includes("youtube.com/embed/")) return url;
    const vParam = url.match(/[?&]v=([\w-]+)/);
    if (vParam) return `https://www.youtube.com/embed/${vParam[1]}`;
    return url;
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-8 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">

        {/* Video Grid */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((src, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-amber-500/20 hover:border-amber-500/60 transition-all cursor-pointer shadow-lg hover:shadow-orange-500/20"
              >
                <div className="relative aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={toEmbedUrl(src)}
                    title={`Performance ${idx + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-orange-500/50 opacity-0 group-hover:opacity-100">
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
