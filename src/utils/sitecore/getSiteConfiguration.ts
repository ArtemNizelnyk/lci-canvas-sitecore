export function getSiteConfiguration(locale: any, siteName: string) {
  if (siteName && locale) {
    return siteName + '_' + locale;
  }
  if (locale) {
    return 'lci-mvc_' + locale;
  }
  if (siteName) {
    return siteName + '_en';
  }
  return 'lci-mvc_en';
}
