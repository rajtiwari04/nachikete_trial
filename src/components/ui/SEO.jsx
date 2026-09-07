import { useEffect } from 'react';

/**
 * Reusable Route-Aware SEO Component for Nachiketa Awareness Society
 * Manages document title, meta tags, Open Graph, Twitter cards, canonical link,
 * indexing controls (robots noindex/index), and JSON-LD structured data.
 */
export default function SEO({
  title = 'Nachiketa Awareness Society | Student Awareness, Growth & Community',
  description = 'Nachiketa Awareness Society is a student-led community focused on awareness, self-discovery, wellbeing, cultural activities and meaningful social participation.',
  keywords = 'Nachiketa Awareness Society, Nachiketa, Nachiketa Society, student awareness society, student community, self development, wellbeing, rights and responsibilities, cultural activities',
  image = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  type = 'website',
  slug = '',
  schema = null,
  noindex = false,
}) {
  useEffect(() => {
    // 1. Determine site base URL (from env or window origin)
    const envSiteUrl = import.meta.env.VITE_SITE_URL || '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const baseUrl = (envSiteUrl || origin).replace(/\/+$/, '');

    // Normalize slug & current canonical URL
    const rawPath = slug ? (slug.startsWith('/') ? slug : `/${slug}`) : (typeof window !== 'undefined' ? window.location.pathname : '/');
    const cleanPath = rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '');
    const canonicalUrl = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}/` || baseUrl || '/';

    // 2. Update Document Title
    document.title = title;

    // Helper to create or update meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // 4. Indexing Control (robots)
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 5. Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:site_name', 'Nachiketa Awareness Society');

    // 6. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // 7. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 8. Structured Data (JSON-LD)
    // Build default schemas if no custom schema is provided
    let finalSchema = schema;
    if (!finalSchema && !noindex) {
      const defaultOrgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Nachiketa Awareness Society',
        alternateName: ['Nachiketa', 'Nachiketa Society', 'Nachiketa student society'],
        url: baseUrl || origin || '/',
        logo: `${baseUrl || origin}/src/assets/nachiketa-logo.jpeg`,
        foundingDate: '2024',
        description: 'A student-led society dedicated to awareness, self-discovery, wellbeing, rights & responsibilities, and positive community engagement.',
        sameAs: [
          'https://instagram.com',
          'https://linkedin.com',
          'https://twitter.com',
        ],
      };

      if (cleanPath === '/' || cleanPath === '') {
        // On homepage, include WebSite schema alongside Organization schema
        const defaultWebSiteSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Nachiketa Awareness Society',
          alternateName: 'Nachiketa',
          url: baseUrl || origin || '/',
        };
        finalSchema = [defaultOrgSchema, defaultWebSiteSchema];
      } else {
        const defaultWebPageSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description: description,
          url: canonicalUrl,
          publisher: {
            '@type': 'Organization',
            name: 'Nachiketa Awareness Society',
          },
        };
        finalSchema = defaultWebPageSchema;
      }
    }

    // Clean up existing JSON-LD scripts to avoid duplicates on route changes
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((s) => s.remove());

    if (finalSchema && !noindex) {
      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.textContent = JSON.stringify(finalSchema, null, 2);
      document.head.appendChild(scriptTag);
    }
  }, [title, description, keywords, image, type, slug, schema, noindex]);

  return null;
}
