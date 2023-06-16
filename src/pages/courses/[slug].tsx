import Page from '@/components/Page';
import { AppPages, InternalCompositionSlugs } from '@/constants';
import { getCoursesFromSitecore, Course } from '@/lib/sitecoreHelper';
import { getCompositionProps } from '@/utils/canvas';
import { getPreEnhancer } from '@/utils/enhancers/wildcard';
import { getFormattedPath } from '@/utils/wildcard';
import { noopLogger, parseUniformServerConfig } from '@uniformdev/canvas-sitecore';
import localizationConfig from '../../constants/localizationConfig.json';
import { getSiteConfiguration } from '@/utils/sitecore/getSiteConfiguration';
import { GetStaticPaths, GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps<{ preview?: boolean }> = async (context: any) => {
  const { preview, params, locale = 'en' } = context;
  const { slug: initialSlug } = params || {};

  //sitecore enhancer uses the language defined in siteConfiguration
  const config = parseUniformServerConfig(process.env, noopLogger, true);

  //siteConfiguration uses the naming convention {siteName}_{locale} this allows us to easily map the locale to the specific siteConfiguration
  const siteConfiguration = getSiteConfiguration(locale, config.SITECORE_SITENAME);
  config.SITECORE_SITENAME = siteConfiguration;

  const path = getFormattedPath(AppPages.Courses, initialSlug).toLowerCase();
  const courseSlug = String(initialSlug);
  const courses = await getCoursesFromSitecore(preview);
  if (!courses || !path) return { notFound: true };

  const selectedCourse: Course = courses?.find((course: Course) => course.Title === courseSlug.replace(/-/g, ' '));
  return getCompositionProps({
    path, // Request for custom page
    defaultPath: `${AppPages.Courses}${InternalCompositionSlugs.WildcardListing}`, // Request a default template page for courses in case there is no custom page
    context, //uniform context
    config, //configuration file
    preEnhancer: !InternalCompositionSlugs.WildcardListing.includes(courseSlug)
      ? getPreEnhancer(selectedCourse?.ItemID) //this is a preEnhancer that is going to be executed before actual
      : undefined, // enhancers to swap the sitecoreItem parameter defined on the template with the actual one identified from route
    locale: locale, // passing locale for other enhancers except of sitecore to be able to enhance based on locale.
  }).then((compositionProps: any) => ({
    props: {
      ...compositionProps,
      preview: Boolean(preview),
    },
  }));
  // .catch(getErrorPageProps);
};

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = await getCoursesFromSitecore(false);
  const slugs = courses.map((item: Course) => `${item.Title.replace(/\s+/g, '-')}`);
  const locales = [...new Set(localizationConfig.map(region => region.locales).flat())];
  const paths = locales
    .map(locale =>
      slugs.map((slug: any) => ({
        params: {
          slug: slug,
        },
        locale,
      }))
    )
    .flat();

  return { paths: paths, fallback: false };
};

export default Page;
