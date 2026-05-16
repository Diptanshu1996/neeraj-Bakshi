"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, Heart, Music, PartyPopper, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CategoryItem = {
  category: string;
  links: string[];
  imageUrl: string;
};

type CategoryCardMeta = {
  description: string;
  color: string;
  defaultImage: string;
  icon: LucideIcon;
};

const categoryMeta: Record<string, CategoryCardMeta> = {
  "Corporate Events": {
    description:
      "Elevate your corporate gatherings with sophisticated live performances that leave lasting impressions.",
    color: "from-blue-600/80 to-indigo-900/80",
    defaultImage: "/gallery/corporate.jpg",
    icon: Briefcase,
  },
  "Private Parties & Galas": {
    description:
      "High-energy performances that transform your celebrations into extraordinary experiences.",
    color: "from-purple-600/80 to-pink-900/80",
    defaultImage: "/gallery/private.jpg",
    icon: PartyPopper,
  },
  "Luxury Weddings & Sangeet": {
    description:
      "Make your special day legendary with grand, elegant, and emotionally resonant performances.",
    color: "from-rose-600/80 to-red-900/80",
    defaultImage: "/gallery/wedding.jpg",
    icon: Heart,
  },
  "Dandiya & Garba Nights": {
    description:
      "Explosive energy and festive vibes that celebrate culture with authentic passion.",
    color: "from-amber-600/80 to-orange-900/80",
    defaultImage: "/gallery/garba.jpg",
    icon: Sparkles,
  },
  "Sufi & Acoustic Nights": {
    description: "Soulful, intimate, and serene performances that touch hearts and create magical moments.",
    color: "from-teal-600/80 to-emerald-900/80",
    defaultImage: "/gallery/sufi.jpg",
    icon: Music,
  },
};

const preferredOrder = [
  "Corporate Events",
  "Private Parties & Galas",
  "Luxury Weddings & Sangeet",
  "Dandiya & Garba Nights",
  "Sufi & Acoustic Nights",
];

export default function EventVersatilitySection() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        if (!res.ok) {
          setCategories([]);
          return;
        }

        const data: unknown = await res.json();
        if (!Array.isArray(data)) {
          setCategories([]);
          return;
        }

        const cleaned = data
          .map((item) => {
            const category = String((item as { category?: unknown })?.category ?? "").trim();
            const rawLinks = (item as { links?: unknown })?.links;
            const imageUrl = String((item as { imageUrl?: unknown })?.imageUrl ?? "").trim();
            const links = Array.isArray(rawLinks)
              ? rawLinks.map((link) => String(link ?? "").trim()).filter(Boolean)
              : [];

            return { category, links, imageUrl };
          })
          .filter((item) => item.category);

        const curated = cleaned.filter((item) => preferredOrder.includes(item.category));

        const sorted = [...curated].sort((a, b) => {
          const ai = preferredOrder.indexOf(a.category);
          const bi = preferredOrder.indexOf(b.category);

          if (ai === -1 && bi === -1) return a.category.localeCompare(b.category);
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });

        setCategories(sorted);
      } catch {
        setCategories([]);
      }
    }

    fetchCategories();
  }, []);

  return (
    <section id="shows" className="py-24 px-4 sm:px-8 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Versatility in Every Note
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          From corporate sophistication to cultural celebrations, experience the full spectrum of live entertainment
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((item) => {
          const meta = categoryMeta[item.category];
          const tintClass = meta?.color ?? "from-zinc-800/80 to-zinc-900/80";
          const bgSrc = item.imageUrl || meta?.defaultImage;
          const Icon = meta?.icon;

          return (
            <div
              key={item.category}
              className={`group relative min-h-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-amber-500/20 hover:border-amber-500/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20`}
            >
            <div className="absolute inset-0 z-0">
              {bgSrc && (
                <img
                  src={bgSrc}
                  alt={item.category}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div className={`absolute inset-0 bg-gradient-to-br ${tintClass} opacity-80`}></div>
            </div>
            <div className="relative z-10 p-8 h-full flex flex-col">
              {Icon && (
                <div className="mb-4">
                  <Icon className="w-12 h-12 text-amber-400" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-3">{item.category}</h3>
              <p className="text-white/80 mb-6 flex-1">
                {meta?.description ??
                  `${item.links.length} video${item.links.length === 1 ? "" : "s"} available in this category.`}
              </p>
              <a
                href="/gallery"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group-hover:gap-4 duration-300 mt-auto"
              >
                View Gallery
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
