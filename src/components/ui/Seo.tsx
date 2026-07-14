import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
  canonical: string
}

/**
 * Per-page SEO head tags — T3 from SEO Task 1.
 * Renders into <head> via react-helmet-async (HelmetProvider wraps the app in main.tsx).
 * OG image reuses the global og-team.png set in index.html; only title/description/url
 * are overridden per-page so the social card always shows the correct page context.
 * DO NOT change visible copy or H1s — this component only touches <head>.
 */
export function Seo({ title, description, canonical }: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph — overrides index.html defaults per page */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />

      {/* Twitter Card — overrides index.html defaults per page */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
