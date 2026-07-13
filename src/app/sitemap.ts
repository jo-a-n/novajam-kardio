import { MetadataRoute } from 'next';
import { SITE_URL } from '@/helpers/constants';
import pages from '@/helpers/query/static-data/pages.json';

export default function sitemap(): MetadataRoute.Sitemap {
  return pages
    .filter((page) => !page.seo?.noindex)
    .map((page) => ({
      url: `${SITE_URL}${page.url}`,
      changeFrequency: 'monthly' as const,
      priority: page.url === '/' ? 1 : 0.8,
    }));
}
