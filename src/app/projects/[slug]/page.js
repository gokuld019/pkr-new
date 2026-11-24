// src/app/projects/[slug]/page.js
import { notFound } from "next/navigation";
import ProjectBanner from "@/components/ProjectBanner";

// Same API that src/lib/projectApi.js (used by ProjectBanner) talks to.
// NOTE: projectApi.js is a 'use client' module, so its helpers can't be imported
// into this server component - the tiny bits we need are repeated here.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const slugify = (s = "") =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Returns the projects array, or null if the API could not be reached.
async function getProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects/list`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`API responded with ${res.status}`);

    const json = await res.json();
    if (!json || json.status !== true || !Array.isArray(json.data)) {
      throw new Error(json?.message || "Unexpected API response");
    }
    return json.data;
  } catch (error) {
    console.warn("Project list fetch failed:", error);
    return null;
  }
}

// The API has no slug field and the project is still named "New Project",
// so map friendly URLs to project ids here. Remove an entry once the project
// is renamed in the admin (then /projects/<name-slug> works by itself).
const SLUG_ALIASES = { privana: 7 };

// Mirrors findProject() in projectApi.js so the server and the client agree.
function matchProject(list, slug) {
  const want = slugify(slug);
  const aliasId = SLUG_ALIASES[want];
  return (
    (aliasId != null && list.find((p) => String(p.id) === String(aliasId))) ||
    list.find((p) => slugify(p.slug || p.name) === want || String(p.id) === String(slug)) ||
    // looser fallback: "privana" also matches "Privana Heights"
    list.find((p) => slugify(p.name).split("-").includes(want) || slugify(p.name).startsWith(want)) ||
    null
  );
}

// Slugs that must always be generated, even if the API is down at build time.
// "output: export" needs every URL listed here - anything missing is an error/404.
const EXTRA_SLUGS = Object.keys(SLUG_ALIASES);

export async function generateStaticParams() {
  const projects = await getProjects();

  const slugs = new Set(EXTRA_SLUGS);
  (projects || []).forEach((p) => {
    const named = slugify(p.slug || p.name);
    if (named) slugs.add(named);
    slugs.add(String(p.id)); // the API has no slug field - /projects/7 always works
  });

  // Check this in the terminal: the slug you visit must appear in this list.
  console.log(
    "[projects] API projects:",
    (projects || []).map((p) => `${p.id}:${p.name}`),
    "| static slugs:",
    [...slugs]
  );

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects ? matchProject(projects, slug) : null;
  if (!project) return {};

  return {
    title: `${project.name} | PKR Estates`,
    description: project.detail?.hero_description || undefined,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;

  const projects = await getProjects();

  // Only 404 when the API answered and really has no such project.
  // If the API was unreachable, let ProjectBanner try again in the browser.
  const match = projects ? matchProject(projects, slug) : null;

  if (projects && !match) {
    // In dev, show what the API actually returned so the right slug is obvious.
    if (process.env.NODE_ENV !== "production") {
      return (
        <main style={{ padding: "48px 24px", fontFamily: "monospace", color: "#111", background: "#fff" }}>
          <h2>No project matches &quot;{slug}&quot;</h2>
          <p>Projects returned by the API ({projects.length}):</p>
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                id {p.id} &mdash; name: {JSON.stringify(p.name)} &mdash; try{" "}
                <a href={`/projects/${slugify(p.name) || p.id}/`}>/projects/{slugify(p.name) || p.id}/</a>
              </li>
            ))}
          </ul>
        </main>
      );
    }
    notFound();
  }

  return (
    <main className="project-detail w-full">
      {/* ProjectBanner fetches + maps the project itself; the id is the most reliable key */}
      <ProjectBanner projectId={match ? match.id : undefined} slug={slug} />
    </main>
  );
}