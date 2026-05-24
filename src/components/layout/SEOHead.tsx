import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "article" | "product";
  /** JSON-LD structured data object — will be serialized automatically */
  jsonLd?: Record<string, unknown>;
  /** Additional meta keywords */
  keywords?: string;
  /** noindex for pages that shouldn't appear in search */
  noIndex?: boolean;
}

const BASE_URL = "https://pleux.com";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80";
const SITE_NAME = "PLEUX+";

const SEOHead = ({
  title,
  description,
  url,
  image,
  type = "website",
  jsonLd,
  keywords,
  noIndex = false,
}: SEOHeadProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", ...jsonLd })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
