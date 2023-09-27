import path from 'path';
import fs from 'fs';

type CacheEntry = {
  timestamp: number;
  result: string;
};

type CacheDictionary = { [key: string]: CacheEntry };

const cacheArray = JSON.parse(
  `[{  
      "key": "getLocaleAndOriginalSlugFromSegment_articles",
      "content": {
        "timestamp": 1691704265909,
        "result": { "locale": "en", "originalSlug": "articles" }
      }
    }]`
);

const cacheData: CacheDictionary = Object.fromEntries(
  cacheArray.map((item: { key: string; content: CacheEntry }) => [item.key, item.content])
);

export async function cacheResult(cacheKey: string, result: any) {
  const cacheDir = path.join(process.cwd(), 'data');
  const cacheFilePath = path.join(cacheDir, `${cacheKey}.json`);
  const cacheData = { timestamp: Date.now(), result };
  fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData), 'utf8');
}

export async function getCachedResult(cacheKey: string) {
  const cachedResult = cacheData[cacheKey];
  if (cachedResult) {
    // Optionally, you can still check if the cached result is within a certain age
    // if (Date.now() - cachedResult.timestamp < 3 * 30 * 24 * 60 * 60 * 1000) {
    return cachedResult.result;
    //}
  }

  return null;
}
