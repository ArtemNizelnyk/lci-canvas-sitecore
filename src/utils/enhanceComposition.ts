import { getTranslatedSlugForProjectMapSlug, SiteLocale } from '@/lib/translation/slugTranslationFileSystem';
import { ComponentParameterEnhancer } from '@uniformdev/canvas';
import { enhance, EnhancerBuilder, RootComponentInstance } from '@uniformdev/canvas';
import { createItemEnhancer, getPageItemId } from '@uniformdev/canvas-sitecore';
import { Logger } from '@uniformdev/canvas-sitecore';

type LinkParameter = {
  type: 'link';
  value: Link;
};

type Link = {
  path: string;
  type: string;
  nodeId: string;
  projectMapId: string;
};

const consoleLogger: Logger = {
  trace: (...message: any[]) => console.log(message.join('\r')),
  debug: (...message: any[]) => console.log(message.join('\r')),
  info: (...message: any[]) => console.log(message.join('\r')),
  warn: (...message: any[]) => console.log(message.join('\r')),
  error: (...message: any[]) => console.log(message.join('\r')),
};

export const enhanceComposition = async ({
  composition,
  preEnhancer,
  preview = false,
  config,
  locale,
}: {
  composition: RootComponentInstance;
  preEnhancer?: EnhancerBuilder;
  preview?: boolean;
  config: any;
  locale: string;
}) => {
  if (preEnhancer) {
    await enhance({
      composition,
      enhancers: preEnhancer,
      context: { preview },
      onErrors: errors => console.warn('Failed to pre-enhance the composition:', errors),
    });
  }

  const enhancerBuilder = new EnhancerBuilder();

  const pageId = getPageItemId({ composition });
  if (pageId) {
    const dataSourceItemEnhancer = createItemEnhancer({
      pageId,
      config,
      isPreview: preview,
      logger: preview ? consoleLogger : undefined,
      modelOnly: false,
    });
    enhancerBuilder.parameterType('sitecoreItem', dataSourceItemEnhancer);
  }

  function createLinkTranslationEnhancer(
    locale: string
  ): ComponentParameterEnhancer {
    return {
      enhanceOne: async ({ parameter }) => {
        const link = parameter.value as Link;
        if (link.type === 'projectMapNode') {
          const translatedPath =  await getTranslatedSlugForProjectMapSlug(link.path, locale as SiteLocale);
          return {
            ...link,
            path: translatedPath,
          };
        }
      },
    };
  }
  const linkTranslationEnhancer= createLinkTranslationEnhancer(locale)

  //link enhancing
  enhancerBuilder.parameterType('link', linkTranslationEnhancer);

  await enhance({
    composition,
    enhancers: enhancerBuilder,
    context: { preview },
    onErrors: errors => console.warn('Failed to enhance the composition:', errors),
  });

};
