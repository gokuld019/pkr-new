// src/app/api/meta-feed/route.js
import { NextResponse } from 'next/server'

// Cache the response for 10 minutes so the Graph API isn't hit on every page view
export const revalidate = 600

const VERSION = process.env.META_GRAPH_VERSION || 'v23.0'
const GRAPH = `https://graph.facebook.com/${VERSION}`
const LIMIT = 3
// How many recent Facebook posts to look through when picking the LIMIT to show
const FB_LOOKBACK = 25

async function graph(path, params, token) {
  const url = new URL(`${GRAPH}/${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  url.searchParams.set('access_token', token)

  const res = await fetch(url, { next: { revalidate } })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) {
    throw new Error(json?.error?.message || `Graph API HTTP ${res.status}`)
  }
  return json
}

const byNewest = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()

/* ---------------- Facebook ---------------- */
function mapFacebookPost(p) {
  const media = p.attachments?.data?.[0]
  const mediaType = String(media?.media_type || '').toLowerCase()
  const isReel = /\/reel\//.test(p.permalink_url || '')

  const kind =
    isReel ? 'reel'
    : mediaType === 'video' ? 'video'
    : mediaType === 'album' ? 'album'
    : 'post'

  return {
    id: p.id,
    url: p.permalink_url,
    image: p.full_picture || media?.media?.image?.src || '',
    text: p.message || p.story || '',
    date: p.created_time,
    kind,
  }
}

async function getFacebookPosts(pageId, pageToken) {
  const fields =
    'id,message,story,created_time,permalink_url,full_picture,attachments{media_type,type,url,media{image{src}}}'

  // published_posts = only what the Page itself posted (no visitor posts)
  let data = (await graph(`${pageId}/published_posts`, { fields, limit: FB_LOOKBACK }, pageToken)).data || []
  if (!data.length) {
    data = (await graph(`${pageId}/posts`, { fields, limit: FB_LOOKBACK }, pageToken)).data || []
  }

  const posts = data
    .filter((p) => p.permalink_url && (p.message || p.full_picture))
    .map(mapFacebookPost)

  // Photo / text / album posts first, then reels & videos to fill the remaining slots.
  // The final list is sorted newest → oldest so the card still reads like a feed.
  const isVideo = (p) => p.kind === 'video' || p.kind === 'reel'
  const staticPosts = posts.filter((p) => !isVideo(p))
  const videoPosts = posts.filter(isVideo)

  return [...staticPosts, ...videoPosts].slice(0, LIMIT).sort(byNewest)
}

/* ---------------- Instagram ---------------- */
function mapInstagramPost(m) {
  const type = String(m.media_type || '').toUpperCase()
  const product = String(m.media_product_type || '').toUpperCase()

  const kind =
    product === 'REELS' ? 'reel'
    : type === 'VIDEO' ? 'video'
    : type === 'CAROUSEL_ALBUM' ? 'album'
    : 'post'

  return {
    id: m.id,
    url: m.permalink,
    image: m.thumbnail_url || m.media_url || '',
    text: m.caption || '',
    date: m.timestamp,
    kind,
  }
}

async function getInstagramPosts(igUserId, token) {
  const { data = [] } = await graph(
    `${igUserId}/media`,
    { fields: 'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp', limit: LIMIT },
    token
  )
  return data.map(mapInstagramPost)
}

/* ---------------- Route ---------------- */
export async function GET(request) {
  const userToken = process.env.META_ACCESS_TOKEN
  const pageId = process.env.META_PAGE_ID

  if (!userToken || !pageId) {
    return NextResponse.json({ facebook: [], instagram: [], error: 'META_ACCESS_TOKEN / META_PAGE_ID missing in .env.local' })
  }

  const result = { facebook: [], instagram: [] }
  const errors = []
  let pageToken = userToken
  let igUserId = process.env.META_IG_USER_ID || ''

  // Exchange for the Page token (works with a user token; a Page token simply returns itself / nothing)
  try {
    const page = await graph(pageId, { fields: 'access_token,instagram_business_account' }, userToken)
    if (page.access_token) pageToken = page.access_token
    if (!igUserId) igUserId = page.instagram_business_account?.id || ''
  } catch (e) {
    errors.push(`page: ${e.message}`)
  }

  const [fb, ig] = await Promise.allSettled([
    getFacebookPosts(pageId, pageToken),
    igUserId ? getInstagramPosts(igUserId, pageToken) : Promise.resolve([]),
  ])

  if (fb.status === 'fulfilled') result.facebook = fb.value
  else errors.push(`facebook: ${fb.reason?.message}`)

  if (ig.status === 'fulfilled') result.instagram = ig.value
  else errors.push(`instagram: ${ig.reason?.message}`)

  if (errors.length) result.error = errors.join(' | ')

  // Debug info only in dev: never expose token details / page ids in production
  if (process.env.NODE_ENV !== 'production' && new URL(request.url).searchParams.get('debug') === '1') {
    result.debug = {
      pageId,
      igUserId,
      facebook: `${result.facebook.length} posts (${result.facebook.map((p) => p.kind).join(', ')})`,
      instagram: `${result.instagram.length} posts`,
    }
  }

  return NextResponse.json(result)
}