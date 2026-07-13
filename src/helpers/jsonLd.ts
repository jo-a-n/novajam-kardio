import { SITE_URL } from '@/helpers/constants';

const DOCTORANYTIME_URL =
  'https://www.doctoranytime.gr/d/Kardiologos/agapitou-elena';
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/7Q5sM7bWsysU2yQT7';

const physician = {
  '@type': 'Physician',
  name: 'Δρ. Έλενα Αγαπητού – Καρδιολόγος',
  medicalSpecialty: 'https://schema.org/Cardiovascular',
  url: SITE_URL,
  image: `${SITE_URL}/logo.webp`,
  telephone: ['+30 210 993 7962', '+30 697 4150 899'],
  email: 'info@kardiologos-agapitou.gr',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Σοφοκλή Βενιζέλου 101',
    addressLocality: 'Ηλιούπολη',
    addressRegion: 'Αττική',
    postalCode: '16343',
    addressCountry: 'GR',
  },
  hasMap: GOOGLE_MAPS_URL,
  knowsLanguage: ['el', 'en', 'fr'],
  sameAs: [DOCTORANYTIME_URL, GOOGLE_MAPS_URL],
};

export const physicianJsonLd = {
  '@context': 'https://schema.org',
  ...physician,
};

export function medicalWebPageJsonLd(page: {
  title: string;
  url: string;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
  } | null;
}) {
  // page titles follow the "Dr Agapitou | <service>" pattern
  const serviceName = page.title.split('|').pop()?.trim() ?? page.title;
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: page.seo?.metaTitle ?? page.title,
    description: page.seo?.metaDescription ?? undefined,
    url: page.seo?.canonicalUrl ?? `${SITE_URL}${page.url}`,
    inLanguage: 'el',
    about: {
      '@type': 'MedicalProcedure',
      name: serviceName,
    },
    provider: physician,
  };
}
