'use client'
/* eslint-disable @next/next/no-img-element */
// src/app/admin/projects/page.js
import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Figtree } from 'next/font/google'
import {
  Pencil, Plus, Trash2, X, Check, ArrowLeft, Upload, ExternalLink, Save, ImageIcon,
  Home, Sparkles, Images, LayoutGrid, Tag, Move3d, MapPin, Settings, Layers, Loader2, FileText,
  ShieldCheck, Wallet, Sprout, ArrowUpRight, Timer,
} from 'lucide-react'
import ProjectBanner from '@/components/ProjectBanner'

const figtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' })

const NAVY = '#0F3A6B'
const NAVY_DARK = '#0A2B50'
const INK = '#2D3A46'
const BLUE = '#E8F0F9'
const BLUE_SOFT = '#F0F6FC'
const GRAD = `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`

/* ---------------- API + auth ---------------- */
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const STORAGE_BASE = process.env.NEXT_PUBLIC_IMG_URL
const TOKEN_KEY = 'admin_token'
const DEBUG_AMENITIES = false
const DEBUG_GALLERY = false
const DEBUG_FLOOR_PLANS = false
const DEBUG_PRICING = true // Set to true to see API responses in console
const DEBUG_LOCATION = true // Set to true to see location API responses
const DEBUG_COUNTDOWN = true // Set to true to see countdown API responses in console
const SHOW_TAB_BAR = true // draws the pricing filter tabs above the table in the editor preview

// Countdown API
//   POST   /projects/countdown/save            { project_id, completion_date, is_active }
//   POST   /projects/countdown/status/{id}     { is_active }
//   DELETE /projects/countdown/delete/{id}
// To LOAD an existing countdown the editor reads `countdown` from GET /projects/details/{id}
// and also tries this GET (change the path if your backend uses another one; a 404 is ignored).
const COUNTDOWN_GET_PATH = (projectId) => `/projects/countdown/${projectId}`

const abs = (u) => (!u ? '' : /^(https?:|data:|blob:)/.test(u) ? u : `${STORAGE_BASE}${String(u).replace(/^\/+/, '').replace(/^storage\//, '')}`)

const readToken = (raw) => {
  if (!raw) return ''
  try {
    const v = JSON.parse(raw)
    if (typeof v === 'string') return v
    if (v && typeof v === 'object') return v.token || v.access_token || v.accessToken || ''
  } catch { /* plain string */ }
  return raw
}

const getToken = () => {
  if (typeof window === 'undefined') return ''
  const stores = []
  try { stores.push(window.localStorage, window.sessionStorage) } catch { /* blocked */ }
  const named = [TOKEN_KEY, 'token', 'access_token', 'auth_token', 'authToken', 'admin_token', 'pkr_admin_token', 'adminToken']
  for (const st of stores) {
    for (const k of named) { const t = readToken(st.getItem(k)); if (t) return t }
    for (let i = 0; i < st.length; i++) {
      const k = st.key(i)
      if (/token/i.test(k)) { const t = readToken(st.getItem(k)); if (t) return t }
    }
  }
  const m = document.cookie.match(/(?:^|;\s*)(?:[\w-]*token[\w-]*)=([^;]+)/i)
  return m ? decodeURIComponent(m[1]) : ''
}

// The API answers with status "success" on some endpoints and status true on others
const isOkStatus = (s) => s === true || s === 1 || s === 'success'

async function apiFetch(path, options = {}) {
  const token = getToken()
  if (!token) throw new Error(`No login token found. Log in again.`)
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) },
    })
  } catch {
    throw new Error("We couldn't reach the server. Check your connection.")
  }
  let json = null
  try { json = await res.json() } catch { json = null }
  if (res.status === 401 || res.status === 403) throw new Error('Your session has expired. Please log in again.')
  if (!res.ok || (json && json.status && !isOkStatus(json.status))) throw new Error(json?.message || 'Something went wrong.')
  return { res, json }
}

async function uploadFile(path, formData) {
  const token = getToken()
  if (!token) throw new Error(`No login token found.`)
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: formData,
    })
  } catch {
    throw new Error("Upload failed. Check your connection.")
  }
  let json = null
  try { json = await res.json() } catch { json = null }
  if (res.status === 401 || res.status === 403) throw new Error('Your session has expired. Please log in again.')
  if (!res.ok || (json && json.status && !isOkStatus(json.status))) throw new Error(json?.message || 'Upload failed.')
  return json
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const uid = () => Date.now() + Math.floor(Math.random() * 100000)
const TONE = { Ongoing: 'bg-[#E8F0F9] text-[#0F3A6B]', Completed: 'bg-emerald-50 text-emerald-700', Upcoming: 'bg-amber-50 text-amber-700' }

// API may return "active" / "inactive" / "ongoing" etc. Always map to one of the 3 editor statuses
const normStatus = (s) => {
  const v = String(s || '').trim().toLowerCase()
  if (v === 'completed') return 'Completed'
  if (v === 'upcoming') return 'Upcoming'
  return 'Ongoing' // active, inactive, ongoing, empty
}

// Editor status -> value sent to POST /projects/update/{id}
// If the status wasn't changed, the original API value (e.g. "active") is sent back untouched.
const toApiStatus = (f) => {
  const ui = normStatus(f.status)
  if (f.statusRaw && normStatus(f.statusRaw) === ui) return String(f.statusRaw).trim().toLowerCase()
  return { Ongoing: 'active', Completed: 'completed', Upcoming: 'upcoming' }[ui]
}

const TYPES = ['Studio', '1 BHK', '2 BHK', '2 BHK + 2T', '3 BHK']
const FACINGS = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']

/* ---------------- Overview ---------------- */
const FACT_DEFS = [
  { key: 'propType', icon: 'type', label: 'Property type' },
  { key: 'propSize', icon: 'size', label: 'Project size' },
  { key: 'propUnits', icon: 'units', label: 'Total units' },
  { key: 'propPrice', icon: 'price', label: 'Price' },
  { key: 'propFloors', icon: 'floors', label: 'Floors' },
  { key: 'reraNumber', icon: 'rera', label: 'RERA No.' },
]

const buildFacts = (f) =>
  FACT_DEFS.filter((d) => (f[d.key] || '').toString().trim()).map((d) => ({ id: `fact-${d.key}`, icon: d.icon, label: d.label, value: f[d.key] }))

function overviewFromApi(p = {}) {
  const o = {}
  if (p.hero_subtitle) o.eyebrow = p.hero_subtitle
  if (p.hero_title) {
    const w = String(p.hero_title).trim().split(/\s+/)
    const n = Math.floor(w.length / 2)
    o.heading = w.length > 1 ? [w.slice(0, n).join(' '), w.slice(n).join(' ')] : [String(p.hero_title), '']
  }
  if (p.hero_description) o.description = p.hero_description
  if (p.call_button_text) o.callButtonText = p.call_button_text
  if (p.call_button_number) o.callButtonNumber = p.call_button_number
  if (p.prop_type) o.propType = p.prop_type
  if (p.prop_size) o.propSize = p.prop_size
  if (p.prop_units) o.propUnits = p.prop_units
  if (p.prop_price) o.propPrice = p.prop_price
  if (p.prop_floors) o.propFloors = p.prop_floors
  if (p.rera_number) o.reraNumber = p.rera_number
  if (p.hero_image_url || p.hero_image) o.aboutImage = p.hero_image_url || abs(p.hero_image)
  if (p.rera_pdf_url || p.rera_pdf) o.reraPdf = p.rera_pdf_url || abs(p.rera_pdf)
  const facts = buildFacts(o)
  if (facts.length) o.quickFacts = facts
  return o
}

/* ---------------- Amenities ---------------- */
const parseList = (v) => {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') { try { const x = JSON.parse(v); return Array.isArray(x) ? x : [] } catch { return [] } }
  return []
}
const urlOf = (x) => (typeof x === 'string' ? abs(x) : abs(x?.url || x?.image_url || x?.path || x?.image || x?.icon_url || x?.icon || ''))

function amenitiesFromApi(raw) {
  const d = raw && typeof raw === 'object' ? raw : {}
  const data = d.data ?? d

  const candidates = [data, data.main, data.section, data.amenities]
  const main = candidates.find((c) => c && typeof c === 'object' && !Array.isArray(c) && (
    'section_subtitle' in c || 'section_title' in c || 'section_description' in c
  )) || data

  const out = {}
  if (main.section_subtitle) out.amenitiesEyebrow = main.section_subtitle
  if (main.section_title) {
    const w = String(main.section_title).trim().split(/\s+/)
    const n = Math.floor(w.length / 2)
    out.amenitiesHeading = w.length > 1 ? [w.slice(0, n).join(' '), w.slice(n).join(' ')] : [String(main.section_title), '']
  }
  if (main.section_description) out.amenitiesDescription = main.section_description

  const list = parseList(
    main.amenities_list ?? main.amenities ?? data.amenities_list ??
    (Array.isArray(data.amenities) ? data.amenities : null)
  )
  const iconsArr = parseList(main.amenities_icons ?? main.icons ?? data.amenities_icons)

  if (Array.isArray(list) && list.length && list.every((x) => typeof x === 'object' || typeof x === 'string')) {
    out.amenitiesIcons = list.map((a, i) => {
      const name = typeof a === 'string' ? a : (a?.name || a?.title || '')
      const iconFromItem = typeof a === 'object'
        ? abs(a?.icon_url || a?.icon || a?.image_url || a?.image || '')
        : ''
      const iconFromArr = urlOf(iconsArr[i] || '')
      return {
        id: a?.id ?? `am-${i}`,
        name,
        icon: iconFromItem || iconFromArr,
        iconFile: null,
      }
    })
  }

  const slides = parseList(
    data.details ?? main.details ??
    data.sliders ?? data.slider ?? data.slides ??
    main.sliders ?? main.slider ?? main.slides
  )
  const hasSlideKey = ['details', 'sliders', 'slider', 'slides'].some((k) => k in data || k in main)
  if (hasSlideKey || (Array.isArray(slides) && slides.length)) {
    out.amenities = slides.map((sl, i) => {
      let images = parseList(sl.images_url ?? sl.image_urls ?? sl.images_urls).map(urlOf).filter(Boolean)
      if (!images.length) images = parseList(sl.images).map(urlOf).filter(Boolean)
      if (!images.length) {
        const single = urlOf(sl.image || sl.image_url || '')
        if (single) images.push(single)
      }
      return {
        id: sl.id ?? `sl-${i}`,
        tagline: sl.tag || sl.tagline || '',
        title: sl.title || '',
        description: sl.description || '',
        tags: parseList(sl.tags).map((t) => (typeof t === 'string' ? t : t?.name || '')).filter(Boolean),
        image: images[0] || '',
        images,
      }
    })
  }
  return out
}

/* ---------------- Gallery ---------------- */
function galleryFromApi(raw) {
  const d = raw && typeof raw === 'object' ? raw : {}
  const data = d.data ?? d
  const out = {}

  const heading = data.gallery_title ?? data.title ?? data.heading ?? data.galleryHeading
  if (heading) out.galleryHeading = [String(heading)]

  const list = parseList(
    data.images ?? data.gallery_images ?? data.gallery ?? data.galleryImages ??
    data.details ?? []
  )
  if (Array.isArray(list)) {
    out.galleryImages = list.map((img, i) => {
      if (typeof img === 'string') {
        return { id: `g-${i}`, title: '', image: abs(img) }
      }
      const imageUrl = img?.image_url || img?.image || img?.url || img?.path || ''
      const title = img?.image_title || img?.title || img?.caption || ''
      return {
        id: img?.id ?? `g-${i}`,
        title,
        image: abs(imageUrl),
      }
    })
  }

  return out
}

/* ---------------- Floor plans ---------------- */
const asObj = (v) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v
  if (typeof v === 'string') { try { const x = JSON.parse(v); return x && typeof x === 'object' && !Array.isArray(x) ? x : null } catch { return null } }
  return null
}
const firstDef = (o, keys) => { if (!o) return undefined; for (const k of keys) if (o[k] !== undefined && o[k] !== null) return o[k]; return undefined }
const nameOf = (x) => (typeof x === 'string' ? x : String(x?.name ?? x?.label ?? x?.title ?? x?.block_name ?? ''))

function normalizeLayout(p, i, fallbackBlock = '', fallbackType = '') {
  const blockRaw = firstDef(p, ['block_name', 'block', 'blockName'])
  const blockName = blockRaw && typeof blockRaw === 'object' ? nameOf(blockRaw) : (blockRaw || fallbackBlock || '')
  return {
    id: p?.id ?? `fp-${i}`,
    title: p?.title || p?.name || p?.unit || '',
    blockName: String(blockName || ''),
    type: p?.unit_type || p?.type || p?.unitType || fallbackType || '',
    facing: p?.facing || '',
    area: p?.area || p?.sqft || '',
    description: p?.description || '',
    image: abs(p?.plan_image_url || p?.plan_image || p?.image_url || p?.image || p?.url || ''),
  }
}

const LAYOUT_KEYS = ['layouts', 'plans', 'floor_plans', 'floorPlans', 'units', 'layout_list']

function flattenLayouts(v) {
  const o = asObj(v)
  if (!o) return parseList(v).map((p, i) => normalizeLayout(p, i))
  const res = []
  Object.entries(o).forEach(([k, val]) => {
    const arr = parseList(val)
    if (arr.length) { arr.forEach((p) => res.push(normalizeLayout(p, res.length, k))); return }
    const inner = asObj(val)
    if (inner) Object.entries(inner).forEach(([k2, v2]) => parseList(v2).forEach((p) => res.push(normalizeLayout(p, res.length, k, k2))))
  })
  return res
}

function floorPlansFromApi(raw) {
  const out = {}
  const root = raw && typeof raw === 'object' && 'data' in raw ? raw.data : raw
  if (root == null) return out
  const rootObj = Array.isArray(root) ? {} : (asObj(root) || {})

  const head = [rootObj, rootObj.header, rootObj.floor_plan, rootObj.floor_plans, rootObj.floorPlan, rootObj.floor_plans_header, rootObj.section, rootObj.main, rootObj.details]
    .map(asObj)
    .find((c) => c && ['heading', 'eyebrow', 'description', 'unit_type_groups', 'blocks'].some((k) => k in c)) || rootObj

  const eyebrow = firstDef(head, ['eyebrow', 'section_subtitle', 'subtitle'])
  const heading = firstDef(head, ['heading', 'section_title', 'title'])
  const description = firstDef(head, ['description', 'section_description'])
  if (eyebrow !== undefined) out.floorPlansEyebrow = String(eyebrow)
  if (heading !== undefined) out.floorPlansHeading = [String(heading || '')]
  if (description !== undefined) out.floorPlansDescription = String(description)

  const tabsRaw = firstDef(head, ['unit_type_groups', 'unit_types', 'unitTypeGroups'])
  if (tabsRaw !== undefined) out.floorPlanTabs = parseList(tabsRaw).map(nameOf).filter(Boolean)

  const blocksRaw = firstDef(head, ['blocks']) ?? firstDef(rootObj, ['blocks'])
  const blockList = parseList(blocksRaw)
  if (blocksRaw !== undefined) {
    out.floorPlanBlocks = blockList.map((b, i) => {
      const name = nameOf(b) || `Block ${i + 1}`
      const status = b && typeof b === 'object' ? (b.status || b.tag || '') : ''
      return { id: (b && b.id) ?? `blk-${i}`, name, status, label: name, tag: status }
    })
  }

  let layoutsRaw = Array.isArray(root) ? root : firstDef(rootObj, LAYOUT_KEYS)
  if (layoutsRaw === undefined) layoutsRaw = firstDef(head, LAYOUT_KEYS)
  let layouts = layoutsRaw === undefined ? [] : flattenLayouts(layoutsRaw)

  if (!layouts.length) {
    blockList.forEach((b) => {
      if (!b || typeof b !== 'object') return
      const inner = firstDef(b, LAYOUT_KEYS)
      if (inner !== undefined) flattenLayouts(inner).forEach((p) => layouts.push({ ...p, blockName: p.blockName || nameOf(b) }))
    })
  }
  if (layouts.length || layoutsRaw !== undefined) out.floorPlans = layouts
  return out
}

/* ---------------- Pricing ---------------- */
const PR_HEAD_KEYS = ['eyebrow', 'heading', 'description', 'cta_title', 'validity_message', 'filter_tabs', 'icon_1_title']
const PR_UNIT_KEYS = ['units', 'pricing_units', 'pricingUnits', 'pricing', 'prices', 'pricing_list', 'unit_list', 'items', 'flats', 'list', 'data']

const truthy = (v) => v === true || v === 1 || v === '1' || v === 'true'

// "₹75.52L" -> 7552000, "₹1.2 Cr" -> 12000000, "6545000" -> 6545000
function parseMoney(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const s = String(v ?? '').replace(/[₹,\s]/g, '').toLowerCase()
  if (!s) return 0
  const m = s.match(/^([\d.]+)(crore|cr|lakhs|lakh|lac|l|k)?/)
  if (!m) return 0
  const n = parseFloat(m[1])
  if (Number.isNaN(n)) return 0
  const mult = { crore: 1e7, cr: 1e7, lakhs: 1e5, lakh: 1e5, lac: 1e5, l: 1e5, k: 1e3 }[m[2]] || 1
  return Math.round(n * mult)
}

// "1259 sq.ft" -> "1259" (the banner table already appends "sq.ft")
const stripSqft = (v) => String(v ?? '').replace(/\s*sq\.?\s*ft\.?/i, '').trim()

// Does a unit belong under a filter tab? ("All Units", "2 BHK", "Shops", "Block A" …)
function matchesTab(u, tab) {
  const t = String(tab || '').trim().toLowerCase()
  if (!t || t === 'all' || t === 'all units') return true
  const type = String(u.type || '').toLowerCase()
  const block = String(u.block || '').toLowerCase()
  const bm = t.match(/^block\s+(.+)$/)
  if (bm) return block === t || String(u.flatNo || '').toLowerCase().startsWith(bm[1])
  if (/^shops?$/.test(t)) return /shop/.test(type)
  const norm = (s) => s.replace(/\s+/g, '')
  return norm(type) === norm(t) || norm(type).startsWith(`${norm(t)}+`) || norm(type).startsWith(norm(t))
}

const looksLikeUnit = (x) => x && typeof x === 'object' && !Array.isArray(x) && ('flat_no' in x || 'flatNo' in x || 'flat' in x)

// Walk the whole response and return the first array whose items look like pricing units.
function findUnitArray(node, depth = 0) {
  if (node == null || depth > 6) return undefined
  if (typeof node === 'string') {
    const t = node.trim()
    if (t[0] === '[' || t[0] === '{') { try { return findUnitArray(JSON.parse(t), depth + 1) } catch { return undefined } }
    return undefined
  }
  if (Array.isArray(node)) {
    if (node.length && node.some(looksLikeUnit)) return node
    for (const x of node) { const r = findUnitArray(x, depth + 1); if (r) return r }
    return undefined
  }
  if (typeof node === 'object') {
    for (const v of Object.values(node)) { const r = findUnitArray(v, depth + 1); if (r) return r }
  }
  return undefined
}

// Find the first value stored under `key` anywhere in the response
function findKey(node, key, depth = 0) {
  if (node == null || typeof node !== 'object' || depth > 6) return undefined
  if (!Array.isArray(node) && key in node && node[key] !== undefined && node[key] !== null) return node[key]
  for (const v of Object.values(node)) { const r = findKey(v, key, depth + 1); if (r !== undefined) return r }
  return undefined
}

const toYesNo = (v) => (['no', 'false', '0', 'off'].includes(String(v).trim().toLowerCase()) ? 'no' : 'yes')

function normalizePricingUnit(u, i) {
  const original = String(u?.original_price ?? u?.originalPrice ?? u?.price ?? '')
  const offer = String(u?.offer_price ?? u?.offerPrice ?? '')
  const areaRaw = String(u?.area ?? u?.sqft ?? '')
  const areaNum = stripSqft(areaRaw)
  const flatNo = u?.flat_no || u?.flatNo || u?.flat || ''
  const letter = String(flatNo).match(/^[A-Za-z]+/)?.[0]
  const block = u?.block_name || u?.block || (letter ? `Block ${letter.toUpperCase()}` : '')
  return {
    id: u?.id ?? `pu-${i}`,
    flatNo,
    block,
    blockName: block,
    floor: u?.floor || '',
    type: u?.type || u?.unit_type || '',
    facing: u?.facing || '',
    area: areaNum,
    areaText: areaRaw,
    sqft: areaNum,
    originalPrice: original,
    offerPriceText: offer,
    isPreLaunch: truthy(u?.is_pre_launch ?? u?.isPreLaunch),
    // aliases used by the ProjectBanner pricing table (numeric so it can format them)
    total: parseMoney(original),
    offerPrice: offer ? parseMoney(offer) : 0,
    finalTotal: offer ? '' : parseMoney(original),
  }
}

