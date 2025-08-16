import React, { useEffect, useState } from "react";

export default function HomepageGallerySection() {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    async function fetchHomepageGalleryVideos() {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      // Find the 'Homepage Gallery Videos' category and get its links
      const homepageCat = data.find((row: { category: string }) => row.category === "Homepage Gallery Videos");
      let homepageLinks: string[] = [];
      if (homepageCat) {
        if (homepageCat.links && Array.isArray(homepageCat.links.links)) {
          homepageLinks = homepageCat.links.links;
        } else if (Array.isArray(homepageCat.links)) {
          homepageLinks = homepageCat.links;
        }
      }
      setVideos(homepageLinks);
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

  if (videos.length === 0) return null;

  return (
    <section className="w-full py-16 px-4 bg-gray-950 text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8">Homepage Gallery Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videos.map((src, idx) => (
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
          </div>
        ))}
      </div>
    </section>
  );
}
