"use client";

import { useState } from "react";
import { Geist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import {
  Mail,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const DEEP_NAVY = "#0F3A6B";
const TEXT_CHARCOAL = "#2D3A46";
const EASE = [0.22, 1, 0.36, 1];

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/pkrestates",
  instagram: "https://www.instagram.com/pkrestates",
  linkedin: "https://www.linkedin.com/company/pkr-estates/",
  youtube: "https://www.youtube.com/@pkrestatesllp",
};

// Banking partner logos — files live in /public (PNG/SVG/WebP, ideally with a transparent background).
// Each logo sits in a 330 × 92 tile. Only the logo is shown; `name` is used for the alt text.
// Order on screen: SBI → Axis → Kotak
// (logos-01.png = Axis, logos-02.png = Kotak, logos-03.png = SBI)
const BANK_PARTNERS = [
  { name: "State Bank of India", src: "/logos-03.png" },
  { name: "Axis Bank", src: "/logos-01.png" },
  { name: "Kotak Mahindra Bank", src: "/logos-02.png" },
];

const HELP_LINKS = [
  { label: "Terms & Conditions", href: "/termsandconditions" },
  { label: "Privacy Policy", href: "/privacypolicy" },
];

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/aboutus" },
  { label: "Ongoing Projects", href: "#" },
  { label: "Gurudev", href: "/projects/gurudev", isSub: true },
  { label: "Privana", href: "/projects/privana", isSub: true },
  { label: "EMI Calculator", href: "/emicalculator" },
  { label: "Contact Us", href: "/contactus" },
];

const SOCIALS = [
  { name: "facebook", label: "Facebook" },
  { name: "instagram", label: "Instagram" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "youtube", label: "YouTube" },
];

const SOCIAL_ICONS = {
  facebook: (
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
  ),
  instagram: (
    <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.26.66-.6 1.22-1.15 1.77-.55.55-1.11.9-1.77 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.66-.26-1.22-.6-1.77-1.15-.55-.55-.9-1.11-1.15-1.77-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77.55-.55 1.11-.9 1.77-1.15.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.86.04-1.33.18-1.64.3-.41.16-.71.35-1.02.66-.31.31-.5.61-.66 1.02-.12.31-.26.78-.3 1.64-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.86.18 1.33.3 1.64.16.41.35.71.66 1.02.31.31.61.5 1.02.66.31.12.78.26 1.64.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.86-.04 1.33-.18 1.64-.3.41-.16.71-.35 1.02-.66.31-.31.5-.61.66-1.02.12-.31.26-.78.3-1.64.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.86-.18-1.33-.3-1.64a2.7 2.7 0 0 0-.66-1.02 2.7 2.7 0 0 0-1.02-.66c-.31-.12-.78-.26-1.64-.3-1.05-.05-1.37-.06-4.04-.06Zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28Zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68Zm5.34-1.98a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.33V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45Z" />
  ),
  youtube: (
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.6 15.6V8.4l6.27 3.6-6.27 3.6Z" />
  ),
};

/* ------------------------------------------------------------------
   MOTION
   framer-motion's `whileInView` uses IntersectionObserver, so it tracks
   the footer's real position even when the page above changes height
   (the cause of the old "footer invisible until refresh" bug).
   `once: true` → plays a single time, then stays visible.
------------------------------------------------------------------ */
const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

const rise = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

const IN_VIEW = { once: true, amount: 0.1 };

