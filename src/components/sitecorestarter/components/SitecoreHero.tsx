import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import NextImage from 'next/image';

type SitecoreHeroProps = ComponentProps<{
  dataSource?: {
    Title: string;
    Description?: string;
    ItemID: string;
    Image: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
  };
}>;

const SitecoreHero: React.FC<SitecoreHeroProps> = ({ dataSource }: SitecoreHeroProps) => {
  const img = dataSource?.Image;
  return (
    <div>
      <NextImage
        alt="image"
        src={'https://ngrok-artemn.unfrm.uno/' + img?.url}
        width={img?.width ?? 1000}
        height={img?.height ?? 1000}
      />
      <h1 className="flex-1 flex justify-center items-center text-black text-x1"><b>{dataSource?.Title}</b></h1>

      <div className="description" dangerouslySetInnerHTML={{ __html: dataSource?.Description || '' }} />
    </div>
  );
};

// making sure `<UniformSlot />` how to render components with type 'hero'
registerUniformComponent({
  type: 'sitecorehero',
  component: SitecoreHero,
});

export default SitecoreHero;
