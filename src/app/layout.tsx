import '@/app/styles/globals.css';
import { Metadata } from 'next';
import Script from 'next/script';
import { AccessibilityButton } from '@/components/elements/AccessibilityButton/AccessibilityButton';
import { SITE_URL } from '@/helpers/constants';
import { physicianJsonLd } from '@/helpers/jsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" className="group scroll-smooth">
      <body className="bg-[#EBEDF4] dark:bg-neutral-900 dark:text-neutral-100">
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0GGQJPH7FV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-0GGQJPH7FV');
          `}
        </Script>
        <Script id="history-origin-guard" strategy="beforeInteractive">
          {`
          (function () {
            if (typeof window === 'undefined' || !window.history) return;

            function withSameOriginGuard(originalMethod) {
              return function (state, title, url) {
                if (url != null) {
                  try {
                    var rawUrl = typeof url === 'string' ? url : String(url);
                    var nextUrl = new URL(rawUrl, window.location.href);
                    if (nextUrl.origin !== window.location.origin) {
                      var router = window.next && window.next.router;
                      if (router && typeof router.replace === 'function') {
                        router.replace(window.location.pathname, undefined, { shallow: true });
                      }
                      return;
                    }
                  } catch (_error) {
                    return;
                  }
                }
                try {
                  return originalMethod.apply(window.history, arguments);
                } catch (error) {
                  if (error && error.name === 'SecurityError') {
                    var router = window.next && window.next.router;
                    if (router && typeof router.replace === 'function') {
                      router.replace(window.location.pathname, undefined, { shallow: true });
                    }
                    return;
                  }
                  throw error;
                }
              };
            }

            window.history.replaceState = withSameOriginGuard(window.history.replaceState);
            window.history.pushState = withSameOriginGuard(window.history.pushState);
          })();
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd) }}
        />
        {children}
        <AccessibilityButton />
      </body>
    </html>
  );
}
