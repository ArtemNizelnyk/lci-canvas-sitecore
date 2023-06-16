import { AppPages, InternalCompositionSlugs } from '@/constants';
import { getCompositionProps } from '@/utils/canvas';
import { getSiteConfiguration } from '@/utils/sitecore/getSiteConfiguration';
import { createPreviewHandler } from '@uniformdev/canvas-next';
import { noopLogger, parseUniformServerConfig } from '@uniformdev/canvas-sitecore';

// Preview Mode, more info https://nextjs.org/docs/advanced-features/preview-mode
export default createPreviewHandler({
  secret: () => process.env.UNIFORM_PREVIEW_SECRET || 'uniform',
  enhance: async (composition, context) => {
    const { locale = 'en' } = (context.req.previewData as { locale?: string }) || {};
    const config = parseUniformServerConfig(process.env, noopLogger, true);
    const siteConfiguration = getSiteConfiguration(locale, config.SITECORE_SITENAME);
    config.SITECORE_SITENAME = siteConfiguration;

    await getCompositionProps({
      path: '/',
      preEnhancer: undefined,
      defaultPath: `${AppPages.Courses}${InternalCompositionSlugs.WildcardListing}`,
      context: { preview: true },
      config: config,
      previewComposition: composition,
      locale: locale,
    });
  },
  resolveFullPath: options => {
    const path = options.path ? options.path : '';
    if (options.locale) {
      if (path.startsWith('/')) {
        return `/${options.locale}${path}`;
      }

      return `/${options.locale}/${path}`;
    }
  },
});
