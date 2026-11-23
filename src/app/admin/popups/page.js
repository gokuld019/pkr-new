'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, PageHeader, Badge, ImageInput, Drawer, ConfirmDelete } from '../ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.crazystory.in/api';
// Update returns a relative path (home/xxx.jpg); this base turns it into a full URL
const IMG_BASE = process.env.NEXT_PUBLIC_IMG_URL || 'http://api.crazystory.in/storage/';

const imgUrl = (p) => (!p ? '' : /^https?:/.test(p) ? p : IMG_BASE + p);

const authHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pkr_admin_token') : null;
  return { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
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

export default function PopupsPage() {
  const router = useRouter();
  const [popup, setPopup] = useState('');
  const [legacy, setLegacy] = useState({});
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { res, data } = await request('/home/details', { headers: authHeaders() });

        // FIX: API returns status: true (boolean), not 'success' (string)
        if (!res.ok || data.status !== true) throw new Error(data.message || 'load');

        if (alive) {
          setPopup(imgUrl(data.data?.popup_image));
          setLegacy(data.data?.legacy || {});
        }
      } catch (e) {
        if (e.message === 'unauthorized') return router.push('/admin/login');
        if (alive) setNote("Couldn't load the current popup. Check your connection and refresh the page.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  const closeForm = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview('');
    setFile(null);
    setFormError('');
    setOpen(false);
  };

  const upload = async () => {
    if (uploading) return;
    if (!file) return setFormError('Choose an image first.');
    setFormError('');
    setUploading(true);
    try {
      const body = new FormData();
      body.append('popup_image', file);
      // Send the current legacy numbers back so this update doesn't clear them
      if (legacy.years) body.append('legacy_years', legacy.years);
      if (legacy.space) body.append('legacy_space', legacy.space);
      if (legacy.landmark) body.append('legacy_landmark', legacy.landmark);

      const { res, data } = await request('/home/update-home', { method: 'POST', headers: authHeaders(), body });

      // FIX: Boolean status check
      if (!res.ok || data.status !== true) {
        setFormError(data.message || "Couldn't update the popup. Try again.");
        return;
      }
      setNote('');
      setPopup(imgUrl(data.data?.popup_image));
      closeForm();
    } catch (e) {
      if (e.message === 'unauthorized') return router.push('/admin/login');
      setFormError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (removing) return;
    setRemoving(true);
    setNote('');
    try {
      const body = new FormData();
      body.append('remove_popup', '1');
      const { res, data } = await request('/home/update-home', { method: 'POST', headers: authHeaders(), body });

      // FIX: Boolean status check
      if (!res.ok || data.status !== true) {
        setNote(data.message || "Couldn't remove the popup. Try again.");
      } else {
        setPopup('');
      }
      setConfirmRemove(false);
    } catch (e) {
      if (e.message === 'unauthorized') return router.push('/admin/login');
      setNote("Couldn't reach the server. Check your connection and try again.");
      setConfirmRemove(false);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Popup"
        subtitle="The promo image visitors see when they open the home page."
        actionLabel={popup ? 'Change popup image' : 'Add popup image'}
        onAction={() => setOpen(true)}
      />

      {note && <div className="a-err" role="alert">{note}</div>}

      {loading ? (
        <p className="a-sub">Loading popup…</p>
      ) : (
        <div className="a-card" style={{ padding: 24, display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: 'min(340px,100%)', background: 'var(--tint)', borderRadius: 14, overflow: 'hidden', minHeight: 200, display: 'grid', placeItems: 'center' }}>
            {popup ? (
              <img src={popup} alt="Current popup" style={{ width: '100%', maxHeight: 460, objectFit: 'contain', display: 'block' }} />
            ) : (
              <span className="a-drop-empty"><Icon name="image" size={26} />No popup image yet</span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <Badge tone={popup ? 'green' : 'gray'}>{popup ? 'Live' : 'Not set'}</Badge>
            <h2 style={{ fontSize: 18, color: 'var(--navy)', margin: '14px 0 6px' }}>
              {popup ? 'Your popup is showing on the website' : 'Add a popup to promote an offer'}
            </h2>
            <p className="a-sub" style={{ marginBottom: 18 }}>
              Uploading a new image replaces the current one. Portrait or square images work best.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="a-btn" onClick={() => setOpen(true)}>
                <Icon name="upload" size={16} /> {popup ? 'Change popup image' : 'Add popup image'}
              </button>
              {popup && (
                <button className="a-btn ghost" onClick={() => setConfirmRemove(true)}>
                  <Icon name="trash" size={16} /> Remove popup
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Drawer open={open} title={popup ? 'Change popup image' : 'Add popup image'} saveLabel={uploading ? 'Uploading…' : 'Upload'} onClose={closeForm} onSave={upload}>
        {formError && <div className="a-err" role="alert">{formError}</div>}
        <ImageInput
          label="Popup image"
          hint="Portrait or square works best, WebP or JPG."
          value={preview}
          onChange={(url, f) => {
            if (preview) URL.revokeObjectURL(preview);
            setPreview(url);
            setFile(f);
            setFormError('');
          }}
        />
      </Drawer>

      <ConfirmDelete open={confirmRemove} name="the popup" onCancel={() => setConfirmRemove(false)} onConfirm={remove} />
    </>
  );
}