// Shared link look: colour shift + an underline that draws in from the left
const LINK_CLASS =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 text-[#2D3A46] transition-[background-size,color] duration-300 ease-out hover:bg-[length:100%_1px] hover:text-[#0F3A6B]";

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (key) => setOpenSection((cur) => (cur === key ? null : key));

  return (
    // reducedMotion="user": people who turn on "reduce motion" get the content without movement
    <MotionConfig reducedMotion="user">
      <footer className={`${geist.className} relative w-full overflow-hidden bg-white`}>
        {/* soft brand glow + hairline at the top */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0F3A6B]/25 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[380px] w-[min(760px,100vw)] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(15,58,107,0.07), rgba(15,58,107,0))" }}
        />

        <div className="relative mx-auto max-w-[1800px] px-4 pt-10 sm:px-6 sm:pt-14 md:px-8 lg:px-10 lg:pt-16">
          {/* ───────── Banking partners ───────── */}
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            className="flex flex-col items-center gap-6 border-b border-neutral-200/80 pb-10 text-center sm:gap-9 sm:pb-14"
          >
            <motion.div variants={rise}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0F3A6B]/10 bg-[#F5F8FC] px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-[#0F3A6B] sm:text-[11px] sm:tracking-[0.25em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0F3A6B]" />
                OUR BANKING PARTNERS
              </span>
              <h3
                className="mt-3 text-lg font-semibold leading-snug tracking-tight sm:mt-4 sm:text-2xl lg:text-[32px] lg:leading-tight"
                style={{ color: DEEP_NAVY }}
              >
                Trusted banks,{" "}
                <br className="hidden sm:block" />
                <span className="text-[#2D3A46]/70">easier home loan approvals.</span>
              </h3>
            </motion.div>

            <motion.ul
              variants={stagger(0.1)}
              className="grid w-full max-w-[400px] grid-cols-3 justify-items-center gap-2 sm:max-w-[560px] sm:gap-3 md:max-w-[1030px] md:gap-5"
            >
              {BANK_PARTNERS.map((bank) => (
                <motion.li
                  key={bank.name}
                  variants={rise}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="relative aspect-[3/2] w-full max-w-[330px] rounded-xl bg-[#F5F8FC] sm:aspect-[330/100] sm:rounded-2xl md:aspect-[330/92] ring-1 ring-[#E3EAF3] transition-[background-color,box-shadow] duration-300 hover:bg-white hover:shadow-[0_18px_36px_-18px_rgba(15,58,107,0.35)] hover:ring-[#D5E1ED]"
                >
                  <Image
                    src={bank.src}
                    alt={bank.name}
                    fill
                    sizes="(min-width: 1110px) 330px, (min-width: 768px) 30vw, 140px"
                    className="object-contain p-3 sm:p-4 md:p-6"
                  />
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ───────── MOBILE FOOTER (compact, collapsible) ───────── */}
          <motion.div
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            className="py-7 sm:hidden"
          >
            <motion.div variants={rise} className="flex items-center justify-between gap-3">
              <Image
                src="/pkr-logo.png"
                alt="PKR Estates"
                width={180}
                height={70}
                style={{ width: "auto" }}
                className="h-9 min-w-0 shrink object-contain object-left"
              />
              <SocialRow />
            </motion.div>

            <motion.p
              variants={rise}
              className="mt-3 text-[12.5px] leading-relaxed"
              style={{ color: TEXT_CHARCOAL, opacity: 0.8 }}
            >
              Creating thoughtfully designed homes and communities that enrich lives,
              today and for generations to come.
            </motion.p>

            <motion.div variants={rise} className="mt-4 grid grid-cols-2 gap-2.5">
              <a
                href="tel:+919381055555"
                className="flex items-center justify-center gap-2 rounded-full border border-[#0F3A6B]/20 py-2.5 text-[13px] font-semibold text-[#0F3A6B] transition active:scale-[0.97]"
              >
                <Phone className="h-4 w-4" />
                Call us
              </a>
              <a
                href="mailto:pkr@pkrestates.com"
                className="flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-semibold text-white shadow-[0_10px_22px_-12px_rgba(15,58,107,0.8)] transition active:scale-[0.97]"
                style={{ background: `linear-gradient(135deg, ${DEEP_NAVY} 0%, #0A2B50 100%)` }}
              >
                <Mail className="h-4 w-4" />
                Email us
              </a>
            </motion.div>

            <motion.div variants={rise} className="mt-6 border-t border-neutral-200/80">
              <FooterAccordion title="EXPLORE" open={openSection === "explore"} onToggle={() => toggleSection("explore")}>
                <ul className="flex flex-col gap-2.5">
                  {EXPLORE_LINKS.map((link) => (
                    <li key={link.label}>
                      <ExploreLink link={link} />
                    </li>
                  ))}
                </ul>
              </FooterAccordion>

              <FooterAccordion title="HELP & SUPPORT" open={openSection === "help"} onToggle={() => toggleSection("help")}>
                <ul className="flex flex-col gap-2.5">
                  {HELP_LINKS.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className={`text-[13px] ${LINK_CLASS}`}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterAccordion>

              <FooterAccordion title="VISIT US" open={openSection === "visit"} onToggle={() => toggleSection("visit")}>
                <div className="flex flex-col gap-3.5">
                  <ContactRow icon={MapPin}>
                    Flat A10, Archana Castle, 4/23 Patrick Church Road, St. Thomas Mount,
                    Chennai – 600 016, Tamil Nadu, India
                  </ContactRow>
                  <ContactRow icon={Clock}>
                    Mon – Sun: 9:30 AM – 6:00 PM
                    <br />
                    Tuesday: Holiday
                  </ContactRow>
                </div>
              </FooterAccordion>
            </motion.div>

            <motion.div variants={rise}>
              <Link
                href="/contactus"
                className="group mt-6 flex items-center justify-between rounded-2xl px-5 py-4 text-[13px] font-semibold text-white shadow-[0_18px_36px_-18px_rgba(15,58,107,0.8)] transition active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${DEEP_NAVY} 0%, #0A2B50 100%)` }}
              >
                <span>Have a question? Get in Touch</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* ───────── TABLET / DESKTOP FOOTER GRID ─────────
              sm  (640+)   : 2 columns
              md  (768+)   : 3 columns
              lg  (1024+)  : 4 columns (brand on its own row)
              xl  (1280+)  : original 5-column desktop layout            */}
          <motion.div
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            className="hidden gap-x-8 gap-y-9 py-10 sm:grid sm:grid-cols-2 sm:py-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-10 xl:grid-cols-5"
          >
            {/* Brand */}
            <motion.div
              variants={rise}
              className="flex flex-col items-start sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-1"
            >
              <Image
                src="/pkr-logo.png"
                alt="PKR Estates"
                width={180}
                height={70}
                style={{ width: "auto" }}
                className="h-9 object-contain object-left sm:h-11"
              />
              <p
                className="mt-5 max-w-xs text-sm leading-relaxed sm:max-w-md xl:max-w-xs"
                style={{ color: TEXT_CHARCOAL, opacity: 0.8 }}
              >
                Creating thoughtfully designed homes and communities that enrich lives,
                today and for generations to come.
              </p>
              <div className="mt-5">
                <SocialRow />
              </div>
            </motion.div>

            {/* Explore */}
            <motion.div variants={rise} className="min-w-0">
              <ColumnTitle>EXPLORE</ColumnTitle>
              <ul className="mt-5 flex flex-col gap-3">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.label}>
                    <ExploreLink link={link} desktop />
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Help & Support */}
            <motion.div variants={rise} className="min-w-0">
              <ColumnTitle>HELP &amp; SUPPORT</ColumnTitle>
              <ul className="mt-5 flex flex-col gap-3">
                {HELP_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={`text-sm ${LINK_CLASS}`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Get in touch */}
            <motion.div variants={rise} className="min-w-0">
              <ColumnTitle>GET IN TOUCH</ColumnTitle>
              <div className="mt-5 flex flex-col gap-4">
                <ContactRow icon={MapPin}>
                  Flat A10, Archana Castle,
                  <br />
                  4/23 Patrick Church Road,
                  <br />
                  St. Thomas Mount, Chennai – 600 016,
                  <br />
                  Tamil Nadu, India
                </ContactRow>
                <ContactRow icon={Phone} center>
                  <a href="tel:+919381055555" className={`whitespace-nowrap ${LINK_CLASS}`}>
                    +91 93810 55555
                  </a>
                </ContactRow>
                <ContactRow icon={Mail} center>
                  <a href="mailto:pkr@pkrestates.com" className={`break-all ${LINK_CLASS}`}>
                    pkr@pkrestates.com
                  </a>
                </ContactRow>
                <ContactRow icon={Clock}>
                  Mon – Sun: 9:30 AM – 6:00 PM
                  <br />
                  Tuesday: Holiday
                </ContactRow>
              </div>
            </motion.div>

            {/* CTA card */}
            <motion.div variants={rise} className="min-w-0 md:col-span-3 lg:col-span-1">
              <div className="relative overflow-hidden rounded-3xl bg-[#F5F8FC] p-6 ring-1 ring-[#E3EAF3]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full"
                  style={{ background: "radial-gradient(closest-side, rgba(15,58,107,0.12), rgba(15,58,107,0))" }}
                />
                <p className="relative text-base font-semibold leading-snug" style={{ color: DEEP_NAVY }}>
                  Have a question or want to know more?
                </p>
                <p className="relative mt-1.5 text-sm leading-relaxed" style={{ color: TEXT_CHARCOAL, opacity: 0.75 }}>
                  We&apos;re here to help.
                </p>

                <Link
                  href="/contactus"
                  className="group relative mt-5 inline-flex items-center gap-2 rounded-full py-2.5 pl-5 pr-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(15,58,107,0.8)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${DEEP_NAVY} 0%, #0A2B50 100%)` }}
                >
                  Get in Touch
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ───────── Bottom bar ───────── */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="border-t border-neutral-200/80 bg-white pb-[env(safe-area-inset-bottom)]"
        >
          <div className="mx-auto flex max-w-[1800px] flex-col items-center justify-between gap-2 px-4 py-4 text-center text-[11px] sm:px-6 sm:py-5 sm:text-sm md:flex-row md:gap-3 md:text-left lg:px-10">
            <span style={{ color: TEXT_CHARCOAL, opacity: 0.75 }}>
              © 2026 PKR ESTATES. All rights reserved.
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:gap-x-4">
              <Link href="/termsandconditions" className={LINK_CLASS}>
                Terms &amp; Conditions
              </Link>
              <span className="text-neutral-300">|</span>
              <Link href="/privacypolicy" className={LINK_CLASS}>
                Privacy Policy
              </Link>
              <span className="text-neutral-300">|</span>
              <a href="https://rera.tn.gov.in/" target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                RERA
              </a>
            </div>
          </div>
        </motion.div>
      </footer>
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function ColumnTitle({ children }) {
  return (
    <h4 className="text-xs font-bold tracking-[0.2em]" style={{ color: DEEP_NAVY }}>
      {children}
    </h4>
  );
}

function ExploreLink({ link, desktop = false }) {
  return (
    <Link
      href={link.href}
      className={`group flex items-center ${desktop ? "text-sm" : "text-[13px]"}`}
      style={{ opacity: link.isSub ? 0.8 : 1 }}
    >
      {link.isSub && (
        <ChevronRight
          className="mr-1 h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          strokeWidth={2.5}
          style={{ color: DEEP_NAVY, opacity: 0.7 }}
        />
      )}
      <span className={LINK_CLASS}>{link.label}</span>
    </Link>
  );
}

function ContactRow({ icon: Icon, center = false, children }) {
  return (
    <div className={`flex gap-3 ${center ? "items-center" : "items-start"}`}>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0F6FC] ${center ? "" : "-mt-0.5"}`}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: DEEP_NAVY }} />
      </span>
      <span className="min-w-0 text-[13px] leading-relaxed sm:text-sm" style={{ color: TEXT_CHARCOAL }}>
        {children}
      </span>
    </div>
  );
}

function FooterAccordion({ title, open, onToggle, children }) {
  return (
    <div className="border-b border-neutral-200/80">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3.5 text-left"
      >
        <span className="text-[11px] font-bold tracking-[0.18em]" style={{ color: DEEP_NAVY }}>
          {title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }}>
          <ChevronDown className="h-4 w-4" style={{ color: DEEP_NAVY }} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="overflow-hidden"
      >
        <div className="pb-4">{children}</div>
      </motion.div>
    </div>
  );
}

function SocialRow() {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
      {SOCIALS.map((s) => (
        <SocialIcon key={s.name} name={s.name} label={s.label} href={SOCIAL_LINKS[s.name]} />
      ))}
    </div>
  );
}

function SocialIcon({ name, label, href }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0F3A6B]/20 text-[#0F3A6B] transition-colors duration-300 hover:border-[#0F3A6B] hover:bg-[#0F3A6B] hover:text-white hover:shadow-[0_10px_20px_-10px_rgba(15,58,107,0.8)]"
    >
      <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] sm:h-4 sm:w-4" fill="currentColor">
        {SOCIAL_ICONS[name]}
      </svg>
    </motion.a>
  );
}