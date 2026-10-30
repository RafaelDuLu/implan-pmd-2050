const warmed = new Map();

/** Fetch near the directory, not during the hero; official artwork is shared by directory and consultation heading. */
export function warmAxisArtwork(id) {
  if (warmed.has(id)) return;
  const image = new Image();
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.src = `${import.meta.env.BASE_URL}axes/official/eje-${id}.webp`;
  warmed.set(id, image);
}
