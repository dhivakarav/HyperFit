// SQLite stores arrays as JSON strings — these helpers parse them back.
// When migrating to PostgreSQL, these become no-ops (the fields become real arrays).

export function parseImages(imagesJson: string | undefined | null): string[] {
  if (!imagesJson) return []
  try { return JSON.parse(imagesJson) as string[] } catch { return [] }
}

export function parseTags(tagsJson: string | undefined | null): string[] {
  if (!tagsJson) return []
  try { return JSON.parse(tagsJson) as string[] } catch { return [] }
}

export function parseWishlist(wishlistJson: string | undefined | null): string[] {
  if (!wishlistJson) return []
  try { return JSON.parse(wishlistJson) as string[] } catch { return [] }
}
