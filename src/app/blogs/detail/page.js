// src/app/blogs/detail/page.js
'use client'
/* eslint-disable @next/next/no-img-element */

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Figtree } from "next/font/google";
import { Clock, Calendar } from "lucide-react";

const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const GOLD_DEEP = "#8A6B2E";
const NAVY = "#0F1C2E";
const LINE = "#E8DFCB";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const IMG_BASE = process.env.NEXT_PUBLIC_IMG_URL;

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
  content: b.content || b.full_description || "",
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

// Public GET helper (no token)
async function getJson(url) {
  let res;
  try {
    res = await fetch(url, { headers: { Accept: "application/json" } });
  } catch (e) {
    throw new Error("Could not reach the API (network or CORS issue).");
  }
  const json = await res.json().catch(() => null);
  console.log("Blogs API:", url, res.status, json);
  if (!res.ok) throw new Error(json?.message || `Request failed (${res.status}).`);
  return json;
}

function BlogDetail() {
  const id = useSearchParams().get("id");
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No blog selected.");
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    setPost(null);

    (async () => {
      try {
        // GET /api/blogs/details/:id
        const json = await getJson(`${API}/details/${id}`);
        const data = json?.data ?? json;
        if (!data?.id) throw new Error("Blog not found.");
        if (!active) return;
        setPost(fromApi(data));
        window.scrollTo(0, 0);

        // GET /api/blogs/list (for "More from the journal")
        try {
          const all = toList(await getJson(`${API}/list`)).map(fromApi);
          if (active) setRelated(all.filter((p) => String(p.id) !== String(data.id)).slice(0, 2));
        } catch {
          /* related posts are optional */
        }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className={figtree.className}>
        <section className="max-w-[760px] mx-auto px-5 sm:px-6 pt-10 sm:pt-16 animate-pulse">
          <div className="h-3 w-24 rounded bg-neutral-200" />
          <div className="mt-4 h-10 w-full rounded bg-neutral-200" />
          <div className="mt-3 h-10 w-2/3 rounded bg-neutral-200" />
          <div className="mt-10 h-[320px] w-full rounded-2xl bg-neutral-100" />
        </section>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className={figtree.className}>
        <section className="max-w-[760px] mx-auto px-5 sm:px-6 py-24 text-center">
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Blog not found</h1>
          <p className="mt-3 text-neutral-500">{error || "This article may have been removed."}</p>
          <Link href="/blogs" className="inline-block mt-6 font-semibold" style={{ color: GOLD_DEEP }}>
            Back to Blogs
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={figtree.className}>
      {/* Title block */}
      <section className="max-w-[760px] mx-auto px-5 sm:px-6 pt-10 sm:pt-16">
        <span className="text-xs font-bold tracking-[0.15em]" style={{ color: GOLD_DEEP }}>
          {post.category}
        </span>
        <h1 className="mt-4 text-[28px] sm:text-[38px] md:text-[44px] font-bold leading-[1.15]" style={{ color: NAVY }}>
          {post.title}
        </h1>
        <div className="flex items-center gap-5 text-sm text-neutral-500 mt-6 pb-8 border-b" style={{ borderColor: LINE }}>
          {post.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
          )}
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          )}
        </div>
      </section>

      {/* Cover image */}
      {post.image && (
        <section className="max-w-[900px] mx-auto px-5 sm:px-6 mt-8">
          <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-100">
            <img src={post.image} alt={post.title} className="w-full h-auto object-contain" style={{ display: "block" }} />
          </div>
        </section>
      )}

      {/* Body */}
      <section className="max-w-[760px] mx-auto px-5 sm:px-6 py-10 sm:py-14">
        {post.excerpt && <p className="text-lg leading-relaxed text-neutral-700 mb-6">{post.excerpt}</p>}
        <div
          className="prose prose-neutral max-w-none text-[15px] leading-relaxed text-neutral-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-[1000px] mx-auto px-5 sm:px-6 pb-20">
          <h3 className="text-lg font-bold mb-6" style={{ color: NAVY }}>More from the journal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blogs/detail?id=${r.id}`}
                className="group rounded-2xl border bg-white overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                style={{ borderColor: LINE }}
              >
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <img
                    src={r.image}
                    alt={r.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold tracking-wide" style={{ color: GOLD_DEEP }}>{r.category}</span>
                  <h4 className="mt-2 font-bold leading-snug" style={{ color: NAVY }}>{r.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

// useSearchParams needs a Suspense boundary for static export
export default function BlogDetailPage() {
  return (
    <Suspense fallback={null}>
      <BlogDetail />
    </Suspense>
  );
}