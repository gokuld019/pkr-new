// src/components/social-feed-section.jsx
'use client'

/*  npm i framer-motion lucide-react
    framer-motion animates the header text and the cards (no GSAP needed).

    LAYOUT
    Three channel cards (YouTube · Instagram · Facebook).
    Each card is its own slider: arrows, progress dots, swipe on touch,
    and ← / → keys when the card is focused. The last slide of every card
    is a "see more on …" slide that links to the channel.

    RESPONSIVE
    Desktop (lg ≥ 1024px) : 3-column grid — unchanged design & sizes.
    Tablet  (md 768–1023) : 2 columns, the 3rd card centred on its own row.
    Phone   (< 768px)     : cards stack, centred, max 520px wide.
    Small phones get slightly tighter padding / type, and landscape phones
    get a shorter slide area so the whole card fits on screen.

    DATA
    YouTube   → /api/social-feed (latest videos)
    Facebook  → /api/meta-feed  (latest Page posts, via META_ACCESS_TOKEN
    Instagram    in .env.local — the token stays on the server)
    If the Meta feed returns nothing, the links in PINNED_POSTS below are
    shown as official embeds instead.

    FACEBOOK VIDEOS / REELS
    Facebook videos & reels play inside the card through Facebook's official
    video embed (set FACEBOOK_INLINE_VIDEO = false to go back to the
    thumbnail card that opens Facebook in a new tab).                     */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { Figtree } from 'next/font/google'
import {
  MonitorPlay, Camera, ThumbsUp, Play, ArrowUpRight, Eye, ChevronLeft, ChevronRight,
} from 'lucide-react'

/* ================================================================== */
/*  ✏️  EDIT HERE — paste up to 3 post links for each platform          */
/*                                                                    */
/*  Instagram: open the post → ••• → Copy link                         */
/*             e.g. https://www.instagram.com/p/C8abc123XyZ/           */
/*             (reels work too: https://www.instagram.com/reel/...)    */
/*                                                                    */
/*  Facebook:  click the post's date/time → copy the address bar URL   */
/*             e.g. https://www.facebook.com/PKRestates/posts/pfbid0.. */
/*             (videos work too: .../videos/123456789)                 */
/*                                                                    */
/*  Put the newest post first. Empty slots are skipped automatically.  */
/*  YouTube needs nothing: the latest 3 videos appear by themselves.   */
/*  Facebook & Instagram also fill in automatically from the Meta      */
/*  feed — these links are only used as a fallback.                    */
/* ================================================================== */
const PINNED_POSTS = {
  instagram: ['', '', ''],
  facebook: ['', '', ''],
}

// true  → Facebook videos/reels play inside the card (official embed)
// false → Facebook videos/reels show the thumbnail card and open Facebook
const FACEBOOK_INLINE_VIDEO = true

/* ------------------------------------------------------------------ */

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const FONT = figtree.style.fontFamily
const EASE = [0.22, 1, 0.36, 1]

// ============ THEME TOKENS (same as the rest of the site) ============
const DEEP_NAVY = '#0F3A6B'
const DEEP_NAVY_DARK = '#0A2B50'
const TEXT_CHARCOAL = '#2D3A46'

const FEED_ENDPOINT = '/api/social-feed'
const META_ENDPOINT = '/api/meta-feed'
const POSTS_PER_CHANNEL = 3
const NEW_BADGE_DAYS = 7

// Height of the slide area — identical across the cards so the grid lines up.
// Desktop (lg+) stays at 560px exactly as before.
//  · small phones 460 → phones 500 → large phones 560
//  · tablet 2-column 520 (narrower cards)
//  · landscape phones/tablets with a short screen → 400 so the card fits
const STAGE_HEIGHT =
  'h-[460px] min-[380px]:h-[500px] sm:h-[560px] md:h-[520px] lg:h-[560px] ' +
  'max-lg:[@media(orientation:landscape)_and_(max-height:540px)]:h-[400px]'

