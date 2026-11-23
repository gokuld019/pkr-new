'use client';
import Link from 'next/link';
import { Icon, PageHeader } from './ui';

// TODO: API - replace with GET /api/admin/stats and GET /api/admin/activity
const STATS = [
  { label: 'Home banners', value: 3, icon: 'image', href: '/admin/banners' },
  { label: 'Active popups', value: 1, icon: 'popup', href: '/admin/popups' },
  { label: 'Projects', value: 6, icon: 'building', href: '/admin/projects' },
  { label: 'Blogs', value: 12, icon: 'blog', href: '/admin/blogs' },
];

const ACTIVITY = [
  { text: 'Gurudev banner updated', time: '2 hours ago' },
  { text: 'Blog "Buying plots in Chennai" published', time: 'Yesterday' },
  { text: 'Privana floor plans edited', time: '3 days ago' },
  { text: 'Diwali offer popup created', time: '5 days ago' },
];

const QUICK = [
  { label: 'Add a home banner', href: '/admin/banners', icon: 'image' },
  { label: 'Create a popup', href: '/admin/popups', icon: 'popup' },
  { label: 'Add a project', href: '/admin/projects', icon: 'building' },
  { label: 'Write a blog', href: '/admin/blogs', icon: 'blog' },
];

export default function OverviewPage() {
  return (
    <>
      <PageHeader title="Overview" subtitle="Manage everything shown on the PKR Estates website." />

      <div className="a-stats">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="a-card a-stat">
            <div className="a-stat-ic"><Icon name={s.icon} size={22} /></div>
            <div>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="a-two">
        <section className="a-card a-panel">
          <h2>Recent activity</h2>
          {ACTIVITY.map((a) => (
            <div className="a-act" key={a.text}>
              <span className="a-dot" />
              <span>{a.text}</span>
              <time>{a.time}</time>
            </div>
          ))}
        </section>

        <section className="a-card a-panel">
          <h2>Quick actions</h2>
          <div className="a-quick">
            {QUICK.map((q) => (
              <Link key={q.label} href={q.href}>
                <Icon name={q.icon} /> {q.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}