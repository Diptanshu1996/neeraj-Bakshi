"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

type PerformanceHighlight = {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnail?: string;
};

type Track = {
  title: string;
  genre: string;
  src: string;
  bars: number[];
};

const tracks: Track[] = [
  {
    title: "Apsara",
    genre: "Official",
    src: "/audio/Apsara  Official Music Video  Neeraj Bakshi.mp3",
    bars: [8, 14, 10, 18, 12, 16, 9, 13, 11, 17, 10, 15, 9, 14, 12, 16],
  },
  {
    title: "Peg Mukne Ni",
    genre: "Punjabi",
    src: "/audio/Peg mukne ni- Neeraj Bakshi - Official video  Latest punjabi song 2020.mp3",
    bars: [10, 12, 9, 16, 11, 14, 8, 15, 10, 13, 9, 17, 11, 14, 10, 12],
  },
  {
    title: "Tere Bina",
    genre: "Romantic",
    src: "/audio/Tere Bina  Neeraj Bakshi (Full Song).mp3",
    bars: [12, 16, 11, 18, 10, 15, 9, 17, 12, 14, 10, 16, 11, 15, 9, 18],
  },
];

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicShowcaseSection() {
  const [highlights, setHighlights] = useState<PerformanceHighlight[]>([]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [duration, setDuration] = useState<Record<number, number>>({});
  const [mutedSet, setMutedSet] = useState<Set<number>>(new Set());
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  function toYouTubeThumbnail(url: string): string {
    try {
      const parsed = new URL(url);
      let id = "";

      if (parsed.hostname.includes("youtu.be")) {
        id = parsed.pathname.replace("/", "");
      } else {
        id = parsed.searchParams.get("v") ?? "";
      }

      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
    } catch {
      return "";
    }
  }

  useEffect(() => {
    async function fetchHighlights() {
      try {
        const res = await fetch("/api/performance-highlights", { cache: "no-store" });
        const items = await res.json();
        if (!Array.isArray(items) || items.length === 0) {
          setHighlights([]);
          return;
        }

        const cleaned = items
          .map((item) => ({
            id: String(item?.id ?? "").trim(),
            title: String(item?.title ?? "").trim(),
            youtubeUrl: String(item?.youtubeUrl ?? "").trim(),
            thumbnail: String(item?.thumbnail ?? "").trim(),
          }))
          .filter((item) => item.id && item.title && item.youtubeUrl);

        setHighlights(cleaned);
      } catch {
        setHighlights([]);
      }
    }

    fetchHighlights();
  }, []);

  function togglePlay(idx: number) {
    const audio = audioRefs.current[idx];
    if (!audio) return;

    if (playingIdx === idx) {
      audio.pause();
      setPlayingIdx(null);
    } else {
      // pause any currently playing track
      if (playingIdx !== null) {
        audioRefs.current[playingIdx]?.pause();
      }
      audio.play();
      setPlayingIdx(idx);
    }
  }

  function handleTimeUpdate(idx: number) {
    const audio = audioRefs.current[idx];
    if (!audio) return;
    setProgress((prev) => ({ ...prev, [idx]: audio.currentTime }));
  }

  function handleLoadedMetadata(idx: number) {
    const audio = audioRefs.current[idx];
    if (!audio) return;
    setDuration((prev) => ({ ...prev, [idx]: audio.duration }));
  }

  function handleEnded(idx: number) {
    setPlayingIdx((prev) => (prev === idx ? null : prev));
  }

  function handleSeek(idx: number, value: number) {
    const audio = audioRefs.current[idx];
    if (!audio) return;
    audio.currentTime = value;
    setProgress((prev) => ({ ...prev, [idx]: value }));
  }

  function toggleMute(idx: number) {
    const audio = audioRefs.current[idx];
    if (!audio) return;
    audio.muted = !audio.muted;
    setMutedSet((prev) => {
      const next = new Set(prev);
      if (audio.muted) next.add(idx); else next.delete(idx);
      return next;
    });
  }

  // Eagerly load duration for all tracks after mount
  useEffect(() => {
    audioRefs.current.forEach((audio, idx) => {
      if (!audio) return;
      const onMeta = () => setDuration((prev) => ({ ...prev, [idx]: audio.duration }));
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration((prev) => ({ ...prev, [idx]: audio.duration }));
      } else {
        audio.addEventListener("loadedmetadata", onMeta, { once: true });
        audio.load();
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-12 pb-24">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Experience the Magic Live
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Watch and listen to unforgettable performances that showcase versatility and vocal excellence
        </p>
      </div>

      {/* Performance Highlights */}
      {highlights.length > 0 && (
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8">Performance Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item) => (
              <a
                key={item.id}
                href={item.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-amber-500/20 hover:border-amber-500/60 transition-all cursor-pointer"
              >
                <div className="relative aspect-video">
                  <img
                    src={item.thumbnail || toYouTubeThumbnail(item.youtubeUrl)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-orange-500/50">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-white font-semibold">{item.title}</h4>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Top Tracks */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-amber-500/30 rounded-2xl p-8 shadow-2xl shadow-orange-500/10">
        <h3 className="text-3xl font-bold text-white mb-6">Top Tracks</h3>
        <div className="space-y-4">
          {tracks.map((track, idx) => {
            const isPlaying = playingIdx === idx;
            const isMuted = mutedSet.has(idx);
            const cur = progress[idx] ?? 0;
            const dur = duration[idx] ?? 0;

            return (
              <div
                key={track.src}
                className="group flex flex-col gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 transition-all"
              >
                {/* native audio element */}
                <audio
                  ref={(el) => { audioRefs.current[idx] = el; }}
                  src={track.src}
                  onTimeUpdate={() => handleTimeUpdate(idx)}
                  onLoadedMetadata={() => handleLoadedMetadata(idx)}
                  onEnded={() => handleEnded(idx)}
                  preload="auto"
                />

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => togglePlay(idx)}
                    className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
                    aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  >
                    {isPlaying
                      ? <Pause className="w-5 h-5 text-white" />
                      : <Play className="w-5 h-5 text-white ml-0.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold mb-0.5 truncate">{track.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-white/60">
                      <span>{track.genre}</span>
                      <span>&bull;</span>
                      <span>{formatTime(cur)} / {formatTime(dur)}</span>
                    </div>
                  </div>

                  {/* animated waveform bars */}
                  <div className="hidden md:flex items-center gap-1 w-48">
                    {track.bars.map((h, i) => (
                      <span
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-150 ${
                          isPlaying ? "bg-amber-500" : "bg-amber-500/30 group-hover:bg-amber-500/50"
                        }`}
                        style={{
                          height: `${h + 8}px`,
                          animation: isPlaying ? `pulse ${0.5 + (i % 4) * 0.15}s ease-in-out infinite alternate` : "none",
                        }}
                      />
                    ))}
                  </div>

                  {/* mute toggle */}
                  <button
                    onClick={() => toggleMute(idx)}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="text-white/60 hover:text-white transition-colors shrink-0"
                  >
                    {isMuted
                      ? <VolumeX className="w-5 h-5" />
                      : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                {/* seek slider — native range for reliable fill */}
                <input
                  type="range"
                  min={0}
                  max={dur || 100}
                  step={0.1}
                  value={cur}
                  onChange={(e) => handleSeek(idx, parseFloat(e.target.value))}
                  className="w-full h-1.5 cursor-pointer appearance-none rounded-full"
                  style={{
                    background: dur > 0
                      ? `linear-gradient(to right, #f59e0b ${(cur / dur) * 100}%, rgba(255,255,255,0.1) ${(cur / dur) * 100}%)`
                      : "rgba(255,255,255,0.1)",
                    accentColor: "#f59e0b",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
