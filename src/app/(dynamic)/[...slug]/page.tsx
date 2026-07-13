import { notFound } from 'next/navigation';
import { SectionMapping } from '@/components/sections/SectionMapping/SectionMapping';
import { getPage } from '@/helpers/query/getPage';
import { medicalWebPageJsonLd } from '@/helpers/jsonLd';
import { PageType } from '@/helpers/types';

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
