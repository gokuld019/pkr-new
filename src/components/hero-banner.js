"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const SLIDES = [
  {
    desktop: "/banners/33.webp",
    desktopWidth: 1366,
    desktopHeight: 626,
    mobile: "/banners/m-1.webp",
    mobileWidth: 720,
    mobileHeight: 1035,
    alt: "Project amenities banner",
  },
  {
    desktop: "/banners/compr2.webp",
    desktopWidth: 1366,
    desktopHeight: 626,
    mobile: "/banners/2.webp",
    mobileWidth: 694,
    mobileHeight: 1000,
    alt: "Privana project banner",
  },
  {
    desktop: "/banners/compr1.webp",
    desktopWidth: 1366,
    desktopHeight: 626,
    mobile: "/banners/mob1.webp",
    mobileWidth: 720,
    mobileHeight: 1088,
    alt: "Gurudev project banner",
  },
];

const AUTO_SCROLL_MS = 5500;
const SWIPE_THRESHOLD = 50;

function SlideImage({ slide, priority }) {
  return (
    <picture className="block w-full">
      <source
        media="(min-width: 768px)"
        srcSet={slide.desktop}
        width={slide.desktopWidth}
        height={slide.desktopHeight}
      />
      <img
        src={slide.mobile}
        alt={slide.alt}
        width={slide.mobileWidth}
        height={slide.mobileHeight}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className="block h-auto w-full"
      />
    </picture>
  );
}

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loadRest, setLoadRest] = useState(false);
  const pausedRef = useRef(false);
  const touchStartX = useRef(null);

  const next = useCallback(() => {
    setLoadRest(true);
    setActive((p) => (p + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setLoadRest(true);
    setActive((p) => (p - 1 + SLIDES.length) % SLIDES.length);
  }, []);

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
    if (SLIDES.length < 2) return;
    const id = setInterval(() => {
      if (!pausedRef.current) next();
    }, AUTO_SCROLL_MS);
    return () => clearInterval(id);
  }, [next]);

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
      {SLIDES.map((s, i) => {
        if (i > 0 && !loadRest && active === 0) return null;
        const isActive = i === active;
        return (
          <div
            key={s.desktop}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}`}
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