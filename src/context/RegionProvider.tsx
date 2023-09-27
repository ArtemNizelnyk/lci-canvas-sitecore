import { FC, ReactNode, createContext, useCallback, useContext, useMemo } from 'react';
import useStorage from '../utils/hooks/useStorage';
import localizationConfig from '../constants/localizationConfig.json';

interface RegionContextProps {
  region: string;
  updateRegion: (region: string) => void;
}

export const RegionContext = createContext<RegionContextProps>({
  region: '',
  updateRegion: () => null,
});

interface Props {
  children: ReactNode;
  locale: string;
}

const RegionContextProvider: FC<Props> = ({ locale, children }) => {
  const serverRegion = findRegionByLocale(locale);
  const [region, setRegion] = useStorage<string>('region', serverRegion || '');

  const updateRegion = useCallback((region: string) => setRegion(region, { force: true }), [setRegion]);

  const value = useMemo(
    () => ({
      region,
      updateRegion,
    }),
    [region, updateRegion]
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
};

export default RegionContextProvider;

export const useRegionContext = () => useContext(RegionContext);

function findRegionByLocale(locale: string) {
  for (const { region, locales } of localizationConfig) {
    if (locales.includes(locale)) {
      return region;
    }
  }
  return null; // Return null if no corresponding region is found
}
