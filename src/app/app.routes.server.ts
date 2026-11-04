import { RenderMode, ServerRoute } from '@angular/ssr';
import { TOOLS } from './core/data/tools.data';
import { CATEGORIES } from './core/tool.types';
import { GUIDES } from './core/data/guides';

/**
 * Every route is prerendered to static HTML at build time, which is what makes
 * the app deployable to Cloudflare, Netlify or Vercel with no server —
 * and gives crawlers fully rendered markup with its own meta tags.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'category/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => CATEGORIES.map((category) => ({ id: category.id })),
  },
  {
    path: 'guides/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => GUIDES.map((guide) => ({ slug: guide.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];

/** Exported for the sitemap generator so both stay in sync. */
export const PRERENDERED_PATHS: string[] = [
  '/',
  '/tools',
  '/favorites',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/guides',
  '/changelog',
  ...GUIDES.map((guide) => `/guides/${guide.slug}`),
  ...CATEGORIES.map((category) => `/category/${category.id}`),
  ...TOOLS.map((tool) => `/tools/${tool.id}`),
];
