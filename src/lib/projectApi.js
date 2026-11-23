// src/lib/projectApi.js
'use client'

import { useEffect, useMemo, useState } from 'react'

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.crazystory.in/api'

// Paths in the API look like "projects/banners/xxx.webp" (Laravel storage disk).
// Change this if your files are served from somewhere else.
export const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE || 'https://api.crazystory.in/storage/'

/* ------------------------------------------------------------------ */
/*  SMALL HELPERS                                                      */
/* ------------------------------------------------------------------ */
const assetUrl = (path) => {
  if (!path) return ''
  const p = String(path)
  if (/^(https?:)?\/\//.test(p) || p.startsWith('data:')) return p
  return `${ASSET_BASE.replace(/\/+$/, '')}/${p.replace(/^\/+/, '')}`
}

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const slugify = (s = '') =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// "Everyday comforts for you" -> ["Everyday comforts", "for you"]  (components render 2-line headings)
export function splitHeading(text = '') {
  const words = String(text).trim().split(/\s+/).filter(Boolean)
  if (words.length < 2) return [words[0] || '', '']
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

// "NORTH-EAST" -> "North-East"
const titleCaseFacing = (s = '') =>
  String(s).toLowerCase().trim().replace(/(^|[-\s])([a-z])/g, (_, a, b) => a + b.toUpperCase())

// "studio, 1, 2" -> "Studio, 1 BHK, 2 BHK"
function formatTypes(raw = '') {
  return String(raw)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (/^\d+$/.test(t) ? `${t} BHK` : t.charAt(0).toUpperCase() + t.slice(1)))
    .join(', ')
}

const formatPhone = (raw = '') => {
  const digits = String(raw).replace(/[^\d+]/g, '')
  if (!digits) return ''
  if (digits.startsWith('+')) return digits
  return digits.length === 10 ? `+91${digits}` : `+${digits}`
}

// <iframe src="https://www.google.com/maps/embed?..."> -> the src
const embedSrc = (html = '') => {
  const m = String(html).match(/src=["']([^"']+)["']/i)
  return m ? m[1] : /^https?:/i.test(html) ? html : ''
}

// Pull lat/lng out of a Google embed URL (!2d = lng, !3d = lat) to build a "Get Directions" link
function directionsUrl(embed = '') {
  const lng = embed.match(/!2d(-?\d+(?:\.\d+)?)/)
  const lat = embed.match(/!3d(-?\d+(?:\.\d+)?)/)
  if (lat && lng) return `https://www.google.com/maps/dir/?api=1&destination=${lat[1]},${lng[1]}`
  return ''
}

/* ------------------------------------------------------------------ */
/*  SECTION MAPPERS                                                    */
/* ------------------------------------------------------------------ */
function mapQuickFacts(d) {
  if (!d) return []
  const facts = []
  if (d.prop_type) facts.push({ icon: 'type', label: 'Property Type', value: formatTypes(d.prop_type) })
  if (d.prop_size) facts.push({ icon: 'size', label: 'Project Size', value: `${d.prop_size} Acres` })
  if (d.prop_units) facts.push({ icon: 'units', label: 'Total Units', value: String(d.prop_units) })
  if (d.prop_floors) facts.push({ icon: 'floors', label: 'Floors', value: String(d.prop_floors) })
  if (d.prop_price) {
    const n = Number(d.prop_price)
    facts.push({
      icon: 'price',
      label: 'Starting Price',
      value: Number.isFinite(n) ? `₹ ${n.toLocaleString('en-IN')} / sq.ft` : String(d.prop_price),
    })
  }
  if (d.rera_number) facts.push({ icon: 'rera', label: 'RERA Number', value: d.rera_number })
  return facts
}

function mapAmenities(a) {
  const details = a?.details || []
  return details.map((x) => {
    const images = (x.images || []).map(assetUrl).filter(Boolean)
    return {
      title: x.title,
      eyebrow: x.tag || 'Explore',
      description: x.description || '',
      tags: x.tags || [],
      image: images[0] || '',
      gallery: images,
    }
  })
}

function mapLayout(l) {
  return {
    id: `layout-${l.id}`,
    title: l.title,
    type: l.unit_type || '',
    facing: l.facing || '',
    area: l.area ? `${l.area} sq.ft` : '',
    description: l.description || '',
    image: assetUrl(l.plan_image),
  }
}

const uniqueTypes = (plans) => [...new Set(plans.map((p) => p.type).filter(Boolean))]

function mapFloorPlans(header, layouts = []) {
  const blocks = header?.blocks || []
  const base = {
    floorPlansEyebrow: header?.eyebrow || 'Floor Plans',
    floorPlansHeading: header?.heading ? splitHeading(header.heading) : undefined,
    floorPlansDescription: header?.description || undefined,
  }

  if (blocks.length) {
    return {
      ...base,
      floorPlanBlocks: blocks.map((b) => {
        const plans = layouts.filter((l) => l.block_name === b.name).map(mapLayout)
        return { id: b.name, label: b.name, tag: b.status || '', tabs: uniqueTypes(plans), plans }
      }),
    }
  }

  const plans = layouts.map(mapLayout)
  return { ...base, floorPlans: plans, floorPlanTabs: uniqueTypes(plans) }
}

// Which filter tabs does this flat belong to?  "2BHK-2T" -> "2BHK",  "A101" -> "Block-A"
function categoriesFor(row, tabs) {
  const type = String(row.type || '').toLowerCase().replace(/[\s_]+/g, '')
  const flat = String(row.flat_no || '').toUpperCase()
  return tabs.filter((tab) => {
    const t = String(tab).toLowerCase().replace(/[\s_]+/g, '')
    const block = t.match(/^block-?([a-z0-9]+)$/)
    if (block) return flat.startsWith(block[1].toUpperCase())
    return type.startsWith(t)
  })
}

function mapPricing(header, rows = []) {
  const offerOn = String(header?.offer_price_status || '').toLowerCase() === 'yes'
  const filterTabs = header?.filter_tabs || []

  const plotPricing = rows.map((r) => {
    const original = num(r.original_price)
    const offer = num(r.offer_price)
    return {
      id: `price-${r.id}`,
      flatNo: r.flat_no,
      floor: String(r.floor || '').replace(/\s*floor/i, ''), // "1st floor" -> "1st" (UI adds " floor")
      type: r.type,
      facing: titleCaseFacing(r.facing),
      sqft: r.area,
      total: original,
      finalTotal: original,
      offerPrice: offerOn && offer > 0 && offer < original ? offer : undefined,
      categories: categoriesFor(r, filterTabs),
    }
  })

  const features = [1, 2, 3]
    .map((n) => ({
      image: assetUrl(header?.[`icon_${n}_image`]),
      title: header?.[`icon_${n}_title`] || '',
      text: [header?.[`icon_${n}_desc`] || ''],
    }))
    .filter((f) => f.title || f.image)

  return {
    plotPricing,
    plotPricingTabs: filterTabs.length
      ? [{ id: 'all', label: 'All' }, ...filterTabs.map((t) => ({ id: t, label: t }))]
      : undefined,
    plotPricingEyebrow: header?.eyebrow || undefined,
    plotPricingHeading: header?.heading ? splitHeading(header.heading) : undefined,
    plotPricingDescription: header?.description || undefined,
    plotFeatures: features,
    plotPricingCtaHeading: header?.cta_title ? splitHeading(header.cta_title) : undefined,
    plotPricingCtaText: header?.cta_description || undefined,
    plotPricingCtaImage: assetUrl(header?.cta_image) || undefined,
    plotPricingCtaButton: header?.cta_button_text || undefined,
    offerValidityText: offerOn ? header?.validity_message || 'Pre-launch offer' : '',
  }
}

/* ------------------------------------------------------------------ */
/*  MAIN MAPPER:  API project  ->  `project` prop of ProjectBanner     */
/* ------------------------------------------------------------------ */
export function mapProject(p) {
  if (!p) return null
  const d = p.detail || {}
  const tour = p.three_sixty
  const conn = p.connectivity
  const embed = embedSrc(conn?.map_link)

  const heroImage = assetUrl(p.desktop_banner || d.hero_image)
  const heroImageMobile = assetUrl(p.mobile_banner) || heroImage

  return {
    id: p.id,
    slug: String(p.id),
    name: p.name,
    status: p.status,

    /* banner + overview */
    heroImage,
    heroImageMobile,
    aboutImage: assetUrl(d.hero_image),
    eyebrow: d.hero_subtitle || p.hero_subtitle || undefined,
    heading: d.hero_title ? splitHeading(d.hero_title) : undefined,
    description: d.hero_description || '',
    callNumber: formatPhone(d.call_button_number),
    callLabel: d.call_button_text || 'Call Us',
    reraPdf: assetUrl(d.rera_pdf),
    quickFacts: mapQuickFacts(d),

    /* amenities */
    amenitiesEyebrow: p.amenity?.section_subtitle || undefined,
    amenitiesHeading: p.amenity?.section_title ? splitHeading(p.amenity.section_title) : undefined,
    amenitiesDescription: p.amenity?.section_description || undefined,
    amenityTabs: mapAmenities(p.amenity),

    /* gallery */
    galleryHeading: p.gallery_title ? [p.gallery_title] : undefined,
    galleryImages: (p.galleries || [])
      .map((g) => ({ image: assetUrl(g.image_path), title: g.image_title || '' }))
      .filter((g) => g.image),

    /* floor plans */
    ...mapFloorPlans(p.layout_header, p.layouts),

    /* pricing */
    ...mapPricing(p.pricing_header, p.pricings),

    /* 360 tour */
    tourEyebrow: tour?.eyebrow || undefined,
    tourHeading: tour?.title ? splitHeading(tour.title) : undefined,
    tourDescription: tour?.description || undefined,
    tourThumbnail: assetUrl(tour?.cover_image) || undefined,
    tour360Image: assetUrl(tour?.panorama_image) || undefined,
    tourCtaLabel: tour?.button_text || undefined,

    /* location */
    locationHeading: conn?.title ? [conn.title] : undefined,
    locationDescription: conn?.description || undefined,
    locationMapEmbed: embed || undefined,
    locationMapUrl: directionsUrl(embed) || undefined,
    locationLandmarks: (conn?.locations || []).map((l) => ({ label: l.location, distance: l.time })),
  }
}

/* ------------------------------------------------------------------ */
/*  FETCH + HOOK                                                       */
/* ------------------------------------------------------------------ */
let projectsPromise = null

export function fetchProjects() {
  if (!projectsPromise) {
    projectsPromise = fetch(`${API_BASE}/projects/list`, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        return res.json()
      })
      .then((json) => {
        if (!json || json.status !== true || !Array.isArray(json.data)) {
          throw new Error(json?.message || 'Unexpected API response')
        }
        return json.data
      })
      .catch((err) => {
        projectsPromise = null // allow a retry next time
        throw err
      })
  }
  return projectsPromise
}

export function findProject(list, { projectId, slug } = {}) {
  if (projectId != null && projectId !== '') {
    return list.find((p) => String(p.id) === String(projectId)) || null
  }
  if (slug) {
    return list.find((p) => slugify(p.slug || p.name) === slugify(slug) || String(p.id) === String(slug)) || null
  }
  return null
}

/**
 * const { project, loading, error } = useProject({ projectId: 7 })
 * Pass either `projectId` (recommended - the API has no slug and two projects share the name "New Project")
 * or `slug` (matched against slugified name or the id).
 */
export function useProject({ projectId, slug } = {}) {
  const [raw, setRaw] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    fetchProjects()
      .then((list) => {
        if (cancelled) return
        const found = findProject(list, { projectId, slug })
        if (!found) setError('Project not found')
        setRaw(found)
      })
      .catch((err) => { if (!cancelled) setError(err.message || 'Could not load project') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [projectId, slug])

  // memoised so ProjectBanner's useMemo/useEffect deps stay stable between renders
  const project = useMemo(() => mapProject(raw), [raw])

  return { project, loading, error }
}