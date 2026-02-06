import colors from "@/Themes/theme";

const ARTWORK_CATEGORIES = [
  { label: 'Painting', value: 'painting', color: colors.blue, default: true },
  { label: 'Sculpture', value: 'sculpture', color: colors.gold },
  { label: 'Photography', value: 'photography', color: colors.cyan },
  { label: 'Digital Art', value: 'digital_art', color: colors.purple },
  { label: 'Mixed Media', value: 'mixed_media', color: colors.green },
  { label: 'Miscellaneous', value: 'miscellaneous', color: colors.gray },
];

function getArtworkCategoryLabel(value: string): string {
  const category = ARTWORK_CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
}

const DEFAULT_ARTWORK_CATEGORY = ARTWORK_CATEGORIES.find(cat => cat.default) || ARTWORK_CATEGORIES[0];

export { ARTWORK_CATEGORIES, getArtworkCategoryLabel, DEFAULT_ARTWORK_CATEGORY };
