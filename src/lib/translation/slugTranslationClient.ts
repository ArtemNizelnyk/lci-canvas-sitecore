import { NextRouter } from 'next/router';
import { SiteLocale } from './slugTranslationFileSystem';

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
async function fetchTranslatedSlug(
  pathSegment: string,
  locale: string,
  type: 'original' | 'translated'
): Promise<string> {
  const res = await fetch(`/api/translatePath?pathSegment=${pathSegment}&locale=${locale}&type=${type}`);
  const data = await res.json();
  if (type === 'original') {
    return data.originalSlug;
  }
  if (type === 'translated') {
    return data.translatedSlug;
  }
  throw new Error("Couldn't retrieve translation from API");
}

// Function to get a translated slug with caching and cache expiry
export async function getTranslatedSlug(pathSegment: string, locale: string, type: 'original' | 'translated') {
  const key = `${pathSegment}|${locale}|${type}`;
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
  const translation = await fetchTranslatedSlug(pathSegment, locale, type);

  if (translation) {
    // Cache the translation with a dynamic expiry time
    await cacheTranslation(key, translation, millisecondsIn3Months);
  }

  return translation;
}

export async function translateSlugFromTo(pathSegment: string, fromLocale: string, toLocale: string): Promise<string> {
  const projectMapNode = await getTranslatedSlug(pathSegment, fromLocale as SiteLocale, 'original');
  const translatedNode = await getTranslatedSlug(projectMapNode, toLocale as SiteLocale, 'translated');
  return translatedNode;
}
