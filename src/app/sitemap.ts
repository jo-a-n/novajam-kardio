import { MetadataRoute } from 'next';
import { SITE_URL } from '@/helpers/constants';
import pages from '@/helpers/query/static-data/pages.json';
import pageDates from '@/helpers/query/static-data/page-dates.json';

export default function sitemap(): MetadataRoute.Sitemap {
  return pages
    .filter((page) => !page.seo?.noindex)
    .map((page) => ({
      url: `${SITE_URL}${page.url}`,
      lastModified: (pageDates as Record<string, string>)[page.url],
      changeFrequency: 'monthly' as const,
      priority: page.url === '/' ? 1 : 0.8,
    }));
}
