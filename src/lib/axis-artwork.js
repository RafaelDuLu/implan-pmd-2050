const warmed = new Map();

/** Fetch near the directory, not during the hero; decoding is deferred to selection. */
export function warmAxisArtwork(id) {
  if (warmed.has(id)) return;
  const image = new Image();
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.src = `${import.meta.env.BASE_URL}axes/entrances/eje-${id}.webp`;
  warmed.set(id, image);
}
