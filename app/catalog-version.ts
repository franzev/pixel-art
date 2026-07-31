export function catalogVersion(
  items: Array<{ id: string; renderId: string }>,
) {
  let hash = 0x811c9dc5;

  for (const item of items) {
    const value = `${item.id}:${item.renderId};`;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
  }

  return `${items.length}-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