function pricingFromApi(raw) {
  const out = {}
  // Fallback if raw is null or not an object
  if (!raw || typeof raw !== 'object') return out;

  const root = 'data' in raw ? raw.data : raw
  if (!root) return out;

  const rootObj = Array.isArray(root) ? {} : (asObj(root) || {})

  const head = [rootObj, rootObj.header, rootObj.pricing_header, rootObj.pricing, rootObj.section, rootObj.details, rootObj.main]
    .map(asObj)
    .find((c) => c && PR_HEAD_KEYS.some((k) => k in c)) || rootObj

  if (head.eyebrow !== undefined && head.eyebrow !== null) out.plotPricingEyebrow = String(head.eyebrow)
  if (head.heading !== undefined && head.heading !== null) out.plotPricingHeading = [String(head.heading)]
  if (head.description !== undefined && head.description !== null) out.plotPricingDescription = String(head.description)
  if (head.validity_message !== undefined && head.validity_message !== null) out.offerValidityText = String(head.validity_message)
  if (head.cta_title !== undefined && head.cta_title !== null) out.plotPricingCtaHeading = [String(head.cta_title)]
  if (head.cta_description !== undefined && head.cta_description !== null) out.plotPricingCtaText = String(head.cta_description)

  const offerStatus = findKey(raw, 'offer_price_status')
  if (offerStatus !== undefined) out.offerPriceStatus = toYesNo(offerStatus)

  const ctaImg = head.cta_image_url || head.cta_image
  if (ctaImg) out.plotPricingCtaImage = abs(ctaImg)

  const tabsRaw = firstDef(head, ['filter_tabs', 'tabs'])
  if (tabsRaw !== undefined) {
    // 🔑 FIX: Map to objects with `id` and `label` to satisfy ProjectBanner's `.map(tab => ... tab.id ...)`
    out.plotPricingTabs = parseList(tabsRaw).map((t) => {
      const label = nameOf(t)
      return { id: label, label, name: label }
    })
  }

  const iconsArr = parseList(firstDef(head, ['icons', 'features']))
  const icons = [1, 2, 3].map((n) => {
    const a = iconsArr[n - 1] || {}
    return {
      title: String(head[`icon_${n}_title`] ?? a.title ?? ''),
      desc: String(head[`icon_${n}_desc`] ?? a.description ?? a.desc ?? ''),
      image: abs(head[`icon_${n}_image_url`] || head[`icon_${n}_image`] || a.image_url || a.image || a.icon_url || a.icon || ''),
      file: null,
    }
  })
  if (icons.some((i) => i.title || i.desc || i.image)) out.pricingIcons = icons

  // 1) try the known keys
  let unitsRaw = Array.isArray(root) ? root : firstDef(rootObj, PR_UNIT_KEYS)
  if (unitsRaw === undefined) unitsRaw = firstDef(head, PR_UNIT_KEYS)
  let unitList = unitsRaw === undefined ? [] : parseList(unitsRaw).filter((x) => x && typeof x === 'object')

  // 2) fallback: search the whole response for an array of objects with flat_no
  if (!unitList.length) {
    const found = findUnitArray(raw)
    if (found) unitList = found.filter(looksLikeUnit)
  }

  if (unitList.length || unitsRaw !== undefined) out.plotPricing = unitList.map(normalizePricingUnit)

  return out
}

/* ---------------- 360° tour ---------------- */
// GET /projects/360/{id}
function tourFromApi(raw) {
  const out = {}
  if (!raw || typeof raw !== 'object') return out
  const root = 'data' in raw ? raw.data : raw
  const d = asObj(root) || {}
  const KEYS = ['title', 'eyebrow', 'description', 'button_text', 'cover_image_url', 'cover_image', 'panorama_image_url', 'panorama_image']
  const src = [d, d.details, d.data, d.tour, d.tour_360].map(asObj).find((c) => c && KEYS.some((k) => k in c)) || d

  if (src.eyebrow !== undefined && src.eyebrow !== null) out.tourEyebrow = String(src.eyebrow)
  if (src.title !== undefined && src.title !== null) out.tourHeading = splitPair(src.title)
  if (src.description !== undefined && src.description !== null) out.tourDescription = String(src.description)
  if (src.button_text !== undefined && src.button_text !== null) out.tourCtaLabel = String(src.button_text)

  if ('cover_image_url' in src || 'cover_image' in src) out.tourCover = src.cover_image_url || abs(src.cover_image) || ''
  if ('panorama_image_url' in src || 'panorama_image' in src) out.tour360Image = src.panorama_image_url || abs(src.panorama_image) || ''
  return out
}

