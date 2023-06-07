export const getFormattedPath = (location: string, slug?: string | string[] | null): string => {
    const slugString = Array.isArray(slug) ? slug.join('/') : slug;
    const path = location.endsWith('/') ? location : `${location}/`;
    return slugString ? `${path}${slugString}` : path;
  };