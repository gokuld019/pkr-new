"use client";

import { useEffect, useState } from "react";

/**
 * PromoPopup
 * -----------
 * Auto-opening promo modal — single full-bleed image, no overlaid text/content.
 * Uses a separate artwork for mobile (< 768px) and desktop/tablet.
 */

const DESKTOP_IMAGE_URL = "/popupp.webp";
const MOBILE_IMAGE_URL = "/mobilepopup.webp";

export default function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("pkrPromoShown")) return;
    } catch {
      return;
    }

    let cancelled = false;
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;
    const targetSrc = isMobile ? MOBILE_IMAGE_URL : DESKTOP_IMAGE_URL;

    const showPopup = () => {
      if (cancelled) return;
      setOpen(true);
      try {
        sessionStorage.setItem("pkrPromoShown", "1");
      } catch {
        /* noop */
      }
    };

    const img = new window.Image();
    img.decoding = "async";
    img.src = targetSrc;

    if (typeof img.decode === "function") {
      img.decode().then(showPopup).catch(showPopup);
    } else {
      img.onload = showPopup;
      img.onerror = showPopup;
    }

    return () => {
      cancelled = true;
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

  if (!open) return null;

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

        <picture className="block">
          <source
            media="(max-width: 767px)"
            srcSet={MOBILE_IMAGE_URL}
            width={720}
            height={1053}
          />
          <img
            src={DESKTOP_IMAGE_URL}
            alt="Promo offer"
            width={1140}
            height={513}
            decoding="sync"
            className="popup-image block h-auto max-h-[85vh] w-auto max-w-[92vw] object-contain sm:max-h-[88vh] md:max-h-[90vh] md:w-full md:max-w-full"
          />
        </picture>
      </div>
    </div>
  );
}