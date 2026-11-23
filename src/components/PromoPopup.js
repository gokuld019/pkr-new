"use client";

import { useEffect, useState } from "react";

/**
 * PromoPopup
 * -----------
 * Auto-opening promo modal — single full-bleed image, no overlaid text/content.
 * The popup image comes from the home details API (popup_image).
 */

const API_URL = "https://api.crazystory.in/api/home/details";

// The API returns a relative path like "home/xxxx.webp".
// Change this if your images are served from a different base (e.g. https://api.crazystory.in/storage/).
const IMAGE_BASE = "https://api.crazystory.in/storage/";

const toUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${IMAGE_BASE}${String(path).replace(/^\/+/, "")}`;
};

export default function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // already shown this session -> don't even call the API
    try {
      if (sessionStorage.getItem("pkrPromoShown")) return;
    } catch {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const showPopup = (src) => {
      if (cancelled) return;
      setImageUrl(src);
      setOpen(true);
      try {
        sessionStorage.setItem("pkrPromoShown", "1");
      } catch {
        /* noop */
      }
    };

    (async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const json = await res.json();
        const src = json?.status ? toUrl(json.data?.popup_image) : "";
        if (!src || cancelled) return; // no popup image set -> show nothing

        // preload + decode first so the popup appears fully rendered
        const img = new window.Image();
        img.decoding = "async";
        img.src = src;

        if (typeof img.decode === "function") {
          img.decode().then(() => showPopup(src)).catch(() => showPopup(src));
        } else {
          img.onload = () => showPopup(src);
          img.onerror = () => showPopup(src);
        }
      } catch {
        /* API failed -> simply don't show the popup */
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || !imageUrl) return null;

  return (
    <div
      className="popup-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-[14px] backdrop-blur-[2px] sm:p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="popup-modal relative max-h-[85vh] w-fit max-w-[92vw] overflow-hidden rounded-[10px] leading-[0] shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:max-h-[88vh] sm:rounded-[12px] md:max-h-[90vh] md:w-[1140px] md:max-w-[min(92vw,1140px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="popup-close absolute right-[10px] top-[10px] z-[2] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-white/92 p-0 text-[#222] transition-all duration-200 hover:scale-105 hover:bg-white sm:right-[13px] sm:top-[12px] sm:h-[34px] sm:w-[34px] md:right-4 md:top-[14px] md:h-9 md:w-9"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Promo offer"
          decoding="sync"
          className="popup-image block h-auto max-h-[85vh] w-auto max-w-[92vw] object-contain sm:max-h-[88vh] md:max-h-[90vh] md:w-full md:max-w-full"
        />
      </div>
    </div>
  );
}