import { enhance, EnhancerBuilder, RootComponentInstance } from '@uniformdev/canvas';
import {
    createItemEnhancer,
    getPageItemId,
} from '@uniformdev/canvas-sitecore';
import { Logger, throwException } from '@uniformdev/canvas-sitecore';

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
}: {
  composition: RootComponentInstance;
  preEnhancer?: EnhancerBuilder;
  preview?: boolean;
  config:any;
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

    let pageId = getPageItemId({ composition });
    //let pageId="A766B52E-D89A-4880-9286-0F4A91DB39B8";
    if (pageId) {
        const dataSourceItemEnhancer = createItemEnhancer({
            pageId,
            config,
            isPreview:preview,
            logger: preview ? consoleLogger : undefined,
            modelOnly: false,
        });
        enhancerBuilder.parameterType('sitecoreItem', dataSourceItemEnhancer);
    }



  await enhance({
    composition,
    enhancers: enhancerBuilder,
    context: { preview },
    onErrors: errors => console.warn('Failed to enhance the composition:', errors),
  });

};