const CHANNELS = [
  {
    id: 'youtube',
    label: 'YouTube',
    Icon: MonitorPlay,
    handle: '@pkrestatesllp',
    url: 'https://www.youtube.com/@pkrestatesllp',
    follow: 'Subscribe',
    moreTitle: 'More films on YouTube',
    moreText: 'Walkthroughs, site progress and project films.',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    Icon: Camera,
    handle: '@pkrestates',
    url: 'https://www.instagram.com/pkrestates',
    follow: 'Follow',
    moreTitle: 'More on Instagram',
    moreText: 'Reels, launches and behind-the-scenes moments.',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    Icon: ThumbsUp,
    handle: 'PKR Estates',
    url: 'https://www.facebook.com/PKRestates/',
    follow: 'Follow',
    moreTitle: 'More on Facebook',
    moreText: 'Project news, offers and event updates.',
  },
]
const CHANNEL_BY_ID = Object.fromEntries(CHANNELS.map((c) => [c.id, c]))

/* ------------------------------------------------------------------ */
/*  HEADER MOTION                                                      */
/*  Uses whileInView (IntersectionObserver): no stale scroll positions,*/
/*  so the heading can never get stuck invisible.                      */
/* ------------------------------------------------------------------ */
const headStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const headRise = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
}

const wordStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

// each word slides up out of its own mask
const wordRise = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1, ease: EASE } },
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const COMPACT = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 })

function formatDate(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isRecent(iso) {
  const t = new Date(iso).getTime()
  return Number.isFinite(t) && Date.now() - t < NEW_BADGE_DAYS * 86400000
}

function instagramEmbedUrl(url = '') {
  const match = url.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/i)
  if (!match) return null
  const kind = match[1].toLowerCase() === 'reels' ? 'reel' : match[1].toLowerCase()
  return `https://www.instagram.com/${kind}/${match[2]}/embed/`
}

function facebookEmbedUrl(url, width, height) {
  if (!/facebook\.com|fb\.watch/i.test(url || '')) return null
  const video = /\/videos\/|\/watch\/?\?|\/reel\/|fb\.watch/i.test(url)
  const plugin = video ? 'video' : 'post'
  return `https://www.facebook.com/plugins/${plugin}.php?href=${encodeURIComponent(url)}&show_text=${video ? 'false' : 'true'}&width=${width}&height=${height}`
}

function validLinks(platform, links = []) {
  const check = platform === 'instagram' ? (u) => instagramEmbedUrl(u) : (u) => facebookEmbedUrl(u, 500, 500)
  return links.map((u) => (u || '').trim()).filter((u) => u && check(u)).slice(0, POSTS_PER_CHANNEL)
}

// YouTube's default thumbnail has black bars — try the sharp versions first,
// and zoom the fallback just enough to crop the bars away.
function youtubeThumbs(video) {
  const base = `https://i.ytimg.com/vi/${video.videoId}`
  return video.type === 'short'
    ? [{ src: `${base}/oardefault.jpg`, zoom: 1 }, { src: `${base}/hqdefault.jpg`, zoom: 1.9 }]
    : [{ src: `${base}/maxresdefault.jpg`, zoom: 1 }, { src: `${base}/hqdefault.jpg`, zoom: 1.34 }]
}

/* ------------------------------------------------------------------ */
/*  DATA: latest YouTube videos                                        */
/* ------------------------------------------------------------------ */
function useLatestVideos() {
  const [state, setState] = useState({ status: 'loading', videos: [] })

  useEffect(() => {
    let cancelled = false
    fetch(FEED_ENDPOINT)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', videos: Array.isArray(data.videos) ? data.videos : [] })
      })
      .catch((err) => {
        console.error('YouTube feed failed to load:', err)
        if (!cancelled) setState({ status: 'error', videos: [] })
      })
    return () => { cancelled = true }
  }, [])

  return state
}

/* ------------------------------------------------------------------ */
/*  DATA: latest Facebook + Instagram posts (server route, token-safe) */
/* ------------------------------------------------------------------ */
function useMetaFeed() {
  const [state, setState] = useState({ status: 'loading', facebook: [], instagram: [] })

  useEffect(() => {
    let cancelled = false
    fetch(META_ENDPOINT)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (cancelled) return
        if (data.error) console.warn('Meta feed:', data.error)
        setState({
          status: 'ready',
          facebook: Array.isArray(data.facebook) ? data.facebook : [],
          instagram: Array.isArray(data.instagram) ? data.instagram : [],
        })
      })
      .catch((err) => {
        console.error('Meta feed failed to load:', err)
        if (!cancelled) setState({ status: 'error', facebook: [], instagram: [] })
      })
    return () => { cancelled = true }
  }, [])

  return state
}

