"use client";
import React, { useState, useEffect } from "react";

export default function GalleryPage() {
  // Convert YouTube URLs to embed format
  function toEmbedUrl(url: string): string {
    if (!url) return "";
    // youtu.be/VIDEOID
    const youtuMatch = url.match(/youtu\.be\/([\w-]+)/);
    if (youtuMatch) {
      return `https://www.youtube.com/embed/${youtuMatch[1]}`;
    }
    // youtube.com/watch?v=VIDEOID
    const watchMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    // youtube.com/embed/VIDEOID (already embed)
    if (url.includes("youtube.com/embed/")) {
      return url;
    }
    // Try extracting v= param if present
    const vParam = url.match(/[?&]v=([\w-]+)/);
    if (vParam) {
      return `https://www.youtube.com/embed/${vParam[1]}`;
    }
    return url;
  }
  const [videosData, setVideosData] = useState<{ [key: string]: string[] }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    async function fetchVideos() {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      // Convert array of {category, links} to object for compatibility
      const videosObj: { [key: string]: string[] } = {};
      data.forEach((row: { category: string, links: any }) => {
        if (row.category === "Homepage Gallery Videos") return;
        // Handle nested links object from Supabase
        if (row.links && Array.isArray(row.links.links)) {
          videosObj[row.category] = row.links.links;
        } else if (Array.isArray(row.links)) {
          videosObj[row.category] = row.links;
        } else {
          videosObj[row.category] = [];
        }
      });
      setVideosData(videosObj);
      const cats = Object.keys(videosObj).sort((a, b) => a.localeCompare(b));
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategory(cats[0]);
        setVideos(videosObj[cats[0]]);
      } else {
        setSelectedCategory("");
        setVideos([]);
      }
    }
    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedCategory && Array.isArray(videosData[selectedCategory])) {
      setVideos(videosData[selectedCategory]);
    } else {
      setVideos([]);
    }
  }, [selectedCategory, videosData]);

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex flex-col items-center justify-center pt-24 px-8">
        <div className="max-w-5xl text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Performance Gallery
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-8">
            Explore unforgettable moments from diverse performances
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-16">
              <label className="block text-lg font-semibold text-white mb-6">Select Performance Category:</label>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "bg-white/10 text-white/70 border border-white/20 hover:border-amber-500/30 hover:text-amber-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {videos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-white/60">No videos available for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((src: string, idx: number) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-amber-500/20 hover:border-amber-500/60 transition-all cursor-pointer shadow-lg hover:shadow-orange-500/20"
                >
                  <div className="relative aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={toEmbedUrl(src)}
                      title={`${selectedCategory} video ${idx + 1}`}
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
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <p className="text-white/80 text-sm font-medium">{selectedCategory}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
