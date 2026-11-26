'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from './ui';

const NAV = [
  { href: '/admin', label: 'Overview', icon: 'dashboard' },
  { href: '/admin/banners', label: 'Home banners', icon: 'image' },
  { href: '/admin/popups', label: 'Popups', icon: 'popup' },
  { href: '/admin/legacy', label: 'Legacy stats', icon: 'chart' },
  { href: '/admin/projects', label: 'Projects', icon: 'building' },
  { href: '/admin/blogs', label: 'Blogs', icon: 'blog' },
];

const CSS = `
.adm{--navy:#0f3a6e;--navy-2:#1d56a0;--ink:#13294b;--muted:#66768d;--line:#e4eaf3;--bg:#f5f8fc;--tint:#eaf1fb;--tint-2:#d8e6f8;--ok:#15803d;--ok-bg:#e4f5ea;--warn:#a16207;--warn-bg:#fdf2d6;--bad:#b42323;--bad-bg:#fdeaea;
position:fixed;inset:0;z-index:99999;display:flex;background:var(--bg);color:var(--ink);font-family:'Plus Jakarta Sans',Inter,system-ui,-apple-system,'Segoe UI',sans-serif;font-size:14px;line-height:1.5}
.adm *{box-sizing:border-box}
.adm h1,.adm h2,.adm h3,.adm p{margin:0}
.adm a{color:inherit;text-decoration:none}
.adm button{font-family:inherit;cursor:pointer}
.adm :focus-visible{outline:2px solid var(--navy-2);outline-offset:2px}

.a-side{width:250px;flex-shrink:0;background:#fff;border-right:1px solid var(--line);display:flex;flex-direction:column;padding:20px 14px;z-index:30;transition:transform .25s ease}
.a-brand{display:flex;align-items:center;gap:10px;padding:2px 10px 22px}
.a-mark{width:34px;height:34px;border-radius:10px;background:var(--navy);color:#fff;display:grid;place-items:center;font-weight:700;font-size:15px}
.a-brand b{display:block;font-size:16px;color:var(--navy);line-height:1.1}
.a-brand span{font-size:12px;color:var(--muted)}
.a-side .a-brand,.a-login .a-brand{flex-direction:column;align-items:flex-start;gap:6px;padding:2px 10px 22px}
.a-logo{display:block;height:46px;width:auto;max-width:100%;object-fit:contain}
.a-nav{display:flex;flex-direction:column;gap:4px;flex:1}
.a-nav a,.a-logout{display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:12px;color:#40526b;font-weight:500;transition:background .15s,color .15s;border:0;background:none;width:100%;font-size:14px}
.a-nav a:hover,.a-logout:hover{background:var(--tint)}
.a-nav a.on{background:var(--navy);color:#fff;box-shadow:0 8px 18px -8px rgba(15,58,110,.55)}
.a-backdrop{display:none}

.a-main{flex:1;min-width:0;display:flex;flex-direction:column}
.a-top{height:66px;flex-shrink:0;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:14px;padding:0 28px}
.a-burger{display:none}
.a-top-title{font-weight:600;font-size:15px;color:var(--navy)}
.a-top-right{margin-left:auto;display:flex;align-items:center;gap:16px}
.a-view{display:flex;align-items:center;gap:6px;color:var(--muted);font-weight:500}
.a-view:hover{color:var(--navy)}
.a-user{display:flex;align-items:center;gap:10px}
.a-avatar{width:36px;height:36px;border-radius:50%;background:var(--tint-2);color:var(--navy);display:grid;place-items:center;font-weight:600}
.a-user small{display:block;color:var(--muted);font-size:12px;line-height:1.2}
.a-content{flex:1;overflow-y:auto;padding:30px 28px 48px}
.a-wrap{width:100%}

.a-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:24px}
.a-title{font-size:26px;font-weight:700;color:var(--navy);letter-spacing:-.01em;line-height:1.2}
.a-sub{color:var(--muted);margin-top:4px}
.a-head-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}

.a-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 20px;border-radius:999px;border:1px solid var(--navy);background:var(--navy);color:#fff;font-weight:600;font-size:14px;transition:background .15s,transform .1s}
.a-btn:hover{background:#0b2d57}
.a-btn:active{transform:scale(.98)}
.a-btn.ghost{background:#fff;color:var(--navy);border-color:var(--tint-2)}
.a-btn.ghost:hover{background:var(--tint)}
.a-btn.danger{background:var(--bad);border-color:var(--bad)}
.a-btn.sm{height:34px;padding:0 14px;font-size:13px}
.a-icon{width:34px;height:34px;border-radius:10px;border:0;background:transparent;color:var(--muted);display:inline-grid;place-items:center;transition:background .15s,color .15s}
.a-icon:hover{background:var(--tint);color:var(--navy)}
.a-icon.del:hover{background:var(--bad-bg);color:var(--bad)}
.a-icon:disabled{opacity:.35;cursor:not-allowed}

.a-card{background:#fff;border:1px solid var(--line);border-radius:18px}
.a-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.a-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px}
.a-stat{padding:20px;display:flex;align-items:center;gap:14px}
.a-stat-ic{width:46px;height:46px;border-radius:14px;background:var(--tint);color:var(--navy);display:grid;place-items:center}
.a-stat b{display:block;font-size:26px;line-height:1.1;color:var(--navy)}
.a-stat span{color:var(--muted);font-size:13px}
.a-two{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:20px}
.a-panel{padding:22px}
.a-panel h2{font-size:16px;margin-bottom:14px;color:var(--navy)}
.a-quick{display:flex;flex-direction:column;gap:10px}
.a-quick a{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;background:var(--bg);font-weight:500}
.a-quick a:hover{background:var(--tint)}
.a-act{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.a-act:last-child{border:0}
.a-act time{margin-left:auto;color:var(--muted);font-size:12px;white-space:nowrap}
.a-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;margin-top:7px;flex-shrink:0}

.a-banner{overflow:hidden}
.a-banner.off .a-thumb img{filter:grayscale(1);opacity:.55}
.a-thumb{aspect-ratio:1366/626;background:var(--tint);position:relative}
.a-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.a-order{position:absolute;top:10px;left:10px;background:#fff;color:var(--navy);font-weight:600;font-size:12px;padding:3px 10px;border-radius:999px}
.a-mob{position:absolute;right:10px;bottom:10px;width:44px;aspect-ratio:720/1035;border-radius:6px;border:2px solid #fff;overflow:hidden;background:var(--tint)}
.a-mob img{width:100%;height:100%;object-fit:cover;display:block}
.a-banner-body{padding:14px 16px}
.a-banner-body h3{font-size:15px;font-weight:600;margin-bottom:10px}
.a-banner-foot{display:flex;align-items:center;justify-content:space-between;gap:8px}

.a-list{overflow:hidden}
.a-row{display:flex;align-items:center;gap:16px;padding:14px 18px;border-bottom:1px solid var(--line)}
.a-row:last-child{border:0}
.a-row:hover{background:#fafcff}
.a-row-img{width:84px;height:56px;border-radius:10px;object-fit:cover;background:var(--tint);flex-shrink:0}
.a-row-main{flex:1;min-width:0}
.a-row-main h3{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.a-row-main p{color:var(--muted);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.a-row-act{display:flex;align-items:center;gap:2px}

.a-badge{display:inline-block;padding:3px 11px;border-radius:999px;font-size:12px;font-weight:600;background:var(--tint);color:var(--navy);white-space:nowrap}
.a-badge.green{background:var(--ok-bg);color:var(--ok)}
.a-badge.amber{background:var(--warn-bg);color:var(--warn)}
.a-badge.red{background:var(--bad-bg);color:var(--bad)}
.a-badge.gray{background:#eef1f5;color:#52607a}

.a-bar{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.a-search{position:relative;flex:1;min-width:220px;max-width:340px}
.a-search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted)}
.a-search input{padding-left:40px}
.a-seg{display:inline-flex;background:#fff;border:1px solid var(--line);border-radius:999px;padding:4px}
.a-seg button{border:0;background:none;padding:7px 16px;border-radius:999px;font-weight:600;font-size:13px;color:var(--muted)}
.a-seg button.on{background:var(--navy);color:#fff}

.a-field{margin-bottom:18px}
.a-field>label{display:block;font-weight:600;font-size:13px;margin-bottom:7px}
.a-field small{display:block;color:var(--muted);margin-top:6px;font-size:12px}
.adm input[type=text],.adm input[type=email],.adm input[type=password],.adm input[type=url],.adm input[type=date],.adm select,.adm textarea{width:100%;height:44px;padding:0 14px;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--ink);font:inherit;transition:border-color .15s,box-shadow .15s}
.adm textarea{height:auto;padding:12px 14px;resize:vertical;min-height:110px}
.adm input:focus,.adm select:focus,.adm textarea:focus{outline:0;border-color:var(--navy-2);box-shadow:0 0 0 3px var(--tint-2)}
.a-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.a-drop{display:block;border:1.5px dashed #b9cde8;border-radius:14px;background:var(--bg);cursor:pointer;overflow:hidden;position:relative;min-height:120px}
.a-drop:hover{background:var(--tint)}
.a-drop img{width:100%;max-height:200px;object-fit:cover;display:block}
.a-drop-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:120px;color:var(--navy);font-weight:600}
.a-drop-change{position:absolute;right:10px;bottom:10px;background:#fff;color:var(--navy);padding:5px 12px;border-radius:999px;font-size:12px;font-weight:600}

.a-toggle{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-weight:500}
.a-toggle input{position:absolute;opacity:0;width:0;height:0}
.a-track{width:42px;height:24px;border-radius:999px;background:#cfd8e6;position:relative;transition:background .2s;flex-shrink:0}
.a-track::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s}
.a-toggle input:checked+.a-track{background:var(--navy)}
.a-toggle input:checked+.a-track::after{transform:translateX(18px)}
.a-toggle input:focus-visible+.a-track{outline:2px solid var(--navy-2);outline-offset:2px}

.a-overlay{position:absolute;inset:0;background:rgba(19,41,75,.35);z-index:60;display:flex;justify-content:flex-end;animation:aFade .18s ease}
.a-overlay.center{justify-content:center;align-items:center}
.a-drawer{width:min(480px,100%);height:100%;background:#fff;display:flex;flex-direction:column;animation:aSlide .25s ease}
.a-drawer.wide{width:min(720px,100%)}
.a-drawer header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--line)}
.a-drawer h2{font-size:18px;color:var(--navy)}
.a-drawer-body{flex:1;overflow-y:auto;padding:24px}
.a-drawer footer{display:flex;justify-content:flex-end;gap:10px;padding:16px 24px;border-top:1px solid var(--line);background:#fff}
.a-dialog{background:#fff;border-radius:18px;padding:26px;width:min(380px,92%)}
.a-dialog h3{font-size:18px;color:var(--navy);margin-bottom:6px}
.a-dialog p{color:var(--muted)}
.a-dialog-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:22px}
@keyframes aFade{from{opacity:0}to{opacity:1}}
@keyframes aSlide{from{transform:translateX(30px);opacity:.6}to{transform:none;opacity:1}}

.a-empty{text-align:center;padding:56px 20px}
.a-empty h3{font-size:18px;color:var(--navy);margin-bottom:6px}
.a-empty p{color:var(--muted);margin-bottom:18px}

.a-tabs{display:flex;gap:6px;border-bottom:1px solid var(--line);margin-bottom:24px;overflow-x:auto}
.a-tabs button{border:0;background:none;padding:12px 18px;font-weight:600;font-size:14px;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}
.a-tabs button.on{color:var(--navy);border-color:var(--navy)}
.a-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.a-tile{position:relative;aspect-ratio:4/3;border-radius:12px;overflow:hidden;background:var(--tint)}
.a-tile img{width:100%;height:100%;object-fit:cover;display:block}
.a-tile button{position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;border:0;background:#fff;color:var(--bad);display:grid;place-items:center}
.a-add{display:grid;place-items:center;gap:6px;aspect-ratio:4/3;border:1.5px dashed #b9cde8;border-radius:12px;background:var(--bg);color:var(--navy);font-weight:600;cursor:pointer;text-align:center}
.a-add:hover{background:var(--tint)}
.a-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
.a-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 8px 6px 14px;border-radius:999px;background:var(--tint);color:var(--navy);font-weight:500}
.a-chip button{border:0;background:#fff;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;color:var(--navy)}
.a-inline{display:flex;gap:10px}
.a-unit{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr 1fr auto;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
.a-unit:last-child{border:0}
.a-unit-h{font-size:12px;color:var(--muted);font-weight:600;padding-bottom:8px}
.a-save{display:flex;justify-content:flex-end;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid var(--line)}

.a-auth{flex:1;overflow-y:auto;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 20% 15%,#dbe8f9 0,transparent 45%),radial-gradient(circle at 85% 85%,#e6f0fc 0,transparent 40%),var(--bg)}
.a-login{width:min(420px,100%);padding:36px}
.a-login .a-brand{padding:0 0 22px}
.a-login h1{font-size:24px;color:var(--navy);margin-bottom:4px}
.a-login .a-sub{margin-bottom:24px}
.a-login .a-btn{width:100%}
.a-input-ic{position:relative}
.a-input-ic svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted)}
.a-input-ic input{padding-left:42px!important}
.a-err{background:var(--bad-bg);color:var(--bad);padding:10px 14px;border-radius:12px;margin-bottom:16px;font-size:13px}

@media (max-width:980px){
  .a-side{position:absolute;inset:0 auto 0 0;transform:translateX(-100%)}
  .a-side.open{transform:none;box-shadow:0 0 40px rgba(19,41,75,.2)}
  .a-backdrop.open{display:block;position:absolute;inset:0;background:rgba(19,41,75,.35);z-index:20}
  .a-burger{display:inline-grid}
  .a-top{padding:0 16px}
  .a-content{padding:22px 16px 40px}
  .a-two{grid-template-columns:1fr}
  .a-user div{display:none}
  .a-view span{display:none}
}
@media (max-width:640px){
  .a-cols{grid-template-columns:1fr}
  .a-row{flex-wrap:wrap}
  .a-row-img{width:64px;height:48px}
  .a-unit{grid-template-columns:1fr 1fr}
  .a-unit-h{display:none}
  .a-title{font-size:22px}
}
@media (prefers-reduced-motion:reduce){.adm *{animation:none!important;transition:none!important}}
`;

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('checking'); // 'checking' | 'authed' | 'guest'

  const path = (pathname || '').replace(/\/+$/, '');
  const isAuth = path === '/admin/login';
  const isOn = (href) => (href === '/admin' ? path === '/admin' : path.startsWith(href));
  const current = NAV.find((n) => isOn(n.href));

  // Client-side guard: verifies the token on every route change.
  // Middleware already enforces this server-side; this is a safety net
  // so the dashboard can never flash before a redirect.
  useEffect(() => {
    if (isAuth) {
      setStatus('guest');
      return;
    }
    const token = localStorage.getItem('pkr_admin_token');
    if (!token) {
      setStatus('guest');
      router.replace('/admin/login');
    } else {
      setStatus('authed');
    }
  }, [isAuth, router, path]);

  const logout = () => {
    // 1. Clear localStorage + sessionStorage
    try {
      ['pkr_admin_token', 'pkr_admin_user', 'admin_token', 'token', 'access_token'].forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
    } catch {}

    // 2. Clear the cookie (path must match the one used at login: path=/)
    document.cookie = 'pkr_admin_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'pkr_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

    // 3. Hard redirect so the middleware re-runs with no cookie
    window.location.href = '/admin/login';
  };

  // Login page: render immediately, no shell
  if (isAuth) {
    return (
      <div className="adm">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="a-auth">{children}</div>
      </div>
    );
  }

  // Block rendering until auth state is known (or while redirecting)
  if (status === 'checking' || status === 'guest') {
    return (
      <div className="adm">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </div>
    );
  }

  // status === 'authed' — safe to render the dashboard
  return (
    <div className="adm">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`a-backdrop ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`a-side ${open ? 'open' : ''}`}>
        <div className="a-brand">
          <img src="/pkr-logo.webp" alt="PKR Estates" className="a-logo" />
          <span>Admin panel</span>
        </div>
        <nav className="a-nav">
          {NAV.map((n) => {
            const on = isOn(n.href);
            return (
              <Link key={n.href} href={n.href} className={on ? 'on' : ''} onClick={() => setOpen(false)}>
                <Icon name={n.icon} /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button type="button" className="a-logout" onClick={logout}>
          <Icon name="logout" /> Log out
        </button>
      </aside>

      <div className="a-main">
        <header className="a-top">
          <button className="a-icon a-burger" onClick={() => setOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <span className="a-top-title">{current?.label || 'Admin'}</span>
          <div className="a-top-right">
            <a className="a-view" href="/" target="_blank" rel="noreferrer">
              <Icon name="external" size={16} /> <span>View website</span>
            </a>
            <div className="a-user">
              <div className="a-avatar">A</div>
              <div>
                Admin
                <small>PKR Estates</small>
              </div>
            </div>
          </div>
        </header>
        <main className="a-content">
          <div className="a-wrap">{children}</div>
        </main>
      </div>
    </div>
  );
}