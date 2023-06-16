import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import NextImage from 'next/image';

type SitecoreCardProps = ComponentProps<{
  datasource?: {
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

const SitecoreCard: React.FC<SitecoreCardProps> = ({ datasource }: SitecoreCardProps) => {
  const img = datasource?.Image;
  return (
    <div>
      <h1 className="flex-1 flex justify-center items-center">{datasource?.Title}</h1>
      <NextImage
        alt="image"
        src={'https://ngrok-artemn.unfrm.uno/' + img?.url}
        width={img?.width ?? 1000}
        height={img?.height ?? 1000}
      />
    </div>
  );
};

// making sure `<UniformSlot />` how to render components with type 'hero'
registerUniformComponent({
  type: 'sitecorecard',
  component: SitecoreCard,
});

export default SitecoreCard;
