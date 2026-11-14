import type { ImageMetadata } from 'astro';

/** Raster assets were removed; public URLs resolve via mediaPlaceholders.ts at render time. */
export function resolveLocalImage(_src: string): ImageMetadata | undefined {
  return undefined;
}

export function hasLocalImage(_src: string): boolean {
  return false;
}
