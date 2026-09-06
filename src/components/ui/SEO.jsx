import { useEffect } from 'react';

/**
 * Reusable SEO Component for Nachiketa Awareness Society
 * Manages document title, meta tags, Open Graph, Twitter cards, canonical link, and JSON-LD structured data.
 */
export default function SEO({
  title = 'Nachiketa Awareness Society | Student Awareness, Growth & Community',
  description = 'Nachiketa Awareness Society is a student-led community focused on awareness, self-discovery, wellbeing, cultural activities and meaningful social participation.',
  keywords = 'Nachiketa Awareness Society, Nachiketa, student awareness society, student community, self development, wellbeing, rights and responsibilities, cultural activities',
  image = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  type = 'website',
  slug = '',
  schema = null,
}) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to create or update meta tags
    const setMetaTag = (selector, nameAttr, attrValue, content) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('description', 'name', 'description', description);
    setMetaTag('keywords', 'name', 'keywords', keywords);

    // 3. Open Graph Tags
    setMetaTag('og:title', 'property', 'og:title', title);
    setMetaTag('og:description', 'property', 'og:description', description);
    setMetaTag('og:image', 'property', 'og:image', image);
    setMetaTag('og:type', 'property', 'og:type', type);
    
    const currentUrl = window.location.origin + (slug ? (slug.startsWith('/') ? slug : `/${slug}`) : window.location.pathname);
    setMetaTag('og:url', 'property', 'og:url', currentUrl);
    setMetaTag('og:site_name', 'property', 'og:site_name', 'Nachiketa Awareness Society');

    // 4. Twitter Card Tags
    setMetaTag('twitter:card', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'name', 'twitter:title', title);
    setMetaTag('twitter:description', 'name', 'twitter:description', description);
    setMetaTag('twitter:image', 'name', 'twitter:image', image);

    // 5. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 6. JSON-LD Structured Data
    const defaultOrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Nachiketa Awareness Society',
      alternateName: ['Nachiketa', 'Nachiketa Society'],
      url: window.location.origin,
      logo: `${window.location.origin}/src/assets/nachiketa-logo.jpeg`,
      foundingDate: '2024',
      description: 'A student-led society dedicated to awareness, self-discovery, wellbeing, rights & responsibilities, and positive community engagement.',
      sameAs: [
        'https://instagram.com',
        'https://linkedin.com',
      ],
    };

    const schemaToUse = schema || defaultOrganizationSchema;
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaToUse);

  }, [title, description, keywords, image, type, slug, schema]);

  return null;
}
