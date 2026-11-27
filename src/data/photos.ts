// src/data/photos.ts
// Finds the image file for a slot name such as hero-1 or jewellery-3.
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });
export function photoMeta(slot: string): ImageMetadata | undefined {
  const hit = Object.entries(files).find(([p]) => p.split('/').pop()!.replace(/\.[^.]+$/, '') === slot);
  return hit?.[1].default;
}
