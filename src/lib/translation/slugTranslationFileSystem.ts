import { NextRouter } from 'next/router';
import { LocalizedProjectMapNode, getProjectMapTranslations } from '../sitecoreHelper';
import { cacheResult, getCachedResult } from './cache';
import crypto from 'crypto';
export type SiteLocale = 'en' | 'fr_FR';

const millisecondsInADay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
const millisecondsInAMonth = 30.44 * millisecondsInADay;
const millisecondsIn3Months = 3 * millisecondsInAMonth;

interface CachedTranslation {
  translation: string;
  timestamp: number;
  maxAge: number; // Expiry time in milliseconds
}

// Function to get a translated slug from local storage
async function getCachedTranslation(key: string): Promise<CachedTranslation | null> {
  try {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData) as CachedTranslation;
      return parsedData;
    }
  } catch (error) {
    console.error('Error parsing cached data:', error);
  }
  return null;
}

// Function to store a translated slug in local storage
async function cacheTranslation(key: string, translation: string, maxAge: number): Promise<void> {
  const data: CachedTranslation = {
    translation,
    timestamp: Date.now(),
    maxAge,
  };
  localStorage.setItem(key, JSON.stringify(data));
}

// Function to get a translated slug from the server
async function fetchTranslatedSlug(pathSegment: string, locale: string): Promise<string> {
  const res = await fetch(`/api/translatePath?pathSegment=${pathSegment}&locale=${locale}`);
  const data = await res.json();
  return data.translatedSlug;
}

// Function to get a translated slug with caching and cache expiry
export async function getTranslatedSlug(pathSegment: string, locale: string) {
  const key = `${pathSegment}|${locale}`;
  const cachedTranslation = await getCachedTranslation(key);

  if (cachedTranslation) {
    const now = Date.now();
    if (now - cachedTranslation.timestamp < cachedTranslation.maxAge) {
      return cachedTranslation.translation;
    }
    // Remove the cached data if it has expired
    localStorage.removeItem(key);
  }

  // Fetch the translation from the server
  const translation = await fetchTranslatedSlug(pathSegment, locale);

  // Cache the translation with a dynamic expiry time
  await cacheTranslation(key, translation, millisecondsIn3Months);

  return translation;
}

// ... Rest of the code ...

interface ButtonLink {
  path: string;
}

export const translatePath = async (router: NextRouter, buttonLink: ButtonLink): Promise<string> => {
  if (router.isReady && buttonLink && buttonLink.path) {
    let localeSlug: string = router?.query?.slug?.[0] || '';

    if (!localeSlug) {
      localeSlug = router.locale || 'en-US';
    }

    const linkPathSegments: string[] = buttonLink.path.split('/');
    const translatedSegments: string[] = await Promise.all(
      linkPathSegments.map(async (segment: string) => {
        if (!segment || segment === ':lang') {
          // skip empty segments and ':lang'
          return '';
        }
        const translatedSlug: string = await getTranslatedSlug(segment, localeSlug);
        return translatedSlug;
      })
    );

    // Filter out empty strings and then join the segments
    return translatedSegments.filter(Boolean).join('/');
  }
  return buttonLink.path;
};

type LocaleMap = {
  [key: string]: string;
};

export function getLocaleFromUrlPath(segment: string): [SiteLocale | null, SiteLocale | null] {
  const knownLocales: SiteLocale[] = ['en', 'fr_FR'];
  const localeMap: Record<SiteLocale, SiteLocale> = {
    en: 'en',
    fr_FR: 'fr_FR',
  };

  if (!knownLocales.includes(segment as SiteLocale)) {
    return [null, null];
  }

  const locale = segment as SiteLocale;
  const localeFormatted = localeMap[segment as SiteLocale] || null;

  return [locale, localeFormatted];
}

export async function getProjectMapSlugForOriginalSlug(originalSlug: string, locale: SiteLocale): Promise<string> {
  const functionName = 'getProjectMapSlugForOriginalSlug';

  const hash = crypto.createHash('md5').update(originalSlug).digest('hex');
  const cacheKey = `${functionName}_${hash}_${locale}`;

  const cachedResult = await getCachedResult(cacheKey);

  if (cachedResult) {
    return cachedResult;
  }

  try {
    const translatedNodes: LocalizedProjectMapNode[] = await getProjectMapTranslations(locale);
    const result = translatedNodes.find(item => {
      return item.translatedSlug.toLowerCase() === originalSlug.toLowerCase();
    });
    if (result) {
      await cacheResult(cacheKey, result.originalSlug);
      return result.originalSlug;
    }

    throw new Error(`No originalSlug found for ${originalSlug}`);
  } catch (error) {
    console.log('error', error);
  }

  return '';
}

export async function getTranslatedSlugForProjectMapSlug(projectMapSlug: string, locale: SiteLocale): Promise<string> {
  const functionName = 'getTranslatedSlugForProjectMapSlug';

  const hash = crypto.createHash('md5').update(projectMapSlug).digest('hex');
  const cacheKey = `${functionName}_${hash}_${locale}`;
  const cachedResult = await getCachedResult(cacheKey);

  if (cachedResult) {
    return cachedResult;
  }

  try {
    const translatedNodes: LocalizedProjectMapNode[] = await getProjectMapTranslations(locale);
    const result = translatedNodes.find(item => {
      return item.originalSlug.toLowerCase() === projectMapSlug.toLowerCase();
    });
    if (result) {
      await cacheResult(cacheKey, result.translatedSlug);
      return result.translatedSlug;
    }

    throw new Error(`No translatedSlug found for ${projectMapSlug}`);
  } catch (error) {
    console.log('ERROR SERVER', error);
  }

  return '';
}
