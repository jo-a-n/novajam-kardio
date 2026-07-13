import { notFound } from 'next/navigation';
import { SectionMapping } from '@/components/sections/SectionMapping/SectionMapping';
import { getPage } from '@/helpers/query/getPage';
import { medicalWebPageJsonLd } from '@/helpers/jsonLd';
import pages from '@/helpers/query/static-data/pages.json';
import { PageType } from '@/helpers/types';

// All routes come from pages.json, so prerender them all and return a
// real 404 (instead of a streamed soft 404) for anything else.
export const dynamicParams = false;

export function generateStaticParams() {
  return pages
    .filter((page) => page.url !== '/')
    .map((page) => ({ slug: page.url.slice(1).split('/') }));
}

export default async function Page({
  params,
}: {
  params: { slug: Array<string> };
}) {
  const url = `/${params.slug!.join('/')}`;
  const data = (await getPage(url)) as unknown as PageType;
  if (!data) {
    notFound();
  }
  const isServicePage = url.startsWith('/clinic-services/');
  return (
    <>
      {isServicePage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(medicalWebPageJsonLd(data)),
          }}
        />
      )}
      <SectionMapping data={data.content} />
    </>
  );
}
