"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {
  Home,
  BedDouble,
  Ruler,
  Building2,
  ArrowRight,
  Phone,
  BadgeCheck,
} from "lucide-react";

const DEEP_NAVY = "#0F3A6B";
const DEEP_NAVY_HOVER = "#0A2B50";
const TEXT_CHARCOAL = "#2D3A46";
const TEXT_MUTED = "#475569";
const LIGHT_BLUE = "#E8F0F9";
const LIGHT_BLUE_RING = "rgba(15,58,107,0.10)";

/* ------------------------------------------------------------------ */
/* API config                                                          */
/* ------------------------------------------------------------------ */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.crazystory.in";
const PROJECTS_URL = `${API_BASE}/api/projects/list`;
// GET /api/projects/countdown/{id}
//   not set -> { status: false, message: "Countdown not set for this project" }
//   set     -> { status: true, data: { id, project_id, completion_date, is_active } }
const COUNTDOWN_URL = (id) => `${API_BASE}/api/projects/countdown/${id}`;
// Laravel public disk – API returns relative paths like "projects/hero/xxx.webp"
const IMAGE_BASE =
  process.env.NEXT_PUBLIC_IMAGE_BASE || `${API_BASE}/storage`;

// Set to true to list only projects whose status === "active"
const ONLY_ACTIVE = false;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const imgUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${IMAGE_BASE}/${String(path).replace(/^\/+/, "")}`;
};

const formatPrice = (n) => {
  if (!n || Number.isNaN(n)) return null;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2).replace(/\.?0+$/, "")} Cr`;
  return `₹${(n / 100000).toFixed(2).replace(/\.?0+$/, "")} Lakhs`;
};

// Lowest offer price across all units -> "₹25.78 Lakhs Onwards*"
const getStartingPrice = (project) => {
  // pricing_header.offer_price_status === "no" -> offer prices are hidden, use the original price
  const useOffer = String(project.pricing_header?.offer_price_status || "yes").toLowerCase() !== "no";
  const prices = (project.pricings || [])
    .map((p) => Number((useOffer && p.offer_price) || p.original_price))
    .filter((n) => n > 0);
  if (prices.length) return `${formatPrice(Math.min(...prices))} Onwards*`;

  const perSqft = Number(project.detail?.prop_price);
  if (perSqft > 0) return `₹${perSqft.toLocaleString("en-IN")} / sq.ft*`;
  return "Price on request";
};

// "studio, 1, 2" -> "Studio, 1BHK, 2BHK"
const formatBedrooms = (propType) => {
  if (!propType) return "—";
  // already written like "1BHK & 2BHK" / "Studio, 1, 2 & 3 BHK" -> show as typed
  if (/bhk|&/i.test(String(propType))) return String(propType).trim();
  return String(propType)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (/^\d+$/.test(s) ? `${s}BHK` : s.charAt(0).toUpperCase() + s.slice(1)))
    .join(", ");
};

