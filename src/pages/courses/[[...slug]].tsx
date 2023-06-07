import Page from '@/components/Page';
import { AppPages, InternalCompositionSlugs } from '@/constants';
import { getCoursesFromSitecore, Course } from '@/lib/sitecoreHelper';
import { getErrorPageProps } from '@/utils';
import { getCompositionProps } from '@/utils/canvas';
import { getPreEnhancer } from '@/utils/enhancers/wildcard';
import { getFormattedPath } from '@/utils/wildcard';
import { noopLogger, parseUniformServerConfig } from '@uniformdev/canvas-sitecore';



export const getStaticProps: GetStaticProps<{ preview?: boolean }> = async (context:any) => {
    const { preview, params } = context;
    const { slug: initialSlug } = params || {};
  
    const config = parseUniformServerConfig(process.env, noopLogger, true);
    console.log(initialSlug);
    const path = getFormattedPath(AppPages.Courses, initialSlug).toLowerCase();
    const courseSlug = String(initialSlug);
    const courses = await getCoursesFromSitecore(preview);
    if (!courses || !path) return { notFound: true };
  
   console.log("normal path",path)
    const selectedCourse:Course = courses?.find((course:Course) => course.Title===courseSlug.replace(/-/g, ' '))
    return getCompositionProps({
      path, // Request for custom page
      defaultPath: `${AppPages.Courses}${InternalCompositionSlugs.WildcardListing}`, // Request a default template page for courses in case there is no custom page
      context,//uniform context
      config,//configuration file
      preEnhancer: !InternalCompositionSlugs.WildcardListing.includes(courseSlug)
      ? getPreEnhancer(selectedCourse?.ItemID) //this is a preEnhancer that is going to be executed before actual
      : undefined,                           // enhancers to swap the sitecoreItem parameter defined on the template with the actual one identified from route
      pageId:selectedCourse?.ItemID // equivalent to Sitecore.Context.Item Global property that will be used as a value for any SitecoreItem parameters with no assigned value.
    })
      .then((compositionProps: any) => ({
        props: {
          ...compositionProps,
          preview: Boolean(preview),
        },
      }));
     // .catch(getErrorPageProps);
  };

  export const getStaticPaths: GetStaticPaths = async () => {
    const courses = await getCoursesFromSitecore(false);
    const paths = courses.map((item:Course) => `${AppPages.Courses}/${item.Title.replace(/\s+/g, '-')}`);

    return { paths:paths, fallback: false };
};

export default Page;