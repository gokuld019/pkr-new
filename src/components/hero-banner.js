"use client";

import { useState, useCallback, useEffect, useRef } from "react";



const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/home/details`;
const IMAGE_BASE = process.env.NEXT_PUBLIC_IMG_URL;

// Shown only if the API fails or returns no banners
const FALLBACK_SLIDES = [
  {
    desktop: "/banners/33.webp",
    mobile: "/banners/m-1.webp",
    alt: "Project amenities banner",
  },
  {
    desktop: "/banners/compr2.webp",
    mobile: "/banners/2.webp",
    alt: "Privana project banner",
  },
  {
    desktop: "/banners/compr1.webp",
    mobile: "/banners/mob1.webp",
    alt: "Gurudev project banner",
  },
];

const AUTO_SCROLL_MS = 5500;
const SWIPE_THRESHOLD = 50;

const toUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${IMAGE_BASE}${String(path).replace(/^\/+/, "")}`;
};

// Build slides from desktop_banners + mobile_banners (they may differ in length)
const buildSlides = (data) => {
  const desktop = Array.isArray(data?.desktop_banners) ? data.desktop_banners.filter(Boolean) : [];
  const mobile = Array.isArray(data?.mobile_banners) ? data.mobile_banners.filter(Boolean) : [];
  const count = Math.max(desktop.length, mobile.length);

  const slides = [];
  for (let i = 0; i < count; i++) {
    const d = desktop[i] || desktop[0] || mobile[i] || mobile[0];
    const m = mobile[i] || mobile[0] || desktop[i] || desktop[0];
    slides.push({
      desktop: toUrl(d),
      mobile: toUrl(m),
      alt: `PKR Estates banner ${i + 1}`,
    });
  }
  return slides;
};

function SlideImage({ slide, priority }) {
  return (
    <picture className="block w-full">
      <source media="(min-width: 768px)" srcSet={slide.desktop} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.mobile}
        alt={slide.alt}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className="block h-auto w-full"
      />
    </picture>
  );
}

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loadRest, setLoadRest] = useState(false);
  const pausedRef = useRef(false);
  const touchStartX = useRef(null);

  const count = slides.length;

  /* ---------- fetch banners ---------- */
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const json = await res.json();
        const list = json?.status ? buildSlides(json.data) : [];
        setSlides(list.length > 0 ? list : FALLBACK_SLIDES);
      } catch (err) {
        if (err.name === "AbortError") return;
        setSlides(FALLBACK_SLIDES);
      } finally {
        if (!controller.signal.aborted) setStatus("ready");
      }
    })();

    return () => controller.abort();
  }, []);

  const next = useCallback(() => {
    if (count < 2) return;
    setLoadRest(true);
    setActive((p) => (p + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count < 2) return;
    setLoadRest(true);
    setActive((p) => (p - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      setLoadRest(true);
    }, 3500);
    return () => clearTimeout(preloadTimer);
  }, []);

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => {
      if (!pausedRef.current) next();
    }, AUTO_SCROLL_MS);
    return () => clearInterval(id);
  }, [next, count]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current !== null) {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (dx > SWIPE_THRESHOLD) prev();
      else if (dx < -SWIPE_THRESHOLD) next();
    }
    touchStartX.current = null;
  };

  /* ---------- loading placeholder (keeps the page from jumping) ---------- */
  if (status === "loading") {
    return (
      <section
        aria-label="Project banner"
        className="hero-banner relative w-full animate-pulse bg-gray-100"
      >
        <h1 className="sr-only">
          PKR Estates — Luxury and Affordable Residential Apartments in Chennai
        </h1>
        <div className="aspect-[720/1035] w-full md:aspect-[1366/626]" />
      </section>
    );
  }

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Project banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="hero-banner relative isolate grid w-full overflow-hidden"
    >
      <h1 className="sr-only">
        PKR Estates — Luxury and Affordable Residential Apartments in Chennai
      </h1>
      {slides.map((s, i) => {
        if (i > 0 && !loadRest && active === 0) return null;
        const isActive = i === active;
        return (
          <div
            key={`${s.desktop}-${i}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!isActive}
            className={`col-start-1 row-start-1 transition-opacity duration-[900ms] ease-in-out motion-reduce:transition-none ${
              isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <SlideImage slide={s} priority={i === 0} />
          </div>
        );
      })}
    </section>
  );
}