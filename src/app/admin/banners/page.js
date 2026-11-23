'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, PageHeader, Drawer, Empty } from '../ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.crazystory.in/api';
const IMG_BASE = process.env.NEXT_PUBLIC_IMG_URL || 'http://api.crazystory.in/storage/';

const TYPES = {
  desktop: { label: 'Desktop', size: '1366 × 626 px', ratio: '1366 / 626', min: 280 },
  mobile: { label: 'Mobile', size: '720 × 1035 px', ratio: '720 / 1035', min: 170 },
};

const imgUrl = (p) => (/^https?:/.test(p) ? p : IMG_BASE + p);

// API returns status: "success" (string); also accept boolean true
const isOk = (data) => data && (data.status === 'success' || data.status === true);

const authHeaders = (json) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pkr_admin_token') : null;
  return {
    Accept: 'application/json',
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request(path, options) {
  const res = await fetch(`${API}${path}`, options);
  if (res.status === 401) throw new Error('unauthorized');
  const contentType = res.headers.get('content-type');
  let data = {};
  if (contentType && contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  } else {
    data = { status: false, message: `Server returned ${res.status} - Not JSON` };
  }
  return { res, data };
}

export default function BannersPage() {
  const router = useRouter();
  const [type, setType] = useState('desktop');
  const [lists, setLists] = useState({ desktop: [], mobile: [] });
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [moving, setMoving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);

  const cfg = TYPES[type];
  const list = lists[type];

  const toLogin = () => router.push('/admin/login');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { res, data } = await request('/home/details', { headers: authHeaders() });

        if (!res.ok || !isOk(data)) {
          throw new Error(data.message || 'list');
        }

        const d = data.data || {};
        if (alive) {
          setLists({
            desktop: (d.desktop_banners || []).map(imgUrl),
            mobile: (d.mobile_banners || []).map(imgUrl),
          });
          setNote('');
        }
      } catch (e) {
        if (e.message === 'unauthorized') return router.push('/admin/login');
        if (alive) setNote(`Couldn't load your saved banners. (${e.message})`);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  const closeForm = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setFormError('');
    setOpen(false);
  };

  const pick = (e) => {
    const picked = Array.from(e.target.files || []).map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setFiles((f) => [...f, ...picked]);
    setFormError('');
    e.target.value = '';
  };

  const upload = async () => {
    if (uploading) return;
    if (!files.length) return setFormError('Choose at least one image.');
    setFormError('');
    setUploading(true);
    try {
      const body = new FormData();
      body.append('type', type);
      files.forEach(({ file }) => body.append('banners[]', file));
      const { res, data } = await request('/home/banners/add', { method: 'POST', headers: authHeaders(), body });

      if (!res.ok || !isOk(data)) {
        setFormError(data.message || "Couldn't upload the banners. Try again.");
        return;
      }

      const newBanners = data.banners || (data.data && data.data.banners) || [];
      setLists((l) => ({ ...l, [type]: [...new Set(newBanners.map(imgUrl))] }));
      closeForm();
    } catch (e) {
      if (e.message === 'unauthorized') return toLogin();
      setFormError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const move = async (i, dir) => {
    if (moving || deleting) return;
    const to = i + dir;
    const order = list.map((_, idx) => idx);
    [order[i], order[to]] = [order[to], order[i]];
    setError('');
    setMoving(true);
    try {
      const { res, data } = await request('/home/banners/reorder', {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify({ type, order }),
      });

      const newBanners = data.banners || (data.data && data.data.banners);
      if (!res.ok || !isOk(data) || !Array.isArray(newBanners)) {
        setError(data.message || "Couldn't change the order. Try again.");
        return;
      }
      setLists((l) => ({ ...l, [type]: newBanners.map(imgUrl) }));
    } catch (e) {
      if (e.message === 'unauthorized') return toLogin();
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setMoving(false);
    }
  };

  // API: DELETE /home/banners/{index}?type=desktop  ->  { status: "success", banners: [...] }
  const remove = async (i) => {
    if (deleting || moving) return;
    if (!confirm('Are you sure you want to delete this banner?')) return;

    setError('');
    setDeleting(true);
    try {
      const { res, data } = await request(`/home/banners/${i}?type=${type}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const newBanners = data.banners || (data.data && data.data.banners);
      if (!res.ok || !isOk(data) || !Array.isArray(newBanners)) {
        setError(data.message || "Couldn't delete the banner. Try again.");
        return;
      }

      // Replace list with what the server says is left
      setLists((l) => ({ ...l, [type]: newBanners.map(imgUrl) }));
    } catch (e) {
      if (e.message === 'unauthorized') return toLogin();
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Home banners"
        subtitle="These slides appear in the home page hero, in the order shown here."
        actionLabel={`Add ${cfg.label.toLowerCase()} banners`}
        onAction={() => setOpen(true)}
      />

      <div className="a-bar">
        <div className="a-seg">
          {Object.entries(TYPES).map(([key, t]) => (
            <button key={key} className={type === key ? 'on' : ''} onClick={() => setType(key)}>
              {t.label} ({lists[key].length})
            </button>
          ))}
        </div>
      </div>

      {note && <div className="a-err" role="alert">{note}</div>}
      {error && <div className="a-err" role="alert">{error}</div>}

      {loading ? (
        <p className="a-sub">Loading banners…</p>
      ) : list.length === 0 ? (
        <div className="a-card">
          <Empty
            title={`Add your first ${cfg.label.toLowerCase()} banner`}
            text={`Upload images at ${cfg.size} for the best fit.`}
            actionLabel={`Add ${cfg.label.toLowerCase()} banners`}
            onAction={() => setOpen(true)}
          />
        </div>
      ) : (
        <div className="a-grid" style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${cfg.min}px,1fr))` }}>
          {list.map((p, i) => (
            <article key={p} className="a-card a-banner">
              <div className="a-thumb" style={{ aspectRatio: cfg.ratio }}>
                <img src={imgUrl(p)} alt={`${cfg.label} banner ${i + 1}`} />
                <span className="a-order">Slide {i + 1}</span>
              </div>
              <div className="a-banner-body">
                <div className="a-banner-foot">
                  <span className="a-sub" style={{ margin: 0 }}>{i + 1} of {list.length}</span>
                  <div className="a-row-act">
                    <button className="a-icon" disabled={i === 0 || moving || deleting} onClick={() => move(i, -1)} aria-label="Move earlier"><Icon name="up" /></button>
                    <button className="a-icon" disabled={i === list.length - 1 || moving || deleting} onClick={() => move(i, 1)} aria-label="Move later"><Icon name="down" /></button>
                    <button className="a-icon a-del" disabled={deleting || moving} onClick={() => remove(i)} aria-label="Delete banner"><Icon name="trash" /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Drawer open={open} title={`Add ${cfg.label.toLowerCase()} banners`} saveLabel={uploading ? 'Uploading…' : 'Upload'} onClose={closeForm} onSave={upload}>
        {formError && <div className="a-err" role="alert">{formError}</div>}
        <label className="a-drop" style={{ marginBottom: 6 }}>
          <span className="a-drop-empty"><Icon name="upload" size={22} />Choose images</span>
          <input type="file" accept="image/*" multiple hidden onChange={pick} />
        </label>
        <small style={{ color: 'var(--muted)', display: 'block', marginBottom: 18 }}>
          Recommended {cfg.size}, WebP or JPG. You can pick several at once.
        </small>
        {files.length > 0 && (
          <div className="a-gallery">
            {files.map((f, i) => (
              <div className="a-tile" key={f.preview}>
                <img src={f.preview} alt="" />
                <button aria-label="Remove image" onClick={() => setFiles((all) => all.filter((_, x) => x !== i))}><Icon name="x" size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </>
  );
}