/* ---------------- Map helper ---------------- */
// Accepts: <iframe src="..."> snippet, a /maps/embed URL, or a normal Google Maps link.
// Returns an iframe-safe URL, or '' if the link can't be embedded.
const mapSrcOf = (v) => {
  const s = String(v ?? '').trim()
  if (!s) return ''
  const m = s.match(/src\s*=\s*["']([^"']+)["']/i)
  const url = (m ? m[1] : s).replace(/&amp;/g, '&').trim()
  if (!/^https?:\/\//i.test(url)) return ''
  if (/google\.[^/]+\/maps\/embed/i.test(url) || /[?&]output=embed/i.test(url)) return url
  if (/goo\.gl|maps\.app/i.test(url)) return '' // short links can't be embedded
  if (/google\.[^/]+\/maps/i.test(url)) {
    const at = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (at) return `https://www.google.com/maps?q=${at[1]},${at[2]}&z=15&output=embed`
    const q = url.match(/[?&]q=([^&]+)/)
    if (q) return `https://www.google.com/maps?q=${q[1]}&output=embed`
    const place = url.match(/\/maps\/place\/([^/@?]+)/)
    if (place) return `https://www.google.com/maps?q=${place[1]}&output=embed`
    return ''
  }
  return url
}

/* ---------------- Location (Connectivity) ---------------- */
// GET /projects/connectivity/{id}
function locationFromApi(raw) {
  const out = {}
  if (!raw || typeof raw !== 'object') return out
  const root = 'data' in raw ? raw.data : raw
  const d = asObj(root) || {}

  const src = [d, d.location, d.connectivity, d.details].map(asObj).find(c => c && ('title' in c || 'locations' in c || 'map_link' in c)) || d

  if (src.title !== undefined && src.title !== null) out.locationHeading = splitPair(src.title)
  if (src.description !== undefined && src.description !== null) out.locationDescription = String(src.description)
  if (src.button_text !== undefined && src.button_text !== null) out.locationCtaLabel = String(src.button_text)
  if (src.map_link !== undefined && src.map_link !== null) out.locationMapUrl = String(src.map_link)
  if (src.map_embed !== undefined && src.map_embed !== null) out.locationMapEmbed = String(src.map_embed)

  const list = parseList(src.locations)
  if (list.length || Array.isArray(src.locations)) {
    out.locationLandmarks = list.map((l, i) => ({
      id: `loc-${i}`,
      label: l.location || l.label || '',
      distance: l.time || l.distance || ''
    }))
  }
  return out
}

/* ---------------- Countdown ---------------- */
// <input type="datetime-local"> value  ->  "2026-12-31 23:59:59" (what the API expects)
const toApiDate = (v) => {
  const s = String(v ?? '').trim().replace('T', ' ')
  if (!s) return ''
  return /\d{2}:\d{2}:\d{2}$/.test(s) ? s : `${s}:00`
}

// "2026-12-31 23:59:59" / ISO string  ->  "2026-12-31T23:59" (datetime-local value)
const toInputDate = (v) => {
  const s = String(v ?? '').trim()
  if (!s) return ''
  return s.replace(' ', 'T').slice(0, 16)
}

// Reads a countdown out of: GET /projects/countdown/{id}, the save/status responses,
// or GET /projects/details/{id} (when it embeds `countdown`). Returns {} when nothing is saved.
function countdownFromApi(raw) {
  const out = {}
  if (!raw || typeof raw !== 'object') return out
  const root = 'data' in raw ? raw.data : raw
  const first = Array.isArray(root) ? root[0] : root
  const d = asObj(first) || {}
  const src = [d, d.countdown, d.project_countdown].map(asObj).find((c) => c && 'completion_date' in c)
  if (!src) return out
  out.countdownId = src.id ?? null
  out.countdownDate = toInputDate(src.completion_date)
  out.countdownActive = truthy(src.is_active)
  return out
}

async function urlToFile(url) {
  if (!/^https?:/i.test(url)) throw new Error('not an http url')
  const res = await fetch(url)
  if (!res.ok) throw new Error('fetch failed')
  const blob = await res.blob()
  const name = (url.split('?')[0].split('/').pop() || 'icon.png')
  return new File([blob], name, { type: blob.type || 'image/png' })
}

const INITIAL = []
const BLANK_ICONS = () => [0, 1, 2].map(() => ({ title: '', desc: '', image: '', file: null }))
const BLANK = {
  id: undefined, name: '', navName: '', slug: '', status: 'Ongoing', statusRaw: '', settingsDirty: false, heroImage: '', heroImageMobile: '', description: '',
  quickFacts: [], amenities: [], galleryHeading: [], galleryImages: [],
  floorPlansEyebrow: '', floorPlansHeading: [''], floorPlansDescription: '',
  floorPlanTabs: [], floorPlanBlocks: [], floorPlans: [],
  plotPricing: [], offerValidityText: '', tourHeading: ['', ''], tour360Image: '', tourThumbnail: '',
  locationHeading: ['', ''], locationLandmarks: [], locationDescription: '', locationCtaLabel: '', locationMapUrl: '', locationMapEmbed: '', locationMapImage: '', locDirty: false,
  metaTitle: '', metaDesc: '',
  callButtonText: '', callButtonNumber: '', propType: '', propSize: '', propUnits: '', propPrice: '', propFloors: '', reraNumber: '',
  reraPdf: '', aboutImageFile: null, reraPdfFile: null, ovDirty: false,
  amenitiesIcons: [], amDirty: false, fpDirty: false, fpLoadError: '',
  plotPricingEyebrow: '', plotPricingHeading: [], plotPricingDescription: '', pricingIcons: BLANK_ICONS(),
  plotPricingTabs: [], plotPricingCtaHeading: [], plotPricingCtaText: '', plotPricingCtaImage: '', plotPricingCtaImageFile: null,
  prDirty: false, prLoadError: '', offerPriceStatus: 'yes',
  tourEyebrow: '', tourDescription: '', tourCtaLabel: '', tourCover: '', tourCoverFile: null, tour360File: null, tourDirty: false,
  countdownId: null, countdownDate: '', countdownActive: true, countdownDirty: false,
}

const SECTIONS = [
  { id: 'banner', label: 'Banner', icon: ImageIcon, keys: ['heroImage', 'heroImageMobile', 'tourThumbnail'] },
  { id: 'overview', label: 'Overview', icon: Home, dom: 'overview', keys: ['eyebrow', 'heading', 'description', 'aboutImage', 'aboutImageFile', 'brochureUrl', 'reraPdf', 'reraPdfFile', 'quickFacts', 'callButtonText', 'callButtonNumber', 'propType', 'propSize', 'propUnits', 'propPrice', 'propFloors', 'reraNumber', 'ovDirty'] },
  { id: 'amenities', label: 'Amenities', icon: Sparkles, dom: 'amenities', keys: ['amenitiesEyebrow', 'amenitiesHeading', 'amenitiesDescription', 'amenitiesIcons', 'amDirty'] },
  { id: 'gallery', label: 'Gallery', icon: Images, dom: 'gallery', keys: ['galleryHeading', 'galleryImages'] },
  { id: 'floor-plans', label: 'Floor plans', icon: LayoutGrid, dom: 'floor-plans', keys: ['floorPlansEyebrow', 'floorPlansHeading', 'floorPlansDescription', 'floorPlanTabs', 'floorPlanBlocks', 'floorPlans', 'fpDirty'] },
  { id: 'price-list', label: 'Pricing', icon: Tag, dom: 'price-list', keys: ['plotPricingEyebrow', 'plotPricingHeading', 'plotPricingDescription', 'pricingIcons', 'plotPricingTabs', 'offerValidityText', 'plotPricing', 'plotPricingCtaImage', 'plotPricingCtaImageFile', 'plotPricingCtaHeading', 'plotPricingCtaText', 'prDirty'] },
  { id: 'tour', label: '360° tour', icon: Move3d, dom: 'tour', keys: ['tourEyebrow', 'tourHeading', 'tourDescription', 'tourCtaLabel', 'tour360Image', 'tourThumbnail', 'tourCover', 'tourCoverFile', 'tour360File', 'tourDirty'] },
  { id: 'location', label: 'Location', icon: MapPin, dom: 'location', keys: ['locationHeading', 'locationDescription', 'locationCtaLabel', 'locationMapUrl', 'locationMapEmbed', 'locationMapImage', 'locationLandmarks', 'locDirty'] },
  { id: 'countdown', label: 'Countdown', icon: Timer, keys: ['countdownId', 'countdownDate', 'countdownActive', 'countdownDirty'] },
  { id: 'settings', label: 'Settings & SEO', icon: Settings, keys: ['name', 'navName', 'slug', 'status', 'statusRaw', 'metaTitle', 'metaDesc', 'settingsDirty'] },
]

const secEl = (dom) => (typeof document === 'undefined' ? null : document.querySelector(`[data-sec="${dom}"]`) || document.getElementById(dom))

/* ---------------- Editor preview ---------------- */
const PH = (text) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="100%" height="100%" fill="#E8F0F9"/><text x="50%" y="50%" fill="#0F3A6B" font-family="sans-serif" font-size="44" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`
  )}`

// 🔑 ROBUST FIX: Handle arrays, strings, objects, null, undefined safely
const blankPair = (v) => {
  if (!v) return true
  if (typeof v === 'string') return !v.trim()
  if (Array.isArray(v)) return v.every((x) => !String(x || '').trim())
  if (typeof v === 'object') return Object.keys(v).length === 0
  return !String(v).trim()
}

const splitPair = (str) => {
  const s = String(str || '').trim()
  const w = s.split(/\s+/).filter(Boolean)
  if (w.length < 2) return [s, '']
  const n = Math.ceil(w.length / 2)
  return [w.slice(0, n).join(' '), w.slice(n).join(' ')]
}

function buildPreview(f) {
  const p = { ...f }
  // 🔑 FIX: the API can send "active"; the banner only understands the 3 editor statuses
  p.status = normStatus(f.status)
  p.slug = f.slug || slugify(f.name || 'project')
  p.projectId = f.id
  p.project_id = f.id
  p._id = f.id

  /* ---- Overview ---- */
  if (!f.eyebrow) p.eyebrow = 'Add an eyebrow'
  if (blankPair(f.heading)) p.heading = ['Designed for a', 'Better Way of Life']
  if (!f.description) p.description = 'Add a short overview of the project here.'
  if (!f.aboutImage) p.aboutImage = PH('Overview image')
  if (!f.quickFacts?.length) {
    p.quickFacts = buildFacts({
      propType: 'Studio, 1, 2 & 3 BHK',
      propSize: '— Acres',
      propUnits: '—',
      propPrice: '₹ — / Sq.Ft',
      propFloors: '—',
      reraNumber: '—',
    })
  }

  /* ---- Amenities ---- */
  if (blankPair(f.amenitiesHeading)) p.amenitiesHeading = ['Everyday Comforts,', 'Exceptional Living']
  if (!f.amenitiesEyebrow) p.amenitiesEyebrow = 'AMENITIES'
  if (!f.amenitiesDescription) p.amenitiesDescription = 'Add a short description of the amenities here.'
  if (!f.amenitiesIcons?.length) {
    p.amenitiesIcons = [1, 2, 3, 4].map((n) => ({ id: `ph-ai${n}`, name: `Amenity ${n}`, icon: PH('Icon'), iconFile: null }))
  }
  if (f.amenities?.length) {
    p.amenities = f.amenities.map((a) => ({
      ...a,
      gallery: a.images?.length ? a.images : a.image ? [a.image] : [],
    }))
  } else {
    p.amenities = [1, 2].map((n) => ({
      id: `ph-sl${n}`,
      tagline: 'SLIDE LABEL',
      title: `Amenity slide ${n}`,
      description: 'Add a slide in the Amenities editor.',
      tags: [],
      image: PH(`Amenity slide ${n}`),
      images: [PH(`Amenity slide ${n}`)],
      gallery: [PH(`Amenity slide ${n}`)],
    }))
  }

  /* ---- Gallery ---- */
  if (blankPair(f.galleryHeading)) p.galleryHeading = ['A Glimpse Into Your Tomorrow']
  if (!f.galleryImages?.length) {
    p.galleryImages = [1, 2, 3].map((n) => ({ id: `ph-g${n}`, title: `Gallery photo ${n}`, image: PH(`Gallery photo ${n}`) }))
  }

  /* ---- Floor plans ---- */
  const realPlans = f.floorPlans || []
  const realBlocks = f.floorPlanBlocks || []
  const uniq = (a) => [...new Set(a.filter(Boolean))]

  const headingStr = (f.floorPlansHeading || []).join(' ').trim() || 'Homes Tailored to Your Needs'
  const hw = headingStr.split(/\s+/)
  const hn = Math.floor(hw.length / 2)
  p.floorPlansEyebrow = f.floorPlansEyebrow || 'FLOOR PLANS'
  p.floorPlansHeading = hw.length > 1 ? [hw.slice(0, hn).join(' '), hw.slice(hn).join(' ')] : [headingStr, '']
  p.floorPlansDescription = f.floorPlansDescription || 'Add a short description of the floor plans here.'

  let tabs = uniq([...(f.floorPlanTabs || []), ...realPlans.map((x) => x.type)])
  const knownBlocks = new Set(realBlocks.map((b) => b.name || b.label))
  let blocks = [
    ...realBlocks,
    ...uniq(realPlans.map((x) => x.blockName))
      .filter((n) => !knownBlocks.has(n))
      .map((n, i) => ({ id: `dblk-${i}`, name: n, status: '', label: n, tag: '' })),
  ]
  if (!tabs.length) tabs = ['2 BHK']
  if (!blocks.length) blocks = [{ id: 'ph-blk1', name: 'Block A', status: 'UNDER CONSTRUCTION', label: 'Block A', tag: 'UNDER CONSTRUCTION' }]

  let plans = realPlans
  if (!plans.length) {
    plans = [{
      id: 'ph-fp1', title: 'Sample layout', blockName: blocks[0].name, type: tabs[0],
      facing: 'East', area: '— Sq.ft', description: 'Add layouts in the Floor plans editor.', image: PH('Floor plan'),
    }]
  }

  const norm = (v) => String(v || '').trim().toLowerCase()
  const firstBlockName = blocks[0].name || blocks[0].label || ''
  p.floorPlanTabs = tabs
  p.floorPlans = plans
  p.floorPlanBlocks = blocks.map((b, i) => {
    const name = b.name || b.label || `Block ${i + 1}`
    const status = b.status || b.tag || ''
    return {
      ...b,
      id: b.id ?? `blk-${i}`,
      name,
      label: name,
      status,
      tag: status,
      tabs,
      plans: plans.filter((x) => norm(x.blockName || firstBlockName) === norm(name)),
    }
  })

  /* ---- Pricing ---- */
  p.plotPricingEyebrow = f.plotPricingEyebrow || 'PRE-LAUNCH OFFER'
  p.plotPricingHeading = splitPair((f.plotPricingHeading || []).join(' ') || 'Homes & Pricing')
  p.plotPricingDescription = f.plotPricingDescription || 'Complete, transparent pre-launch pricing for every unit at Privana — all 176 homes and 10 shops across Blocks A & B, stilt + 5 floors.'

  const icDefaults = [
    { title: 'Clear Titles', desc: 'Hassle-free ownership' },
    { title: 'Competitive Pricing', desc: 'Great value for your investment' },
    { title: 'Future Growth', desc: 'A location with lasting potential' },
  ]
  const srcIcons = f.pricingIcons?.length ? f.pricingIcons : BLANK_ICONS()
  p.plotPricingIcons = [0, 1, 2].map((i) => {
    const ic = srcIcons[i] || {}
    const title = ic.title || icDefaults[i].title
    const desc = ic.desc || icDefaults[i].desc
    return { id: `pricing-ic-${i}`, title, desc, description: desc, image: ic.image || '', icon: ic.image || '' }
  })

  // 🔑 FIX: Always ensure tabs are objects `{ id, label, name }` so the ProjectBanner's `.map` doesn't error on missing `key`
  const rawTabs = f.plotPricingTabs?.length ? f.plotPricingTabs : ['All Units', 'Studio', '1 BHK', '2 BHK', '3 BHK', 'Shops', 'Block A', 'Block B']
  p.plotPricingTabs = rawTabs.map((t) => {
    const label = typeof t === 'string' ? t : (t.label || t.name || String(t))
    return { id: label, label, name: label }
  })
  // aliases so the banner's filter bar finds the tabs whatever it calls them
  p.pricingTabs = p.plotPricingTabs
  p.filterTabs = p.plotPricingTabs
  p.priceTabs = p.plotPricingTabs
  p.plotPricingFilters = p.plotPricingTabs

  p.plotPricingCtaHeading = splitPair((f.plotPricingCtaHeading || []).join(' ') || 'A Brighter Tomorrow Awaits')
  p.plotPricingCtaText = f.plotPricingCtaText || 'Lock in pre-launch pricing at Privana today.'
  if (!f.plotPricingCtaImage) p.plotPricingCtaImage = PH('Call-to-action image')

  p.offerValidityText = f.offerValidityText || 'Pre-launch offer valid till Nov 8th 2026'

  if (!f.plotPricing?.length) {
    p.plotPricing = [{
      id: 'ph-pr1', flatNo: 'A101', type: '2 BHK + 2T', facing: 'East', floor: '1st floor', area: '1259', areaText: '1259 sq.ft', sqft: '1259',
      originalPrice: '₹75.52L', offerPriceText: '₹65.45L', isPreLaunch: true, total: 7552000, offerPrice: 6545000, finalTotal: '',
    }, {
      id: 'ph-pr2', flatNo: 'A102', type: '2 BHK + 2T', facing: 'East', floor: '1st floor', area: '1073', areaText: '1073 sq.ft', sqft: '1073',
      originalPrice: '₹64.35L', offerPriceText: '₹55.77L', isPreLaunch: true, total: 6435000, offerPrice: 5577000, finalTotal: '',
    }]
  }

  // Offer prices on/off: when off, show the normal price (no strike-through, no offer column value)
  p.offerPriceStatus = f.offerPriceStatus === 'no' ? 'no' : 'yes'
  p.showOfferPrice = p.offerPriceStatus !== 'no'
  if (p.offerPriceStatus === 'no') {
    p.plotPricing = p.plotPricing.map((u) => ({ ...u, offerPrice: 0, offerPriceText: '', finalTotal: u.total }))
  }

  /* ---- 360° tour ---- */
  // the 360° API's cover image is the tour card image; the panorama is the image that rotates
  p.tourCover = f.tourCover || f.tourThumbnail || ''
  if (f.tourCover) p.tourThumbnail = f.tourCover
  p.tourImage = f.tour360Image || f.tourImage
  if (!p.tourThumbnail && !f.tour360Image && !f.tourImage) p.tourThumbnail = PH('360° tour image')
  if (blankPair(f.tourHeading)) p.tourHeading = ['Explore in', 'immersive 360°']
  if (!f.tourDescription) p.tourDescription = 'Add a short description of the 360° tour here.'

  /* ---- Location ---- */
  if (blankPair(f.locationHeading)) p.locationHeading = ['Perfectly', 'connected']
  if (!f.locationDescription) p.locationDescription = 'Add a short description of the location here.'
  p.locationCtaLabel = f.locationCtaLabel || 'Get Directions'

  // iframe-safe URL from whatever the admin pasted (embed code, embed URL or normal link)
  const mapEmbed = mapSrcOf(f.locationMapEmbed) || mapSrcOf(f.locationMapUrl)
  const rawLink = String(f.locationMapUrl || '').trim()
  const plainLink = /^https?:\/\//i.test(rawLink) ? rawLink : ''

  // the banner may read any of these names, so set them all to the embed URL
  p.locationMapEmbed = mapEmbed
  p.locationMapSrc = mapEmbed
  p.mapEmbed = mapEmbed
  p.mapEmbedUrl = mapEmbed
  p.mapSrc = mapEmbed
  p.mapUrl = mapEmbed
  p.locationMapUrl = mapEmbed || plainLink || 'https://maps.google.com'
  p.locationDirectionsUrl = plainLink || mapEmbed || 'https://maps.google.com'

  if (!f.locationLandmarks?.length) {
    p.locationLandmarks = [
      { id: 'ph-l1', label: 'Airport', distance: '— km' },
      { id: 'ph-l2', label: 'Railway Station', distance: '— km' },
      { id: 'ph-l3', label: 'Schools', distance: '— km' },
    ]
  }

  return p
}

/* ================= form pieces ================= */
const inputCls = 'w-full rounded-xl border border-gray-200 bg-[#F7FAFD] px-3.5 py-2.5 text-[13.5px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0F3A6B] focus:bg-white focus:ring-2 focus:ring-[#0F3A6B]/15'

function Btn({ children, onClick, kind = 'solid', icon: I, className = '', ...rest }) {
  const k = {
    solid: 'text-white shadow-[0_8px_20px_-10px_rgba(15,58,107,0.7)] hover:shadow-[0_10px_24px_-10px_rgba(15,58,107,0.85)]',
    ghost: 'border border-[#D5E1ED] bg-white text-[#0F3A6B] hover:border-[#0F3A6B] hover:bg-[#F0F6FC]',
    danger: 'border border-red-100 bg-white text-red-600 hover:bg-red-50',
  }[kind]
  return (
    <button type="button" onClick={onClick} {...rest} style={kind === 'solid' ? { background: GRAD } : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition active:scale-[0.97] disabled:opacity-60 ${k} ${className}`}>
      {I && <I className="h-4 w-4" strokeWidth={2} />}{children}
    </button>
  )
}

function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[12px] font-semibold text-gray-600">{label}</span>
      {children}
      {hint && <span className="text-[11.5px] text-gray-400">{hint}</span>}
    </label>
  )
}

const Text = ({ label, hint, value, onChange, placeholder, rows, className }) => (
  <Field label={label} hint={hint} className={className}>
    {rows ? <textarea rows={rows} className={`${inputCls} resize-none`} placeholder={placeholder} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      : <input className={inputCls} placeholder={placeholder} value={value || ''} onChange={(e) => onChange(e.target.value)} />}
  </Field>
)

const Select = ({ label, value, onChange, options }) => (
  <Field label={label}><select className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)}><option value="">—</option>{options.map((o) => <option key={o}>{o}</option>)}</select></Field>
)

function Pair({ label, value, onChange, hints = ['Line 1', 'Line 2 (navy)'] }) {
  const v = value?.length ? value : ['', '']
  const up = (i, x) => { const a = [v[0] || '', v[1] || '']; a[i] = x; onChange(a) }
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-gray-600">{label}</span>
      <div className="grid grid-cols-2 gap-2.5">{[0, 1].map((i) => <input key={i} className={inputCls} placeholder={hints[i]} value={v[i] || ''} onChange={(e) => up(i, e.target.value)} />)}</div>
    </div>
  )
}

function Tags({ label, hint, value = [], onChange }) {
  const [txt, setTxt] = useState((value || []).map(t => typeof t === 'string' ? t : (t.label || t.name || '')).join(', '))
  useEffect(() => { setTxt((value || []).map(t => typeof t === 'string' ? t : (t.label || t.name || '')).join(', ')) }, [value])
  return (
    <Field label={label} hint={hint || 'Separate with commas'}>
      <input className={inputCls} value={txt} onChange={(e) => setTxt(e.target.value)} onBlur={() => onChange(txt.split(',').map((s) => s.trim()).filter(Boolean))} />
    </Field>
  )
}

function LocalFileField({ label, hint, accept, value, file, onPick, isImage = true }) {
  const inputRef = useRef(null)
  const Ico = isImage ? ImageIcon : FileText
  const pick = (e) => {
    const f = e.target.files?.[0]
    if (f) onPick(f)
    e.target.value = ''
  }
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-gray-600">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#C9D8E8] bg-[#F7FAFD] p-2.5">
        <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
          {isImage && value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <Ico className="h-5 w-5" style={{ color: NAVY }} strokeWidth={1.5} />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="truncate text-[12px] text-gray-500">{file ? file.name : value ? (isImage ? 'Current image' : 'Current file') : 'No file selected'}</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold hover:underline" style={{ color: NAVY }}>
              <Upload className="h-3.5 w-3.5" />{value || file ? 'Replace' : 'Upload'}
            </button>
            {!isImage && value && !file && (
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold hover:underline" style={{ color: NAVY }}>View current</a>
            )}
          </div>
          <input type="file" ref={inputRef} accept={accept} hidden onChange={pick} />
        </div>
      </div>
      {hint && <span className="text-[11.5px] text-gray-400">{hint}</span>}
    </div>
  )
}

function ImageField({ label, hint, value, onChange, projectId, bannerType }) {
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  const inputRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!bannerType) {
      setLocalError("Upload isn't connected for this image yet.")
      e.target.value = ''
      return
    }
    if (!projectId) {
      setLocalError('Please save the project first to generate an ID.')
      e.target.value = ''
      return
    }

    setLoading(true)
    setLocalError('')
    try {
      const formData = new FormData()
      let fieldName = 'desktop_banner'
      if (bannerType === 'mobile') fieldName = 'mobile_banner'
      if (bannerType === 'thumbnail') fieldName = 'thumbnail_image'

      formData.append(fieldName, file)

      const res = await uploadFile(`/projects/add-banners/${projectId}`, formData)

      const data = res.data || {}
      let newUrl = ''
      if (bannerType === 'desktop') newUrl = data.desktop_banner || data.desktop_banner_url
      else if (bannerType === 'mobile') newUrl = data.mobile_banner || data.mobile_banner_url
      else if (bannerType === 'thumbnail') newUrl = data.thumbnail_image || data.thumbnail_image_url

      if (!newUrl) throw new Error('Server returned success but no image URL.')
      onChange(abs(newUrl))
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  const handleRemove = async () => {
    if (!value) return
    if (!bannerType) { onChange(''); return }
    if (!projectId) { onChange(''); return }
    if (!confirm('Are you sure you want to remove this image?')) return

    setLoading(true)
    setLocalError('')
    try {
      await apiFetch(`/projects/delete-banner/${projectId}?type=${bannerType}`, { method: 'DELETE' })
      onChange('')
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-gray-600">{label}</span>
      <div className="relative flex items-center gap-3 rounded-xl border border-dashed border-[#C9D8E8] bg-[#F7FAFD] p-2.5">
        {loading && <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60"><Loader2 className="h-5 w-5 animate-spin text-[#0F3A6B]" /></div>}

        <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5" style={{ color: NAVY }} strokeWidth={1.5} />}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <input className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[12px] outline-none focus:border-[#0F3A6B]" placeholder="No image selected" value={value || ''} readOnly />

          <div className="flex items-center gap-3">
            <button type="button" disabled={loading} onClick={() => inputRef.current?.click()} className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold hover:underline disabled:opacity-50" style={{ color: NAVY }}>
              <Upload className="h-3.5 w-3.5" />{value ? 'Replace' : 'Upload'}
            </button>
            <input type="file" ref={inputRef} accept="image/*" hidden onChange={handleUpload} />

            {value && (
              <button type="button" disabled={loading} onClick={handleRemove} className="text-[12px] font-semibold text-red-500 hover:underline disabled:opacity-50">
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      {localError && <span className="text-[11.5px] text-red-500">{localError}</span>}
      {hint && <span className="text-[11.5px] text-gray-400">{hint}</span>}
    </div>
  )
}

function CardList({ items = [], onChange, fields, blank, addLabel, nameKey }) {
  const upd = (id, patch) => onChange(items.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  return (
    <div className="flex flex-col gap-3">
      {items.map((r, n) => (
        <div key={r.id} className="rounded-2xl border border-[#E4ECF4] bg-white p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <span className="truncate text-[13px] font-bold" style={{ color: NAVY }}>{(nameKey && r[nameKey]) || `Item ${n + 1}`}</span>
            <button type="button" aria-label="Remove item" onClick={() => onChange(items.filter((x) => x.id !== r.id))} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" strokeWidth={1.8} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => {
              const wrap = f.full || f.type === 'image' || f.type === 'area' || f.type === 'tags' ? 'col-span-2' : ''
              const p = { label: f.label, value: r[f.key], placeholder: f.placeholder, className: wrap, onChange: (v) => upd(r.id, { [f.key]: v }) }
              if (f.type === 'image') return <div key={f.key} className="col-span-2"><ImageField {...p} /></div>
              if (f.type === 'select') return <Select key={f.key} {...p} options={f.options} />
              if (f.type === 'tags') return <div key={f.key} className="col-span-2"><Tags {...p} /></div>
              return <Text key={f.key} {...p} rows={f.type === 'area' ? 3 : 0} />
            })}
          </div>
        </div>
      ))}
      <div><Btn kind="ghost" icon={Plus} onClick={() => onChange([...items, { ...blank, id: uid() }])}>{addLabel}</Btn></div>
    </div>
  )
}

function AmenityIconRow({ item, onChange, onRemove }) {
  const ref = useRef(null)
  const localBlobRef = useRef(null)

  const pick = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (localBlobRef.current) URL.revokeObjectURL(localBlobRef.current)
    const url = URL.createObjectURL(f)
    localBlobRef.current = url
    onChange({ icon: url, iconFile: f })
    e.target.value = ''
  }

  useEffect(() => () => {
    if (localBlobRef.current) URL.revokeObjectURL(localBlobRef.current)
  }, [])

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E4ECF4] bg-white p-3">
      <button type="button" onClick={() => ref.current?.click()} aria-label="Upload icon" className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#C9D8E8]" style={{ backgroundColor: BLUE }}>
        {item.icon ? <img src={item.icon} alt="" className="h-full w-full object-contain p-1.5" /> : <Upload className="h-4 w-4" style={{ color: NAVY }} />}
      </button>
      <input type="file" ref={ref} accept="image/*" hidden onChange={pick} />
      <input className={inputCls} placeholder="Amenity name" value={item.name} onChange={(e) => onChange({ name: e.target.value })} />
      <button type="button" aria-label="Remove amenity" onClick={onRemove} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" strokeWidth={1.8} /></button>
    </div>
  )
}

function SlideForm({ mode = 'add', initial, onSubmit, onCancel }) {
  const isEdit = mode === 'edit'
  const [d, setD] = useState({
    tag: initial?.tagline || '',
    title: initial?.title || '',
    description: initial?.description || '',
    tags: (initial?.tags || []).join(', '),
  })
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const ref = useRef(null)
  const filesRef = useRef([])
  filesRef.current = files

  useEffect(() => () => { filesRef.current.forEach((f) => URL.revokeObjectURL(f.url)) }, [])

  const pick = (e) => {
    const picked = Array.from(e.target.files || []).map((file) => ({ file, url: URL.createObjectURL(file) }))
    setFiles((f) => [...f, ...picked]); setErr(''); e.target.value = ''
  }
  const dropFile = (i) => setFiles((all) => { URL.revokeObjectURL(all[i].url); return all.filter((_, x) => x !== i) })

  const submit = async () => {
    if (busy) return
    if (!d.title.trim()) return setErr('Enter a title for the slide.')
    if (!isEdit && !files.length) return setErr('Add at least one image.')
    setBusy(true); setErr('')
    const r = await onSubmit({
      tag: d.tag.trim(),
      title: d.title.trim(),
      description: d.description.trim(),
      tags: d.tags.split(',').map((x) => x.trim()).filter(Boolean),
      files: files.map((f) => f.file),
    })
    setBusy(false)
    if (r?.error) return setErr(r.error)
    files.forEach((f) => URL.revokeObjectURL(f.url))
    setFiles([])
    if (isEdit) onCancel?.()
    else setD({ tag: '', title: '', description: '', tags: '' })
  }

  const existing = initial?.images || []

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4ECF4] bg-[#FBFDFE] p-3.5">
      <span className="text-[13px] font-bold" style={{ color: NAVY }}>{isEdit ? 'Edit slide' : 'Add a new slide'}</span>
      <Text label="Small label" value={d.tag} onChange={(v) => setD({ ...d, tag: v })} placeholder="GATHER & CELEBRATE" />
      <Text label="Title" value={d.title} onChange={(v) => setD({ ...d, title: v })} placeholder="Club House" />
      <Text label="Description" rows={3} value={d.description} onChange={(v) => setD({ ...d, description: v })} />
      <Text label="Tags" hint="Separate with commas" value={d.tags} onChange={(v) => setD({ ...d, tags: v })} placeholder="Events, Community, Social" />

      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-gray-600">{isEdit ? 'Replace images (optional)' : 'Images'}</span>

        {isEdit && existing.length > 0 && !files.length && (
          <div className="flex flex-col gap-1.5">
            <div className="grid grid-cols-4 gap-2">
              {existing.map((u, i) => (
                <div key={`${u}-${i}`} className="aspect-square overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
                  <img src={u} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-[11.5px] text-gray-400">Current images. Leave as is to keep them.</span>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {files.map((f, i) => (
            <div key={f.url} className="relative aspect-square overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
              <img src={f.url} alt="" className="h-full w-full object-cover" />
              <button type="button" aria-label="Remove image" onClick={() => dropFile(i)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-red-500"><X className="h-3 w-3" /></button>
            </div>
          ))}
          <button type="button" onClick={() => ref.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#C9D8E8] bg-[#F7FAFD] text-[11px] font-semibold" style={{ color: NAVY }}><Upload className="h-4 w-4" />{isEdit ? 'Upload new' : 'Add'}</button>
        </div>
        {isEdit && files.length > 0 && (
          <span className="text-[11.5px] text-amber-600">Saving will delete the old images and use only these new ones.</span>
        )}
        <input type="file" ref={ref} accept="image/*" multiple hidden onChange={pick} />
      </div>

      {err && <p role="alert" className="m-0 text-[12px] text-red-600">{err}</p>}
      <div className="flex items-center gap-2">
        <Btn icon={busy ? undefined : (isEdit ? Check : Plus)} disabled={busy} onClick={submit}>
          {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />{isEdit ? 'Saving…' : 'Adding…'}</> : (isEdit ? 'Save slide' : 'Add slide')}
        </Btn>
        {isEdit && <Btn kind="ghost" icon={X} disabled={busy} onClick={onCancel}>Cancel</Btn>}
      </div>
    </div>
  )
}

function SlideRow({ slide, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [err, setErr] = useState('')

  const remove = async () => {
    if (deleting) return
    if (!confirm(`Delete the slide “${slide.title || 'Untitled slide'}”? This can’t be undone.`)) return
    setDeleting(true); setErr('')
    const r = await onDelete(slide.id)
    if (r?.error) { setErr(r.error); setDeleting(false) }
  }

  if (editing) {
    return <SlideForm mode="edit" initial={slide} onSubmit={(draft) => onUpdate(slide.id, draft)} onCancel={() => setEditing(false)} />
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative flex items-center gap-3 rounded-2xl border border-[#E4ECF4] bg-white p-3">
        {deleting && <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60"><Loader2 className="h-5 w-5 animate-spin text-[#0F3A6B]" /></div>}
        <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
          {slide.image ? <img src={slide.image} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4" style={{ color: NAVY }} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-[13px] font-bold" style={{ color: NAVY }}>{slide.title || 'Untitled slide'}</p>
          <p className="m-0 truncate text-[11.5px] text-gray-400">{[slide.tagline, `${slide.images?.length || 0} image${(slide.images?.length || 0) === 1 ? '' : 's'}`].filter(Boolean).join(' · ')}</p>
        </div>
        <button type="button" aria-label="Edit slide" disabled={deleting} onClick={() => setEditing(true)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#F0F6FC] hover:text-[#0F3A6B] disabled:opacity-50"><Pencil className="h-4 w-4" strokeWidth={1.8} /></button>
        <button type="button" aria-label="Delete slide" disabled={deleting} onClick={remove} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"><Trash2 className="h-4 w-4" strokeWidth={1.8} /></button>
      </div>
      {err && <p role="alert" className="m-0 px-1 text-[11.5px] text-red-600">{err}</p>}
    </div>
  )
}

/* ---------- GALLERY: image row + inline edit ---------- */
function GalleryImageRow({ image, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(image.title || '')
  const [newFile, setNewFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [err, setErr] = useState('')
  const ref = useRef(null)

  useEffect(() => { setTitle(image.title || '') }, [image.title])

  const pick = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (preview) URL.revokeObjectURL(preview)
    const url = URL.createObjectURL(f)
    setPreview(url)
    setNewFile(f)
    e.target.value = ''
  }

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const save = async () => {
    if (busy) return
    setBusy(true); setErr('')
    const r = await onUpdate(image.id, { title: title.trim(), file: newFile })
    setBusy(false)
    if (r?.error) return setErr(r.error)
    setNewFile(null)
    if (preview) { URL.revokeObjectURL(preview); setPreview(null) }
    setEditing(false)
  }

  const remove = async () => {
    if (deleting) return
    if (!confirm(`Delete this gallery image${image.title ? ` — “${image.title}”` : ''}?`)) return
    setDeleting(true); setErr('')
    const r = await onDelete(image.id)
    if (r?.error) { setErr(r.error); setDeleting(false) }
  }

  const imgSrc = preview || image.image

  if (!editing) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative flex items-center gap-3 rounded-2xl border border-[#E4ECF4] bg-white p-3">
          {deleting && <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60"><Loader2 className="h-5 w-5 animate-spin text-[#0F3A6B]" /></div>}
          <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
            {image.image ? <img src={image.image} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4" style={{ color: NAVY }} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-[13px] font-bold" style={{ color: NAVY }}>{image.title || 'Untitled photo'}</p>
            <p className="m-0 truncate text-[11.5px] text-gray-400">#{image.id}</p>
          </div>
          <button type="button" aria-label="Edit image" disabled={deleting} onClick={() => setEditing(true)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#F0F6FC] hover:text-[#0F3A6B] disabled:opacity-50"><Pencil className="h-4 w-4" strokeWidth={1.8} /></button>
          <button type="button" aria-label="Delete image" disabled={deleting} onClick={remove} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"><Trash2 className="h-4 w-4" strokeWidth={1.8} /></button>
        </div>
        {err && <p role="alert" className="m-0 px-1 text-[11.5px] text-red-600">{err}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4ECF4] bg-[#FBFDFE] p-3.5">
      <span className="text-[13px] font-bold" style={{ color: NAVY }}>Edit image #{image.id}</span>
      <Text label="Image title" value={title} onChange={setTitle} placeholder="Privana — Main Entrance" />
      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-gray-600">Replace image (optional)</span>
        <div className="grid grid-cols-2 gap-2">
          {imgSrc && (
            <div className="aspect-video overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
              <img src={imgSrc} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <button type="button" onClick={() => ref.current?.click()} className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#C9D8E8] bg-[#F7FAFD] text-[11px] font-semibold" style={{ color: NAVY }}>
            <Upload className="h-4 w-4" />Upload new
          </button>
        </div>
        <input type="file" ref={ref} accept="image/*" hidden onChange={pick} />
        {newFile && <span className="text-[11.5px] text-amber-600">Saving will replace the current image with “{newFile.name}”.</span>}
      </div>
      {err && <p role="alert" className="m-0 text-[12px] text-red-600">{err}</p>}
      <div className="flex items-center gap-2">
        <Btn icon={busy ? undefined : Check} disabled={busy} onClick={save}>
          {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Saving…</> : 'Save image'}
        </Btn>
        <Btn kind="ghost" icon={X} disabled={busy} onClick={() => setEditing(false)}>Cancel</Btn>
      </div>
    </div>
  )
}

function AddGalleryImages({ onAdd }) {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const ref = useRef(null)
  const filesRef = useRef([])
  filesRef.current = files

  useEffect(() => () => { filesRef.current.forEach((f) => URL.revokeObjectURL(f.url)) }, [])

  const pick = (e) => {
    const picked = Array.from(e.target.files || []).map((file) => ({ file, url: URL.createObjectURL(file), title: '' }))
    setFiles((f) => [...f, ...picked]); setErr(''); e.target.value = ''
  }
  const drop = (i) => setFiles((all) => { URL.revokeObjectURL(all[i].url); return all.filter((_, x) => x !== i) })
  const setTitle = (i, v) => setFiles((all) => all.map((f, x) => (x === i ? { ...f, title: v } : f)))

  const submit = async () => {
    if (busy) return
    if (!files.length) return setErr('Add at least one photo.')
    setBusy(true); setErr('')
    const r = await onAdd({
      titles: files.map((f) => f.title.trim()),
      files: files.map((f) => f.file),
    })
    setBusy(false)
    if (r?.error) return setErr(r.error)
    files.forEach((f) => URL.revokeObjectURL(f.url))
    setFiles([])
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4ECF4] bg-[#FBFDFE] p-3.5">
      <span className="text-[13px] font-bold" style={{ color: NAVY }}>Add photos</span>
      <p className="m-0 text-[11.5px] text-gray-400">Titles are optional. They line up with photos in the same order.</p>
      <div className="grid grid-cols-2 gap-2">
        {files.map((f, i) => (
          <div key={f.url} className="flex flex-col gap-1.5">
            <div className="relative aspect-video overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
              <img src={f.url} alt="" className="h-full w-full object-cover" />
              <button type="button" aria-label="Remove image" onClick={() => drop(i)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-red-500"><X className="h-3 w-3" /></button>
            </div>
            <input className={inputCls} placeholder={`Title for photo ${i + 1}`} value={f.title} onChange={(e) => setTitle(i, e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={() => ref.current?.click()} className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#C9D8E8] bg-[#F7FAFD] text-[11px] font-semibold" style={{ color: NAVY }}>
          <Upload className="h-4 w-4" />Add photos
        </button>
      </div>
      <input type="file" ref={ref} accept="image/*" multiple hidden onChange={pick} />
      {err && <p role="alert" className="m-0 text-[12px] text-red-600">{err}</p>}
      <div>
        <Btn icon={busy ? undefined : Plus} disabled={busy} onClick={submit}>
          {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Uploading…</> : 'Upload photos'}
        </Btn>
      </div>
    </div>
  )
}

/* ---------- FLOOR PLANS: add layout + row ---------- */
function FloorPlanAddForm({ blocks = [], unitTypes = [], onAdd }) {
  const [d, setD] = useState({ title: '', block_name: '', unit_type: '', facing: '', area: '', description: '' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const ref = useRef(null)

  // Extract block names from the blocks array or fallback to empty
  const blockOptions = blocks.map(b => typeof b === 'string' ? b : b.name || b.label).filter(Boolean)

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const pick = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (preview) URL.revokeObjectURL(preview)
    const url = URL.createObjectURL(f)
    setPreview(url); setFile(f)
    e.target.value = ''
  }

  const submit = async () => {
    if (busy) return
    if (!d.title.trim()) return setErr('Enter a title.')
    if (!d.unit_type.trim()) return setErr('Choose a unit type.')
    setBusy(true); setErr('')
    const r = await onAdd({
      title: d.title.trim(),
      block_name: d.block_name.trim() || blockOptions[0] || '',
      unit_type: d.unit_type.trim(),
      facing: d.facing.trim(),
      area: d.area.trim(),
      description: d.description.trim(),
      file,
    })
    setBusy(false)
    if (r?.error) return setErr(r.error)
    setD({ title: '', block_name: '', unit_type: '', facing: '', area: '', description: '' })
    setFile(null)
    if (preview) { URL.revokeObjectURL(preview); setPreview(null) }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4ECF4] bg-[#FBFDFE] p-3.5">
      <span className="text-[13px] font-bold" style={{ color: NAVY }}>Add layout</span>
      <Text label="Title" value={d.title} onChange={(v) => setD({ ...d, title: v })} placeholder="Unit A105" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Block" hint={blockOptions.length ? undefined : 'No blocks saved yet. Type a name, e.g. Block A'}>
          <input
            className={inputCls}
            list="floorplan-block-options"
            placeholder="Block A"
            value={d.block_name}
            onChange={(e) => setD({ ...d, block_name: e.target.value })}
          />
          <datalist id="floorplan-block-options">
            {blockOptions.map((b) => <option key={b} value={b} />)}
          </datalist>
        </Field>
        <Select label="Unit type" value={d.unit_type} onChange={(v) => setD({ ...d, unit_type: v })} options={unitTypes.length ? unitTypes : TYPES} />
        <Select label="Facing" value={d.facing} onChange={(v) => setD({ ...d, facing: v })} options={FACINGS} />
        <Text label="Area" value={d.area} onChange={(v) => setD({ ...d, area: v })} placeholder="469 Sq.ft" />
      </div>
      <Text label="Description" rows={3} value={d.description} onChange={(v) => setD({ ...d, description: v })} />
      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-gray-600">Plan image</span>
        <div className="grid grid-cols-2 gap-2">
          {preview && (
            <div className="aspect-video overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
              <img src={preview} alt="" className="h-full w-full object-contain" />
            </div>
          )}
          <button type="button" onClick={() => ref.current?.click()} className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#C9D8E8] bg-[#F7FAFD] text-[11px] font-semibold" style={{ color: NAVY }}>
            <Upload className="h-4 w-4" />{preview ? 'Replace image' : 'Upload image'}
          </button>
        </div>
        <input type="file" ref={ref} accept="image/*" hidden onChange={pick} />
      </div>
      {err && <p role="alert" className="m-0 text-[12px] text-red-600">{err}</p>}
      <div>
        <Btn icon={busy ? undefined : Plus} disabled={busy} onClick={submit}>
          {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Adding…</> : 'Add layout'}
        </Btn>
      </div>
    </div>
  )
}

function FloorPlanRow({ plan, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const [err, setErr] = useState('')

  const remove = async () => {
    if (deleting) return
    if (!confirm(`Delete layout “${plan.title || 'Untitled'}”?`)) return
    setDeleting(true); setErr('')
    const r = await onDelete(plan.id)
    if (r?.error) { setErr(r.error); setDeleting(false) }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative flex items-center gap-3 rounded-2xl border border-[#E4ECF4] bg-white p-3">
        {deleting && <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60"><Loader2 className="h-5 w-5 animate-spin text-[#0F3A6B]" /></div>}
        <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
          {plan.image ? <img src={plan.image} alt="" className="h-full w-full object-contain p-1" /> : <LayoutGrid className="h-4 w-4" style={{ color: NAVY }} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-[13px] font-bold" style={{ color: NAVY }}>{plan.title || 'Untitled layout'}</p>
          <p className="m-0 truncate text-[11.5px] text-gray-400">
            {[plan.blockName, plan.type, plan.facing, plan.area].filter(Boolean).join(' · ') || `#${plan.id}`}
          </p>
        </div>
        <button type="button" aria-label="Delete layout" disabled={deleting} onClick={remove} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"><Trash2 className="h-4 w-4" strokeWidth={1.8} /></button>
      </div>
      {err && <p role="alert" className="m-0 px-1 text-[11.5px] text-red-600">{err}</p>}
    </div>
  )
}

/* ---------- PRICING: add unit + row ---------- */
const BLANK_UNIT = { flat_no: '', floor: '', type: '', facing: '', area: '', original_price: '', offer_price: '', is_pre_launch: true }

function PricingAddForm({ onAdd }) {
  const [d, setD] = useState(BLANK_UNIT)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const up = (patch) => setD((x) => ({ ...x, ...patch }))

  const submit = async () => {
    if (busy) return
    if (!d.flat_no.trim()) return setErr('Enter the flat number.')
    if (!d.type.trim()) return setErr('Enter the unit type.')
    if (!d.original_price.trim()) return setErr('Enter the original price.')
    setBusy(true); setErr('')
    const r = await onAdd({
      flat_no: d.flat_no.trim(),
      floor: d.floor.trim(),
      type: d.type.trim(),
      facing: d.facing.trim(),
      area: d.area.trim(),
      original_price: d.original_price.trim(),
      offer_price: d.offer_price.trim(),
      is_pre_launch: d.is_pre_launch ? 1 : 0,
    })
    setBusy(false)
    if (r?.error) return setErr(r.error)
    setD(BLANK_UNIT)
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4ECF4] bg-[#FBFDFE] p-3.5">
      <span className="text-[13px] font-bold" style={{ color: NAVY }}>Add unit</span>
      <div className="grid grid-cols-2 gap-3">
        <Text label="Flat no." value={d.flat_no} onChange={(v) => up({ flat_no: v })} placeholder="A101" />
        <Text label="Floor" value={d.floor} onChange={(v) => up({ floor: v })} placeholder="1st floor" />
        <Field label="Type">
          <input className={inputCls} list="pricing-type-options" placeholder="2 BHK + 2T" value={d.type} onChange={(e) => up({ type: e.target.value })} />
          <datalist id="pricing-type-options">{['Studio', '1 BHK + 1T', '2 BHK + 1T', '2 BHK + 2T', '3 BHK', 'Shop'].map((t) => <option key={t} value={t} />)}</datalist>
        </Field>
        <Select label="Facing" value={d.facing} onChange={(v) => up({ facing: v })} options={FACINGS} />
        <Text label="Area" value={d.area} onChange={(v) => up({ area: v })} placeholder="1259 sq.ft" />
        <Text label="Original price" value={d.original_price} onChange={(v) => up({ original_price: v })} placeholder="₹75.52L" />
        <Text label="Offer price" value={d.offer_price} onChange={(v) => up({ offer_price: v })} placeholder="₹65.45L" className="col-span-2" />
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-gray-600">
        <input type="checkbox" checked={d.is_pre_launch} onChange={(e) => up({ is_pre_launch: e.target.checked })} className="h-4 w-4 accent-[#0F3A6B]" />
        Pre-launch offer (shows the “PRE-LAUNCH OFFER” tag)
      </label>
      {err && <p role="alert" className="m-0 text-[12px] text-red-600">{err}</p>}
      <div>
        <Btn icon={busy ? undefined : Plus} disabled={busy} onClick={submit}>
          {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Adding…</> : 'Add unit'}
        </Btn>
      </div>
    </div>
  )
}

/* Offer prices on/off: POST /projects/pricing/offer-status/{id}  (form-data: offer_price_status = yes | no) */
function OfferStatusToggle({ value, onChange, compact = false }) {
  const on = value !== 'no'
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const flip = async () => {
    if (busy) return
    setBusy(true); setErr('')
    const r = await onChange(on ? 'no' : 'yes')
    setBusy(false)
    if (r?.error) setErr(r.error)
  }

  // compact pill used on the page preview, next to the filter tabs
  if (compact) {
    return (
      <div className={`${figtree.className} flex shrink-0 items-center gap-2 rounded-full border border-[#E4ECF4] bg-white py-1.5 pl-4 pr-2`} title={err || undefined}>
        <span className="text-[12.5px] font-semibold text-[#1f2029]">Offer prices</span>
        <span className={`text-[11px] font-bold ${on ? 'text-emerald-600' : 'text-gray-400'}`}>{err ? 'ERROR' : on ? 'ON' : 'OFF'}</span>
        <button type="button" role="switch" aria-checked={on} aria-label="Show offer prices" disabled={busy} onClick={flip}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-60 ${on ? '' : 'bg-gray-300'}`}
          style={on ? { background: GRAD } : undefined}>
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-[#E4ECF4] bg-white p-3.5">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="m-0 text-[13px] font-bold" style={{ color: NAVY }}>Show offer prices</p>
          <p className="m-0 text-[11.5px] text-gray-400">{on ? 'Offer prices are shown on the page.' : 'Offer prices are hidden. Only the original price shows.'} Saved instantly.</p>
        </div>
        <button type="button" role="switch" aria-checked={on} aria-label="Show offer prices" disabled={busy} onClick={flip}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-60 ${on ? '' : 'bg-gray-300'}`}
          style={on ? { background: GRAD } : undefined}>
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          {busy && <Loader2 className="absolute -left-6 h-4 w-4 animate-spin text-[#0F3A6B]" />}
        </button>
      </div>
      {err && <p role="alert" className="m-0 text-[11.5px] text-red-600">{err}</p>}
    </div>
  )
}

/* Bulk upload: POST /projects/pricing/bulk-upload/{id}  (form-data: file = .xlsx) */
function PricingBulkUpload({ onUpload }) {
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const ref = useRef(null)

  const pick = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f); setErr(''); setOk('')
    e.target.value = ''
  }

  const submit = async () => {
    if (busy) return
    if (!file) return setErr('Choose an Excel file first.')
    setBusy(true); setErr(''); setOk('')
    const r = await onUpload(file)
    setBusy(false)
    if (r?.error) return setErr(r.error)
    setOk(r?.message || 'Pricing data uploaded.')
    setFile(null)
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4ECF4] bg-[#FBFDFE] p-3.5">
      <span className="text-[13px] font-bold" style={{ color: NAVY }}>Bulk upload from Excel</span>
      <p className="m-0 text-[11.5px] text-gray-400">Upload a .xlsx price list to add many units at once. The unit list refreshes when it finishes.</p>
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#C9D8E8] bg-[#F7FAFD] p-2.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: BLUE }}>
          <FileText className="h-5 w-5" style={{ color: NAVY }} strokeWidth={1.5} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-[12px] text-gray-500">{file ? file.name : 'No file selected'}</span>
          <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[12px] font-semibold hover:underline disabled:opacity-50" style={{ color: NAVY }}>
            <Upload className="h-3.5 w-3.5" />{file ? 'Replace file' : 'Choose file'}
          </button>
          <input type="file" ref={ref} accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" hidden onChange={pick} />
        </div>
      </div>
      {err && <p role="alert" className="m-0 text-[12px] text-red-600">{err}</p>}
      {ok && <p role="status" className="m-0 text-[12px] text-emerald-700">{ok}</p>}
      <div>
        <Btn icon={busy ? undefined : Upload} disabled={busy || !file} onClick={submit}>
          {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Uploading…</> : 'Upload price list'}
        </Btn>
      </div>
    </div>
  )
}

