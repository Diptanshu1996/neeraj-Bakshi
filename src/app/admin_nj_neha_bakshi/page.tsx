"use client";
import React, { useState, useEffect } from "react";

export default function AdminGallery() {
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number>(-1);
  const [newCatName, setNewCatName] = useState("");
  const [newCatLinks, setNewCatLinks] = useState("");
  const [editingCatName, setEditingCatName] = useState<string | null>(null);
  const [linkEdits, setLinkEdits] = useState<Record<number, Record<number, string>>>({});

  // Fetch initial categories
  useEffect(() => {
    fetchGallery();
  }, [status]);

  async function fetchGallery() {
    const res = await fetch("/api/gallery");
    try {
      const arr = await res.json();
      setCategories(Array.isArray(arr) ? arr : []);
    } catch {
      setCategories([]);
    }
  }

  // --- CRUD Actions ---
  async function saveCategory(catIdx:number) {
    const cat = categories[catIdx];
    if (!cat) return;
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(cat)
    });
    setStatus(res.ok ? "Saved changes!" : "Failed to save");
  }

  async function deleteCategory(catIdx:number) {
    const cat = categories[catIdx];
    if (!cat) return;
    if (!window.confirm(`Delete category '${cat.category}' and all links?`)) return;
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({category: cat.category, deleteCategory: true})
    });
    if (res.ok) {
      setStatus("Category deleted!");
      setSelectedCategoryIdx(-1);
    } else setStatus("Failed to delete");
  }

  async function addCategory() {
    if (!newCatName.trim()) return setStatus("Category name required");
    const linksArr = newCatLinks.split(",").map(x=>x.trim()).filter(Boolean);
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({category: newCatName, links: {links: linksArr}})
    });
    setStatus(res.ok ? "Category added!" : "Failed to add category");
    setNewCatName(""); setNewCatLinks("");
  }

  async function renameCategory(catIdx:number) {
    const cat = categories[catIdx];
    if (!cat || !editingCatName || editingCatName === cat.category) {
      setEditingCatName(null); return;
    }
    // create new, copy links, delete old
    const linksArr = (cat.links?.links ?? []);
    await fetch("/api/gallery", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({category: editingCatName, links: {links: linksArr}})
    });
    await fetch("/api/gallery", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({category: cat.category, deleteCategory: true})
    });
    setStatus("Category renamed");
    setEditingCatName(null);
    setSelectedCategoryIdx(-1);
  }

  // ----- Per-link CRUD -----
  function handleLinkEdit(catIdx:number, linkIdx:number, value:string) {
    setLinkEdits(edits => ({
      ...edits,
      [catIdx]: {...(edits[catIdx] ?? {}), [linkIdx]: value },
    }));
  }

  async function saveLink(catIdx:number, linkIdx:number) {
    const editsCat = (linkEdits as any)[catIdx] || {};
    if (!editsCat[linkIdx]) return;
    const cat = {...categories[catIdx]};
    cat.links.links[linkIdx] = editsCat[linkIdx];
    await fetch("/api/gallery", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(cat)
    });
    setStatus("Link updated");
    setLinkEdits(edits => {
  const updated = { ...edits };
  const catEntry = { ...(updated[catIdx] || {}) };
  delete catEntry[linkIdx];
  updated[catIdx] = catEntry;
  return updated;
});
  }

  async function deleteLink(catIdx:number, linkIdx:number) {
    if (!window.confirm("Delete this link?")) return;
    const cat = {...categories[catIdx]};
    cat.links.links.splice(linkIdx, 1);
    await fetch("/api/gallery", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(cat)
    });
    setStatus("Link deleted");
  }

  async function addLink(catIdx:number, newLink:string) {
    if (!newLink.trim()) return;
    const cat = {...categories[catIdx]};
    cat.links.links.push(newLink.trim());
    await fetch("/api/gallery", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(cat)
    });
    setStatus("Link added");
  }

  // --- Render ---
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-16 px-2">
      <h1 className="text-3xl font-bold mb-6">Admin: Gallery CRUD (JSON backend)</h1>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Add category */}
        <div className="bg-gray-800 p-6 rounded shadow flex flex-col gap-4">
          <h2 className="font-bold text-lg">Add New Category</h2>
          <input
            type="text"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 mb-2"
            placeholder="New category name"
          />
          <textarea
            value={newCatLinks}
            onChange={e => setNewCatLinks(e.target.value)}
            rows={2}
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 mb-2"
            placeholder="Video links, comma separated"
          />
          <button
            className="bg-green-600 px-4 py-1 rounded font-bold"
            onClick={addCategory}
          >Add Category</button>
          {status && <div className="mt-2 text-base text-green-300">{status}</div>}
        </div>
        {/* Right: Browse/Edit Categories */}
        <div className="bg-gray-800 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">All Categories</h2>
          <div className="space-y-7">
            {categories.length === 0 && <span>No categories found.</span>}
            {categories.map((cat, catIdx) => (
              <div key={cat.category} className="mb-2 border-b border-gray-700 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  {editingCatName === cat.category ? (
                    <>
                      <input
                        className="p-1 rounded bg-gray-900 text-white border border-gray-600"
                        value={editingCatName ?? ""}
                        onChange={e=>setEditingCatName(e.target.value)}
                      />
                      <button className="bg-blue-600 px-2 py-1 rounded ml-1" onClick={()=>renameCategory(catIdx)}>Save</button>
                      <button className="bg-gray-600 px-2 py-1 rounded ml-1" onClick={()=>setEditingCatName(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-lg text-blue-300 cursor-pointer" onClick={()=>setSelectedCategoryIdx(catIdx)}>{cat.category}</span>
                      <button className="bg-yellow-700 px-2 py-1 rounded text-sm ml-2" onClick={()=>setEditingCatName(cat.category)}>Rename</button>
                      <button className="bg-red-700 px-2 py-1 rounded text-sm ml-2" onClick={()=>deleteCategory(catIdx)}>Delete</button>
                    </>
                  )}
                  <button className="ml-auto bg-blue-500 px-3 py-1 rounded text-sm font-bold" onClick={()=>saveCategory(catIdx)}>Save All Links</button>
                </div>
                {/* Links */}
                <ul className="pl-4">
                  {(cat.links?.links || []).length === 0 && (
                    <li className="text-gray-400">No links in this category.</li>
                  )}
                  {(cat.links?.links || []).map((link:string, linkIdx:number) => (
                    <li key={linkIdx} className="flex items-center gap-2 mb-1">
                      {linkEdits[catIdx]?.[linkIdx] !== undefined ? (
                        <>
                          <input
                            className="p-1 rounded bg-gray-900 text-white border border-gray-600 w-full"
                            value={linkEdits[catIdx][linkIdx]}
                            onChange={e=>handleLinkEdit(catIdx, linkIdx, e.target.value)}
                            placeholder="Edit link"
                          />
                          <button className="bg-blue-600 px-2 py-1 rounded text-sm" onClick={()=>saveLink(catIdx,linkIdx)}>Save</button>
                          <button className="bg-gray-600 px-1 py-1 rounded text-sm" onClick={()=>setLinkEdits(edits => {
  const updated = { ...edits };
  const catEntry = { ...(updated[catIdx] || {}) };
  delete catEntry[linkIdx];
  updated[catIdx] = catEntry;
  return updated;
})}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-green-300 underline break-all w-full">{link}</a>
                          <button className="bg-yellow-700 px-2 py-1 rounded text-xs ml-1" onClick={()=>handleLinkEdit(catIdx, linkIdx, link)}>Edit</button>
                          <button className="bg-red-700 px-2 py-1 rounded text-xs ml-1" onClick={()=>deleteLink(catIdx, linkIdx)}>Delete</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                {/* Add New Link */}
                <AddLinkForm onAdd={l => addLink(catIdx,l)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

//--- Add Link Form inline component ---
function AddLinkForm({onAdd}:{onAdd:(link:string)=>void}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="flex mt-1 gap-2">
      <input
        type="text"
        className="flex-1 p-1 rounded bg-gray-900 text-white border border-gray-600"
        placeholder="New video link.."
        value={draft}
        onChange={e=>setDraft(e.target.value)}
      />
      <button className="bg-green-700 px-2 py-1 rounded text-xs font-bold" onClick={()=>{onAdd(draft);setDraft("");}}>Add Link</button>
    </div>
  );
}
