"use client";
import React, { useState, useEffect } from "react";

export default function AdminGallery() {
  const [status, setStatus] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [links, setLinks] = useState<string>("");
  const [newCategory, setNewCategory] = useState("");
  const [newLinks, setNewLinks] = useState("");

  useEffect(() => {
    async function fetchGallery() {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setVideos(arr);
      if (arr.length > 0) {
        setCategory(arr[0].category);
        setLinks(((arr[0].links?.links ?? [])).join(", "));
      }
    }
    fetchGallery();
  }, [status]);

  const handleSave = async () => {
    try {
      const linksArr = links.split(",").map(l => l.trim()).filter(l => l);
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, links: { links: linksArr } })
      });
      if (res.ok) {
        setStatus("Saved successfully!");
      } else {
        setStatus("Failed to save.");
      }
    } catch {
      setStatus("Error saving data.");
    }
  };

  const handleDelete = async (cat: string) => {
    if (!window.confirm(`Are you sure you want to delete the category '${cat}' and all its links?`)) return;
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: cat, deleteCategory: true })
      });
      if (res.ok) {
        setStatus("Category deleted!");
      } else {
        setStatus("Failed to delete.");
      }
    } catch {
      setStatus("Error deleting category.");
    }
  };

  const handleSelectCategory = (cat: string) => {
  setCategory(cat);
  const found = videos.find(v => v.category === cat);
  setLinks(((found?.links?.links ?? [])).join(", "));
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-6">Admin: Gallery CRUD (Supabase)</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="flex flex-col gap-4 bg-gray-800 p-6 rounded shadow">
          <label htmlFor="category" className="font-semibold mb-1">Select Category</label>
          <select
            id="category"
            value={category}
            onChange={e => handleSelectCategory(e.target.value)}
            className="w-full p-4 rounded bg-gray-900 text-white border border-gray-700"
            required
          >
            {videos.map(v => (
              <option key={v.category} value={v.category}>{v.category}</option>
            ))}
          </select>
          <label htmlFor="links" className="font-semibold mb-1">Edit Video Links (comma separated)</label>
          <textarea
            id="links"
            value={links}
            onChange={e => setLinks(e.target.value)}
            rows={6}
            className="w-full p-4 rounded bg-gray-900 text-white border border-gray-700"
            placeholder="Enter video links, comma separated"
            required
          />
          <button type="button" className="bg-blue-600 px-6 py-2 rounded font-bold" onClick={handleSave}>Save</button>
          <hr className="my-6 border-gray-700" />
          <h2 className="text-lg font-bold mb-2">Add New Category</h2>
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="w-full p-4 rounded bg-gray-900 text-white border border-gray-700 mb-2"
            placeholder="New category name"
          />
          <textarea
            value={newLinks}
            onChange={e => setNewLinks(e.target.value)}
            rows={4}
            className="w-full p-4 rounded bg-gray-900 text-white border border-gray-700 mb-2"
            placeholder="Video links, comma separated"
          />
          <button
            type="button"
            className="bg-green-600 px-6 py-2 rounded font-bold"
            onClick={async () => {
              if (!newCategory.trim()) return setStatus("Category name required");
              const linksArr = newLinks.split(",").map(l => l.trim()).filter(l => l);
              const res = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: newCategory, links: { links: linksArr } })
              });
              if (res.ok) {
                setStatus("New category added!");
                setNewCategory("");
                setNewLinks("");
              } else {
                setStatus("Failed to add category.");
              }
            }}
          >Add Category</button>
          {status && <div className="mt-2 text-lg">{status}</div>}
        </div>
        {/* Right: Category List & Delete */}
        <div className="bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="space-y-4">
            {videos.map(v => (
              <div key={v.category} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-lg text-blue-400 mr-2 cursor-pointer" onClick={() => handleSelectCategory(v.category)}>{v.category}</span>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-700 ml-2"
                    onClick={() => handleDelete(v.category)}
                  >Delete</button>
                </div>
                <ul className="ml-4 list-disc">
                  {(v.links?.links ?? []).map((link: string, idx: number) => (
                    <li key={idx} className="break-all text-sm text-gray-200">{link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