/* Filter tab bar shown above the pricing table in the preview */
function PricingTabBar({ tabs, active, onChange }) {
  return (
    <div className={`${figtree.className} flex w-fit max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-[#E4ECF4] bg-white p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
      {tabs.map((t) => {
        const on = t === active
        return (
          <button key={t} type="button" onClick={() => onChange(t)} style={on ? { background: GRAD } : undefined}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition ${on ? 'text-white shadow-[0_8px_20px_-10px_rgba(15,58,107,0.7)]' : 'text-[#1f2029] hover:bg-[#F0F6FC]'}`}>
            {t}
          </button>
        )
      })}
    </div>
  )
}

/* Units list with the same filter tabs as the page */
function PricingUnitList({ units, tabs = [], onDelete }) {
  const all = ['All Units', ...tabs.map(t => typeof t === 'string' ? t : (t.label || t.name || '')).filter((t) => String(t).trim().toLowerCase() !== 'all units')]
  const [active, setActive] = useState('All Units')
  const current = all.includes(active) ? active : 'All Units'
  const shown = units.filter((u) => matchesTab(u, current))
  const count = (t) => units.filter((u) => matchesTab(u, t)).length

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-1.5">
        {all.map((t) => {
          const on = t === current
          return (
            <button key={t} type="button" onClick={() => setActive(t)} style={on ? { background: GRAD } : undefined}
              className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${on ? 'border-transparent text-white' : 'border-[#D5E1ED] bg-white text-[#0F3A6B] hover:bg-[#F0F6FC]'}`}>
              {t} <span className={on ? 'opacity-80' : 'text-gray-400'}>({count(t)})</span>
            </button>
          )
        })}
      </div>
      <p className="m-0 text-[11.5px] text-gray-400">Showing {shown.length} of {units.length} units</p>
      {shown.length === 0 ? (
        <p className="m-0 rounded-xl bg-[#F0F6FC] px-3.5 py-2.5 text-[12.5px]" style={{ color: INK }}>No units under “{current}”.</p>
      ) : (
        shown.map((u) => <PricingRow key={u.id} unit={u} onDelete={onDelete} />)
      )}
    </div>
  )
}

function PricingRow({ unit, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const [err, setErr] = useState('')

  const remove = async () => {
    if (deleting) return
    if (!confirm(`Delete unit “${unit.flatNo || 'Untitled'}”?`)) return
    setDeleting(true); setErr('')
    const r = await onDelete(unit.id)
    if (r?.error) { setErr(r.error); setDeleting(false) }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative flex items-center gap-3 rounded-2xl border border-[#E4ECF4] bg-white p-3">
        {deleting && <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60"><Loader2 className="h-5 w-5 animate-spin text-[#0F3A6B]" /></div>}
        <div className="flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-lg text-[12px] font-bold" style={{ backgroundColor: BLUE, color: NAVY }}>
          {unit.flatNo || '—'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-[13px] font-bold" style={{ color: NAVY }}>
            {[unit.type, unit.floor].filter(Boolean).join(' · ') || 'Untitled unit'}
          </p>
          <p className="m-0 truncate text-[11.5px] text-gray-400">
            {[unit.facing, unit.areaText || unit.area, unit.originalPrice && `${unit.originalPrice}${unit.offerPriceText ? ` → ${unit.offerPriceText}` : ''}`, unit.isPreLaunch && 'Pre-launch'].filter(Boolean).join(' · ') || `#${unit.id}`}
          </p>
        </div>
        <button type="button" aria-label="Delete unit" disabled={deleting} onClick={remove} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"><Trash2 className="h-4 w-4" strokeWidth={1.8} /></button>
      </div>
      {err && <p role="alert" className="m-0 px-1 text-[11.5px] text-red-600">{err}</p>}
    </div>
  )
}

/* 360° image: instant Replace / Remove when saved on the server, local pick when not saved yet */
function TourImageField({ label, hint, value, file, onPick, onReplaceNow, onRemoveNow }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const saved = !!value && !file

  const choose = async (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setErr('')
    if (saved) {
      setBusy(true)
      const r = await onReplaceNow(f)
      setBusy(false)
      if (r?.error) setErr(r.error)
    } else {
      onPick(f)
    }
  }

  const remove = async () => {
    if (!confirm('Delete this image from the server?')) return
    setBusy(true); setErr('')
    const r = await onRemoveNow()
    setBusy(false)
    if (r?.error) setErr(r.error)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-gray-600">{label}</span>
      <div className="relative flex items-center gap-3 rounded-xl border border-dashed border-[#C9D8E8] bg-[#F7FAFD] p-2.5">
        {busy && <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60"><Loader2 className="h-5 w-5 animate-spin text-[#0F3A6B]" /></div>}
        <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: BLUE }}>
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5" style={{ color: NAVY }} strokeWidth={1.5} />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="truncate text-[12px] text-gray-500">
            {saved ? 'Saved on the server' : file ? `Selected: ${file.name}` : 'No image yet'}
          </span>
          <div className="flex items-center gap-3">
            <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold hover:underline disabled:opacity-50" style={{ color: NAVY }}>
              <Upload className="h-3.5 w-3.5" />{saved ? 'Replace' : file ? 'Change' : 'Upload'}
            </button>
            {saved && <button type="button" disabled={busy} onClick={remove} className="text-[12px] font-semibold text-red-500 hover:underline disabled:opacity-50">Remove</button>}
            {!saved && file && <button type="button" onClick={() => onPick(null)} className="text-[12px] font-semibold text-red-500 hover:underline">Clear</button>}
          </div>
          <input type="file" ref={ref} accept="image/*" hidden onChange={choose} />
        </div>
      </div>
      {err && <span className="text-[11.5px] text-red-500">{err}</span>}
      <span className="text-[11.5px] text-gray-400">
        {hint}{saved ? ' Replace and Remove are saved instantly.' : file ? ' Saved when you click Save 360° tour.' : ''}
      </span>
    </div>
  )
}

/* Landmark row with instant edit/delete for saved items */
function LandmarkRow({ item, index, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [d, setD] = useState({ location: item.label, time: item.distance })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const save = async () => {
    if (!d.location.trim()) return setErr('Location is required.')
    setBusy(true); setErr('')
    const r = await onEdit(index, { location: d.location.trim(), time: d.time.trim() })
    setBusy(false)
    if (r?.error) return setErr(r.error)
    setEditing(false)
  }

  const remove = async () => {
    if (!confirm(`Delete "${item.label}"?`)) return
    setBusy(true); setErr('')
    const r = await onDelete(index)
    setBusy(false)
    if (r?.error) setErr(r.error)
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E4ECF4] bg-[#FBFDFE] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold" style={{ color: NAVY }}>Edit location #{index + 1}</span>
          <button type="button" onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
        </div>
        <Text label="Location" value={d.location} onChange={(v) => setD({ ...d, location: v })} placeholder="Guduvancheri (GST Road)" />
        <Text label="Distance / Time" value={d.time} onChange={(v) => setD({ ...d, time: v })} placeholder="5 mins" />
        {err && <p role="alert" className="m-0 text-[11.5px] text-red-600">{err}</p>}
        <div className="flex gap-2">
          <Btn icon={busy ? undefined : Check} disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</Btn>
          <Btn kind="ghost" disabled={busy} onClick={() => setEditing(false)}>Cancel</Btn>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3 rounded-2xl border border-[#E4ECF4] bg-white p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold" style={{ backgroundColor: BLUE, color: NAVY }}>{index + 1}</div>
        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-[13px] font-bold" style={{ color: NAVY }}>{item.label}</p>
          <p className="m-0 truncate text-[11.5px] text-gray-400">{item.distance}</p>
        </div>
        <button type="button" aria-label="Edit" onClick={() => setEditing(true)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#F0F6FC] hover:text-[#0F3A6B]"><Pencil className="h-4 w-4" strokeWidth={1.8} /></button>
        <button type="button" aria-label="Delete" onClick={remove} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" strokeWidth={1.8} /></button>
      </div>
      {err && <p role="alert" className="m-0 px-1 text-[11.5px] text-red-600">{err}</p>}
    </div>
  )
}

/* Add location (appends to the end) */
function AddLandmarkForm({ onAdd }) {
  const [d, setD] = useState({ location: '', time: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (!d.location.trim()) return setErr('Location is required.')
    setBusy(true); setErr('')
    const r = await onAdd({ location: d.location.trim(), time: d.time.trim() })
    setBusy(false)
    if (r?.error) return setErr(r.error)
    setD({ location: '', time: '' })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4ECF4] bg-[#FBFDFE] p-3.5">
      <span className="text-[13px] font-bold" style={{ color: NAVY }}>Add location</span>
      <div className="grid grid-cols-2 gap-3">
        <Text label="Location" value={d.location} onChange={(v) => setD({ ...d, location: v })} placeholder="Guduvancheri" />
        <Text label="Distance / Time" value={d.time} onChange={(v) => setD({ ...d, time: v })} placeholder="5 mins" />
      </div>
      {err && <p role="alert" className="m-0 text-[11.5px] text-red-600">{err}</p>}
      <div>
        <Btn icon={busy ? undefined : Plus} disabled={busy} onClick={submit}>
          {busy ? 'Adding…' : 'Add location'}
        </Btn>
      </div>
    </div>
  )
}

/* ---------- COUNTDOWN: live preview + top strip + panel ---------- */
// shared ticking clock (updates every second)
function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

// Live "time left" preview, same boxes as the public project card
function CountdownPreview({ value, active }) {
  const now = useNow()

  const end = value ? new Date(value).getTime() : NaN
  if (Number.isNaN(end)) return null
  const diff = Math.max(0, end - now)
  const cells = [
    { v: Math.floor(diff / 86400000), l: 'DAYS' },
    { v: Math.floor((diff / 3600000) % 24), l: 'HRS' },
    { v: Math.floor((diff / 60000) % 60), l: 'MIN' },
    { v: Math.floor((diff / 1000) % 60), l: 'SEC' },
  ]
  const label = new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold tracking-[0.14em]" style={{ color: '#475569' }}>TIME LEFT FOR PROJECT COMPLETION</span>
        <span className="text-[11px] font-bold tracking-[0.12em]" style={{ color: NAVY }}>{label}</span>
      </div>
      <div className={`grid grid-cols-4 overflow-hidden rounded-xl transition ${active ? '' : 'opacity-40'}`} style={{ backgroundColor: BLUE, boxShadow: 'inset 0 0 0 1px rgba(15,58,107,0.10)' }}>
        {cells.map(({ v, l }) => (
          <div key={l} className="flex flex-col items-center py-3">
            <span className="text-[20px] font-bold tabular-nums" style={{ color: NAVY }}>{v}</span>
            <span className="mt-0.5 text-[9px] font-semibold tracking-[0.12em]" style={{ color: '#475569' }}>{l}</span>
          </div>
        ))}
      </div>
      {!active && <p className="m-0 text-[11.5px] text-gray-400">Countdown is off, so the website shows the RERA box instead.</p>}
    </div>
  )
}

// Full-width countdown section shown at the very top of the project (above the banner)
function CountdownStrip({ form, onEdit }) {
  const now = useNow()
  const end = form.countdownDate ? new Date(form.countdownDate).getTime() : NaN
  const hasDate = !Number.isNaN(end)
  const on = form.countdownActive !== false

  // nothing set yet: show an "add" prompt
  if (!hasDate) {
    return (
      <div data-sec="countdown" className={`${figtree.className} border-b border-[#E4ECF4] bg-[#F7FAFD]`}>
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: BLUE }}><Timer className="h-5 w-5" style={{ color: NAVY }} strokeWidth={1.7} /></span>
            <div>
              <p className="m-0 text-[14px] font-bold" style={{ color: NAVY }}>No countdown yet</p>
              <p className="m-0 text-[12px] text-gray-500">Add a completion date to show “Time left for project completion”.</p>
            </div>
          </div>
          <EditButton label="countdown" onClick={onEdit} />
        </div>
      </div>
    )
  }

  const diff = Math.max(0, end - now)
  const done = diff === 0
  const cells = [
    { v: Math.floor(diff / 86400000), l: 'DAYS' },
    { v: Math.floor((diff / 3600000) % 24), l: 'HRS' },
    { v: Math.floor((diff / 60000) % 60), l: 'MIN' },
    { v: Math.floor((diff / 1000) % 60), l: 'SEC' },
  ]
  const dateLabel = new Date(end).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div data-sec="countdown" className={`${figtree.className} relative overflow-hidden`} style={{ background: GRAD }}>
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-28 left-1/4 h-56 w-56 rounded-full bg-white/5" />
      <div className="relative mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20"><Timer className="h-5 w-5 text-white" strokeWidth={1.7} /></span>
          <div className="min-w-0">
            <p className="m-0 text-[10.5px] font-semibold tracking-[0.18em] text-white/70">TIME LEFT FOR PROJECT COMPLETION</p>
            <p className="m-0 mt-0.5 text-[15px] font-bold text-white">
              {done ? 'Project completion date reached' : `Completion by ${dateLabel}`}
            </p>
            {!on && <p className="m-0 mt-0.5 text-[11.5px] font-semibold text-amber-300">Countdown is OFF. The website shows the RERA box instead.</p>}
          </div>
        </div>

        <div className={`flex items-center gap-2.5 transition ${on ? '' : 'opacity-40'}`}>
          {cells.map(({ v, l }) => (
            <div key={l} className="flex min-w-[64px] flex-col items-center rounded-xl bg-white/10 px-3 py-2.5 ring-1 ring-white/15 backdrop-blur-sm sm:min-w-[76px]">
              <span className="text-[24px] font-bold leading-none tabular-nums text-white sm:text-[28px]">{pad(v)}</span>
              <span className="mt-1.5 text-[9.5px] font-semibold tracking-[0.14em] text-white/70">{l}</span>
            </div>
          ))}
        </div>

        <EditButton label="countdown" onClick={onEdit} className="!bg-none !bg-white !text-[#0F3A6B] ring-0" />
      </div>
    </div>
  )
}

function CountdownPanel({ form, setCd, actions }) {
  const saved = !!form.countdownId
  const on = form.countdownActive !== false
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const nc = async () => ({ error: 'Not connected.' })

  // POST /projects/countdown/status/{id} when saved; otherwise just remembered until the first save
  const flip = async () => {
    if (busy) return
    setErr('')
    if (!saved) { setCd({ countdownActive: !on }); return }
    setBusy(true)
    const r = await (actions.toggleCountdown || nc)(!on)
    setBusy(false)
    if (r?.error) setErr(r.error)
  }

  // DELETE /projects/countdown/delete/{id}
  const remove = async () => {
    if (busy || !saved) return
    if (!confirm('Delete this countdown? The website will show the RERA box instead.')) return
    setBusy(true); setErr('')
    const r = await (actions.deleteCountdown || nc)()
    setBusy(false)
    if (r?.error) setErr(r.error)
  }

  return <>
    <p className="m-0 rounded-xl bg-[#F0F6FC] px-3.5 py-2.5 text-[12.5px]" style={{ color: INK }}>
      Shows “TIME LEFT FOR PROJECT COMPLETION” at the top of the project and on the project card. Turn it off or delete it and the card shows the RERA number instead.
    </p>

    <Field label="Project completion date & time" hint="Sent as completion_date, e.g. 2026-12-31 23:59:59">
      <input
        type="datetime-local"
        className={inputCls}
        value={form.countdownDate || ''}
        onChange={(e) => setCd({ countdownDate: e.target.value })}
      />
    </Field>

    <div className="flex flex-col gap-1.5 rounded-2xl border border-[#E4ECF4] bg-white p-3.5">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="m-0 text-[13px] font-bold" style={{ color: NAVY }}>Show countdown on the website</p>
          <p className="m-0 text-[11.5px] text-gray-400">
            {saved ? 'Saved instantly when you flip it.' : 'Applied when you save the countdown for the first time.'}
          </p>
        </div>
        <span className={`text-[11px] font-bold ${on ? 'text-emerald-600' : 'text-gray-400'}`}>{on ? 'ON' : 'OFF'}</span>
        <button type="button" role="switch" aria-checked={on} aria-label="Show countdown" disabled={busy} onClick={flip}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-60 ${on ? '' : 'bg-gray-300'}`}
          style={on ? { background: GRAD } : undefined}>
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          {busy && <Loader2 className="absolute -left-6 h-4 w-4 animate-spin text-[#0F3A6B]" />}
        </button>
      </div>
      {err && <p role="alert" className="m-0 text-[11.5px] text-red-600">{err}</p>}
    </div>

    {form.countdownDate ? <CountdownPreview value={form.countdownDate} active={on} /> : (
      <p className="m-0 rounded-xl bg-[#F0F6FC] px-3.5 py-2.5 text-[12.5px]" style={{ color: INK }}>Pick a date to see the live preview.</p>
    )}

    <p className="m-0 text-[11.5px] text-gray-400">
      {saved ? `Saved on the server (#${form.countdownId}). Date changes are saved when you click Save countdown.` : 'Not saved yet. Click Save countdown to create it.'}
    </p>

    {saved && (
      <div>
        <Btn kind="danger" icon={Trash2} disabled={busy} onClick={remove}>Delete countdown</Btn>
      </div>
    )}
  </>
}

function SectionFields({ id, form, set, actions = {} }) {
  const t = (key, label, extra = {}) => <Text label={label} value={form[key]} onChange={(v) => set({ [key]: v })} {...extra} />

  const im = (key, label, hint, type) => <ImageField label={label} hint={hint} value={form[key]} onChange={(v) => set({ [key]: v })} projectId={form.id} bannerType={type} />

  const pr = (key, label, hints) => <Pair label={label} value={form[key]} onChange={(v) => set({ [key]: v })} hints={hints} />

  const setOv = (patch) => set({ ...patch, quickFacts: buildFacts({ ...form, ...patch }), ovDirty: true })
  const ov = (key, label, extra = {}) => <Text label={label} value={form[key]} onChange={(v) => setOv({ [key]: v })} {...extra} />

  switch (id) {
    case 'banner':
      return (
        <>
          {im('heroImage', 'Desktop banner', 'Wide image, about 2463 × 1000', 'desktop')}
          {im('heroImageMobile', 'Mobile banner', 'Tall image, 380 × 700. Falls back to desktop.', 'mobile')}
          {im('tourThumbnail', 'Thumbnail Image', 'Small square image', 'thumbnail')}
        </>
      )
    case 'overview':
      return <>
        {ov('eyebrow', 'Eyebrow', { placeholder: 'More than just a home' })}
        <Pair label="Heading" value={form.heading} onChange={(v) => setOv({ heading: v })} hints={['Designed for a', 'Better Way of Life']} />
        {ov('description', 'Description', { rows: 5 })}
        <div className="grid grid-cols-2 gap-3">
          {ov('callButtonText', 'Call button text', { placeholder: 'Call Us' })}
          {ov('callButtonNumber', 'Call button number', { placeholder: '9876543210' })}
        </div>
        <LocalFileField label="Overview image" accept="image/*" isImage value={form.aboutImage} file={form.aboutImageFile}
          hint="Sent to the server when you click Save overview."
          onPick={(f) => setOv({ aboutImage: URL.createObjectURL(f), aboutImageFile: f })} />
        <div>
          <p className="m-0 mb-2.5 text-[12px] font-semibold text-gray-600">Quick facts</p>
          <div className="grid grid-cols-2 gap-3">
            {ov('propType', 'Property type', { placeholder: 'Studio, 1, 2 & 3 BHK', className: 'col-span-2' })}
            {ov('propSize', 'Project size', { placeholder: '1.41 Acres' })}
            {ov('propUnits', 'Total units', { placeholder: '186' })}
            {ov('propPrice', 'Price', { placeholder: '₹ 5,100 / Sq.Ft' })}
            {ov('propFloors', 'Floors', { placeholder: 'Stilt + 5' })}
            {ov('reraNumber', 'RERA number', { placeholder: 'TNRERA/35/BLG/0317/2026', className: 'col-span-2' })}
          </div>
        </div>
        <LocalFileField label="RERA certificate PDF" accept="application/pdf" isImage={false} value={form.reraPdf} file={form.reraPdfFile}
          hint="Opens from the RERA card. Sent when you click Save overview."
          onPick={(f) => setOv({ reraPdf: URL.createObjectURL(f), reraPdfFile: f })} />
        {t('brochureUrl', 'Brochure PDF link', { placeholder: '/brochures/privana.pdf', hint: 'Shows the Download Brochure button (not saved to the server yet)' })}
      </>
    case 'amenities': {
      const setAm = (patch) => set({ ...patch, amDirty: true })
      const am = (key, label, extra = {}) => <Text label={label} value={form[key]} onChange={(v) => setAm({ [key]: v })} {...extra} />
      const icons = form.amenitiesIcons || []
      const slides = form.amenities || []
      const updIcon = (iid, patch) => setAm({ amenitiesIcons: icons.map((a) => (a.id === iid ? { ...a, ...patch } : a)) })
      return <>
        {am('amenitiesEyebrow', 'Eyebrow', { placeholder: 'LIFE AT PRIVANA' })}
        <Pair label="Heading" value={form.amenitiesHeading} onChange={(v) => setAm({ amenitiesHeading: v })} hints={['Everyday Comforts,', 'Exceptional Living']} />
        {am('amenitiesDescription', 'Description', { rows: 3 })}

        <div>
          <p className="m-0 mb-1 text-[12px] font-semibold text-gray-600">Amenities (names + icons)</p>
          <p className="m-0 mb-2.5 text-[11.5px] text-gray-400">Order matters — each icon is paired with the amenity at the same position.</p>
          <div className="flex flex-col gap-2.5">
            {icons.map((a) => <AmenityIconRow key={a.id} item={a} onChange={(patch) => updIcon(a.id, patch)} onRemove={() => setAm({ amenitiesIcons: icons.filter((x) => x.id !== a.id) })} />)}
            <div><Btn kind="ghost" icon={Plus} onClick={() => setAm({ amenitiesIcons: [...icons, { id: uid(), name: '', icon: '', iconFile: null }] })}>Add amenity</Btn></div>
          </div>
          <p className="m-0 mt-2 text-[11.5px] text-gray-400">Sent when you click Save amenities. Every amenity needs an icon.</p>
        </div>

        <div>
          <p className="m-0 mb-1 text-[12px] font-semibold text-gray-600">Slider slides</p>
          <p className="m-0 mb-2.5 text-[11.5px] text-gray-400">Each slide = tag + title + description + tags + images. Slide changes are saved instantly.</p>
          {slides.length === 0 ? (
            <p className="m-0 rounded-xl bg-[#F0F6FC] px-3.5 py-2.5 text-[12.5px]" style={{ color: INK }}>No slides yet. If you add none, the website shows its default four.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {slides.map((sl) => (
                <SlideRow key={sl.id} slide={sl}
                  onUpdate={actions.updateSlide || (async () => ({ error: 'Not connected.' }))}
                  onDelete={actions.deleteSlide || (async () => ({ error: 'Not connected.' }))} />
              ))}
            </div>
          )}
          <div className="mt-3"><SlideForm mode="add" onSubmit={actions.addSlide || (async () => ({ error: 'Not connected.' }))} /></div>
        </div>
      </>
    }

    case 'gallery': {
      const images = form.galleryImages || []
      return <>
        <Text
          label="Gallery title"
          value={form.galleryHeading?.join(' ') || ''}
          onChange={(v) => set({ galleryHeading: v ? [v] : [] })}
          placeholder="A Glimpse Into Your Tomorrow"
          hint="Sent to POST /projects/gallery/title/{id} when you save the project."
        />
        <div>
          <p className="m-0 mb-2 text-[12px] font-semibold text-gray-600">Gallery images</p>
          {images.length === 0 ? (
            <p className="m-0 rounded-xl bg-[#F0F6FC] px-3.5 py-2.5 text-[12.5px]" style={{ color: INK }}>
              No photos saved yet. Use the “Add photos” block below.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {images.map((img) => (
                <GalleryImageRow
                  key={img.id}
                  image={img}
                  onUpdate={actions.updateGalleryImage || (async () => ({ error: 'Not connected.' }))}
                  onDelete={actions.deleteGalleryImage || (async () => ({ error: 'Not connected.' }))}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-1">
          <AddGalleryImages onAdd={actions.addGalleryImages || (async () => ({ error: 'Not connected.' }))} />
        </div>
      </>
    }

    /* ---------- FLOOR PLANS ---------- */
    case 'floor-plans': {
      const setFp = (patch) => set({ ...patch, fpDirty: true })
      const blocks = form.floorPlanBlocks || []
      const layouts = form.floorPlans || []
      const unitTypes = form.floorPlanTabs || []
      return <>
        {form.fpLoadError && (
          <p role="alert" className="m-0 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-700">
            Couldn’t load the saved floor plans: {form.fpLoadError}
          </p>
        )}
        <Text
          label="Eyebrow"
          value={form.floorPlansEyebrow || ''}
          onChange={(v) => setFp({ floorPlansEyebrow: v })}
          placeholder="FLOOR PLANS"
        />
        <Text
          label="Heading"
          value={(form.floorPlansHeading || []).join(' ') || ''}
          onChange={(v) => setFp({ floorPlansHeading: v ? [v] : [] })}
          placeholder="Homes Tailored to Your Needs"
        />
        <Text
          label="Description"
          rows={3}
          value={form.floorPlansDescription || ''}
          onChange={(v) => setFp({ floorPlansDescription: v })}
        />
        <Tags
          label="Unit type groups"
          hint="Comma separated. Sent as `unit_type_groups` JSON array."
          value={unitTypes}
          onChange={(v) => setFp({ floorPlanTabs: v })}
        />

        <div>
          <p className="m-0 mb-1 text-[12px] font-semibold text-gray-600">Blocks</p>
          <p className="m-0 mb-2.5 text-[11.5px] text-gray-400">These appear as “Select Block” tabs on the page.</p>
          <CardList
            items={blocks}
            onChange={(v) => setFp({ floorPlanBlocks: v })}
            addLabel="Add block"
            nameKey="name"
            blank={{ name: '', status: 'UNDER CONSTRUCTION', label: '', tag: '' }}
            fields={[
              { key: 'name', label: 'Block name', placeholder: 'Block A' },
              { key: 'status', label: 'Status', placeholder: 'UNDER CONSTRUCTION' },
            ]}
          />
        </div>

        <div>
          <p className="m-0 mb-2 text-[12px] font-semibold text-gray-600">Layouts</p>
          {layouts.length === 0 ? (
            <p className="m-0 rounded-xl bg-[#F0F6FC] px-3.5 py-2.5 text-[12.5px]" style={{ color: INK }}>
              No layouts saved yet. Use the form below.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {layouts.map((p) => (
                <FloorPlanRow
                  key={p.id}
                  plan={p}
                  onDelete={actions.deleteFloorPlan || (async () => ({ error: 'Not connected.' }))}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-1">
          <FloorPlanAddForm
            blocks={form.floorPlanBlocks}
            unitTypes={form.floorPlanTabs}
            onAdd={actions.addFloorPlan || (async () => ({ error: 'Not connected.' }))}
          />
        </div>
      </>
    }

    /* ---------- PRICING ---------- */
    case 'price-list': {
      const setPr = (patch) => set({ ...patch, prDirty: true })
      const units = form.plotPricing || []
      const icons = [0, 1, 2].map((i) => (form.pricingIcons || [])[i] || { title: '', desc: '', image: '', file: null })
      const updIcon = (i, patch) => setPr({ pricingIcons: icons.map((x, n) => (n === i ? { ...x, ...patch } : x)) })
      return <>
        {form.prLoadError && (
          <p role="alert" className="m-0 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-700">
            Couldn’t load the saved pricing: {form.prLoadError}
          </p>
        )}

        <Text label="Eyebrow" value={form.plotPricingEyebrow} onChange={(v) => setPr({ plotPricingEyebrow: v })} placeholder="PRE-LAUNCH OFFER" />
        <Text label="Heading" value={(form.plotPricingHeading || []).join(' ')} onChange={(v) => setPr({ plotPricingHeading: v ? [v] : [] })} placeholder="Homes & Pricing" />
        <Text label="Description" rows={4} value={form.plotPricingDescription} onChange={(v) => setPr({ plotPricingDescription: v })}
          placeholder="Complete, transparent pre-launch pricing for every unit…" />

        <div>
          <p className="m-0 mb-1 text-[12px] font-semibold text-gray-600">Highlights (3 icons)</p>
          <p className="m-0 mb-2.5 text-[11.5px] text-gray-400">Shown in a row under the description. Only new images are uploaded.</p>
          <div className="flex flex-col gap-3">
            {icons.map((ic, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-2xl border border-[#E4ECF4] bg-white p-3.5">
                <span className="text-[13px] font-bold" style={{ color: NAVY }}>{ic.title || `Highlight ${i + 1}`}</span>
                <div className="grid grid-cols-2 gap-3">
                  <Text label="Title" value={ic.title} onChange={(v) => updIcon(i, { title: v })} placeholder={['Clear Titles', 'Competitive Pricing', 'Future Growth'][i]} />
                  <Text label="Description" value={ic.desc} onChange={(v) => updIcon(i, { desc: v })} placeholder={['Hassle-free ownership', 'Great value for your investment', 'A location with lasting potential'][i]} />
                </div>
                <LocalFileField label="Icon image" accept="image/*" isImage value={ic.image} file={ic.file}
                  onPick={(f) => updIcon(i, { image: URL.createObjectURL(f), file: f })} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="m-0 mb-2.5 text-[12px] font-semibold text-gray-600">Call-to-action card</p>
          <div className="flex flex-col gap-3">
            <Text label="CTA title" value={(form.plotPricingCtaHeading || []).join(' ')} onChange={(v) => setPr({ plotPricingCtaHeading: v ? [v] : [] })} placeholder="A Brighter Tomorrow Awaits" />
            <Text label="CTA description" rows={2} value={form.plotPricingCtaText} onChange={(v) => setPr({ plotPricingCtaText: v })} placeholder="Lock in pre-launch pricing at Privana today." />
            <LocalFileField label="CTA image" accept="image/*" isImage value={form.plotPricingCtaImage} file={form.plotPricingCtaImageFile}
              hint="Background of the card. Sent when you click Save pricing header."
              onPick={(f) => setPr({ plotPricingCtaImage: URL.createObjectURL(f), plotPricingCtaImageFile: f })} />
          </div>
        </div>

        <OfferStatusToggle value={form.offerPriceStatus} onChange={actions.setOfferPriceStatus || (async () => ({ error: 'Not connected.' }))} />

        <Text label="Offer validity message" value={form.offerValidityText} onChange={(v) => setPr({ offerValidityText: v })}
          placeholder="Pre-launch offer valid till Nov 8th 2026" hint="Green pill shown above the table." />
        <Tags label="Filter tabs" value={form.plotPricingTabs || []} onChange={(v) => setPr({ plotPricingTabs: v })}
          hint="Comma separated, in order. e.g. All Units, Studio, 1 BHK, 2 BHK, 3 BHK, Shops, Block A, Block B" />

        <div>
          <p className="m-0 mb-1 text-[12px] font-semibold text-gray-600">Pricing units</p>
          <p className="m-0 mb-2.5 text-[11.5px] text-gray-400">Units are saved instantly when you add or delete them.</p>
          {units.length === 0 ? (
            <p className="m-0 rounded-xl bg-[#F0F6FC] px-3.5 py-2.5 text-[12.5px]" style={{ color: INK }}>
              No units saved yet. Use the form below.
            </p>
          ) : (
            <PricingUnitList units={units} tabs={form.plotPricingTabs || []} onDelete={actions.deletePricingUnit || (async () => ({ error: 'Not connected.' }))} />
          )}
        </div>

        <div className="mt-1">
          <PricingBulkUpload onUpload={actions.bulkUploadPricing || (async () => ({ error: 'Not connected.' }))} />
        </div>

        <div className="mt-1">
          <PricingAddForm onAdd={actions.addPricingUnit || (async () => ({ error: 'Not connected.' }))} />
        </div>
      </>
    }

    /* ---------- 360° TOUR ---------- */
    case 'tour': {
      const setTr = (patch) => set({ ...patch, tourDirty: true })
      const pickCover = (f) => setTr({ tourCover: f ? URL.createObjectURL(f) : '', tourCoverFile: f || null })
      const pickPano = (f) => setTr({ tour360Image: f ? URL.createObjectURL(f) : '', tour360File: f || null })
      const nc = async () => ({ error: 'Not connected.' })
      return <>
        <p className="m-0 rounded-xl bg-[#F0F6FC] px-3.5 py-2.5 text-[12.5px]" style={{ color: INK }}>
          First time: fill the text, add both images and click “Save 360° tour”. Everything is created in one call. After that, Replace and Remove on an image save instantly.
        </p>
        <Text label="Eyebrow" value={form.tourEyebrow} onChange={(v) => setTr({ tourEyebrow: v })} placeholder="EXPLORE BEFORE YOU BELONG" />
        <Pair label="Heading" value={form.tourHeading} onChange={(v) => setTr({ tourHeading: v })} hints={['Experience Privana', 'in 360°']} />
        <Text label="Description" rows={4} value={form.tourDescription} onChange={(v) => setTr({ tourDescription: v })} placeholder="Take a virtual tour and explore the spaces…" />
        <Text label="Button text" value={form.tourCtaLabel} onChange={(v) => setTr({ tourCtaLabel: v })} placeholder="Start 360° Tour" />
        <TourImageField label="Cover image" hint="The picture with the play button." value={form.tourCover} file={form.tourCoverFile}
          onPick={pickCover}
          onReplaceNow={(f) => (actions.editTourImage || nc)('cover', f)}
          onRemoveNow={() => (actions.deleteTourImage || nc)('cover')} />
        <TourImageField label="360° panorama image" hint="The image that rotates. Use a true 2:1 equirectangular photo." value={form.tour360Image} file={form.tour360File}
          onPick={pickPano}
          onReplaceNow={(f) => (actions.editTourImage || nc)('panorama', f)}
          onRemoveNow={() => (actions.deleteTourImage || nc)('panorama')} />
      </>
    }

    /* ---------- LOCATION (Connectivity) ---------- */
    case 'location': {
      const setLoc = (patch) => set({ ...patch, locDirty: true })
      const loc = (key, label, extra = {}) => <Text label={label} value={form[key]} onChange={(v) => setLoc({ [key]: v })} {...extra} />
      const landmarks = form.locationLandmarks || []

      return <>
        {loc('locationHeading', 'Heading', { placeholder: 'Well Connected for a Brighter You' })}
        {loc('locationDescription', 'Description', { rows: 3, placeholder: 'Privana sits at the heart of a fast-growing neighbourhood…' })}
        {loc('locationCtaLabel', 'Button text', { placeholder: 'Get Directions' })}
        {loc('locationMapUrl', 'Google Maps embed (src URL or full <iframe> code)', { placeholder: 'https://www.google.com/maps/embed?pb=...', hint: 'Google Maps → Share → Embed a map → paste the code here. Short links (maps.app.goo.gl) can’t be embedded.' })}

        <div>
          <p className="m-0 mb-1 text-[12px] font-semibold text-gray-600">Landmarks</p>
          <p className="m-0 mb-2.5 text-[11.5px] text-gray-400">Saved instantly as you edit or delete. Add new ones with the form below.</p>
          {landmarks.length === 0 ? (
            <p className="m-0 rounded-xl bg-[#F0F6FC] px-3.5 py-2.5 text-[12.5px]" style={{ color: INK }}>
              No landmarks saved yet. Use the form below.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {landmarks.map((l, i) => (
                <LandmarkRow
                  key={l.id || i}
                  item={l}
                  index={i}
                  onEdit={actions.editLocationLandmark || (async () => ({ error: 'Not connected.' }))}
                  onDelete={actions.deleteLocationLandmark || (async () => ({ error: 'Not connected.' }))}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-1">
          <AddLandmarkForm onAdd={actions.addLocationLandmark || (async () => ({ error: 'Not connected.' }))} />
        </div>
      </>
    }

    /* ---------- COUNTDOWN ---------- */
    case 'countdown': {
      const setCd = (patch) => set({ ...patch, countdownDirty: true })
      return <CountdownPanel form={form} setCd={setCd} actions={actions} />
    }

    /* ---------- SETTINGS (POST /projects/update/{id}: name, nav_name, status) ---------- */
    case 'settings': {
      const setSt = (patch) => set({ ...patch, settingsDirty: true })
      return <>
        <Text label="Project name" value={form.name} onChange={(v) => setSt({ name: v })} placeholder="PKR ESTATES Gurudev" />
        <Text label="Nav name" value={form.navName} onChange={(v) => setSt({ navName: v })} placeholder="Gurudev" hint="Short name shown in the website navigation menu." />
        <Select label="Status" value={form.status} onChange={(v) => setSt({ status: v })} options={['Ongoing', 'Completed', 'Upcoming']} />
        <p className="m-0 text-[11.5px] text-gray-400">Name, nav name and status are saved to the server when you click Save settings.</p>
        <Text label="URL slug" hint="crazystory.in/projects/your-slug" value={form.slug} onChange={(v) => set({ slug: slugify(v) })} />
        {t('metaTitle', 'SEO title')}
        {t('metaDesc', 'SEO description', { rows: 3 })}
      </>
    }
    default: return null
  }
}

function Drawer({ sec, form, set, onCancel, onDone, top = 0, busy = false, error = '', actions }) {
  const Icon = sec.icon
  const doneLabel = { overview: 'Save overview', amenities: 'Save amenities', 'floor-plans': 'Save header & blocks', 'price-list': 'Save pricing header', tour: 'Save 360° tour', location: 'Save location', countdown: 'Save countdown', settings: 'Save settings' }[sec.id] || 'Done'
  return (
    <aside role="dialog" aria-label={`Edit ${sec.label}`} className="fixed bottom-0 right-0 z-[9000] flex w-full flex-col bg-white shadow-[-30px_0_80px_-30px_rgba(15,58,107,0.45)] sm:w-[480px]" style={{ top, borderLeft: '1px solid #E0E8F0' }}>
      <header className="flex items-center gap-3 border-b border-[#EEF3F9] px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: BLUE }}><Icon className="h-5 w-5" style={{ color: NAVY }} strokeWidth={1.6} /></span>
        <div className="min-w-0 flex-1"><h3 className="m-0 text-[16px] font-bold leading-tight" style={{ color: NAVY }}>Edit {sec.label}</h3><p className="m-0 text-[12px]" style={{ color: INK, opacity: 0.6 }}>Changes appear on the page instantly.</p></div>
        <button type="button" onClick={onCancel} disabled={busy} aria-label="Cancel" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D5E1ED] hover:bg-[#F0F6FC] disabled:opacity-50"><X className="h-4 w-4" style={{ color: NAVY }} /></button>
      </header>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5" key={sec.id}><SectionFields id={sec.id} form={form} set={set} actions={actions} /></div>
      {error && <p role="alert" className="m-0 border-t border-red-100 bg-red-50 px-5 py-2.5 text-[12.5px] text-red-700">{error}</p>}
      <footer className="flex items-center justify-end gap-2 border-t border-[#EEF3F9] bg-[#FBFDFE] px-5 py-3.5">
        <Btn kind="ghost" icon={X} disabled={busy} onClick={onCancel}>Discard changes</Btn>
        <Btn icon={busy ? undefined : Check} disabled={busy} onClick={onDone}>
          {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Saving…</> : doneLabel}
        </Btn>
      </footer>
    </aside>
  )
}

function EditButton({ label, onClick, className = '' }) {
  return (
    <button type="button" onClick={onClick} style={{ background: GRAD, fontFamily: 'inherit' }}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12.5px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(15,58,107,0.85)] ring-2 ring-white/80 transition hover:-translate-y-px active:scale-[0.96] ${className}`}>
      <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />Edit {label}
    </button>
  )
}

const ADMIN_HEADER_SELECTOR = 'header'

function Editor({ form, setForm, onBack, onSave, onSaveOverview, onSaveAmenities, onSaveGalleryTitle, onSaveFloorPlansHeader, onSavePricingHeader, onSaveTour, onSaveLocation, onSaveCountdown, onSaveSettings, actions, error, loadingDetails }) {
  const [activeId, setActiveId] = useState(null)
  const [hosts, setHosts] = useState({})
  const [headerH, setHeaderH] = useState(0)
  const [drawerBusy, setDrawerBusy] = useState(false)
  const [drawerError, setDrawerError] = useState('')
  const [unitTab, setUnitTab] = useState('All Units')
  const [tabHost, setTabHost] = useState(null)
  const snap = useRef(null)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const active = SECTIONS.find((s) => s.id === activeId)
  const base = useMemo(() => buildPreview(form), [form])
  const priceTabs = useMemo(
    () => ['All Units', ...(base.plotPricingTabs || []).map(t => typeof t === 'string' ? t : (t.label || t.name || '')).filter((t) => String(t).trim().toLowerCase() !== 'all units')],
    [base],
  )
  const curTab = priceTabs.includes(unitTab) ? unitTab : 'All Units'
  // the selected filter tab narrows the units passed to the banner's table
  const preview = useMemo(
    () => (curTab === 'All Units' ? base : { ...base, plotPricing: (base.plotPricing || []).filter((u) => matchesTab(u, curTab)) }),
    [base, curTab],
  )

  const openSection = (id, scroll = false) => {
    const sec = SECTIONS.find((s) => s.id === id)
    snap.current = Object.fromEntries(sec.keys.map((k) => [k, form[k]]))
    setDrawerError('')
    setActiveId(id)
    if (scroll && sec.dom) secEl(sec.dom)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const cancel = () => { if (snap.current) set(snap.current); setDrawerError(''); setActiveId(null) }

  const done = async () => {
    const savers = {
      overview: ['ovDirty', onSaveOverview],
      amenities: ['amDirty', onSaveAmenities],
      'price-list': ['prDirty', onSavePricingHeader],
      tour: ['tourDirty', onSaveTour],
      location: ['locDirty', onSaveLocation],
      countdown: ['countdownDirty', onSaveCountdown],
      settings: ['settingsDirty', onSaveSettings],
    }
    const sv = active && savers[active.id]
    if (sv && sv[1] && form[sv[0]]) {
      setDrawerBusy(true); setDrawerError('')
      const r = await sv[1]()
      setDrawerBusy(false)
      if (r.error) return setDrawerError(r.error)
    }
    if (active?.id === 'gallery' && onSaveGalleryTitle) {
      setDrawerBusy(true); setDrawerError('')
      const r = await onSaveGalleryTitle()
      setDrawerBusy(false)
      if (r?.error) return setDrawerError(r.error)
    }
    if (active?.id === 'floor-plans' && form.fpDirty && onSaveFloorPlansHeader) {
      setDrawerBusy(true); setDrawerError('')
      const r = await onSaveFloorPlansHeader()
      setDrawerBusy(false)
      if (r?.error) return setDrawerError(r.error)
    }
    setActiveId(null)
  }

  useEffect(() => {
    const el = document.querySelector(ADMIN_HEADER_SELECTOR)
    const pinned = !!el && ['fixed', 'sticky'].includes(getComputedStyle(el).position)
    if (pinned) setHeaderH(Math.round(el.getBoundingClientRect().bottom))
  }, [])

  useEffect(() => {
    const next = {}
    SECTIONS.filter((s) => s.dom).forEach((s) => {
      const el = secEl(s.dom)
      if (!el) return
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
      let host = el.querySelector(':scope > [data-edit-host]')
      if (!host) {
        host = document.createElement('div')
        host.setAttribute('data-edit-host', '')
        host.style.cssText = 'position:absolute;top:16px;right:16px;z-index:30'
        el.appendChild(host)
      }
      next[s.id] = host
    })
    setHosts((prev) => {
      const same = Object.keys(next).length === Object.keys(prev).length && Object.keys(next).every((k) => prev[k] === next[k])
      return same ? prev : next
    })
  })

  // find the pricing table card and give the filter tab bar a spot at its top
  useEffect(() => {
    if (!SHOW_TAB_BAR) return
    const sec = secEl('price-list')
    if (!sec) { if (tabHost) setTabHost(null); return }
    let host = sec.querySelector('[data-tab-host]')
    if (!host) {
      const head = [...sec.querySelectorAll('*')].find((n) => n.children.length === 0 && n.textContent.trim() === 'Facing & area')
      let card = head?.parentElement || null
      for (let i = 0; card && i < 14; i++) {
        const cs = getComputedStyle(card)
        if (parseFloat(cs.borderTopLeftRadius) >= 20 && card.getBoundingClientRect().width > 400) break
        card = card.parentElement
        if (card === sec) { card = null; break }
      }
      if (!card) { if (tabHost) setTabHost(null); return }
      if (getComputedStyle(card).position === 'static') card.style.position = 'relative'
      host = document.createElement('div')
      host.setAttribute('data-tab-host', '')
      host.style.cssText = 'position:absolute;top:14px;left:24px;right:24px;z-index:5;display:flex'
      card.appendChild(host)
    }
    if (host !== tabHost) setTabHost(host)
  })

  useEffect(() => {
    SECTIONS.forEach((s) => { const el = s.dom && secEl(s.dom); if (el) el.style.outline = '' })
    const el = active?.dom && secEl(active.dom)
    if (el) { el.style.outline = `3px solid ${NAVY}`; el.style.outlineOffset = '-3px' }
  }, [activeId, hosts])

  return (
    <div className={figtree.className}>
      <div className="border-b border-[#E4ECF4] bg-white">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center gap-3 px-4 py-4 sm:px-8">
          <button type="button" onClick={onBack} aria-label="Back to projects" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5E1ED] bg-white transition hover:border-[#0F3A6B]"><ArrowLeft className="h-4 w-4" style={{ color: NAVY }} /></button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h1 className="m-0 truncate text-[20px] font-bold leading-tight" style={{ color: form.name ? NAVY : '#9ca3af' }}>{form.name || 'New project'}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${TONE[normStatus(form.status)]}`}>{normStatus(form.status)}</span>
            </div>
            <p className="m-0 mt-0.5 text-[12px] text-gray-400">{loadingDetails ? 'Loading saved details…' : <>Click any <span className="font-semibold" style={{ color: NAVY }}>Edit</span> button on the page, or use the toolbar at the bottom.</>}</p>
          </div>
          <EditButton label="name" onClick={() => openSection('settings')} />
          {form.slug && <a href={`/projects/${form.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E1ED] bg-white px-4 py-2 text-[13px] font-semibold no-underline transition hover:border-[#0F3A6B]" style={{ color: NAVY }}>View live <ExternalLink className="h-3.5 w-3.5" /></a>}
        </div>
        {error && <p role="alert" className="mx-4 mb-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-[13px] text-red-700 sm:mx-8">{error}</p>}
      </div>

      {/* Countdown section: top of the project, above the banner */}
      <CountdownStrip form={form} onEdit={() => openSection('countdown')} />

      <div className="relative">
        <div className="absolute left-4 top-4 z-[30] sm:left-8 sm:top-6"><EditButton label="banner" onClick={() => openSection('banner')} /></div>
        <style>{`.sticky.z-40:has(nav[aria-label="Project sections"]){display:none !important}`}</style>
        <ProjectBanner project={preview} projectId={form.id} id={form.id} />
      </div>
      <div className="h-28" aria-hidden="true" />

      {SHOW_TAB_BAR && tabHost && createPortal(
        <div className="flex w-full items-center justify-between gap-3">
          <div className="min-w-0 flex-1"><PricingTabBar tabs={priceTabs} active={curTab} onChange={setUnitTab} /></div>
          <OfferStatusToggle compact value={form.offerPriceStatus} onChange={actions.setOfferPriceStatus || (async () => ({ error: 'Not connected.' }))} />
        </div>,
        tabHost,
      )}

      {SECTIONS.filter((s) => hosts[s.id]).map((s) => createPortal(<EditButton key={s.id} label={s.label} onClick={() => openSection(s.id)} />, hosts[s.id], s.id))}

      <div className={`pointer-events-none fixed bottom-4 left-0 right-0 z-[8000] flex justify-center px-3 transition-[right] duration-300 ${active ? 'sm:right-[480px] max-sm:hidden' : ''}`}>
        <div className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-[#E0E8F0] bg-white p-1.5 shadow-[0_24px_60px_-18px_rgba(15,58,107,0.5)]">
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SECTIONS.map((s) => { const I = s.icon; const on = s.id === activeId; return (
              <button key={s.id} type="button" onClick={() => openSection(s.id, true)} title={s.label} aria-label={`Edit ${s.label}`} style={on ? { background: GRAD } : undefined}
                ref={on ? (el) => el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }) : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2.5 text-[12.5px] font-semibold transition sm:px-3.5 ${on ? 'text-white' : 'text-[#5A6B7B] hover:bg-[#F0F6FC] hover:text-[#0F3A6B]'}`}>
                <I className="h-4 w-4" strokeWidth={1.8} /><span className="hidden lg:inline">{s.label}</span></button>) })}
          </div>
          <span className="mx-1 h-7 w-px shrink-0 bg-[#E0E8F0]" />
          <Btn icon={Save} onClick={onSave} className="shrink-0 !py-2.5">Save<span className="hidden sm:inline">&nbsp;project</span></Btn>
        </div>
      </div>

      {active && <Drawer sec={active} form={form} set={set} top={headerH} busy={drawerBusy} error={drawerError} actions={actions} onCancel={cancel} onDone={done} />}
    </div>
  )
}

export default function ProjectsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [confirmAdd, setConfirmAdd] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const [loadingDetails, setLoadingDetails] = useState(false)

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const loadDetails = async (id) => {
    setLoadingDetails(true)
    try {
      const { json } = await apiFetch(`/projects/details/${id}`, { method: 'GET' })
      const d = json?.data
      if (!d) return
      const base = {
        ...(d.name ? { name: d.name } : {}),
        navName: d.nav_name || '',
        status: normStatus(d.status),
        statusRaw: d.status || '',
        heroImage: d.desktop_banner_url || abs(d.desktop_banner),
        heroImageMobile: d.mobile_banner_url || abs(d.mobile_banner),
        tourThumbnail: d.thumbnail_image_url || abs(d.thumbnail_image),
      }
      const overview = overviewFromApi(d.details || {})
      // if the details response embeds `countdown`, use it right away
      const cd = countdownFromApi({ data: d })
      setForm((f) => {
        if (!f || String(f.id) !== String(id)) return f
        // don't overwrite settings edits the user hasn't saved yet
        const keepSettings = !!f.settingsDirty
        const { name, navName, status, statusRaw, ...rest } = base
        return {
          ...f,
          ...rest,
          ...(keepSettings ? {} : { ...(name ? { name } : {}), navName, status, statusRaw }),
          ...(f.ovDirty ? {} : overview),
          ...(f.countdownDirty ? {} : cd),
        }
      })
    } catch (err) {
      setError(err.message || "Couldn't load the saved details. Refresh to try again.")
    } finally {
      setLoadingDetails(false)
    }
  }

  const loadAmenities = async (id, force = false) => {
    try {
      const { json } = await apiFetch(`/projects/amenities/${id}`, { method: 'GET' })
      if (DEBUG_AMENITIES) console.log('AMENITIES GET RAW:', JSON.stringify(json, null, 2))
      const am = amenitiesFromApi(json)
      setForm((f) => {
        if (!f || String(f.id) !== String(id)) return f
        const next = { ...f, ...(am.amenities ? { amenities: am.amenities } : {}) }
        if (!f.amDirty || force) {
          if (am.amenitiesIcons) next.amenitiesIcons = am.amenitiesIcons
          if (am.amenitiesEyebrow !== undefined) next.amenitiesEyebrow = am.amenitiesEyebrow
          if (am.amenitiesHeading !== undefined) next.amenitiesHeading = am.amenitiesHeading
          if (am.amenitiesDescription !== undefined) next.amenitiesDescription = am.amenitiesDescription
          next.amDirty = false
        }
        return next
      })
    } catch (err) {
      console.warn('Could not load amenities', err)
    }
  }

  const loadGallery = async (id) => {
    try {
      const { json } = await apiFetch(`/projects/gallery/${id}`, { method: 'GET' })
      if (DEBUG_GALLERY) console.log('GALLERY GET RAW:', JSON.stringify(json, null, 2))
      const g = galleryFromApi(json)
      setForm((f) => {
        if (!f || String(f.id) !== String(id)) return f
        return {
          ...f,
          ...(g.galleryHeading !== undefined ? { galleryHeading: g.galleryHeading } : {}),
          ...(g.galleryImages !== undefined ? { galleryImages: g.galleryImages } : {}),
        }
      })
    } catch (err) {
      console.warn('Could not load gallery', err)
    }
  }

  const loadFloorPlans = async (id) => {
    try {
      const { json } = await apiFetch(`/projects/floor-plans/${id}`, { method: 'GET' })
      if (DEBUG_FLOOR_PLANS) console.log('FLOOR PLANS GET RAW:', JSON.stringify(json, null, 2))
      const fp = floorPlansFromApi(json)
      if (!Object.keys(fp).length) console.warn('Floor plans: response shape not recognised', json)
      setForm((f) => {
        if (!f || String(f.id) !== String(id)) return f
        // don't overwrite header edits the user hasn't saved yet (e.g. after adding a layout)
        const keepHeader = !!f.fpDirty
        return {
          ...f,
          ...(keepHeader ? {} : {
            ...(fp.floorPlansEyebrow !== undefined ? { floorPlansEyebrow: fp.floorPlansEyebrow } : {}),
            ...(fp.floorPlansHeading !== undefined ? { floorPlansHeading: fp.floorPlansHeading } : {}),
            ...(fp.floorPlansDescription !== undefined ? { floorPlansDescription: fp.floorPlansDescription } : {}),
            ...(fp.floorPlanTabs !== undefined ? { floorPlanTabs: fp.floorPlanTabs } : {}),
            ...(fp.floorPlanBlocks !== undefined ? { floorPlanBlocks: fp.floorPlanBlocks } : {}),
          }),
          ...(fp.floorPlans !== undefined ? { floorPlans: fp.floorPlans } : {}),
          fpDirty: keepHeader,
          fpLoadError: '',
        }
      })
    } catch (err) {
      console.warn('Could not load floor plans', err)
      setForm((f) => (!f || String(f.id) !== String(id) ? f : { ...f, fpLoadError: err.message || 'Request failed' }))
    }
  }

  // GET /projects/pricing/{id}
  const loadPricing = async (id, force = false) => {
    try {
      const { json } = await apiFetch(`/projects/pricing/${id}`, { method: 'GET' })
      if (DEBUG_PRICING) console.log('PRICING GET RAW:', JSON.stringify(json, null, 2))
      const pr = pricingFromApi(json)
      if (DEBUG_PRICING) console.log('PRICING PARSED units:', pr.plotPricing?.length ?? 'none found', pr)
      if (!Object.keys(pr).length) console.warn('Pricing: response shape not recognised', json)
      setForm((f) => {
        if (!f || String(f.id) !== String(id)) return f
        // don't overwrite header edits the user hasn't saved yet (e.g. after adding a unit)
        const keepHeader = !!f.prDirty && !force
        return {
          ...f,
          ...(keepHeader ? {} : {
            ...(pr.plotPricingEyebrow !== undefined ? { plotPricingEyebrow: pr.plotPricingEyebrow } : {}),
            ...(pr.plotPricingHeading !== undefined ? { plotPricingHeading: pr.plotPricingHeading } : {}),
            ...(pr.plotPricingDescription !== undefined ? { plotPricingDescription: pr.plotPricingDescription } : {}),
            ...(pr.pricingIcons !== undefined ? { pricingIcons: pr.pricingIcons } : {}),
            ...(pr.plotPricingTabs !== undefined ? { plotPricingTabs: pr.plotPricingTabs } : {}),
            ...(pr.offerValidityText !== undefined ? { offerValidityText: pr.offerValidityText } : {}),
            ...(pr.plotPricingCtaHeading !== undefined ? { plotPricingCtaHeading: pr.plotPricingCtaHeading } : {}),
            ...(pr.plotPricingCtaText !== undefined ? { plotPricingCtaText: pr.plotPricingCtaText } : {}),
            ...(pr.plotPricingCtaImage !== undefined ? { plotPricingCtaImage: pr.plotPricingCtaImage, plotPricingCtaImageFile: null } : {}),
          }),
          ...(pr.plotPricing !== undefined ? { plotPricing: pr.plotPricing } : {}),
          ...(pr.offerPriceStatus !== undefined ? { offerPriceStatus: pr.offerPriceStatus } : {}),
          prDirty: keepHeader,
          prLoadError: '',
        }
      })
    } catch (err) {
      console.warn('Could not load pricing', err)
      setForm((f) => (!f || String(f.id) !== String(id) ? f : { ...f, prLoadError: err.message || 'Request failed' }))
    }
  }

  // GET /projects/360/{id}  (public)
  const loadTour = async (id, force = false) => {
    try {
      const { json } = await apiFetch(`/projects/360/${id}`, { method: 'GET' })
      const t = tourFromApi(json)
      setForm((f) => {
        if (!f || String(f.id) !== String(id)) return f
        // don't overwrite text edits the user hasn't saved yet
        const keepText = !!f.tourDirty && !force
        return {
          ...f,
          ...(keepText ? {} : {
            ...(t.tourEyebrow !== undefined ? { tourEyebrow: t.tourEyebrow } : {}),
            ...(t.tourHeading !== undefined ? { tourHeading: t.tourHeading } : {}),
            ...(t.tourDescription !== undefined ? { tourDescription: t.tourDescription } : {}),
            ...(t.tourCtaLabel !== undefined ? { tourCtaLabel: t.tourCtaLabel } : {}),
          }),
          // keep a picked-but-unsaved local file
          ...(t.tourCover !== undefined && !f.tourCoverFile ? { tourCover: t.tourCover } : {}),
          ...(t.tour360Image !== undefined && !f.tour360File ? { tour360Image: t.tour360Image } : {}),
          tourDirty: keepText,
        }
      })
    } catch (err) {
      console.warn('Could not load 360 tour', err)
    }
  }

  // GET /projects/connectivity/{id}
  const loadLocation = async (id, force = false) => {
    try {
      const { json } = await apiFetch(`/projects/connectivity/${id}`, { method: 'GET' })
      if (DEBUG_LOCATION) console.log('LOCATION GET RAW:', JSON.stringify(json, null, 2))
      const l = locationFromApi(json)
      setForm((f) => {
        if (!f || String(f.id) !== String(id)) return f
        const keepHeader = !!f.locDirty && !force
        return {
          ...f,
          ...(keepHeader ? {} : {
            ...(l.locationHeading !== undefined ? { locationHeading: l.locationHeading } : {}),
            ...(l.locationDescription !== undefined ? { locationDescription: l.locationDescription } : {}),
            ...(l.locationCtaLabel !== undefined ? { locationCtaLabel: l.locationCtaLabel } : {}),
            ...(l.locationMapUrl !== undefined ? { locationMapUrl: l.locationMapUrl } : {}),
            ...(l.locationMapEmbed !== undefined ? { locationMapEmbed: l.locationMapEmbed } : {}),
          }),
          ...(l.locationLandmarks !== undefined ? { locationLandmarks: l.locationLandmarks } : {}),
          locDirty: keepHeader,
        }
      })
    } catch (err) {
      console.warn('Could not load location', err)
    }
  }

  // GET COUNTDOWN_GET_PATH(id)  (a 404 just means the backend has no GET endpoint yet; details may embed it instead)
  const loadCountdown = async (id, force = false) => {
    try {
      const { json } = await apiFetch(COUNTDOWN_GET_PATH(id), { method: 'GET' })
      if (DEBUG_COUNTDOWN) console.log('COUNTDOWN GET RAW:', JSON.stringify(json, null, 2))
      const c = countdownFromApi(json)
      if (!Object.keys(c).length) return // nothing saved for this project
      setForm((f) => {
        if (!f || String(f.id) !== String(id)) return f
        // don't overwrite a date the user is still typing
        const keep = !!f.countdownDirty && !force
        return { ...f, ...(keep ? {} : { ...c, countdownDirty: false }) }
      })
    } catch (err) {
      console.warn('Could not load countdown', err)
    }
  }

  const open = (p) => {
    setForm(p); setError(''); window.scrollTo({ top: 0 })
    loadDetails(p.id); loadAmenities(p.id); loadGallery(p.id); loadFloorPlans(p.id); loadPricing(p.id); loadTour(p.id); loadLocation(p.id); loadCountdown(p.id)
  }

  useEffect(() => {
    let isMounted = true
    async function loadProjects() {
      try {
        const res = await apiFetch('/projects/get-all', { method: 'GET' })
        const list = res.json?.data || []

        const mapped = list.map(p => ({
          ...BLANK,
          id: p.id,
          name: p.name,
          navName: p.nav_name || '',
          status: normStatus(p.status),
          statusRaw: p.status || '',
          heroImage: p.desktop_banner_url || abs(p.desktop_banner),
          heroImageMobile: p.mobile_banner_url || abs(p.mobile_banner),
          tourThumbnail: p.thumbnail_image_url || abs(p.thumbnail_image),
          slug: slugify(p.name || 'project'),
          ...overviewFromApi(p),
          ...countdownFromApi({ data: p }),
        }))

        if (isMounted) setItems(mapped)
      } catch (err) {
        console.error('Failed to load projects', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadProjects()
    return () => { isMounted = false }
  }, [])

  /* ---------- SETTINGS action ---------- */
  // POST /projects/update/{id}  (JSON body: name, nav_name, status)
  const saveSettings = async () => {
    if (!form?.id) return { error: 'Create the project first.' }
    if (!form.name.trim()) return { error: 'Enter the project name.' }
    const payload = {
      name: form.name.trim(),
      nav_name: (form.navName || '').trim(),
      status: toApiStatus(form),
    }
    try {
      const { json } = await apiFetch(`/projects/update/${form.id}`, { method: 'POST', body: JSON.stringify(payload) })
      const d = json?.data || {}
      const patch = {
        settingsDirty: false,
        name: d.name || payload.name,
        navName: d.nav_name ?? payload.nav_name,
        status: normStatus(d.status ?? payload.status),
        statusRaw: d.status ?? payload.status,
      }
      setForm((f) => (f ? { ...f, ...patch } : f))
      setItems((l) => l.map((p) => (String(p.id) === String(form.id) ? { ...p, name: patch.name, navName: patch.navName, status: patch.status, statusRaw: patch.statusRaw } : p)))
      flash(json?.message || 'Settings saved')
      return { error: '', patch }
    } catch (err) {
      return { error: err.message }
    }
  }

  const saveOverview = async () => {
    if (!form?.id) return { error: 'Create the project first.' }
    const body = new FormData()
    const text = {
      hero_subtitle: form.eyebrow,
      hero_title: (form.heading || []).filter(Boolean).join(' '),
      hero_description: form.description,
      call_button_text: form.callButtonText,
      call_button_number: form.callButtonNumber,
      prop_type: form.propType,
      prop_size: form.propSize,
      prop_units: form.propUnits,
      prop_price: form.propPrice,
      prop_floors: form.propFloors,
      rera_number: form.reraNumber,
    }
    Object.entries(text).forEach(([k, v]) => body.append(k, v ?? ''))
    if (form.aboutImageFile) body.append('hero_image', form.aboutImageFile)
    if (form.reraPdfFile) body.append('rera_pdf', form.reraPdfFile)

    try {
      const json = await uploadFile(`/projects/firstdetail/update/${form.id}`, body)
      const d = json?.data || {}
      const patch = { ovDirty: false, aboutImageFile: null, reraPdfFile: null }
      if (d.hero_image_url || d.hero_image) patch.aboutImage = d.hero_image_url || abs(d.hero_image)
      if (d.rera_pdf_url || d.rera_pdf) patch.reraPdf = d.rera_pdf_url || abs(d.rera_pdf)
      setForm((f) => ({ ...f, ...patch }))
      flash(json?.message || 'Overview saved')
      return { error: '', patch }
    } catch (err) {
      return { error: err.message }
    }
  }

  const saveAmenities = async () => {
    if (!form?.id) return { error: 'Create the project first.' }
    const items = (form.amenitiesIcons || []).filter((a) => (a.name || '').trim())
    if (!items.length) return { error: 'Add at least one amenity.' }

    const body = new FormData()
    body.append('section_subtitle', form.amenitiesEyebrow ?? '')
    body.append('section_title', (form.amenitiesHeading || []).filter(Boolean).join(' '))
    body.append('section_description', form.amenitiesDescription ?? '')
    body.append('amenities_list', JSON.stringify(items.map((a) => ({ name: a.name.trim() }))))

    for (const a of items) {
      let file = a.iconFile
      if (!file && a.icon && /^https?:/i.test(a.icon)) {
        try { file = await urlToFile(a.icon) } catch { file = null }
      }
      if (!file) {
        return { error: `Upload an icon for “${a.name}”. Its saved icon can't be reused — please re-upload.` }
      }
      body.append('amenities_icons[]', file)
    }

    try {
      const json = await uploadFile(`/projects/amenities/main/${form.id}`, body)
      const d = json?.data || {}

      let freshIcons = form.amenitiesIcons.map((a) => ({ ...a, iconFile: null }))
      const serverList = Array.isArray(d.amenities_list) ? d.amenities_list
        : Array.isArray(d.amenities) ? d.amenities
        : null
      if (serverList && serverList.length === items.length) {
        freshIcons = serverList.map((s, i) => ({
          id: items[i]?.id ?? uid(),
          name: s?.name ?? items[i]?.name ?? '',
          icon: abs(s?.icon_url || s?.icon || '') || items[i]?.icon || '',
          iconFile: null,
        }))
      }

      const patch = { amDirty: false, amenitiesIcons: freshIcons }
      setForm((f) => ({ ...f, ...patch }))
      loadAmenities(form.id, true)
      flash(json?.message || 'Amenities saved')
      return { error: '', patch }
    } catch (err) {
      return { error: err.message }
    }
  }

  const slideBody = (draft, includeFiles = true) => {
    const body = new FormData()
    body.append('tag', draft.tag)
    body.append('title', draft.title)
    body.append('description', draft.description)
    body.append('tags', JSON.stringify(draft.tags))
    if (includeFiles) draft.files.forEach((f) => body.append('images[]', f))
    return body
  }

  const addSlide = async (draft) => {
    if (!form?.id) return { error: 'Create the project first.' }
    try {
      const json = await uploadFile(`/projects/amenities/slider/add/${form.id}`, slideBody(draft))
      await loadAmenities(form.id)
      flash(json?.message || 'Slide added')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  const updateSlide = async (slideId, draft) => {
    if (!form?.id) return { error: 'Create the project first.' }
    try {
      const json = await uploadFile(`/projects/amenities/slider/update/${slideId}`, slideBody(draft, draft.files.length > 0))
      await loadAmenities(form.id)
      flash(json?.message || 'Slide updated')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  const deleteSlide = async (slideId) => {
    if (!form?.id) return { error: 'Create the project first.' }
    try {
      const { json } = await apiFetch(`/projects/amenities/slider/delete/${slideId}`, { method: 'DELETE' })
      setForm((f) => (f ? { ...f, amenities: (f.amenities || []).filter((s) => String(s.id) !== String(slideId)) } : f))
      await loadAmenities(form.id)
      flash(json?.message || 'Slide deleted')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  /* ---------- GALLERY actions ---------- */
  const saveGalleryTitle = async () => {
    if (!form?.id) return { error: 'Create the project first.' }
    const title = (form.galleryHeading || []).join(' ').trim()
    if (!title) return { error: 'Enter a gallery title first.' }
    const body = new FormData()
    body.append('gallery_title', title)
    try {
      const json = await uploadFile(`/projects/gallery/title/${form.id}`, body)
      flash(json?.message || 'Gallery title saved')
      await loadGallery(form.id)
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  const addGalleryImages = async ({ titles, files }) => {
    if (!form?.id) return { error: 'Create the project first.' }
    if (!files.length) return { error: 'Pick at least one image.' }
    if (titles.length !== files.length) return { error: 'Every photo needs a matching title slot.' }
    const body = new FormData()
    body.append('image_titles', JSON.stringify(titles))
    files.forEach((f) => body.append('images[]', f))
    try {
      const json = await uploadFile(`/projects/gallery/add/${form.id}`, body)
      await loadGallery(form.id)
      flash(json?.message || 'Photos added')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  const updateGalleryImage = async (imageId, { title, file }) => {
    if (!imageId) return { error: 'Missing image id.' }
    if (!title) return { error: 'Enter a title first.' }
    const body = new FormData()
    body.append('image_title', title)
    if (file) body.append('image', file)
    try {
      const json = await uploadFile(`/projects/gallery/update/${imageId}`, body)
      await loadGallery(form.id)
      flash(json?.message || 'Image updated')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  const deleteGalleryImage = async (imageId) => {
    if (!imageId) return { error: 'Missing image id.' }
    try {
      const { json } = await apiFetch(`/projects/gallery/delete/${imageId}`, { method: 'DELETE' })
      setForm((f) => (f ? { ...f, galleryImages: (f.galleryImages || []).filter((g) => String(g.id) !== String(imageId)) } : f))
      await loadGallery(form.id)
      flash(json?.message || 'Image deleted')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  /* ---------- FLOOR PLANS actions ---------- */
  const saveFloorPlansHeader = async () => {
    if (!form?.id) return { error: 'Create the project first.' }
    const body = new FormData()
    body.append('eyebrow', form.floorPlansEyebrow ?? '')
    body.append('heading', (form.floorPlansHeading || []).filter(Boolean).join(' '))
    body.append('description', form.floorPlansDescription ?? '')
    body.append('unit_type_groups', JSON.stringify(form.floorPlanTabs || []))
    body.append('blocks', JSON.stringify((form.floorPlanBlocks || []).map((b) => ({
      name: b.name || b.label || '',
      status: b.status || b.tag || '',
    }))))
    try {
      const json = await uploadFile(`/projects/floor-plans/header/${form.id}`, body)
      setForm((f) => ({ ...f, fpDirty: false }))
      await loadFloorPlans(form.id)
      flash(json?.message || 'Floor plans header saved')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  const addFloorPlan = async ({ title, block_name, unit_type, facing, area, description, file }) => {
    if (!form?.id) return { error: 'Create the project first.' }
    const body = new FormData()
    body.append('title', title)
    body.append('block_name', block_name)
    body.append('unit_type', unit_type)
    body.append('facing', facing)
    body.append('area', area)
    body.append('description', description)
    if (file) body.append('plan_image', file)
    try {
      const json = await uploadFile(`/projects/floor-plans/add/${form.id}`, body)
      await loadFloorPlans(form.id)
      flash(json?.message || 'Layout added')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  const deleteFloorPlan = async (layoutId) => {
    if (!layoutId) return { error: 'Missing layout id.' }
    try {
      const { json } = await apiFetch(`/projects/floor-plans/delete/${layoutId}`, { method: 'DELETE' })
      setForm((f) => (f ? { ...f, floorPlans: (f.floorPlans || []).filter((p) => String(p.id) !== String(layoutId)) } : f))
      await loadFloorPlans(form.id)
      flash(json?.message || 'Layout deleted')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  /* ---------- PRICING actions ---------- */
  // POST /projects/pricing/header/{id}  (left side: eyebrow, heading, description, 3 icons, CTA card, validity pill, filter tabs)
  const savePricingHeader = async () => {
    if (!form?.id) return { error: 'Create the project first.' }
    const body = new FormData()
    body.append('eyebrow', form.plotPricingEyebrow ?? '')
    body.append('heading', (form.plotPricingHeading || []).filter(Boolean).join(' '))
    body.append('description', form.plotPricingDescription ?? '')

    const icons = form.pricingIcons || []
    ;[0, 1, 2].forEach((i) => {
      const ic = icons[i] || {}
      const n = i + 1
      body.append(`icon_${n}_title`, ic.title ?? '')
      body.append(`icon_${n}_desc`, ic.desc ?? '')
      if (ic.file) body.append(`icon_${n}_image`, ic.file) // only when a new file was picked
    })

    body.append('cta_title', (form.plotPricingCtaHeading || []).filter(Boolean).join(' '))
    body.append('cta_description', form.plotPricingCtaText ?? '')
    if (form.plotPricingCtaImageFile) body.append('cta_image', form.plotPricingCtaImageFile)

    body.append('validity_message', form.offerValidityText ?? '')
    // 🔑 Send as plain strings (API expects strings)
    body.append('filter_tabs', JSON.stringify((form.plotPricingTabs || []).map(t => typeof t === 'string' ? t : (t.label || t.name || ''))))

    try {
      const json = await uploadFile(`/projects/pricing/header/${form.id}`, body)
      setForm((f) => ({
        ...f,
        prDirty: false,
        plotPricingCtaImageFile: null,
        pricingIcons: (f.pricingIcons || []).map((ic) => ({ ...ic, file: null })),
      }))
      await loadPricing(form.id, true)
      flash(json?.message || 'Pricing header saved')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  // POST /projects/pricing/add/{id}
  const addPricingUnit = async (unit) => {
    if (!form?.id) return { error: 'Create the project first.' }
    const body = new FormData()
    Object.entries(unit).forEach(([k, v]) => body.append(k, v ?? ''))
    try {
      const json = await uploadFile(`/projects/pricing/add/${form.id}`, body)
      await loadPricing(form.id)
      flash(json?.message || 'Unit added')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  const deletePricingUnit = async (unitId) => {
    if (!unitId) return { error: 'Missing unit id.' }
    try {
      // If your API uses a different path, adjust it here.
      const { json } = await apiFetch(`/projects/pricing/delete/${unitId}`, { method: 'DELETE' })
      setForm((f) => (f ? { ...f, plotPricing: (f.plotPricing || []).filter((u) => String(u.id) !== String(unitId)) } : f))
      await loadPricing(form.id)
      flash(json?.message || 'Unit deleted')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  // POST /projects/pricing/bulk-upload/{id}  (form-data: file)
  const bulkUploadPricing = async (file) => {
    if (!form?.id) return { error: 'Create the project first.' }
    if (!file) return { error: 'Choose an Excel file first.' }
    const body = new FormData()
    body.append('file', file)
    try {
      const json = await uploadFile(`/projects/pricing/bulk-upload/${form.id}`, body)
      await loadPricing(form.id)
      flash(json?.message || 'Pricing data uploaded')
      return { error: '', message: json?.message }
    } catch (err) {
      return { error: err.message }
    }
  }

  // POST /projects/pricing/offer-status/{id}  (form-data: offer_price_status = yes | no)
  const setOfferPriceStatus = async (status) => {
    if (!form?.id) return { error: 'Create the project first.' }
    const body = new FormData()
    body.append('offer_price_status', status)
    try {
      const json = await uploadFile(`/projects/pricing/offer-status/${form.id}`, body)
      const next = toYesNo(json?.current_status ?? status)
      setForm((f) => ({ ...f, offerPriceStatus: next }))
      flash(json?.message || `Offer price status updated to ${next}`)
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  /* ---------- 360° TOUR actions ---------- */
  // POST /projects/360/update/{id}  (eyebrow, title, description, button_text, cover_image, panorama_image)
  const saveTour = async () => {
    if (!form?.id) return { error: 'Create the project first.' }
    const serverCover = !!form.tourCover && !form.tourCoverFile
    const serverPano = !!form.tour360Image && !form.tour360File
    if (!serverCover && !serverPano && (!form.tourCoverFile || !form.tour360File)) {
      return { error: 'First time: add both the cover image and the 360° panorama image, then save.' }
    }
    const body = new FormData()
    body.append('eyebrow', form.tourEyebrow ?? '')
    body.append('title', (form.tourHeading || []).filter(Boolean).join(' '))
    body.append('description', form.tourDescription ?? '')
    body.append('button_text', form.tourCtaLabel ?? '')
    if (form.tourCoverFile) body.append('cover_image', form.tourCoverFile)
    if (form.tour360File) body.append('panorama_image', form.tour360File)
    try {
      const json = await uploadFile(`/projects/360/update/${form.id}`, body)
      const cover = findKey(json, 'cover_image_url')
      const pano = findKey(json, 'panorama_image_url')
      const patch = { tourDirty: false, tourCoverFile: null, tour360File: null }
      if (cover) patch.tourCover = abs(cover)
      if (pano) patch.tour360Image = abs(pano)
      setForm((f) => ({ ...f, ...patch }))
      await loadTour(form.id, true)
      flash(json?.message || '360° tour saved')
      return { error: '', patch }
    } catch (err) {
      return { error: err.message }
    }
  }

  // POST /projects/360/edit-image/{id}  (type = cover | panorama, image = file)
  const editTourImage = async (type, file) => {
    if (!form?.id) return { error: 'Create the project first.' }
    if (!file) return { error: 'Choose an image first.' }
    const body = new FormData()
    body.append('type', type)
    body.append('image', file)
    try {
      const json = await uploadFile(`/projects/360/edit-image/${form.id}`, body)
      const url = findKey(json, type === 'cover' ? 'cover_image_url' : 'panorama_image_url')
      if (url) setForm((f) => ({ ...f, [type === 'cover' ? 'tourCover' : 'tour360Image']: abs(url) }))
      await loadTour(form.id)
      flash(json?.message || `${type === 'cover' ? 'Cover' : 'Panorama'} image updated`)
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  // DELETE /projects/360/delete-image/{id}?type=cover|panorama  (no body)
  const deleteTourImage = async (type) => {
    if (!form?.id) return { error: 'Create the project first.' }
    try {
      const { json } = await apiFetch(`/projects/360/delete-image/${form.id}?type=${type}`, { method: 'DELETE' })
      setForm((f) => ({ ...f, [type === 'cover' ? 'tourCover' : 'tour360Image']: '' }))
      await loadTour(form.id)
      flash(json?.message || `${type === 'cover' ? 'Cover' : 'Panorama'} image deleted`)
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  /* ---------- LOCATION actions ---------- */
  // POST /projects/connectivity/update/{id}
  const saveLocation = async () => {
    if (!form?.id) return { error: 'Create the project first.' }
    const body = new FormData()
    body.append('title', (form.locationHeading || []).filter(Boolean).join(' '))
    body.append('description', form.locationDescription ?? '')
    body.append('button_text', form.locationCtaLabel ?? '')
    // store the iframe-safe URL, so pasting <iframe ...> or a normal Maps link still works
    body.append('map_link', mapSrcOf(form.locationMapUrl) || String(form.locationMapUrl ?? '').trim())

    // Build the exact array format the API expects
    const locs = (form.locationLandmarks || []).map(l => ({ location: l.label, time: l.distance }))
    body.append('locations', JSON.stringify(locs))

    try {
      const json = await uploadFile(`/projects/connectivity/update/${form.id}`, body)
      setForm((f) => ({ ...f, locDirty: false }))
      await loadLocation(form.id, true)
      flash(json?.message || 'Location saved')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  // POST /projects/connectivity/add-location/{id}
  const addLocationLandmark = async ({ location, time }) => {
    if (!form?.id) return { error: 'Create the project first.' }
    const body = new FormData()
    body.append('location', location)
    body.append('time', time)
    try {
      const json = await uploadFile(`/projects/connectivity/add-location/${form.id}`, body)
      await loadLocation(form.id)
      flash(json?.message || 'Location added')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  // POST /projects/connectivity/edit-location/{id}
  const editLocationLandmark = async (index, { location, time }) => {
    if (!form?.id) return { error: 'Create the project first.' }
    const body = new FormData()
    body.append('index', index)
    body.append('location', location)
    body.append('time', time)
    try {
      const json = await uploadFile(`/projects/connectivity/edit-location/${form.id}`, body)
      await loadLocation(form.id)
      flash(json?.message || 'Location updated')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  // DELETE /projects/connectivity/delete-location/{id}?index=X
  const deleteLocationLandmark = async (index) => {
    if (!form?.id) return { error: 'Create the project first.' }
    try {
      const { json } = await apiFetch(`/projects/connectivity/delete-location/${form.id}?index=${index}`, { method: 'DELETE' })
      await loadLocation(form.id)
      flash(json?.message || 'Location deleted')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  /* ---------- COUNTDOWN actions ---------- */
  // POST /projects/countdown/save  (JSON: project_id, completion_date "YYYY-MM-DD HH:mm:ss", is_active)
  const saveCountdown = async () => {
    if (!form?.id) return { error: 'Create the project first.' }
    const date = toApiDate(form.countdownDate)
    if (!date) return { error: 'Pick the project completion date and time.' }
    const payload = { project_id: form.id, completion_date: date, is_active: !!form.countdownActive }
    try {
      const { json } = await apiFetch('/projects/countdown/save', { method: 'POST', body: JSON.stringify(payload) })
      if (DEBUG_COUNTDOWN) console.log('COUNTDOWN SAVE RAW:', JSON.stringify(json, null, 2))
      const d = json?.data || {}
      const patch = {
        countdownDirty: false,
        countdownId: d.id ?? form.countdownId ?? null,
        ...(d.completion_date ? { countdownDate: toInputDate(d.completion_date) } : {}),
        ...(d.is_active !== undefined ? { countdownActive: truthy(d.is_active) } : {}),
      }
      setForm((f) => (f ? { ...f, ...patch } : f))
      flash(json?.message || 'Countdown saved')
      return { error: '', patch }
    } catch (err) {
      return { error: err.message }
    }
  }

  // POST /projects/countdown/status/{id}  (JSON: is_active) - saved instantly from the toggle
  const toggleCountdown = async (active) => {
    if (!form?.countdownId) return { error: 'Save the countdown first.' }
    try {
      const { json } = await apiFetch(`/projects/countdown/status/${form.countdownId}`, { method: 'POST', body: JSON.stringify({ is_active: !!active }) })
      if (DEBUG_COUNTDOWN) console.log('COUNTDOWN STATUS RAW:', JSON.stringify(json, null, 2))
      const d = json?.data || {}
      setForm((f) => (f ? { ...f, countdownActive: d.is_active !== undefined ? truthy(d.is_active) : !!active } : f))
      flash(json?.message || (active ? 'Countdown turned on' : 'Countdown turned off'))
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  // DELETE /projects/countdown/delete/{id}
  const deleteCountdown = async () => {
    if (!form?.countdownId) return { error: 'Nothing to delete.' }
    try {
      const { json } = await apiFetch(`/projects/countdown/delete/${form.countdownId}`, { method: 'DELETE' })
      setForm((f) => (f ? { ...f, countdownId: null, countdownDate: '', countdownActive: true, countdownDirty: false } : f))
      flash(json?.message || 'Countdown deleted')
      return { error: '' }
    } catch (err) {
      return { error: err.message }
    }
  }

  const save = async () => {
    if (!form.name.trim()) return setError('Open “Settings & SEO” and enter the project name.')
    let base = form
    if (form.settingsDirty) {
      const r = await saveSettings()
      if (r.error) return setError(r.error)
      base = { ...base, ...r.patch }
    }
    if (form.ovDirty) {
      const r = await saveOverview()
      if (r.error) return setError(r.error)
      base = { ...base, ...r.patch }
    }
    if (form.amDirty) {
      const r = await saveAmenities()
      if (r.error) return setError(r.error)
      base = { ...base, ...r.patch }
    }
    if (form.fpDirty) {
      const r = await saveFloorPlansHeader()
      if (r.error) return setError(r.error)
      base = { ...base, fpDirty: false }
    }
    if (form.prDirty) {
      const r = await savePricingHeader()
      if (r.error) return setError(r.error)
      base = { ...base, prDirty: false }
    }
    if (form.tourDirty) {
      const r = await saveTour()
      if (r.error) return setError(r.error)
      base = { ...base, ...r.patch }
    }
    if (form.locDirty) {
      const r = await saveLocation()
      if (r.error) return setError(r.error)
      base = { ...base, locDirty: false }
    }
    if (form.countdownDirty) {
      const r = await saveCountdown()
      if (r.error) return setError(r.error)
      base = { ...base, ...r.patch }
    }
    const project = { ...base, slug: base.slug || slugify(base.name), id: base.id || uid() }
    setItems((l) => (base.id ? l.map((p) => (p.id === project.id ? project : p)) : [project, ...l]))
    setForm(project); setError(''); flash('Project saved')
  }

  const createProject = async () => {
    if (creating) return
    setCreating(true); setCreateError('')
    try {
      const { json } = await apiFetch('/projects/create', { method: 'POST' })
      const d = json?.data
      if (!d) throw new Error('The server did not return the new project.')

      const project = {
        ...BLANK,
        id: d.id,
        name: d.name || 'New Project',
        navName: d.nav_name || '',
        status: normStatus(d.status),
        statusRaw: d.status || '',
        slug: slugify(d.name || 'new-project'),
        heroImage: d.desktop_banner_url || abs(d.desktop_banner),
        heroImageMobile: d.mobile_banner_url || abs(d.mobile_banner),
        tourThumbnail: d.thumbnail_image_url || abs(d.thumbnail_image),
        ...overviewFromApi(d),
      }

      setItems((l) => [project, ...l])
      setConfirmAdd(false)
      open(project)
      flash(json.message || 'Project created')
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const remove = () => {
    setItems((l) => l.filter((p) => p.id !== toDelete.id)); setToDelete(null); flash('Project deleted')
  }

  if (form) return (
    <>
      <Editor
        form={form}
        setForm={setForm}
        onBack={() => setForm(null)}
        onSave={save}
        onSaveOverview={saveOverview}
        onSaveAmenities={saveAmenities}
        onSaveGalleryTitle={saveGalleryTitle}
        onSaveFloorPlansHeader={saveFloorPlansHeader}
        onSavePricingHeader={savePricingHeader}
        onSaveTour={saveTour}
        onSaveLocation={saveLocation}
        onSaveCountdown={saveCountdown}
        onSaveSettings={saveSettings}
        actions={{
          addSlide, updateSlide, deleteSlide,
          addGalleryImages, updateGalleryImage, deleteGalleryImage,
          addFloorPlan, deleteFloorPlan,
          addPricingUnit, deletePricingUnit, bulkUploadPricing, setOfferPriceStatus,
          editTourImage, deleteTourImage,
          addLocationLandmark, editLocationLandmark, deleteLocationLandmark,
          toggleCountdown, deleteCountdown,
        }}
        error={error}
        loadingDetails={loadingDetails}
      />
      {toast && <Toast text={toast} />}
    </>
  )

  return (
    <div className={`${figtree.className} min-h-screen w-full`} style={{ backgroundColor: '#F7FAFD', color: INK }}>
      <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-8 sm:py-9">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="m-0 text-[28px] font-semibold tracking-tight text-[#1f2029] sm:text-[36px]">Projects</h1><p className="m-0 mt-1 text-[14px]" style={{ opacity: 0.7 }}>Open a project to edit its page section by section.</p></div>
          <Btn icon={Plus} onClick={() => { setCreateError(''); setConfirmAdd(true) }}>Add project</Btn>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#0F3A6B]" />
            <p className="mt-4 text-[14px] text-gray-500">Loading projects...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#D5E1ED] bg-white px-6 py-16 text-center"><p className="m-0 text-[15px] font-semibold text-[#1f2029]">Add your first project</p><Btn className="mt-5" icon={Plus} onClick={() => { setCreateError(''); setConfirmAdd(true) }}>Add project</Btn></div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <article key={p.id} className="group overflow-hidden rounded-[22px] border border-[#E0E8F0] bg-white shadow-[0_20px_50px_-32px_rgba(15,58,107,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-30px_rgba(15,58,107,0.4)]">
                <button type="button" onClick={() => open(p)} className="relative block h-44 w-full overflow-hidden text-left" style={{ backgroundColor: BLUE }}>
                  {p.heroImage && <img src={p.heroImage} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />}
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11.5px] font-bold ${TONE[normStatus(p.status)]}`}>{normStatus(p.status)}</span>
                </button>
                <div className="p-5">
                  <h3 className="m-0 text-[18px] font-bold" style={{ color: NAVY }}>{p.name}</h3>
                  <p className="m-0 mt-0.5 text-[12px] text-gray-400">/projects/{p.slug}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[[Images, p.galleryImages?.length || 0, 'Photos'], [Layers, p.floorPlans?.length || 0, 'Plans'], [Tag, p.plotPricing?.length || 0, 'Units']].map(([I, n, l]) => (
                      <div key={l} className="rounded-xl py-2.5" style={{ backgroundColor: BLUE_SOFT }}><I className="mx-auto h-4 w-4" style={{ color: NAVY }} strokeWidth={1.6} /><p className="m-0 mt-1 text-[15px] font-bold" style={{ color: NAVY }}>{n}</p><p className="m-0 text-[11px]" style={{ opacity: 0.6 }}>{l}</p></div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Btn className="flex-1" icon={Pencil} onClick={() => open(p)}>Edit project</Btn>
                    <button type="button" aria-label="Delete project" onClick={() => setToDelete(p)} className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 text-red-500 transition hover:bg-red-50"><Trash2 className="h-4 w-4" strokeWidth={1.8} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {confirmAdd && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm" onClick={() => !creating && setConfirmAdd(false)}>
          <div role="dialog" aria-label="Create project" onClick={(e) => e.stopPropagation()} className="w-full max-w-[420px] rounded-[22px] bg-white p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: BLUE }}><Plus className="h-5 w-5" style={{ color: NAVY }} strokeWidth={2} /></span>
            <h3 className="m-0 text-[17px] font-bold text-[#1f2029]">Create a new project?</h3>
            <p className="m-0 mt-1.5 text-[13.5px] leading-[1.6]" style={{ opacity: 0.75 }}>A project with default data will be created and opened so you can edit every section.</p>
            {createError && <p role="alert" className="m-0 mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">{createError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <Btn kind="ghost" disabled={creating} onClick={() => setConfirmAdd(false)}>Cancel</Btn>
              <Btn disabled={creating} onClick={createProject} icon={creating ? undefined : Plus}>
                {creating ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Creating…</> : createError ? 'Try again' : 'Create project'}
              </Btn>
            </div>
          </div>
        </div>
      )}

      {toDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm" onClick={() => setToDelete(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[400px] rounded-[22px] bg-white p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-50"><Trash2 className="h-5 w-5 text-red-500" strokeWidth={1.8} /></span>
            <h3 className="m-0 text-[17px] font-bold text-[#1f2029]">Delete {toDelete.name}?</h3>
            <p className="m-0 mt-1.5 text-[13.5px]" style={{ opacity: 0.7 }}>This removes the project and all its sections. This can’t be undone.</p>
            <div className="mt-5 flex justify-end gap-2"><Btn kind="ghost" onClick={() => setToDelete(null)}>Keep project</Btn><Btn kind="danger" onClick={remove}>Delete project</Btn></div>
          </div>
        </div>
      )}
      {toast && <Toast text={toast} />}
    </div>
  )
}

function Toast({ text }) {
  return <div role="status" className={`${figtree.className} fixed bottom-6 left-1/2 z-[10001] flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold text-white shadow-[0_16px_40px_-12px_rgba(15,58,107,0.7)]`} style={{ background: GRAD }}><Check className="h-4 w-4" strokeWidth={2.5} />{text}</div>
}