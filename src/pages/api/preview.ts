import { AppPages, InternalCompositionSlugs } from '@/constants';
import { getCompositionProps } from '@/utils/canvas';
import { getFormattedPath } from '@/utils/wildcard';
import { createPreviewHandler } from '@uniformdev/canvas-next';
import { noopLogger, parseUniformServerConfig } from '@uniformdev/canvas-sitecore';

// Preview Mode, more info https://nextjs.org/docs/advanced-features/preview-mode
export default createPreviewHandler({
  secret: () => process.env.UNIFORM_PREVIEW_SECRET || 'uniform',
  enhance: async (composition, { req }) => {
    const config = parseUniformServerConfig(process.env, noopLogger, true);

    await getCompositionProps({
      path: "/",
      preEnhancer: undefined,
      defaultPath: `${AppPages.Courses}${InternalCompositionSlugs.WildcardListing}`,
      context: { preview: true },
      config: config,
      pageId: '',
      previewComposition:composition,
    })

  },
  resolveFullPath: ({ path, slug }) => {
    const pathToRedirectTo = path || slug || '';
    return pathToRedirectTo.startsWith('/') ? pathToRedirectTo : `/${pathToRedirectTo}`;
  },
});