// API has no plain address field – best effort from the Google Maps embed
const getAddress = (project) => {
  const iframe = project.connectivity?.map_link;
  if (iframe) {
    const m = iframe.match(/!2s([^!"]+)!5e/);
    if (m) {
      try {
        return decodeURIComponent(m[1].replace(/\+/g, " "));
      } catch {
        /* fall through */
      }
    }
  }
  return "";
};

// "2026-12-31 23:59:59" -> Date (Safari-safe; no timezone in API => local time)
const parseDate = (s) => {
  if (!s) return null;
  const d = new Date(String(s).trim().replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
};

const isTruthy = (v) => v === true || v === 1 || v === "1" || v === "true";

// Pull a countdown object out of any of the response shapes and return a Date (or null)
const dateFromCountdown = (raw) => {
  if (!raw || typeof raw !== "object") return null;
  const first = Array.isArray(raw) ? raw[0] : raw;
  const cd = first?.countdown || first?.project_countdown || first;
  if (!cd || typeof cd !== "object" || !("completion_date" in cd)) return null;
  // only show when the countdown is switched ON
  if (!isTruthy(cd.is_active)) return null;
  return parseDate(cd.completion_date);
};

// GET /api/projects/countdown/{id}  ->  Date | null
// "Countdown not set" (status:false / 404) simply means: show the RERA box instead.
async function fetchCountdown(id, signal) {
  try {
    const res = await fetch(COUNTDOWN_URL(id), {
      signal,
      headers: { Accept: "application/json" },
    });
    let json = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    if (!res.ok || !json || !isTruthy(json.status) && json.status !== "success") {
      return null;
    }
    return dateFromCountdown(json.data ?? json);
  } catch {
    return null;
  }
}

// "68 Cents" stays as typed; a bare "1.41" gets the unit (default Acres)
const formatSize = (d) => {
  const v = String(d.prop_size ?? "").trim();
  if (!v) return "—";
  return /[a-z]/i.test(v) ? v : `${v} ${d.prop_size_unit || "Acres"}`;
};

// "90 Apartments" stays as typed; a bare "186" becomes "186 Units"
const formatUnits = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "—";
  return /[a-z]/i.test(s) ? s : `${s} Units`;
};

// Normalise one API project into what the card renders
// `countdownDate` comes from the countdown API (falls back to an embedded `countdown`, if any)
const mapProject = (p, countdownDate) => {
  const d = p.detail || {};
  return {
    id: p.id,
    href: `/projects/${p.id}`,
    category: "APARTMENTS",
    // short project name (admin "Nav name"), e.g. "Gurudev"; falls back to the project name
    name: p.nav_name || p.name,
    address: getAddress(p),
    price: getStartingPrice(p),
    type: "Apartments",
    // optional prop_size_unit (e.g. "Cents"); defaults to Acres
    size: formatSize(d),
    bedrooms: formatBedrooms(d.prop_type),
    units: formatUnits(d.prop_units),
    rera: d.rera_number || "",
    phone: d.call_button_number || "",
    // Date object (or null). Countdown shows only when set + active.
    completionDate: countdownDate ?? dateFromCountdown(p.countdown),
    image:
      imgUrl(p.thumbnail_image) ||
      imgUrl(d.hero_image) ||
      imgUrl(p.desktop_banner) ||
      imgUrl(p.mobile_banner),
  };
};

// target: Date | null
function useCountdown(target) {
  const [t, setT] = useState({ days: "--", hrs: "--", min: "--", sec: "--" });

  useEffect(() => {
    if (!target) return;
    const end = target.getTime();
    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) {
        setT({ days: 0, hrs: 0, min: 0, sec: 0 });
        return;
      }
      setT({
        days: Math.floor(diff / 86400000),
        hrs: Math.floor((diff / 3600000) % 24),
        min: Math.floor((diff / 60000) % 60),
        sec: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return t;
}

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(PROJECTS_URL, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = await res.json();
        if (!json?.status || !Array.isArray(json.data)) {
          throw new Error(json?.message || "Unexpected response");
        }

        const raw = json.data
          // skip empty placeholder projects that have no details filled in
          .filter((p) => p.detail)
          .filter((p) => (ONLY_ACTIVE ? p.status === "active" : true));

        // fetch every project's countdown in parallel (one failure never blocks the list)
        const dates = await Promise.all(
          raw.map((p) => fetchCountdown(p.id, controller.signal))
        );
        if (controller.signal.aborted) return;

        setProjects(raw.map((p, i) => mapProject(p, dates[i])));
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Something went wrong");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return { projects, loading, error };
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function OurProjects() {
  const root = useRef(null);
  const { projects, loading, error } = useProjects();

  // Heading animation (runs once)
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let obs;
    const ctx = gsap.context(() => {
      const head = section.querySelector(".gs-head");
      if (head && typeof IntersectionObserver !== "undefined") {
        obs = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            obs.disconnect();
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.fromTo(
              ".gs-eyebrow-text",
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.35, clearProps: "transform,opacity" }
            )
              .fromTo(
                ".gs-title-word",
                { yPercent: 110, opacity: 0 },
                {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.55,
                  stagger: 0.06,
                  ease: "power4.out",
                  clearProps: "transform,opacity",
                },
                "-=0.2"
              )
              .fromTo(
                ".gs-sub",
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", clearProps: "transform,opacity" },
                "-=0.3"
              );
          },
          { threshold: 0.15 }
        );
        obs.observe(head);
      }
    }, root);

    return () => {
      obs?.disconnect();
      ctx.revert();
    };
  }, []);

  // Card animations (run when API data arrives)
  useEffect(() => {
    const section = root.current;
    if (!section || !projects.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observers = [];
    const ctx = gsap.context(() => {
      section.querySelectorAll(".gs-card").forEach((card) => {
        if (typeof IntersectionObserver === "undefined") return;
        const obs = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            obs.disconnect();
            const ctl = gsap.timeline({ defaults: { ease: "power3.out" } });
            ctl
              .fromTo(
                card,
                { y: 35, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", clearProps: "transform,opacity" }
              )
              .fromTo(
                card.querySelector(".gs-img"),
                { scale: 1.08, opacity: 0.85 },
                { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out", clearProps: "transform,opacity" },
                "-=0.4"
              )
              .fromTo(
                card.querySelectorAll(".gs-line"),
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: "power3.out", clearProps: "transform,opacity" },
                "-=0.3"
              )
              .fromTo(
                card.querySelectorAll(".gs-spec"),
                { y: 12, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: "power2.out", clearProps: "transform,opacity" },
                "-=0.25"
              );

            // countdown / RERA box only exists on some cards
            const box = card.querySelector(".gs-countdown-box");
            if (box) {
              ctl.fromTo(
                box,
                { y: 12, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "transform,opacity" },
                "-=0.2"
              );
            }

            ctl.fromTo(
              card.querySelector(".gs-actions"),
              { y: 14, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", clearProps: "transform,opacity" },
              "-=0.2"
            );
          },
          { threshold: 0.12 }
        );
        obs.observe(card);
        observers.push(obs);
      });
    }, root);

    return () => {
      observers.forEach((o) => o.disconnect());
      ctx.revert();
    };
  }, [projects]);

  const gridCols = useMemo(
    () => (projects.length === 1 ? "lg:grid-cols-1 lg:max-w-3xl lg:mx-auto" : "lg:grid-cols-2"),
    [projects.length]
  );

  return (
    <section
      ref={root}
      id="projects"
      className="relative w-full py-9 sm:py-16 md:py-20"
    >
      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-10">
        <div className="gs-head mb-7 text-center sm:mb-14">
          <div className="flex items-center justify-center gap-3">
            <span
              className="gs-eyebrow-text text-[10.5px] font-semibold tracking-[0.2em] sm:text-xs sm:tracking-[0.28em]"
              style={{ color: DEEP_NAVY }}
            >
              EXPLORE
            </span>
          </div>

          <h2
            className="mt-2.5 text-[27px] font-bold tracking-tight sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ color: DEEP_NAVY }}
          >
            {["Our", "Projects"].map((word) => (
              <span
                key={word}
                className="inline-block overflow-hidden align-bottom"
                style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
              >
                <span className="gs-title-word inline-block pr-[0.22em] will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p
            className="gs-sub mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed sm:mt-5 sm:text-lg"
            style={{ color: TEXT_CHARCOAL }}
          >
            Creating more than addresses, we shape welcoming spaces where families can begin their next chapter together.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:gap-7 lg:grid-cols-2">
            {[0, 1].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-sm" style={{ color: TEXT_MUTED }}>
            Unable to load projects right now. Please try again later.
          </p>
        ) : projects.length === 0 ? (
          <p className="text-center text-sm" style={{ color: TEXT_MUTED }}>
            New projects are coming soon.
          </p>
        ) : (
          <div className={`grid grid-cols-1 gap-5 sm:gap-7 ${gridCols}`}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_-14px_rgba(15,58,107,0.25)]">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="aspect-square w-full" style={{ backgroundColor: LIGHT_BLUE }} />
        <div className="space-y-3 px-4 py-6 sm:px-6 md:px-8">
          <div className="h-3 w-24 rounded" style={{ backgroundColor: LIGHT_BLUE }} />
          <div className="h-6 w-40 rounded" style={{ backgroundColor: LIGHT_BLUE }} />
          <div className="h-4 w-full rounded" style={{ backgroundColor: LIGHT_BLUE }} />
          <div className="h-4 w-2/3 rounded" style={{ backgroundColor: LIGHT_BLUE }} />
          <div className="h-8 w-48 rounded" style={{ backgroundColor: LIGHT_BLUE }} />
        </div>
      </div>
      <div className="px-4 py-6 sm:px-6 md:px-8">
        <div className="h-16 rounded-xl" style={{ backgroundColor: LIGHT_BLUE }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
function ProjectCard({ project }) {
  const { days, hrs, min, sec } = useCountdown(project.completionDate);
  const href = project.href;

  return (
    <div className="gs-card group/card overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_-14px_rgba(15,58,107,0.25)] transition-shadow duration-300 hover:shadow-[0_18px_50px_-16px_rgba(15,58,107,0.35)]">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Image */}
        <Link
          href={href}
          aria-label={`View ${project.name} project details`}
          className="relative block w-full overflow-hidden bg-gray-50"
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.name}
              width={420}
              height={420}
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 310px"
              className="gs-img h-auto w-full object-contain transition-transform duration-500 group-hover/card:scale-[1.04]"
            />
          ) : (
            <div
              className="gs-img flex aspect-square w-full items-center justify-center text-sm font-semibold"
              style={{ backgroundColor: LIGHT_BLUE, color: DEEP_NAVY }}
            >
              {project.name}
            </div>
          )}
        </Link>

        {/* Details */}
        <div className="flex flex-col justify-center px-4 py-5 sm:px-6 sm:py-7 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span
                className="gs-line text-[10px] font-semibold tracking-[0.18em] sm:text-[11px] sm:tracking-[0.22em]"
                style={{ color: DEEP_NAVY }}
              >
                {project.category}
              </span>

              <h3
                className="gs-line mt-0.5 text-lg font-semibold capitalize tracking-tight sm:mt-1 sm:text-2xl"
                style={{ color: DEEP_NAVY }}
              >
                <Link
                  href={href}
                  className="transition-colors duration-300"
                  style={{ color: DEEP_NAVY }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = DEEP_NAVY_HOVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = DEEP_NAVY)}
                >
                  {project.name}
                </Link>
              </h3>
            </div>

            {project.phone && (
              <a
                href={`tel:+91${String(project.phone).replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "")}`}
                aria-label={`Call about ${project.name}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 sm:h-10 sm:w-10"
                style={{ backgroundColor: LIGHT_BLUE, color: DEEP_NAVY }}
              >
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
            )}
          </div>

          {project.address && (
            <p
              className="gs-line mt-2.5 text-[12.5px] leading-relaxed sm:mt-4 sm:text-[14px]"
              style={{ color: TEXT_CHARCOAL }}
            >
              {project.address}
            </p>
          )}

          <div
            className="gs-line mt-4 text-[11px] font-medium tracking-wide sm:mt-6 sm:text-xs"
            style={{ color: TEXT_CHARCOAL }}
          >
            Starting from
          </div>
          <div
            className="gs-line mt-0.5 text-lg font-bold tracking-tight sm:mt-1 sm:text-2xl md:text-3xl"
            style={{ color: DEEP_NAVY }}
          >
            {project.price}
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8">
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-6 sm:gap-y-5 md:grid-cols-4">
          {[
            { icon: Building2, label: "TYPE", value: project.type },
            { icon: Ruler, label: "SIZE", value: project.size },
            { icon: BedDouble, label: "BEDROOMS", value: project.bedrooms },
            { icon: Home, label: "UNITS", value: project.units },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="gs-spec flex items-start gap-2 sm:gap-2.5">
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                strokeWidth={1.5}
                style={{ color: DEEP_NAVY }}
              />
              <div className="min-w-0">
                <div
                  className="text-[9.5px] font-semibold tracking-[0.14em] sm:text-[10px]"
                  style={{ color: TEXT_MUTED }}
                >
                  {label}
                </div>
                <div
                  className="mt-0.5 text-[12px] font-bold leading-snug sm:text-sm"
                  style={{ color: DEEP_NAVY }}
                >
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Countdown (only when the countdown API is set + active for this project) */}
        {project.completionDate ? (
          <div className="mt-4 pt-3 sm:mt-7 sm:pt-6">
            <div className="flex flex-col gap-1 xs:flex-row xs:items-center xs:justify-between sm:flex-row sm:items-center sm:justify-between sm:gap-1.5">
              <span
                className="text-[9.5px] font-semibold tracking-[0.14em] sm:text-[10px] sm:tracking-[0.16em]"
                style={{ color: TEXT_MUTED }}
              >
                TIME LEFT FOR PROJECT COMPLETION
              </span>
              <span
                className="text-[10.5px] font-bold uppercase tracking-[0.12em] sm:text-[11px]"
                style={{ color: DEEP_NAVY }}
              >
                {project.completionDate
                  .toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  .toUpperCase()}
              </span>
            </div>

            <div
              className="gs-countdown-box mt-3 grid grid-cols-4 overflow-hidden rounded-xl sm:mt-4"
              style={{
                backgroundColor: LIGHT_BLUE,
                boxShadow: `inset 0 0 0 1px ${LIGHT_BLUE_RING}`,
              }}
            >
              {[
                { v: days, l: "DAYS" },
                { v: hrs, l: "HRS" },
                { v: min, l: "MIN" },
                { v: sec, l: "SEC" },
              ].map(({ v, l }) => (
                <div
                  key={l}
                  className="gs-count flex flex-col items-center py-2.5 sm:py-4"
                >
                  <span
                    className="text-base font-bold tabular-nums sm:text-xl md:text-2xl"
                    style={{ color: DEEP_NAVY }}
                  >
                    {v}
                  </span>
                  <span
                    className="mt-0.5 text-[8.5px] font-semibold tracking-[0.1em] sm:mt-1 sm:text-[10px] sm:tracking-[0.14em]"
                    style={{ color: TEXT_MUTED }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : project.rera ? (
          <div
            className="gs-countdown-box mt-4 flex items-center gap-2.5 rounded-xl px-4 py-3 sm:mt-7 sm:py-4"
            style={{
              backgroundColor: LIGHT_BLUE,
              boxShadow: `inset 0 0 0 1px ${LIGHT_BLUE_RING}`,
            }}
          >
            <BadgeCheck className="h-5 w-5 shrink-0" strokeWidth={1.5} style={{ color: DEEP_NAVY }} />
            <div className="min-w-0">
              <div
                className="text-[9.5px] font-semibold tracking-[0.14em] sm:text-[10px]"
                style={{ color: TEXT_MUTED }}
              >
                RERA REGISTERED
              </div>
              <div
                className="mt-0.5 break-all text-[12px] font-bold sm:text-sm"
                style={{ color: DEEP_NAVY }}
              >
                {project.rera}
              </div>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="gs-actions mt-4 flex justify-end sm:mt-7">
          <Link
            href={href}
            className="group inline-flex items-center gap-2 rounded-md px-4 py-2 text-[10.5px] font-bold tracking-[0.14em] text-white shadow-[0_6px_18px_-8px_rgba(15,58,107,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(15,58,107,0.85)] active:scale-[0.98] sm:gap-2.5 sm:px-6 sm:py-3 sm:text-xs sm:tracking-[0.16em]"
            style={{ backgroundColor: DEEP_NAVY }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = DEEP_NAVY_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = DEEP_NAVY)}
          >
            KNOW MORE
            <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}