/**
 * Centralized Image Selection & Optimization Logic for Nachiketa Awareness Society
 * 
 * Priority:
 * 1. Valid real image from Gallery data (if available and non-empty)
 * 2. Curated Unsplash fallback relevant to student awareness, community, wellbeing, and culture
 * 
 * Handles null/undefined, missing URLs, empty arrays, and invalid records safely.
 */

// High quality fallback imagery aligned with Nachiketa Awareness Society identity
export const FALLBACK_COMMUNITY_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    alt: 'Students participating in a Nachiketa Awareness Society community program',
    title: 'Student Community & Interaction',
  },
  {
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    alt: 'Students attending an interactive awareness session organized by Nachiketa',
    title: 'Awareness Session & Learning',
  },
  {
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    alt: 'Students engaging in self-discovery and group discussion',
    title: 'Group Discussion & Reflection',
  },
  {
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    alt: 'Students participating in a cultural and educational workshop',
    title: 'Cultural & Wellbeing Program',
  },
];

/**
 * Filter out invalid image records and extract valid image URLs
 */
export function getValidGalleryImages(galleryImages) {
  if (!Array.isArray(galleryImages)) return [];
  
  return galleryImages.filter((img) => {
    if (!img) return false;
    if (typeof img === 'string') return img.trim().length > 0;
    const url = img.url || img.imageUrl || img.thumbnailUrl || img.image;
    return typeof url === 'string' && url.trim().length > 0;
  });
}

/**
 * Get a representative community image for the homepage (Hero, Cards, Open Graph).
 * Automatically prefers valid gallery images when available, falling back to curated Unsplash image.
 * 
 * @param {Array} galleryImages - Raw gallery items array from API or state
 * @param {number} index - Index for deterministic selection when multiple images exist
 * @param {Object} customFallback - Optional custom fallback object
 * @returns {Object} { url, alt, title }
 */
export function getHomepageCommunityImage(galleryImages = [], index = 0, customFallback = null) {
  const valid = getValidGalleryImages(galleryImages);
  
  if (valid.length > 0) {
    const selected = valid[index % valid.length];
    
    if (typeof selected === 'string') {
      return {
        url: selected,
        alt: 'Students participating in a Nachiketa Awareness Society session',
        title: 'Life at Nachiketa',
      };
    }
    
    const url = selected.url || selected.imageUrl || selected.thumbnailUrl || selected.image;
    const rawTitle = selected.title || 'Community Program';
    const alt = `Students participating in ${rawTitle} - Nachiketa Awareness Society`;
    
    return {
      url,
      alt,
      title: rawTitle,
    };
  }
  
  const defaultFallback = FALLBACK_COMMUNITY_IMAGES[index % FALLBACK_COMMUNITY_IMAGES.length];
  return customFallback || defaultFallback;
}

/**
 * Conceptually required centralized getHomepageImage function
 */
export function getHomepageImage(galleryImages = [], index = 0) {
  return getHomepageCommunityImage(galleryImages, index);
}
