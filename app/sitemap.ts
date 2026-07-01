import type { MetadataRoute } from 'next';
import { getSiteConfig, getProjects } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await getSiteConfig();
  const url = config?.url || 'https://tectoflow.studio';
  const projects = await getProjects();

  const staticRoutes = [
    '',
    '/work',
    '/about',
  ].map((route) => ({
    url: `${url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((project: any) => ({
    url: `${url}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
