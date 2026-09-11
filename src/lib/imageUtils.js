/**
 * Centralized Image Selection & Validation Logic
 * for Nachiketa Awareness Society.
 *
 * IMPORTANT:
 * - Uses ONLY real gallery images returned by the API.
 * - No Unsplash or external fallback images.
 * - Returns null when no valid image is available.
 * - Safely handles null, undefined, malformed, and unexpected API data.
 */

/**
 * Safely extract an image URL from a gallery item.
 */
function getImageUrl(image) {
  if (typeof image === 'string') {
    const url = image.trim();
    return url.length > 0 ? url : null;
  }

  if (!image || typeof image !== 'object') {
    return null;
  }

  const possibleUrl =
    image.url ||
    image.imageUrl ||
    image.thumbnailUrl ||
    image.image;

  if (typeof possibleUrl !== 'string') {
    return null;
  }

  const url = possibleUrl.trim();

  return url.length > 0 ? url : null;
}

/**
 * Filter out invalid image records.
 *
 * Always returns an array.
 */
export function getValidGalleryImages(galleryImages) {
  if (!Array.isArray(galleryImages)) {
    return [];
  }

  return galleryImages.filter((img) => {
    return Boolean(getImageUrl(img));
  });
}

/**
 * Get a real homepage community image.
 *
 * Returns:
 *   {
 *     url: string,
 *     alt: string,
 *     title: string
 *   }
 *
 * or:
 *   null
 *
 * No fallback image is used.
 */
export function getHomepageCommunityImage(
  galleryImages = [],
  index = 0
) {
  const valid = getValidGalleryImages(galleryImages);

  if (valid.length === 0) {
    return null;
  }

  // Keep the index safe even if an unexpected value is passed.
  const numericIndex = Number.isFinite(Number(index))
    ? Math.max(0, Math.floor(Number(index)))
    : 0;

  const selected = valid[numericIndex % valid.length];

  const url = getImageUrl(selected);

  // Extra defensive check.
  if (!url) {
    return null;
  }

  // String-based image record.
  if (typeof selected === 'string') {
    return {
      url,
      alt: 'Students participating in a Nachiketa Awareness Society session',
      title: 'Life at Nachiketa',
    };
  }

  // Object-based image record.
  const rawTitle =
    typeof selected.title === 'string' && selected.title.trim()
      ? selected.title.trim()
      : 'Community Program';

  const alt =
    typeof selected.alt === 'string' && selected.alt.trim()
      ? selected.alt.trim()
      : `Students participating in ${rawTitle} - Nachiketa Awareness Society`;

  return {
    url,
    alt,
    title: rawTitle,
  };
}

/**
 * Backward-compatible alias.
 *
 * Existing imports using getHomepageImage will continue to work.
 */
export function getHomepageImage(
  galleryImages = [],
  index = 0
) {
  return getHomepageCommunityImage(galleryImages, index);
}
