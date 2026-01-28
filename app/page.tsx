"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function createPaste() {
    setError("");

    const body: {
      content: string;
      ttl_seconds?: number;
      max_views?: number;
    } = { content };

    if (ttl) body.ttl_seconds = Number(ttl);
    if (views) body.max_views = Number(views);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create paste");
      return;
    }

    setUrl(data.url);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl">
        <h1 className="text-xl font-bold mb-4">Pastebin Lite</h1>

        <textarea
          className="w-full border p-2 mb-3"
          rows={6}
          placeholder="Paste text..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-2 mb-3">
          <input
            className="border p-2 w-1/2"
            placeholder="TTL (seconds)"
            type="number"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
          <input
            className="border p-2 w-1/2"
            placeholder="Max views"
            type="number"
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={createPaste}
        >
          Create Paste
        </button>

  {url && (
    <p className="mt-3 text-green-600 break-all">
      🔗{" "}
      <a
        href={url}
        className="underline text-blue-600 hover:text-blue-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </a>
    </p>
  )}
        {error && <p className="mt-3 text-red-600">{error}</p>}
      </div>
    </main>
  );
}