/* ------------------------------------------------------------------ */
/*  SLIDE: "see more" end card                                         */
/* ------------------------------------------------------------------ */
function MoreSlide({ channel }) {
  const Icon = channel.Icon
  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/more relative flex h-full w-full flex-col justify-between overflow-hidden p-6 text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white min-[380px]:p-7 sm:p-8"
      style={{ background: `linear-gradient(155deg, ${DEEP_NAVY} 0%, ${DEEP_NAVY_DARK} 100%)` }}
    >
      {/* soft light + fine grid for depth */}
      <span className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.08] blur-2xl transition-transform duration-700 group-hover/more:scale-110" />
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 70%)',
        }}
      />

      <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur min-[380px]:h-14 min-[380px]:w-14">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>

      <div className="relative">
        <p className="m-0 text-[11px] font-semibold uppercase tracking-[2.2px] text-[#B8CFE8]">{channel.handle}</p>
        <p className="m-0 mt-3 text-[23px] font-bold leading-[1.15] tracking-tight min-[380px]:text-[26px] sm:text-[28px]">{channel.moreTitle}</p>
        <p className="m-0 mt-3 max-w-[280px] text-[13.5px] leading-[1.65] text-white/70 min-[380px]:text-[14px]">{channel.moreText}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[1.4px] transition-transform duration-300 group-hover/more:-translate-y-0.5 min-[380px]:mt-7" style={{ color: DEEP_NAVY }}>
          Open {channel.label}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/more:-translate-y-0.5 group-hover/more:translate-x-0.5" strokeWidth={2.5} />
        </span>
      </div>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/*  SLIDE: YouTube video                                               */
