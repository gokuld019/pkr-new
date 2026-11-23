'use client';
/* eslint-disable @next/next/no-img-element */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Icon, PageHeader, Badge, Field, ImageInput, Drawer, ConfirmDelete, Empty } from '../ui';

const API = 'https://api.crazystory.in/api/blogs';
// Update this if your backend serves uploaded images from a different path
const IMG_BASE = 'https://api.crazystory.in/storage/';
const TOKEN_KEY = 'pkr_admin_token';

const BLANK = { cover: '', title: '', category: '', excerpt: '', content: '', readTime: '' };

// Reads the admin token saved at login and sends it as a Bearer token
const headers = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const imgSrc = (p) => {
  if (!p) return '';
  if (/^(https?:|data:|blob:|\/)/.test(p)) return p;
  return IMG_BASE + p;
};

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

// API shape -> form shape
const fromApi = (b) => ({
  id: b.id,
  cover: b.image || '',
  title: b.title || '',
  category: b.category || '',
  excerpt: b.short_description || '',
  content: b.content || b.full_description || '',
  readTime: b.read_time || '',
  date: b.created_at || '',
});

// Convert blob: URLs to base64 data URIs (the API expects base64). data: and server paths pass through.
const toBase64 = async (url) => {
  if (!url.startsWith('blob:')) return url;
  const blob = await (await fetch(url)).blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Could not read image'));
    r.readAsDataURL(blob);
  });
};

// Turns a failed response into a readable error (handles 401 and validation errors)
const apiError = (res, json, fallback) => {
  if (res.status === 401) return 'Your session has expired. Please log in again.';
  if (json?.errors) return Object.values(json.errors).flat().join(' ');
  return json?.message || fallback;
};

export default function BlogsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');
  const [q, setQ] = useState('');

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const close = () => {
    setForm(null);
    setError('');
  };

  // GET /api/blogs
  const load = useCallback(async () => {
    try {
      setPageError('');
      const res = await fetch(API, { headers: headers() });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(apiError(res, json, 'Could not load blogs. Please try again.'));
      const list = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : json.data?.data || [];
      setItems(list.map(fromApi));
    } catch (e) {
      setPageError(e.message || 'Could not load blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(
    () => items.filter((b) => b.title.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

  const save = async () => {
    if (saving) return;
    if (!form.cover) return setError('Add a cover image.');
    if (!form.title.trim()) return setError('Enter a blog title.');

    setSaving(true);
    setError('');
    try {
      const isEdit = !!form.id;
      const body = {
        title: form.title.trim(),
        category: form.category.trim(),
        short_description: form.excerpt,
        content: form.content,
        full_description: form.content,
        read_time: form.readTime,
      };

      // Create always needs an image. On edit, send it only if a new one was picked
      // (existing images are server paths like "blogs/xyz.jpeg").
      const isNewImage = form.cover.startsWith('blob:') || form.cover.startsWith('data:');
      if (!isEdit || isNewImage) body.image = await toBase64(form.cover);

      // POST /api/blogs/create  or  POST /api/blogs/update/:id
      const url = isEdit ? `${API}/update/${form.id}` : `${API}/create`;
      const res = await fetch(url, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json.status === false) {
        throw new Error(apiError(res, json, 'Could not save the blog.'));
      }

      await load(); // create response has no data, so refetch the list
      close();
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  // DELETE /api/blogs/delete/:id
  const remove = async () => {
    try {
      const res = await fetch(`${API}/delete/${toDelete.id}`, { method: 'DELETE', headers: headers() });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.status === false) throw new Error(apiError(res, json, 'Could not delete the blog.'));
      setItems((list) => list.filter((b) => b.id !== toDelete.id));
    } catch (e) {
      setPageError(e.message);
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
      <PageHeader title="Blogs" subtitle="Write and publish articles for your website." actionLabel="New blog" onAction={() => setForm(BLANK)} />

      <div className="a-bar">
        <div className="a-search">
          <Icon name="search" size={17} />
          <input type="text" placeholder="Search blogs" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {pageError && <div className="a-err" role="alert">{pageError}</div>}

      <div className="a-card a-list">
        {loading ? (
          <Empty title="Loading blogs" text="Please wait a moment." />
        ) : shown.length === 0 ? (
          <Empty title="No blogs found" text="Try another search, or write a new post." actionLabel="New blog" onAction={() => setForm(BLANK)} />
        ) : (
          shown.map((b) => (
            <div className="a-row" key={b.id}>
              <img className="a-row-img" src={imgSrc(b.cover)} alt="" />
              <div className="a-row-main">
                <h3>{b.title}</h3>
                <p>{b.category || 'No category'} • {fmt(b.date)}{b.readTime ? ` • ${b.readTime}` : ''}</p>
              </div>
              <Badge tone="green">Published</Badge>
              <div className="a-row-act">
                <button className="a-icon" onClick={() => setForm(b)} aria-label="Edit blog"><Icon name="edit" /></button>
                <button className="a-icon del" onClick={() => setToDelete(b)} aria-label="Delete blog"><Icon name="trash" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <Drawer wide open={!!form} title={form?.id ? 'Edit blog' : 'New blog'} saveLabel={saving ? 'Saving...' : form?.id ? 'Update' : 'Publish'} onClose={close} onSave={save}>
        {form && (
          <>
            {error && <div className="a-err" role="alert">{error}</div>}
            <ImageInput label="Cover image" hint="Recommended 1200 × 630 px." value={imgSrc(form.cover)} onChange={(url) => set({ cover: url })} />
            <Field label="Title">
              <input type="text" placeholder="How to Plan Your Budget Before Buying a New Home?" value={form.title} onChange={(e) => set({ title: e.target.value })} />
            </Field>
            <div className="a-cols">
              <Field label="Category">
                <input type="text" placeholder="REAL ESTATE" value={form.category} onChange={(e) => set({ category: e.target.value })} />
              </Field>
              <Field label="Read time">
                <input type="text" placeholder="10 MIN READ" value={form.readTime} onChange={(e) => set({ readTime: e.target.value })} />
              </Field>
            </div>
            <Field label="Short summary" hint="Shown on the blog list page.">
              <textarea value={form.excerpt} onChange={(e) => set({ excerpt: e.target.value })} />
            </Field>
            {/* TODO: swap this textarea for a rich text editor (for example Tiptap or React Quill). The API accepts HTML. */}
            <Field label="Content" hint="HTML is supported, for example <h1> and <p>.">
              <textarea style={{ minHeight: 240 }} placeholder="Write your article here" value={form.content} onChange={(e) => set({ content: e.target.value })} />
            </Field>
          </>
        )}
      </Drawer>

      <ConfirmDelete open={!!toDelete} name={toDelete ? `“${toDelete.title}”` : ''} onCancel={() => setToDelete(null)} onConfirm={remove} />
    </>
  );
}