import { FC } from 'react';
import { UniformComposition, UniformSlot } from '@uniformdev/canvas-react';
import type { RootComponentInstance } from '@uniformdev/canvas';
import { HeroVariant } from '@/canvas/Hero';
import ThemeProvider from './ThemeProvider';
import Container, { PaddingSize } from './Container';
import classNames from 'classnames';

type PageProps = {
  preview: boolean;
  useUniformComposition?: boolean;
  composition: RootComponentInstance;
};

const resolvePageComponent = (component: Pick<RootComponentInstance, 'type'>) => {
  if (component.type === 'page') {
    return (
      <>
        <UniformSlot name="pageContent">
          {({ key, child, component }) => {
            // Do not wrap container around the component if it is a container itself
            if (component.type === 'container') return <>{child}</>;

            return (
              <Container
                className={classNames({
                  '!max-w-none !px-0': component.type === 'hero' && component.variant === HeroVariant.BackgroundImage,
                })}
                // adding padding top only to 1+ component in the content slot
                paddingTop={key.toString().endsWith('-0') ? PaddingSize.None : PaddingSize.Small}
                paddingBottom={PaddingSize.Small}
              >
                {child}
              </Container>
            );
          }}
        </UniformSlot>
      </>
    );
  }
  if (component.type === 'blogpost') {
    return (
      <>
        <UniformSlot name="content">
          {({ key, child, component }) => {
            // Do not wrap container around the component if it is a container itself
            if (component.type === 'container') return <>{child}</>;

            return (
              <Container
                className={classNames({
                  '!max-w-none !px-0': component.type === 'hero' && component.variant === HeroVariant.BackgroundImage,
                })}
                // adding padding top only to 1+ component in the content slot
                paddingTop={key.toString().endsWith('-0') ? PaddingSize.None : PaddingSize.Small}
                paddingBottom={PaddingSize.Small}
              >
                {child}
              </Container>
            );
          }}
        </UniformSlot>
      </>
    );
  }
  return null;
};

const Page2: FC<PageProps> = ({ composition, useUniformComposition }) => {
  return (
    <UniformComposition data={composition} behaviorTracking="onLoad">
      {({ component }) => {
        const pageComponent = resolvePageComponent(component);
        return (
          <>
            <ThemeProvider data={composition} useUniformComposition={useUniformComposition}>
              <UniformSlot name="header" />
              {/* useUniformComposition is always true only for global composition preview */}
              {useUniformComposition && (
                <h1 className="flex-1 flex justify-center items-center">Page content placeholder</h1>
              )}

              {Boolean(pageComponent) ? pageComponent : <>Default functionality here</>}
              {/* adding container with padding only to 1+ component in the content slot */}
              <UniformSlot name="footer" />
            </ThemeProvider>
          </>
        );
      }}
    </UniformComposition>
  );
};

export default Page2;