/* ------------------------------------------------------------------ */
function YouTubeThumb({ video, className = '', fit = 'cover' }) {
  const candidates = useMemo(() => youtubeThumbs(video), [video])
  const [i, setI] = useState(0)
  const current = candidates[i]
  if (!current) return null
  return (
    <img
      src={current.src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setI((n) => n + 1)}
      className={`${className} ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
      style={{ scale: fit === 'contain' ? 1 : current.zoom }}
    />
  )
}

function VideoSlide({ video, active }) {
  const [playing, setPlaying] = useState(false)
  const isShort = video.type === 'short'

  // stop the video when the user slides away from it
  useEffect(() => {
    if (!active) setPlaying(false)
  }, [active])

  if (playing) {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-[#050B14]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&playsinline=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className={isShort ? 'absolute inset-0 h-full w-full border-0' : 'aspect-video w-full border-0'}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${video.title}`}
      className="group/vid relative block h-full w-full overflow-hidden bg-[#050B14] text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
    >
      {/* blurred backdrop fills the tall frame; the real frame sits sharp on top */}
      <YouTubeThumb video={video} className="absolute inset-0 h-full w-full scale-125 opacity-55 blur-2xl" />
      {isShort ? (
        <YouTubeThumb video={video} className="absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-out group-hover/vid:scale-[1.05]" />
      ) : (
        <span className="absolute inset-x-0 top-[18%] block aspect-video overflow-hidden">
          <YouTubeThumb video={video} className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover/vid:scale-[1.05]" />
        </span>
      )}

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06182E] via-[#06182E]/35 to-transparent" />

      {/* badges */}
      <span className="absolute left-4 top-4 flex items-center gap-1.5">
        {isRecent(video.publishedAt) && (
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.2px]" style={{ color: DEEP_NAVY }}>
            New
          </span>
        )}
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.2px] text-white ring-1 ring-white/25 backdrop-blur-md">
          {isShort ? 'Short' : 'Video'}
        </span>
      </span>

      {/* play */}
      <span className="absolute left-1/2 top-[42%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-md transition-all duration-500 group-hover/vid:scale-110 group-hover/vid:bg-white group-hover/vid:text-[#0F3A6B] min-[380px]:h-16 min-[380px]:w-16">
        <Play className="ml-0.5 h-6 w-6 fill-current" strokeWidth={0} />
      </span>

      {/* caption */}
      <span className="absolute inset-x-0 bottom-0 block p-4 min-[380px]:p-5 sm:p-6">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-white/60">
          <span>{formatDate(video.publishedAt)}</span>
          {video.views ? (
            <>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                {COMPACT.format(video.views)}
              </span>
            </>
          ) : null}
        </span>
        <span className="mt-2 line-clamp-2 block text-[16px] font-bold leading-snug text-white min-[380px]:text-[18px] sm:text-[19px]">{video.title}</span>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[1.4px] text-white/90">
          Watch now
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/vid:-translate-y-0.5 group-hover/vid:translate-x-0.5" strokeWidth={2.5} />
        </span>
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  SLIDE: Instagram / Facebook official embed                         */
/*  Embeds have a minimum width; in narrow columns we scale them down  */
/*  instead of cutting them off.                                       */
/* ------------------------------------------------------------------ */
function EmbedFrame({ buildSrc, minWidth, maxWidth, title }) {
  const ref = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width / 10) * 10
      const h = Math.round(entry.contentRect.height / 10) * 10
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scale = box.w && box.w < minWidth ? box.w / minWidth : 1
  const renderW = Math.min(maxWidth, Math.max(minWidth, box.w))
  const renderH = Math.round(box.h / scale)
  const src = box.w ? buildSrc(renderW, renderH) : null

  return (
    <div ref={ref} className="absolute inset-0 flex justify-center overflow-hidden bg-white">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-[#EDF3F9]" />}
      {src && (
        <iframe
          key={src}
          src={src}
          title={title}
          width={renderW}
          height={renderH}
          scrolling="no"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className="relative shrink-0 border-0"
          style={{
            width: renderW,
            height: renderH,
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
        />
      )}
    </div>
  )
}

function EmbedSlide({ platform, url }) {
  const channel = CHANNEL_BY_ID[platform]
  const buildSrc = useCallback(
    (w, h) => (platform === 'instagram' ? instagramEmbedUrl(url) : facebookEmbedUrl(url, w, h)),
    [platform, url]
  )
  return (
    <div className="relative h-full w-full">
      <EmbedFrame
        buildSrc={buildSrc}
        minWidth={platform === 'instagram' ? 326 : 350}
        maxWidth={platform === 'instagram' ? 540 : 500}
        title={`PKR Estates on ${channel.label}`}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SLIDE: Facebook video / reel from the Meta feed                    */
/*  Shows the PostSlide card first (thumbnail + caption). On tap the   */
/*  official Facebook video player loads inside the card, and it is    */
/*  unloaded again when the user slides away (so it stops playing).    */
/* ------------------------------------------------------------------ */
function FacebookVideoSlide({ post, channel, active }) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!active) setPlaying(false)
  }, [active])

  if (playing) {
    return (
      <div className="relative h-full w-full bg-[#050B14]">
        <EmbedSlide platform="facebook" url={post.url} />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <PostSlide post={post} channel={channel} />
      {/* transparent layer over the media area: tap to play inside the card.
          It stops above the caption panel so "View on Facebook" still works. */}
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label="Play video here"
        className="absolute inset-x-0 top-14 bottom-[46%] z-10 cursor-pointer bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SLIDE: Facebook / Instagram post from the Meta feed                */
/*  Social captions are long (emojis, hashtags, phone numbers, RERA).  */
/*  parseCaption() turns one into a clean card:                        */
/*    title      → the first sentence, emojis removed                  */
/*    summary    → one supporting line                                 */
/*    highlights → up to 3 short selling points (prices, ✅ benefits)  */
/*  Hashtags, phone numbers and RERA lines are left out of the card    */
/*  (the full caption is one tap away on the post itself).             */
/* ------------------------------------------------------------------ */
const KIND_LABEL = { post: 'Post', video: 'Video', reel: 'Reel', album: 'Album' }

const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/gu
const CHECK_START = /^\s*(✅|☑️?|✔️?|✓|•|-|–|—|\*)\s*/u
const NOISE_LINE = /(book your|call us|whatsapp|rera\s*(no|number)?\s*[:#]|^\+?\d[\d\s-]{8,}$|link in bio|^#)/i

function cleanLine(line) {
  return line
    .replace(/#[\p{L}\p{N}_]+/gu, '') // inline hashtags
    .replace(EMOJI, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s:–—-]+|[\s:–—-]+$/g, '')
    .trim()
}

function firstSentence(text, max = 90) {
  const m = text.match(/^(.{12,}?[.!?])(\s|$)/)
  const s = m ? m[1] : text
  return s.length > max ? `${s.slice(0, max).replace(/\s+\S*$/, '')}…` : s
}

function parseCaption(raw = '') {
  const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean)
  const highlights = []
  const rest = []

  lines.forEach((line) => {
    const isCheck = CHECK_START.test(line)
    const text = cleanLine(line.replace(CHECK_START, ''))
    if (!text || NOISE_LINE.test(line) || NOISE_LINE.test(text)) return

    // short benefit lines ("No Pre-EMI") and price lines ("1 BHK from ₹22 Lakhs*")
    const parts = text.split(/\s*\|\s*/).filter(Boolean)
    const pricey = parts.filter((p) => /₹|lakh|cr\b|sq\.?\s?ft|bhk/i.test(p) && p.length <= 34)
    if (isCheck && text.length <= 34) highlights.push(text)
    else if (pricey.length) highlights.push(...pricey)
    else rest.push(text)
  })

  const titleSource = rest.shift() || highlights[0] || ''
  const title = firstSentence(titleSource)
  // anything left from the title's own line becomes the summary, else the next line
  const leftover = titleSource.slice(title.replace(/…$/, '').length).trim()
  const summary = leftover.length > 20 ? leftover : rest[0] || ''

  return {
    title,
    summary,
    highlights: [...new Set(highlights)].filter((h) => h !== title).slice(0, 3),
  }
}

function PostSlide({ post, channel }) {
  const [imgOk, setImgOk] = useState(Boolean(post.image))
  const isVideo = post.kind === 'video' || post.kind === 'reel'
  const Icon = channel.Icon
  const { title, summary, highlights } = useMemo(() => parseCaption(post.text), [post.text])

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      aria-label={`Open ${channel.label} post: ${title || 'PKR Estates'}`}
      className="group/post relative block h-full w-full overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      style={{ background: `linear-gradient(155deg, ${DEEP_NAVY} 0%, ${DEEP_NAVY_DARK} 100%)` }}
    >
      {/* media — fills the whole card */}
      {imgOk && (
        <img
          src={post.image}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          referrerPolicy="no-referrer"
          onError={() => setImgOk(false)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover/post:scale-[1.06]"
        />
      )}

      {/* readable bottom fade + soft top shade for the badges */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04142A] via-[#04142A]/55 via-45% to-transparent" />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />

      {/* top row: badges + platform */}
      <span className="absolute inset-x-4 top-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {isRecent(post.date) && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.2px]" style={{ color: DEEP_NAVY }}>
              New
            </span>
          )}
          <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.2px] text-white ring-1 ring-white/25 backdrop-blur-md">
            {KIND_LABEL[post.kind] || 'Post'}
          </span>
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white ring-1 ring-white/25 backdrop-blur-md">
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </span>

      {/* play */}
      {isVideo && (
        <span className="absolute left-1/2 top-[34%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/50 backdrop-blur-md transition-all duration-500 group-hover/post:scale-110 group-hover/post:bg-white group-hover/post:text-[#0F3A6B] min-[380px]:h-16 min-[380px]:w-16">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/20 motion-reduce:hidden [animation-duration:2.4s]" />
          <Play className="relative ml-0.5 h-6 w-6 fill-current" strokeWidth={0} />
        </span>
      )}

      {/* caption — frosted glass panel */}
      <span className="absolute inset-x-3 bottom-3 block rounded-[18px] bg-white/[0.08] p-3.5 ring-1 ring-white/15 backdrop-blur-xl min-[380px]:p-4 sm:inset-x-4 sm:bottom-4 sm:p-5">
        <span className="flex min-w-0 items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[1.6px] text-white/60">
          <span className="shrink-0">{formatDate(post.date)}</span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-white/35" />
          <span className="truncate">{channel.handle}</span>
        </span>

        {title && (
          <span className="mt-2 line-clamp-2 text-[16px] font-bold leading-[1.3] tracking-[-0.01em] text-white min-[380px]:text-[17px] sm:text-[18px]">
            {title}
          </span>
        )}

        {summary && (
          <span className="mt-1.5 line-clamp-2 text-[12.5px] leading-[1.55] text-white/70 min-[380px]:text-[13px]">
            {summary}
          </span>
        )}

        {highlights.length > 0 && (
          <span className="mt-3 flex max-h-[58px] flex-wrap gap-1.5 overflow-hidden">
            {highlights.map((h) => (
              <span
                key={h}
                className="inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded-full bg-white/[0.12] px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#9CC3EE]" />
                <span className="truncate">{h}</span>
              </span>
            ))}
          </span>
        )}

        <span className="mt-3.5 flex items-center justify-between border-t border-white/15 pt-3 min-[380px]:mt-4">
          <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-white/90">
            View on {channel.label}
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#0F3A6B] transition-transform duration-300 group-hover/post:rotate-45">
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </span>
      </span>
    </a>
  )
}

function SkeletonSlide() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#EDF3F9]" aria-hidden="true">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-[#E4ECF5] to-[#F3F7FB]" />
      <div className="absolute inset-x-6 bottom-6 space-y-3">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-white/80" />
        <div className="h-5 w-full animate-pulse rounded-full bg-white/80" />
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/80" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  CHANNEL CARD — header + slider + controls                          */
/*  `slides` is a list of { key, label, render(active) }               */
/* ------------------------------------------------------------------ */
function ChannelCard({ channel, slides, index, className = '' }) {
  const Icon = channel.Icon
  const [current, setCurrent] = useState(0)
  const count = slides.length
  const touch = useRef(null)

  // keep the index valid if the slide list changes (e.g. videos finish loading)
  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, count - 1)))
  }, [count])

  const go = useCallback((n) => setCurrent(((n % count) + count) % count), [count])
  const prev = () => go(current - 1)
  const next = () => go(current + 1)

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  }
  const onTouchStart = (e) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (count > 1 && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) (dx < 0 ? next : prev)()
  }
  const onTouchCancel = () => { touch.current = null }

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
      className={`group/card relative mx-auto flex w-full min-w-0 max-w-[520px] flex-col rounded-[24px] border border-[#E3EBF4] bg-white/80 p-2 shadow-[0_24px_60px_-40px_rgba(15,58,107,0.55)] backdrop-blur transition-shadow duration-500 hover:shadow-[0_40px_80px_-44px_rgba(15,58,107,0.6)] sm:rounded-[28px] sm:p-2.5 md:max-w-none lg:max-w-none ${className}`}
      aria-roledescription="carousel"
      aria-label={`${channel.label} posts`}
    >
      {/* ---------- Header ---------- */}
      <header className="flex items-center gap-2.5 px-2 pb-3 pt-2 sm:gap-3 sm:px-3 sm:pb-3.5 sm:pt-2.5">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] text-white shadow-[0_10px_20px_-10px_rgba(15,58,107,0.8)] sm:h-11 sm:w-11 sm:rounded-[14px]"
          style={{ background: `linear-gradient(140deg, ${DEEP_NAVY} 0%, ${DEEP_NAVY_DARK} 100%)` }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="m-0 truncate text-[15px] font-bold leading-tight sm:text-[16px]" style={{ color: DEEP_NAVY }}>{channel.label}</h3>
          <p className="m-0 mt-0.5 truncate text-[12px] font-medium sm:text-[12.5px]" style={{ color: TEXT_CHARCOAL, opacity: 0.6 }}>{channel.handle}</p>
        </div>
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/follow inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#D5E1EE] px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[1.2px] transition-all duration-300 hover:border-transparent hover:bg-[#0F3A6B] hover:text-white min-[380px]:px-3.5 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[1.3px]"
          style={{ color: DEEP_NAVY }}
        >
          {channel.follow}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/follow:-translate-y-0.5 group-hover/follow:translate-x-0.5" strokeWidth={2.5} />
        </a>
      </header>

      {/* ---------- Slides ---------- */}
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        className={`relative ${STAGE_HEIGHT} touch-pan-y select-none overflow-hidden rounded-[18px] bg-[#EDF3F9] outline-none ring-[#0F3A6B]/30 focus-visible:ring-2 sm:rounded-[22px]`}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none"
          style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}
        >
          {slides.map((s, i) => (
            <div
              key={s.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.label}`}
              aria-hidden={i !== current}
              className="relative h-full w-full shrink-0"
            >
              {s.render(i === current)}
            </div>
          ))}
        </div>

        {/* hover arrows — desktop, plus tablets/laptops with a mouse or trackpad */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#0F3A6B] opacity-0 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:bg-white focus-visible:opacity-100 group-hover/card:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:flex lg:flex"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#0F3A6B] opacity-0 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:bg-white focus-visible:opacity-100 group-hover/card:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:flex lg:flex"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </>
        )}
      </div>

      {/* ---------- Controls ---------- */}
      <footer className="flex items-center justify-between gap-3 px-2 pb-1 pt-3 sm:gap-4 sm:px-3 sm:pb-1.5 sm:pt-3.5">
        <div className="flex min-w-0 flex-1 items-center gap-1.5" role="tablist" aria-label={`${channel.label} slides`}>
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className="group/dot relative h-6 min-w-[14px] flex-1 max-w-[56px] outline-none"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-[#E1E9F2] transition-colors group-hover/dot:bg-[#CCD9E7]">
                <span
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: i === current ? '100%' : '0%', background: DEEP_NAVY }}
                />
              </span>
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden min-w-[52px] text-right text-[12px] font-semibold tabular-nums min-[360px]:inline-block" style={{ color: TEXT_CHARCOAL }}>
            <span style={{ color: DEEP_NAVY }}>{pad(current + 1)}</span>
            <span className="opacity-40"> / {pad(count)}</span>
          </span>
          <button
            type="button"
            onClick={prev}
            disabled={count < 2}
            aria-label="Previous slide"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D5E1EE] text-[#0F3A6B] transition-colors duration-300 hover:border-transparent hover:bg-[#0F3A6B] hover:text-white disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={count < 2}
            aria-label="Next slide"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-300 hover:scale-105 disabled:pointer-events-none disabled:opacity-35"
            style={{ background: `linear-gradient(140deg, ${DEEP_NAVY} 0%, ${DEEP_NAVY_DARK} 100%)` }}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </footer>
    </motion.article>
  )
}

/* ------------------------------------------------------------------ */
/*  Build the slide list for each channel                              */
/* ------------------------------------------------------------------ */
function moreSlide(channel) {
  return { key: `${channel.id}-more`, label: channel.moreTitle, render: () => <MoreSlide channel={channel} /> }
}

function youtubeSlides(status, videos) {
  const channel = CHANNEL_BY_ID.youtube
  if (status === 'loading') return [{ key: 'yt-loading', label: 'Loading', render: () => <SkeletonSlide /> }]
  const latest = videos.slice(0, POSTS_PER_CHANNEL)
  return [
    ...latest.map((video) => ({
      key: video.id || video.videoId,
      label: video.title,
      render: (active) => <VideoSlide video={video} active={active} />,
    })),
    moreSlide(channel),
  ]
}

// Meta feed first; pinned links (official embeds) only if the feed is empty
function metaSlides(platform, meta, links) {
  const channel = CHANNEL_BY_ID[platform]
  const fromFeed = (meta[platform] || []).slice(0, POSTS_PER_CHANNEL)
  const pinned = validLinks(platform, links)

  if (meta.status === 'loading' && !pinned.length) {
    return [{ key: `${platform}-loading`, label: 'Loading', render: () => <SkeletonSlide /> }]
  }

  const posts = fromFeed.length
    ? fromFeed.map((post) => {
        const playsInline =
          FACEBOOK_INLINE_VIDEO &&
          platform === 'facebook' &&
          (post.kind === 'video' || post.kind === 'reel') &&
          Boolean(facebookEmbedUrl(post.url, 500, 500))

        return {
          key: post.id,
          label: post.text ? post.text.slice(0, 80) : `${channel.label} post`,
          render: (active) =>
            playsInline
              ? <FacebookVideoSlide post={post} channel={channel} active={active} />
              : <PostSlide post={post} channel={channel} />,
        }
      })
    : pinned.map((url, i) => ({
        key: url,
        label: `${channel.label} post ${i + 1}`,
        render: () => <EmbedSlide platform={platform} url={url} />,
      }))

  return [...posts, moreSlide(channel)]
}

/* ------------------------------------------------------------------ */
/*  SECTION HEADER                                                     */
/*  Eyebrow text → one balanced heading (solid deep navy)              */
/*  → description. Everything centred on one axis, words rise out of   */
/*  a mask one after another.                                          */
/* ------------------------------------------------------------------ */
function SectionHeader({ eyebrow, heading, description }) {
  const words = heading.join(' ').split(/\s+/).filter(Boolean)
  const lastIndex = words.length - 1

  return (
    <motion.header
      variants={headStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="mx-auto mb-10 flex max-w-[820px] flex-col items-center px-1 text-center sm:mb-16"
    >
      {/* eyebrow: plain text */}
      <motion.span
        variants={headRise}
        className="block text-[10px] font-semibold uppercase tracking-[0.24em] min-[380px]:text-[10.5px] min-[380px]:tracking-[0.28em] sm:text-[11.5px]"
        style={{ color: DEEP_NAVY, opacity: 0.75 }}
      >
        {eyebrow}
      </motion.span>

      {/* heading: one balanced block, each word revealed from a mask */}
      <motion.h2
        variants={wordStagger}
        aria-label={words.join(' ')}
        className="m-0 mt-4 text-balance break-words text-[28px] font-bold leading-[1.08] tracking-[-0.025em] min-[380px]:mt-5 min-[380px]:text-[32px] sm:mt-6 sm:text-[46px] md:text-[56px]"
        style={{ color: DEEP_NAVY }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} aria-hidden="true">
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
              <motion.span variants={wordRise} className="inline-block">
                {word}
              </motion.span>
            </span>
            {i < lastIndex && ' '}
          </span>
        ))}
      </motion.h2>

      <motion.p
        variants={headRise}
        className="m-0 mt-4 max-w-[540px] text-balance text-[13.5px] leading-[1.7] min-[380px]:mt-5 min-[380px]:text-[14px] min-[380px]:leading-[1.75] sm:mt-6 sm:text-[16px]"
        style={{ color: TEXT_CHARCOAL, opacity: 0.75 }}
      >
        {description}
      </motion.p>
    </motion.header>
  )
}

/* ================================================================== */
/*  SOCIAL FEED SECTION                                                */
/* ================================================================== */
export default function SocialFeedSection({
  id = 'social',
  eyebrow = 'Follow our journey',
  heading = ['The PKR', 'Estates Journal'],
  description = 'Site progress, walkthroughs and handovers at PKR Estates. Catch the latest from our channels.',
  pinned = PINNED_POSTS,
}) {
  const { status, videos } = useLatestVideos()
  const meta = useMetaFeed()

  const slidesByChannel = useMemo(
    () => ({
      youtube: youtubeSlides(status, videos),
      instagram: metaSlides('instagram', meta, pinned.instagram),
      facebook: metaSlides('facebook', meta, pinned.facebook),
    }),
    [status, videos, meta, pinned]
  )

  // tablet (2 columns): an odd last card sits centred on its own row,
  // at the same width as the cards above it. Desktop is unaffected.
  const lastIsOrphan = CHANNELS.length % 2 === 1
  const orphanClass = 'md:col-span-2 md:max-w-[calc(50%-12px)] lg:col-span-1 lg:max-w-none'

  return (
    <MotionConfig reducedMotion="user">
      <section
        id={id}
        className={`${figtree.className} relative w-full overflow-hidden px-4 py-12 [-webkit-tap-highlight-color:transparent] min-[380px]:py-14 sm:px-8 sm:py-20 md:px-10 lg:px-16 lg:py-24`}
        style={{ fontFamily: FONT, background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F9FC 55%, #FFFFFF 100%)' }}
      >
        {/* soft glow behind the header (radial gradient, not a CSS blur filter) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[600px] -translate-x-1/2 sm:h-[420px] sm:w-[900px]"
          style={{ background: 'radial-gradient(closest-side, rgba(15,58,107,0.07), rgba(15,58,107,0))' }}
        />

        <div className="relative mx-auto max-w-[1280px]">
          <SectionHeader eyebrow={eyebrow} heading={heading} description={description} />

          {/* ====== grid: 1 col phone · 2 col tablet · 3 col desktop ====== */}
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:gap-8">
            {CHANNELS.map((channel, i) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                slides={slidesByChannel[channel.id]}
                index={i}
                className={lastIsOrphan && i === CHANNELS.length - 1 ? orphanClass : ''}
              />
            ))}
          </div>

          <p className="m-0 mt-7 text-center text-[12px] sm:mt-8 lg:hidden" style={{ color: TEXT_CHARCOAL, opacity: 0.55 }}>
            Swipe or use the arrows to see more posts
          </p>
        </div>
      </section>
    </MotionConfig>
  )
}