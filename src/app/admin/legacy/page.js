'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader, Field } from '../ui';

const API = process.env.NEXT_PUBLIC_API_URL;

const TEXT_FIELDS = [
  { key: 'hero_subtitle', label: 'Hero subtitle', placeholder: 'MORE THAN JUST A HOME' },
  { key: 'hero_title', label: 'Hero title', placeholder: 'Designed for a Better Way of Life' },
  { key: 'call_button_text', label: 'Call button text', placeholder: 'Call Us' },
  { key: 'call_button_number', label: 'Call button number', placeholder: '9876543210' },
  { key: 'prop_type', label: 'Property type', placeholder: 'Studio, 1, 2 & 3 BHK' },
  { key: 'prop_size', label: 'Property size', placeholder: '1.41 Acres' },
  { key: 'prop_units', label: 'Total units', placeholder: '186' },
  { key: 'prop_price', label: 'Price', placeholder: '₹ 5,100 / Sq.Ft' },
  { key: 'prop_floors', label: 'Floors', placeholder: 'Stilt + 5' },
  { key: 'rera_number', label: 'RERA number', placeholder: 'TNRERA/35/BLG/0317/2026' },
];

const EMPTY = {
  hero_subtitle: '',
  hero_title: '',
  hero_description: '',
  call_button_text: '',
  call_button_number: '',
  prop_type: '',
  prop_size: '',
  prop_units: '',
  prop_price: '',
  prop_floors: '',
  rera_number: '',
};

const authHeaders = () => {
  const token = localStorage.getItem('pkr_admin_token');
  return { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

async function request(path, options) {
  const res = await fetch(`${API}${path}`, options);
  if (res.status === 401) throw new Error('unauthorized');
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export default function ProjectFirstDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState(EMPTY);
  const [heroImage, setHeroImage] = useState(null);
  const [reraPdf, setReraPdf] = useState(null);
  const [heroPreview, setHeroPreview] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [existingPdf, setExistingPdf] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Load existing details (if the GET endpoint exists). If not, the form just starts empty.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { res, data } = await request(`/projects/firstdetail/${id}`, { headers: authHeaders() });
        if (res.ok && data.status === 'success' && alive) {
          const d = data.data || {};
          const next = {};
          Object.keys(EMPTY).forEach((k) => {
            next[k] = d[k] != null ? String(d[k]) : '';
          });
          setForm(next);
          setExistingImage(d.hero_image || '');
          setExistingPdf(d.rera_pdf || '');
        }
      } catch (e) {
        if (e.message === 'unauthorized') return router.push('/admin/login');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, router]);

  // Local preview for newly chosen hero image
  useEffect(() => {
    if (!heroImage) return setHeroPreview('');
    const url = URL.createObjectURL(heroImage);
    setHeroPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [heroImage]);

  const change = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
    setError('');
  };

  const save = async () => {
    if (saving) return;

    const allFields = [...TEXT_FIELDS, { key: 'hero_description', label: 'Hero description' }];
    const empty = allFields.find((f) => !form[f.key].trim());
    if (empty) return setError(`Enter ${empty.label.toLowerCase()}.`);
    if (!/^\d{10}$/.test(form.call_button_number.trim())) {
      return setError('Call button number must be a 10-digit number.');
    }

    setError('');
    setSaving(true);
    try {
      const body = new FormData();
      Object.keys(EMPTY).forEach((k) => body.append(k, form[k].trim()));
      if (heroImage) body.append('hero_image', heroImage);
      if (reraPdf) body.append('rera_pdf', reraPdf);

      const { res, data } = await request(`/projects/firstdetail/update/${id}`, {
        method: 'POST',
        headers: authHeaders(), // no Content-Type: browser sets the multipart boundary
        body,
      });

      if (!res.ok || data.status !== 'success') {
        setError(data.message || "Couldn't save the changes. Try again.");
        return;
      }

      const d = data.data || {};
      if (d.hero_image) setExistingImage(d.hero_image);
      if (d.rera_pdf) setExistingPdf(d.rera_pdf);
      setHeroImage(null);
      setReraPdf(null);
      setSaved(true);
    } catch (e) {
      if (e.message === 'unauthorized') return router.push('/admin/login');
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const imageToShow = heroPreview || existingImage;

  return (
    <>
      <PageHeader title="Project first details" subtitle="Hero section, call button, property facts and RERA details." />

      {error && <div className="a-err" role="alert">{error}</div>}

      {loading ? (
        <p className="a-sub">Loading details…</p>
      ) : (
        <>
          <div className="a-card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, color: 'var(--navy)', marginBottom: 16 }}>Hero</h2>
            <div className="a-cols" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
              <Field label="Hero subtitle">
                <input type="text" placeholder={TEXT_FIELDS[0].placeholder} value={form.hero_subtitle} onChange={(e) => change('hero_subtitle', e.target.value)} />
              </Field>
              <Field label="Hero title">
                <input type="text" placeholder={TEXT_FIELDS[1].placeholder} value={form.hero_title} onChange={(e) => change('hero_title', e.target.value)} />
              </Field>
            </div>
            <div style={{ marginTop: 16 }}>
              <Field label="Hero description">
                <textarea
                  rows={4}
                  placeholder="Privana brings together..."
                  value={form.hero_description}
                  onChange={(e) => change('hero_description', e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </Field>
            </div>
            <div style={{ marginTop: 16 }}>
              <Field label="Hero image" hint={heroImage ? heroImage.name : 'Leave empty to keep the current image'}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setHeroImage(e.target.files?.[0] || null);
                    setSaved(false);
                  }}
                />
              </Field>
              {imageToShow && (
                <img
                  src={imageToShow}
                  alt="Hero preview"
                  style={{ marginTop: 12, width: '100%', maxWidth: 360, height: 200, objectFit: 'cover', borderRadius: 12, border: '1px solid #c9d9ef' }}
                />
              )}
            </div>
          </div>

          <div className="a-card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, color: 'var(--navy)', marginBottom: 16 }}>Call button</h2>
            <div className="a-cols" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
              <Field label="Button text">
                <input type="text" placeholder="Call Us" value={form.call_button_text} onChange={(e) => change('call_button_text', e.target.value)} />
              </Field>
              <Field label="Phone number">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9876543210"
                  value={form.call_button_number}
                  onChange={(e) => change('call_button_number', e.target.value.replace(/\D/g, ''))}
                />
              </Field>
            </div>
          </div>

          <div className="a-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, color: 'var(--navy)', marginBottom: 16 }}>Property details</h2>
            <div className="a-cols" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
              {TEXT_FIELDS.filter((f) => f.key.startsWith('prop_') || f.key === 'rera_number').map((f) => (
                <Field key={f.key} label={f.label}>
                  <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={(e) => change(f.key, e.target.value)} />
                </Field>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <Field label="RERA PDF" hint={reraPdf ? reraPdf.name : 'Leave empty to keep the current file'}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    setReraPdf(e.target.files?.[0] || null);
                    setSaved(false);
                  }}
                />
              </Field>
              {existingPdf && !reraPdf && (
                <a href={existingPdf} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: 13 }}>
                  View current RERA PDF
                </a>
              )}
            </div>

            <div className="a-save">
              {saved && <span className="a-badge green" style={{ alignSelf: 'center' }}>Changes saved</span>}
              <button className="a-btn" onClick={save}>{saving ? 'Saving…' : 'Save changes'}</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}