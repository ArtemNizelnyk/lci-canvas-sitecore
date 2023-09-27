import NodeCache from 'node-cache';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  SiteLocale,
  getProjectMapSlugForOriginalSlug,
  getTranslatedSlugForProjectMapSlug,
} from '@/lib/translation/slugTranslationFileSystem';

// Create a new cache instance
const myCache = new NodeCache({ stdTTL: 0 });

interface CacheData {
  translatedSlug: string;
  originalSlug: string;
  fetchedAt: Date;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const pathSegment = typeof req.query.pathSegment === 'string' ? req.query.pathSegment.trim() : null;
  const locale = typeof req.query.locale === 'string' ? req.query.locale.trim() : null;

  const type = req.query.type === 'original' ? 'original' : 'translated';

  if (!pathSegment || !locale || !type) {
    return res.status(200).json({ translatedSlug: pathSegment });
  }

  if (type == 'original') {
    try {
      // Combine the pathSegment and the locale to create a unique key for each combination
      const cacheKey = `${pathSegment}|${locale}|${type}`;

      // Check if we already have a translation in the cache
      const cachedData: CacheData | undefined = myCache.get(cacheKey);
      let originalSlug;

      if (cachedData) {
        // Extract only the translated slug
        originalSlug = cachedData.originalSlug;
      } else {
        // If not in the cache, fetch it and store it in the cache
        originalSlug = await getProjectMapSlugForOriginalSlug(pathSegment, locale as SiteLocale);
        myCache.set(cacheKey, { originalSlug, fetchedAt: new Date() });
      }

      return res.status(200).json({ originalSlug });
    } catch (error) {
      console.error('Error in translation:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    try {
      // Combine the pathSegment and the locale to create a unique key for each combination
      const cacheKey = `${pathSegment}|${locale}|${type}`;

      // Check if we already have a translation in the cache
      const cachedData: CacheData | undefined = myCache.get(cacheKey);

      let translatedSlug;

      if (cachedData) {
        // Extract only the translated slug
        translatedSlug = cachedData.translatedSlug;
      } else {
        // If not in the cache, fetch it and store it in the cache
        translatedSlug = await getTranslatedSlugForProjectMapSlug(pathSegment, locale as SiteLocale);
        myCache.set(cacheKey, { translatedSlug, fetchedAt: new Date() });
      }

      return res.status(200).json({ translatedSlug });
    } catch (error) {
      console.error('Error in translation:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

export default handler;
