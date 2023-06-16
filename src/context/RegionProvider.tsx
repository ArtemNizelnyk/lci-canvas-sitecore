import { FC, ReactNode, createContext, useCallback, useContext, useMemo } from 'react';
import useStorage from '../utils/hooks/useStorage';

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
}

const RegionContextProvider: FC<Props> = ({ children }) => {
  const [region, setRegion] = useStorage<string>('region', '');

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
