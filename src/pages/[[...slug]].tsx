import { withUniformGetStaticProps, withUniformGetStaticPaths } from '@uniformdev/canvas-next/project-map';
import { getCanvasClient, getCompositionById, getProjectMapClient, globalCompositionId } from '@/utils/canvas';
import Page2 from '@/components/Page2';
import Page from './global';

export const getStaticProps = withUniformGetStaticProps({
  param: 'slug',
  preview: process.env.NODE_ENV === 'development',
  client: getCanvasClient(),
  callback: async (context, composition) => {
    if (!composition) {
      return {
        notFound: true,
        revalidate: 31536000,
      };
    }

    // fetching global composition for header navigation and footer
    const globalComposition = await getCompositionById(globalCompositionId, context as { preview: boolean });

    // merging two compositions
    const pageComposition = {
      _name: composition?._name,
      _id: composition?._id,
      type: composition?.type,
      parameters: {
        ...composition?.parameters,
        ...globalComposition?.parameters,
      },
      slots: {
        header: globalComposition?.slots?.header ?? null,
        pageContent: composition?.slots?.pageContent ?? null,
        footer: globalComposition?.slots?.footer ?? null,
      },
    };

    return {
      props: {
        preview: Boolean(context.preview),
        composition: pageComposition || null,
      },
      revalidate: 31536000,
    };
  },
});

export const getStaticPaths = async () => {
  const nodePaths = await withUniformGetStaticPaths({
    preview: process.env.NODE_ENV === 'development',
    client: getProjectMapClient(),
  });
  const { paths } = await nodePaths();
  return {
    paths,
    fallback: 'blocking',
  };
};

const CanvasPage = (props) => {
  if (true) {
    return Page2(props);
  }
  // if (props.composition.type==="programdetailtemplate")
  // {
  //   return Page(props);
  // }
  //some default logic
}
export default CanvasPage;
