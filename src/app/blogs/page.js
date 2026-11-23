// src/app/blogs/page.js
'use client'
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Figtree } from "next/font/google";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
});

const CREAM = "#FBF8F2";
const GOLD_DEEP = "#8A6B2E";
const NAVY = "#0F1C2E";
const LINE = "#E8DFCB";

const API = "https://api.crazystory.in/api/blogs";
const IMG_BASE = "https://api.crazystory.in/storage/";

const imgSrc = (p) => {
  if (!p) return "";
  if (/^(https?:|data:|blob:|\/)/.test(p)) return p;
  return IMG_BASE + p;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

const fromApi = (b) => ({
  id: b.id,
  title: b.title || "",
  category: b.category || "",
  excerpt: b.short_description || "",
  image: imgSrc(b.image),
  readTime: b.read_time || "",
  date: fmtDate(b.created_at),
});

const toList = (json) => {
  if (Array.isArray(json)) return json;
  if (!json || typeof json !== "object") return [];
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.data?.data)) return json.data.data;
  const first = Object.values(json).find((v) => Array.isArray(v));
  return first || [];
};

// GET /api/blogs/list (public, no token)
async function fetchBlogs() {
  let res;
  try {
    res = await fetch(`${API}/list`, { headers: { Accept: "application/json" } });
  } catch (e) {
    throw new Error("Could not reach the API (network or CORS issue).");
  }
  const json = await res.json().catch(() => null);
  console.log("Blogs API:", res.status, json);
  if (!res.ok) throw new Error(json?.message || `Request failed (${res.status}).`);
  return toList(json).map(fromApi);
}

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(await fetchBlogs());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className={figtree.className} style={{ backgroundColor: CREAM }}>
      {/* Hero Section */}
      <section className="w-full">
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[420px] lg:h-[780px] flex overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl mx-3 mt-3 sm:mx-4 sm:mt-4 md:mx-8 md:mt-8">
          <div
            className="hero-img flex-[1.7] relative bg-cover bg-center mr-23"
            style={{ backgroundImage: `url(/blogs.png)` }}
          />
        </div>
      </section>

      {/* Blog Cards */}
      <section className="w-full px-4 mt-10 pb-16 sm:px-6 sm:mt-14 md:px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-2xl border bg-white overflow-hidden animate-pulse" style={{ borderColor: LINE }}>
                  <div className="h-[200px] sm:h-[190px] xl:h-[210px]" style={{ backgroundColor: "#F3ECDA" }} />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-24 rounded-full" style={{ backgroundColor: "#F3ECDA" }} />
                    <div className="h-4 w-3/4 rounded bg-neutral-200" />
                    <div className="h-3 w-full rounded bg-neutral-100" />
                    <div className="h-3 w-2/3 rounded bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-sm" style={{ color: NAVY }}>{error}</p>
              <button onClick={load} className="mt-4 text-sm font-semibold" style={{ color: GOLD_DEEP }}>
                Try again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-sm py-16 text-neutral-500">No blogs published yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function BlogCard({ post }) {
  return (
    <Link
      href={`/blogs/detail?id=${post.id}`}
      className="rounded-2xl border bg-white overflow-hidden flex flex-col group cursor-pointer transition-shadow hover:shadow-md"
      style={{ borderColor: LINE }}
    >
      <div className="relative h-[200px] overflow-hidden sm:h-[190px] xl:h-[210px] bg-neutral-100">
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span
          className="inline-block text-[11px] font-semibold uppercase tracking-wide rounded-full px-3 py-1 mb-3 w-fit"
          style={{ backgroundColor: "#F3ECDA", color: GOLD_DEEP }}
        >
          {post.category}
        </span>
        <h3 className="text-base font-bold leading-snug mb-2" style={{ color: NAVY }}>
          {post.title}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed mb-4 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t flex-wrap" style={{ borderColor: LINE }}>
          <div className="flex items-center gap-3 text-xs text-neutral-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            )}
          </div>
          <span
            className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#8A6B2E]"
            style={{ borderColor: GOLD_DEEP }}
          >
            <ArrowRight className="w-3.5 h-3.5 transition-colors group-hover:text-white" style={{ color: GOLD_DEEP }} />
          </span>
        </div>
      </div>
    </Link>
  );
}