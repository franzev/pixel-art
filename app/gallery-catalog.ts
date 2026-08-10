import { catalogVersion } from "./catalog-version";
import type {
  ArtItem,
  GalleryCatalog,
  GalleryItem,
  SuggestedTag,
} from "./review-types";

function tagIdentity(tag: SuggestedTag) {
  return JSON.stringify([
    tag.key,
    tag.label,
    tag.group,
    tag.source,
    tag.confidence,
  ]);
}

export function compactGalleryCatalog(items: ArtItem[]): GalleryCatalog {
  const tagDefinitions: SuggestedTag[] = [];
  const definitionIds = new Map<string, number>();

  const compactItems = items.map((item) => {
    const { suggestedTags } = item;
    return {
      id: item.id,
      renderId: item.renderId,
      assetHash: item.assetHash,
      url: item.url,
      name: item.name,
      filename: item.filename,
      category: item.category,
      collection: item.collection,
      status: item.status,
      width: item.width,
      height: item.height,
      generatedAt: item.generatedAt,
      tagDefinitionIds: suggestedTags.map((tag) => {
        const identity = tagIdentity(tag);
        const existing = definitionIds.get(identity);
        if (existing !== undefined) return existing;

        const next = tagDefinitions.length;
        tagDefinitions.push(tag);
        definitionIds.set(identity, next);
        return next;
      }),
    };
  });

  return {
    version: catalogVersion(items),
    items: compactItems,
    tagDefinitions,
  };
}

export function expandGalleryCatalog(catalog: GalleryCatalog): GalleryItem[] {
  return catalog.items.map(({ tagDefinitionIds, ...item }) => ({
    ...item,
    suggestedTags: tagDefinitionIds.map((id) => {
      const definition = catalog.tagDefinitions[id];
      if (!definition) {
        throw new Error(`Gallery catalog references missing tag ${id}`);
      }
      return definition;
    }),
  }));
}
