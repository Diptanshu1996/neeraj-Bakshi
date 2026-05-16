"use client";
import React, { useState, useEffect } from "react";

function parseLinksInput(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

type LeadStatus = "new" | "followed";

type BookingLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  event: string;
  eventDate: string;
  eventLocation: string;
  budget: string;
  message: string;
  leadStatus: LeadStatus;
  called: boolean;
  createdAt: string;
  updatedAt: string;
};

type PerformanceHighlight = {
  id: string;
  title: string;
  youtubeUrl: string;
};

type TestimonialStatus = "pending" | "approved";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  status: TestimonialStatus;
  createdAt: string;
};

type PhotoImage = {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
};

type CategoryItem = {
  category: string;
  links: string[];
  imageUrl: string;
};

export default function AdminGallery() {
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [activeView, setActiveView] = useState<"categories" | "leads" | "highlights" | "testimonials" | "photos">("categories");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatLinks, setNewCatLinks] = useState("");
  const [newCatImageUrl, setNewCatImageUrl] = useState("");
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatDraft, setEditingCatDraft] = useState("");
  const [bookingLeads, setBookingLeads] = useState<BookingLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [photoImages, setPhotoImages] = useState<PhotoImage[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const parsedNewLinks = parseLinksInput(newCatLinks);
  const validNewLinks = parsedNewLinks.filter((link) => isValidHttpUrl(link));
  const invalidNewLinks = parsedNewLinks.filter((link) => !isValidHttpUrl(link));

  // Fetch initial categories on mount and after changes
  useEffect(() => {
    fetchGallery();
    fetchBookingLeads();
    fetchPhotoImages();
  }, []);

  async function fetchGallery() {
    const res = await fetch("/api/gallery");
    try {
      let arr = await res.json();
      arr = (Array.isArray(arr) ? arr : []).map((cat: { category?: unknown; links?: unknown; imageUrl?: unknown }) => ({
        category: String(cat?.category ?? "").trim(),
        links: Array.isArray(cat.links)
          ? cat.links.map((link) => String(link ?? "").trim()).filter(Boolean)
          : Array.isArray((cat.links as { links?: unknown } | undefined)?.links)
            ? ((cat.links as { links: unknown[] }).links.map((link) => String(link ?? "").trim()).filter(Boolean))
            : [],
        imageUrl: String(cat?.imageUrl ?? "").trim(),
      }));
      setCategories(arr);
    } catch {
      setCategories([]);
    }
  }

  async function fetchBookingLeads() {
    setLoadingLeads(true);
    try {
      const res = await fetch("/api/booking-requests", { cache: "no-store" });
      const items = await res.json();
      setBookingLeads(Array.isArray(items) ? items : []);
    } catch {
      setBookingLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  }

  async function fetchPhotoImages() {
    setLoadingPhotos(true);
    try {
      const res = await fetch("/api/photo-gallery", { cache: "no-store" });
      const data = await res.json();
      setPhotoImages(Array.isArray(data) ? data : []);
    } catch {
      setPhotoImages([]);
    } finally {
      setLoadingPhotos(false);
    }
  }

  function setSuccess(text: string) {
    setStatus({ kind: "success", text });
  }

  function setError(text: string) {
    setStatus({ kind: "error", text });
  }

  async function addCategory() {
    if (!newCatName.trim()) return setError("Category name is required");
    if (invalidNewLinks.length > 0) {
      return setError("Please fix invalid links before adding category");
    }

    const linksArr = validNewLinks;
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: newCatName, links: linksArr, imageUrl: newCatImageUrl }),
    });
    if (res.ok) {
      setSuccess("Category added");
      setNewCatName("");
      setNewCatLinks("");
      setNewCatImageUrl("");
      fetchGallery();
    } else {
      setError("Failed to add category");
    }
  }

  async function handleNewCategoryImageChange(file: File | null) {
    if (!file) {
      setNewCatImageUrl("");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setNewCatImageUrl(dataUrl);
    } catch {
      setError("Failed to process image file");
    }
  }

  function removeDraftLink(linkToRemove: string) {
    const remaining = parsedNewLinks.filter((item) => item !== linkToRemove);
    setNewCatLinks(remaining.join("\n"));
  }

  async function deleteCategory(catIdx: number) {
    const cat = categories[catIdx];
    if (!cat) return;
    if (!window.confirm(`Delete category '${cat.category}' and all links?`)) return;
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: cat.category, deleteCategory: true }),
    });
    if (res.ok) {
      setSuccess("Category deleted");
      fetchGallery();
    } else setError("Failed to delete category");
  }

  async function addLink(catIdx: number, newLink: string) {
    if (!newLink.trim()) return;
    const cat = { ...categories[catIdx] };
    cat.links = [...(cat.links || []), newLink.trim()];
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: cat.category, links: cat.links }),
    });
    if (res.ok) {
      setSuccess("Link added");
      fetchGallery();
    } else {
      setError("Failed to add link");
    }
  }

  async function deleteLink(catIdx: number, linkIdx: number) {
    const cat = { ...categories[catIdx] };
    cat.links = [...cat.links];
    cat.links.splice(linkIdx, 1);
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: cat.category, links: cat.links }),
    });
    if (res.ok) {
      setSuccess("Link deleted");
      fetchGallery();
    } else {
      setError("Failed to delete link");
    }
  }

  function startRename(catIdx: number) {
    const cat = categories[catIdx];
    if (!cat) return;
    setEditingCatIndex(catIdx);
    setEditingCatDraft(cat.category);
  }

  function cancelRename() {
    setEditingCatIndex(null);
    setEditingCatDraft("");
  }

  async function renameCategory(catIdx: number) {
    const cat = categories[catIdx];
    const nextName = editingCatDraft.trim();
    if (!cat || !nextName || nextName === cat.category) {
      cancelRename();
      return;
    }

    // create new, copy links, delete old
    const linksArr = cat.links ?? [];
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: nextName, links: linksArr, imageUrl: cat.imageUrl ?? "" }),
    });
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: cat.category, deleteCategory: true }),
    });
    setSuccess("Category renamed");
    cancelRename();
    fetchGallery();
  }

  async function updateCategoryImage(catIdx: number, file: File | null) {
    const cat = categories[catIdx];
    if (!cat || !file) return;

    try {
      const imageUrl = await fileToDataUrl(file);
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: cat.category, links: cat.links, imageUrl }),
      });

      if (res.ok) {
        setSuccess("Category image updated");
        fetchGallery();
      } else {
        setError("Failed to update category image");
      }
    } catch {
      setError("Failed to process image file");
    }
  }

  async function clearCategoryImage(catIdx: number) {
    const cat = categories[catIdx];
    if (!cat) return;

    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: cat.category, links: cat.links, imageUrl: "" }),
    });

    if (res.ok) {
      setSuccess("Category image removed");
      fetchGallery();
    } else {
      setError("Failed to remove category image");
    }
  }

  async function updateLeadStatus(id: string, patch: Partial<Pick<BookingLead, "leadStatus" | "called">>) {
    const res = await fetch("/api/booking-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });

    if (res.ok) {
      setSuccess("Lead updated");
      fetchBookingLeads();
      return;
    }

    setError("Failed to update lead");
  }

  async function addPhotoImage() {
    const url = newPhotoUrl.trim();
    if (!url) return setError("Image URL is required");
    if (!isValidHttpUrl(url) && !url.startsWith("data:")) return setError("Enter a valid http/https URL or upload an image");

    const res = await fetch("/api/photo-gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, caption: newPhotoCaption.trim() }),
    });

    if (res.ok) {
      setSuccess("Photo added");
      setNewPhotoUrl("");
      setNewPhotoCaption("");
      fetchPhotoImages();
    } else {
      setError("Failed to add photo");
    }
  }

  async function handlePhotoFileUpload(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setNewPhotoUrl(dataUrl);
    } catch {
      setError("Failed to read image file");
    }
  }

  async function deletePhotoImage(id: string) {
    if (!window.confirm("Delete this photo?")) return;
    const res = await fetch(`/api/photo-gallery?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      setSuccess("Photo deleted");
      fetchPhotoImages();
    } else {
      setError("Failed to delete photo");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.12),_transparent_48%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <header className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
            Admin Panel
          </div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent leading-tight">
            Gallery Management
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
            Create, organize, and curate video categories from one dashboard.
          </p>
        </header>

        {status && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm sm:text-base shadow-sm backdrop-blur ${
              status.kind === "success"
                ? "border-amber-300/30 bg-amber-400/10 text-amber-200"
                : "border-orange-300/30 bg-orange-400/10 text-orange-200"
            }`}
          >
            {status.text}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-amber-500/20 bg-black/40 p-1.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setActiveView("categories")}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeView === "categories"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-700/25"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => setActiveView("highlights")}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeView === "highlights"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-700/25"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Performance Highlights
            </button>
            <button
              type="button"
              onClick={() => setActiveView("testimonials")}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeView === "testimonials"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-700/25"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Testimonials
            </button>
            <button
              type="button"
              onClick={() => setActiveView("photos")}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeView === "photos"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-700/25"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Photo Gallery
            </button>
          </div>

          <div className="inline-flex rounded-xl border border-amber-500/20 bg-black/40 p-1.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setActiveView("leads")}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeView === "leads"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-700/25"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Booking Leads
            </button>
          </div>
        </div>

        {activeView === "categories" && (
          <div className="grid grid-cols-1 xl:grid-cols-[380px,1fr] gap-6 sm:gap-8">
          <aside className="rounded-2xl border border-amber-500/20 bg-zinc-900/70 p-5 sm:p-6 shadow-[0_12px_35px_-16px_rgba(0,0,0,0.75)] backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white">Add New Category</h2>
            <p className="mt-1 text-sm text-white/60">Paste links separated by comma or new line.</p>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-amber-100/80">Category Name</span>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full rounded-lg border border-amber-500/20 bg-black/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                  placeholder="e.g. Wedding Highlights"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-amber-100/80">Video Links</span>
                <textarea
                  value={newCatLinks}
                  onChange={(e) => setNewCatLinks(e.target.value)}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-amber-500/20 bg-black/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                  placeholder="https://...\nhttps://...\nor use commas"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-amber-100/80">Category Image (Optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleNewCategoryImageChange(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-amber-500/20 bg-black/60 px-3 py-2 text-xs text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                />
              </label>

              {newCatImageUrl && (
                <div className="rounded-lg border border-amber-500/20 bg-black/45 p-2">
                  <img src={newCatImageUrl} alt="New category preview" className="mx-auto w-full max-w-[220px] aspect-[3/4] rounded-md bg-black/60 object-contain" />
                  <button
                    type="button"
                    onClick={() => setNewCatImageUrl("")}
                    className="mt-2 rounded-md bg-zinc-700 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white hover:bg-zinc-600"
                  >
                    Clear image
                  </button>
                </div>
              )}

              <div className="rounded-lg border border-amber-500/20 bg-black/50 p-3">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-semibold text-white/75">
                    Parsed: {parsedNewLinks.length}
                  </span>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-1 font-semibold text-amber-200">
                    Valid: {validNewLinks.length}
                  </span>
                  <span className="rounded-full bg-rose-900/50 px-2.5 py-1 font-semibold text-rose-300">
                    Invalid: {invalidNewLinks.length}
                  </span>
                </div>

                {parsedNewLinks.length === 0 ? (
                  <p className="text-xs text-white/45">Links preview will appear here.</p>
                ) : (
                  <ul className="max-h-40 space-y-1 overflow-auto pr-1">
                    {parsedNewLinks.map((link) => {
                      const valid = isValidHttpUrl(link);
                      return (
                        <li
                          key={link}
                          className={`flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-xs ${
                            valid
                              ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
                              : "border-orange-500/40 bg-orange-500/10 text-orange-100"
                          }`}
                        >
                          <span className="truncate">{link}</span>
                          <button
                            type="button"
                            onClick={() => removeDraftLink(link)}
                            className="rounded bg-black/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide hover:bg-black/35"
                          >
                            Remove
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <button
              className="mt-5 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-700/30 transition hover:brightness-110 active:scale-[0.99]"
              onClick={addCategory}
            >
              Add Category
            </button>
          </aside>

          <section className="rounded-2xl border border-amber-500/20 bg-zinc-900/70 p-5 sm:p-6 shadow-[0_12px_35px_-16px_rgba(0,0,0,0.75)] backdrop-blur-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">All Categories</h2>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
                {categories.length} total
              </span>
            </div>

            <div className="space-y-4">
              {categories.length === 0 && (
                <div className="rounded-xl border border-dashed border-amber-500/20 bg-black/40 px-4 py-10 text-center text-white/60">
                  No categories found.
                </div>
              )}

              {categories.map((cat, catIdx) => (
                <article
                  key={cat.category}
                  className="rounded-xl border border-amber-500/20 bg-black/45 p-4 sm:p-5 shadow-inner"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {editingCatIndex === catIdx ? (
                      <>
                        <input
                          className="min-w-[210px] flex-1 rounded-md border border-amber-500/20 bg-black/60 px-3 py-1.5 text-sm text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                          value={editingCatDraft}
                          onChange={(e) => setEditingCatDraft(e.target.value)}
                        />
                        <button
                          className="rounded-md bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:brightness-110"
                          onClick={() => renameCategory(catIdx)}
                        >
                          Save
                        </button>
                        <button
                          className="rounded-md bg-zinc-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-100 hover:bg-zinc-600"
                          onClick={cancelRename}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg sm:text-xl font-bold text-amber-200">{cat.category}</h3>
                        <button
                          className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-amber-500"
                          onClick={() => startRename(catIdx)}
                        >
                          Rename
                        </button>
                        <button
                          className="rounded-md bg-rose-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-rose-600"
                          onClick={() => deleteCategory(catIdx)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  <div className="mt-4 rounded-md border border-amber-500/20 bg-black/45 p-3">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={`${cat.category} preview`} className="mb-2 h-28 w-full rounded-md object-cover" />
                    ) : (
                      <div className="mb-2 h-28 w-full rounded-md bg-gradient-to-br from-zinc-800 to-zinc-900" />
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="rounded-md bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:brightness-110 cursor-pointer">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => updateCategoryImage(catIdx, e.target.files?.[0] ?? null)}
                        />
                      </label>
                      {cat.imageUrl && (
                        <button
                          className="rounded-md bg-zinc-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-100 hover:bg-zinc-600"
                          onClick={() => clearCategoryImage(catIdx)}
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {(cat.links || []).length === 0 && (
                      <li className="rounded-md border border-amber-500/20 bg-black/45 px-3 py-2 text-sm text-white/60">
                        No links in this category.
                      </li>
                    )}

                    {(cat.links || []).map((link: string, linkIdx: number) => (
                      <li
                        key={`${cat.category}-${linkIdx}`}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-md border border-amber-500/20 bg-black/45 px-3 py-2"
                      >
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full break-all text-sm text-amber-300 underline decoration-amber-500/60 underline-offset-4 hover:text-amber-200"
                        >
                          {link}
                        </a>
                        <button
                          className="self-start sm:self-auto rounded-md bg-rose-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-rose-600"
                          onClick={() => deleteLink(catIdx, linkIdx)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <AddLinkForm onAdd={(l) => addLink(catIdx, l)} />
                  </div>
                </article>
              ))}
            </div>
          </section>
          </div>
        )}

        {activeView === "leads" && (
          <section className="mt-2 rounded-2xl border border-amber-500/20 bg-zinc-900/70 p-5 sm:p-6 shadow-[0_12px_35px_-16px_rgba(0,0,0,0.75)] backdrop-blur-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-white">Booking Leads</h2>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-100">
                Total: {bookingLeads.length}
              </span>
              <span className="rounded-full border border-orange-500/30 bg-orange-500/15 px-3 py-1 text-orange-200">
                New: {bookingLeads.filter((item) => item.leadStatus === "new").length}
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-amber-200">
                Followed: {bookingLeads.filter((item) => item.leadStatus === "followed").length}
              </span>
            </div>
          </div>

          {loadingLeads && <p className="text-white/70">Loading booking leads...</p>}

          {!loadingLeads && bookingLeads.length === 0 && (
            <div className="rounded-xl border border-dashed border-amber-500/20 bg-black/40 px-4 py-10 text-center text-white/60">
              No booking requests yet.
            </div>
          )}

          {!loadingLeads && bookingLeads.length > 0 && (
            <div className="space-y-3">
              {bookingLeads.map((lead) => (
                <article key={lead.id} className="rounded-xl border border-amber-500/20 bg-black/45 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1.5 text-sm text-white/90">
                      <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                      <p>
                        <span className="text-white/55">Email:</span> {lead.email}
                      </p>
                      <p>
                        <span className="text-white/55">Phone:</span> {lead.phone}
                      </p>
                      {lead.event && (
                        <p>
                          <span className="text-white/55">Event:</span> {lead.event}
                        </p>
                      )}
                      {lead.eventDate && (
                        <p>
                          <span className="text-white/55">Event Date:</span> {new Date(lead.eventDate).toLocaleDateString()}
                        </p>
                      )}
                      {lead.eventLocation && (
                        <p>
                          <span className="text-white/55">Location:</span> {lead.eventLocation}
                        </p>
                      )}
                      {lead.budget && (
                        <p>
                          <span className="text-white/55">Budget:</span> {lead.budget}
                        </p>
                      )}
                      <p className="pt-1 text-white/80">{lead.message}</p>
                      <p className="text-xs text-white/45">Created: {new Date(lead.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col gap-2 md:min-w-[220px]">
                      <button
                        type="button"
                        onClick={() => updateLeadStatus(lead.id, { leadStatus: lead.leadStatus === "new" ? "followed" : "new" })}
                        className={`rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wide text-white ${
                          lead.leadStatus === "new"
                            ? "bg-orange-700 hover:bg-orange-600"
                            : "bg-amber-700 hover:bg-amber-600"
                        }`}
                      >
                        {lead.leadStatus === "new" ? "Mark as Followed" : "Mark as New"}
                      </button>

                      <button
                        type="button"
                        onClick={() => updateLeadStatus(lead.id, { called: !lead.called })}
                        className={`rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wide text-white ${
                          lead.called ? "bg-amber-700 hover:bg-amber-600" : "bg-zinc-700 hover:bg-zinc-600"
                        }`}
                      >
                        {lead.called ? "Called: Yes (Toggle)" : "Called: No (Toggle)"}
                      </button>

                      <div className="rounded-md border border-amber-500/20 bg-black/50 px-3 py-2 text-xs text-white/75">
                        Status: <span className="font-semibold text-white">{lead.leadStatus}</span>
                        <br />
                        Called: <span className="font-semibold text-white">{lead.called ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          </section>
        )}

        {activeView === "highlights" && (
          <PerformanceHighlightsManager onSuccess={setSuccess} onError={setError} />
        )}

        {activeView === "testimonials" && (
          <TestimonialsManager onSuccess={setSuccess} onError={setError} />
        )}

        {activeView === "photos" && (
          <section className="mt-2 rounded-2xl border border-amber-500/20 bg-zinc-900/70 p-5 sm:p-6 shadow-[0_12px_35px_-16px_rgba(0,0,0,0.75)] backdrop-blur-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Photo Gallery</h2>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
                {photoImages.length} photos
              </span>
            </div>

            {/* Add Photo Form */}
            <div className="mb-8 rounded-xl border border-amber-500/20 bg-black/45 p-4 sm:p-5">
              <h3 className="text-lg font-bold text-white mb-4">Add New Photo</h3>
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-amber-100/80">Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoFileUpload(e.target.files?.[0] ?? null)}
                    className="w-full rounded-lg border border-amber-500/20 bg-black/60 px-3 py-2 text-xs text-white outline-none transition focus:border-amber-400"
                  />
                </label>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <div className="flex-1 border-t border-white/10" />
                  or paste a URL
                  <div className="flex-1 border-t border-white/10" />
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-amber-100/80">Image URL</span>
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-lg border border-amber-500/20 bg-black/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                  />
                </label>
                {newPhotoUrl && (
                  <div className="rounded-lg border border-amber-500/20 bg-black/45 p-2">
                    <img src={newPhotoUrl} alt="Preview" className="mx-auto w-full max-w-[260px] aspect-[3/4] rounded-md bg-black/60 object-contain" />
                  </div>
                )}
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-amber-100/80">Caption (Optional)</span>
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="e.g. Wedding reception, Mumbai 2024"
                    className="w-full rounded-lg border border-amber-500/20 bg-black/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                  />
                </label>
                <button
                  onClick={addPhotoImage}
                  className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-700/30 transition hover:brightness-110 active:scale-[0.99]"
                >
                  Add Photo
                </button>
              </div>
            </div>

            {/* Photo Grid */}
            {loadingPhotos && <p className="text-white/70">Loading photos...</p>}

            {!loadingPhotos && photoImages.length === 0 && (
              <div className="rounded-xl border border-dashed border-amber-500/20 bg-black/40 px-4 py-10 text-center text-white/60">
                No photos yet. Add some above.
              </div>
            )}

            {!loadingPhotos && photoImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {photoImages.map((img) => (
                  <div key={img.id} className="group relative rounded-xl overflow-hidden border border-amber-500/20 bg-black/45">
                    <img src={img.url} alt={img.caption || "Gallery photo"} className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      {img.caption && (
                        <p className="text-xs text-white/90 text-center truncate w-full">{img.caption}</p>
                      )}
                      <button
                        onClick={() => deletePhotoImage(img.id)}
                        className="rounded-md bg-rose-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function PerformanceHighlightsManager({
  onSuccess,
  onError,
}: {
  onSuccess: (text: string) => void;
  onError: (text: string) => void;
}) {
  const [items, setItems] = useState<PerformanceHighlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHighlights();
  }, []);

  async function fetchHighlights() {
    setLoading(true);
    try {
      const res = await fetch("/api/performance-highlights", { cache: "no-store" });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
      onError("Failed to load performance highlights");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setYoutubeUrl("");
    setEditingId(null);
  }

  function startEdit(item: PerformanceHighlight) {
    setEditingId(item.id);
    setTitle(item.title);
    setYoutubeUrl(item.youtubeUrl);
  }

  async function submit() {
    if (!title.trim() || !youtubeUrl.trim()) {
      onError("Title and YouTube URL are required");
      return;
    }

    const method = editingId ? "PATCH" : "POST";
    const body = editingId
      ? { id: editingId, title: title.trim(), youtubeUrl: youtubeUrl.trim() }
      : { title: title.trim(), youtubeUrl: youtubeUrl.trim() };

    const res = await fetch("/api/performance-highlights", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      onError(data?.error || "Failed to save performance highlight");
      return;
    }

    onSuccess(editingId ? "Performance highlight updated" : "Performance highlight added");
    resetForm();
    fetchHighlights();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this performance highlight?")) return;

    const res = await fetch(`/api/performance-highlights?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      onError("Failed to delete performance highlight");
      return;
    }

    if (editingId === id) resetForm();
    onSuccess("Performance highlight deleted");
    fetchHighlights();
  }

  return (
    <section className="mt-2 rounded-2xl border border-amber-500/20 bg-zinc-900/70 p-5 sm:p-6 shadow-[0_12px_35px_-16px_rgba(0,0,0,0.75)] backdrop-blur-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Performance Highlights</h2>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
          {items.length} total
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px,1fr] gap-6">
        <aside className="rounded-xl border border-amber-500/20 bg-black/45 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-white">{editingId ? "Edit Highlight" : "Add Highlight"}</h3>
          <p className="mt-1 text-sm text-white/60">Provide title and YouTube URL.</p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-amber-100/80">Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-amber-500/20 bg-black/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                placeholder="e.g. Corporate Event Highlight"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-amber-100/80">YouTube URL</span>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full rounded-lg border border-amber-500/20 bg-black/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </label>
          </div>

          <button
            className="mt-5 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-700/30 transition hover:brightness-110 active:scale-[0.99]"
            onClick={submit}
          >
            {editingId ? "Update Highlight" : "Add Highlight"}
          </button>
        </aside>

        <div className="space-y-4">
          {loading && <p className="text-white/70">Loading highlights...</p>}

          {!loading && items.length === 0 && (
            <div className="rounded-xl border border-dashed border-amber-500/20 bg-black/40 px-4 py-10 text-center text-white/60">
              No highlights found.
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-amber-500/20 bg-black/45 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1.5 text-sm text-white/90">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-amber-300 underline decoration-amber-500/60 underline-offset-4 hover:text-amber-200 break-all"
                      >
                        {item.youtubeUrl}
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-amber-500"
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md bg-rose-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-rose-600"
                        onClick={() => remove(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TestimonialsManager({
  onSuccess,
  onError,
}: {
  onSuccess: (text: string) => void;
  onError: (text: string) => void;
}) {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials?scope=all", { cache: "no-store" });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
      onError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(item: Testimonial) {
    const nextStatus: TestimonialStatus = item.status === "approved" ? "pending" : "approved";

    const res = await fetch("/api/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, status: nextStatus }),
    });

    if (!res.ok) {
      onError("Failed to update testimonial status");
      return;
    }

    onSuccess(nextStatus === "approved" ? "Testimonial approved" : "Testimonial moved to pending");
    fetchTestimonials();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this testimonial?")) return;

    const res = await fetch(`/api/testimonials?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      onError("Failed to delete testimonial");
      return;
    }

    onSuccess("Testimonial deleted");
    fetchTestimonials();
  }

  return (
    <section className="mt-2 rounded-2xl border border-amber-500/20 bg-zinc-900/70 p-5 sm:p-6 shadow-[0_12px_35px_-16px_rgba(0,0,0,0.75)] backdrop-blur-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Testimonials Approval</h2>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-100">
            Total: {items.length}
          </span>
          <span className="rounded-full border border-orange-500/30 bg-orange-500/15 px-3 py-1 text-orange-200">
            Pending: {items.filter((item) => item.status === "pending").length}
          </span>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-amber-200">
            Approved: {items.filter((item) => item.status === "approved").length}
          </span>
        </div>
      </div>

      {loading && <p className="text-white/70">Loading testimonials...</p>}

      {!loading && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-amber-500/20 bg-black/40 px-4 py-10 text-center text-white/60">
          No testimonials found.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-amber-500/20 bg-black/45 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1.5 text-sm text-white/90">
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  {item.role && <p className="text-amber-300/90">{item.role}</p>}
                  <p className="text-white/80 italic">"{item.text}"</p>
                  <p className="text-xs text-white/55">Rating: {item.rating}/5</p>
                  <p className="text-xs text-white/45">Submitted: {new Date(item.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex flex-col gap-2 md:min-w-[220px]">
                  <button
                    type="button"
                    onClick={() => toggleStatus(item)}
                    className={`rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wide text-white ${
                      item.status === "approved"
                        ? "bg-zinc-700 hover:bg-zinc-600"
                        : "bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110"
                    }`}
                  >
                    {item.status === "approved" ? "Move to Pending" : "Approve"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-md bg-rose-700 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-rose-600"
                  >
                    Delete
                  </button>
                  <div className="rounded-md border border-amber-500/20 bg-black/50 px-3 py-2 text-xs text-white/75">
                    Status: <span className="font-semibold text-white">{item.status}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function AddLinkForm({ onAdd }: { onAdd: (link: string) => void }) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (!isValidHttpUrl(trimmed)) {
      setError("Enter a valid http/https URL");
      return;
    }
    setError("");
    onAdd(trimmed);
    setDraft("");
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row mt-1 gap-2">
        <input
          type="text"
          className="flex-1 rounded-md border border-amber-500/20 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
          placeholder="Paste a video link"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button
          className="rounded-md bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:brightness-110"
          onClick={submit}
        >
          Add Link
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
