import { SitecoreItemIDs, SitecoreItemPaths } from '@/constants';
import SitecoreClient from './sitecoreClient';
import { SiteLocale } from './translation/slugTranslationFileSystem';

export interface Course {
  Campus: string;
  Title: string;
  ItemName: string;
  ItemID: string;
}
export interface LocalizedProjectMapNode {
  originalSlug: string;
  translatedSlug: string;
  ItemName: string;
  ItemID: string;
  Language: SiteLocale;
}
export async function getOriginalSlugByItemId(itemId: string): Promise<string> {
  const client = new SitecoreClient(
    process.env.SITECORE_API_KEY as string,
    process.env.SITECORE_API_URL as string,
    'master',
    'en'
  );
  const slug = await client.getItemById(itemId);
  return slug.Slug;
}
export async function getProjectMapTranslations(lang: string): Promise<LocalizedProjectMapNode[]> {
  const client = new SitecoreClient(
    process.env.SITECORE_API_KEY as string,
    process.env.SITECORE_API_URL as string,
    'master',
    lang || 'en'
  );
  const result = await client.getItemChildrenByItemId(SitecoreItemIDs.ProjectMapFolder);
  const mapNodes = result.map((item: any) => {
    return {
      originalSlug: item.originalSlug,
      translatedSlug: item[`translatedSlug`],
      ItemName: item[`ItemName`],
      ItemID: item[`ItemID`],
      Language: item[`ItemLanguage`],
    };
  });

  return mapNodes;
}
export function getCoursesFromSitecore(preview: boolean, lang: string): Promise<Course[]> {
  const client = new SitecoreClient(
    process.env.SITECORE_API_KEY as string,
    process.env.SITECORE_API_URL as string,
    preview ? 'master' : (process.env.DATABASE as string),
    lang
  );

  const courses = client
    .getItemChildrenByItemId(SitecoreItemIDs.CoursesFolder)
    .then(response => {
      response.map(
        (item: any): Course => ({
          Campus: item.Campus,
          Title: item.Title,
          ItemName: item.ItemName,
          ItemID: item.ItemID,
        })
      );
      return response;
    })
    .catch(error => console.log(error));

  return courses;
}
