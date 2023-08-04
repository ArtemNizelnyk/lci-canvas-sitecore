import { SitecoreItemIDs } from '@/constants';
import SitecoreClient from './sitecoreClient';
export interface Course {
  Campus: string;
  Title: string;
  ItemName: string;
  ItemID: string;
}

export function getCoursesFromSitecore(preview: boolean):Promise<Course[]> {
  const client = new SitecoreClient(
    process.env.SITECORE_API_KEY as string,
    process.env.SITECORE_API_URL as string,
    preview ? 'master' : (process.env.DATABASE as string)
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
      )
      return response;
    }
    )
    .catch(error => console.log(error));

  return courses;

  // Get an item by its ID
  //  client.getItemById('110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9')
  //   .then(item => console.log(item))
  //   .catch(error => console.error(error));

  // Get an item by its path
  // const course = client.getItemByPath('/sitecore/content/uniform-mvc-kit/Home/Courses')
  //     .then(item => console.log(item))
  //     .catch(error => console.error(error));
}
