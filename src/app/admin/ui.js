'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useId } from 'react';

const PATHS = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  popup: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  blog: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
};

export function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PATHS[name] || '' }} />
  );
}

export function PageHeader({ title, subtitle, actionLabel, onAction, children }) {
  return (
    <div className="a-head">
      <div>
        <h1 className="a-title">{title}</h1>
        {subtitle && <p className="a-sub">{subtitle}</p>}
      </div>
      <div className="a-head-actions">
        {children}
        {actionLabel && (
          <button className="a-btn" onClick={onAction}>
            <Icon name="plus" size={16} /> {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function Badge({ tone = 'gray', children }) {
  return <span className={`a-badge ${tone}`}>{children}</span>;
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="a-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="a-track" />
      {label && <span>{label}</span>}
    </label>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div className="a-field">
      <label>{label}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function ImageInput({ label, value, onChange, hint }) {
  const id = useId();
  const pick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: API - send `file` to the upload endpoint and store the URL it returns
    onChange(URL.createObjectURL(file), file);
  };
  return (
    <Field label={label} hint={hint}>
      <label htmlFor={id} className={`a-drop ${value ? 'has' : ''}`}>
        {value ? (
          <>
            <img src={value} alt="" />
            <span className="a-drop-change">Change image</span>
          </>
        ) : (
          <span className="a-drop-empty">
            <Icon name="upload" size={22} />
            Choose an image
          </span>
        )}
      </label>
      <input id={id} type="file" accept="image/*" hidden onChange={pick} />
    </Field>
  );
}

export function Drawer({ open, title, onClose, onSave, saveLabel = 'Save changes', wide, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="a-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className={`a-drawer ${wide ? 'wide' : ''}`} role="dialog" aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button className="a-icon" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </header>
        <div className="a-drawer-body">{children}</div>
        <footer>
          <button className="a-btn ghost" onClick={onClose}>Cancel</button>
          <button className="a-btn" onClick={onSave}>{saveLabel}</button>
        </footer>
      </aside>
    </div>
  );
}

export function ConfirmDelete({ open, name, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="a-overlay center" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="a-dialog" role="alertdialog">
        <h3>Delete {name}?</h3>
        <p>This can&apos;t be undone.</p>
        <div className="a-dialog-actions">
          <button className="a-btn ghost" onClick={onCancel}>Keep it</button>
          <button className="a-btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export function Empty({ title, text, actionLabel, onAction }) {
  return (
    <div className="a-empty">
      <h3>{title}</h3>
      <p>{text}</p>
      {actionLabel && <button className="a-btn" onClick={onAction}><Icon name="plus" size={16} /> {actionLabel}</button>}
    </div>
  );
}