import { EnhancerBuilder } from '@uniformdev/canvas';
import { ComponentParameter } from '@uniformdev/canvas';

export interface EnhanceParameter<T> {
  parameter: ComponentParameter<T>;
}

interface SitecoreItemParam {
  value:string
}


// We replacing the default SitecoreItem parameter enhancer with our own based on the product id from slug
const getSitecoreItemParameterPreEnhancer = (itemId: string) => ({
  enhanceOne: async function Enhancer({ parameter }: EnhanceParameter<SitecoreItemParam>) {
    return itemId;
  },
});


export const getPreEnhancer = (itemId: string) => {
  return new EnhancerBuilder().component("sitecorehero",  (ctx)=> ctx.parameterType('sitecoreItem', getSitecoreItemParameterPreEnhancer(itemId)));
  
};
