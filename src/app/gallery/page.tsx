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
    <main
      className="min-h-screen text-white flex flex-col items-center py-20 px-4"
      style={{
        backgroundImage: 'url(/gallery-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-5xl font-extrabold mb-6">Gallery</h1>
      <div className="mb-8">
        <label htmlFor="category" className="mr-2 text-lg font-semibold">Select Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded"
          disabled={categories.length === 0}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {videos.length === 0 ? (
        <div className="text-xl text-gray-400 mt-10">No videos available for this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {videos.map((src: string, idx: number) => (
            <div key={idx} className="bg-gray-900 p-4 rounded-lg shadow flex flex-col items-center">
              <iframe
                width="100%"
                height="215"
                src={toEmbedUrl(src)}
                title={`YouTube video player ${idx+1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg w-full max-w-md mb-2"
              ></iframe>
              <span>{selectedCategory} Video {idx+1}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
