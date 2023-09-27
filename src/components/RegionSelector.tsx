import { FC, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useRegionContext } from '@/context/RegionProvider';
import Dropdown from './Dropdown';
import localizationConfig from '../constants/localizationConfig.json';

const REGIONS_OPTIONS: {
  label: string;
  value: string;
  locales: string[];
}[] = localizationConfig.map(({ region, locales }) => ({
  label: region,
  value: region.toLowerCase(),
  locales: locales,
}));

const RegionSelector: FC = () => {
  const { push, asPath, locale: currentLocale = 'en' } = useRouter();
  const { region: currentRegionName, updateRegion } = useRegionContext();
  const slug = asPath;

  useEffect(() => {
    const currentRegionConfig = localizationConfig.find(({ region: regionName }) => regionName === currentRegionName.toLowerCase());
    if (!currentRegionConfig?.locales?.includes(currentLocale)) {
      const updatedRegionConfig = localizationConfig.find(({ locales }) => locales.includes(currentLocale));
      updateRegion(updatedRegionConfig?.region?.toLowerCase() || '');
    }
  }, [currentRegionName, currentLocale, updateRegion]);

  const selectedOption = useMemo(
    () => REGIONS_OPTIONS.find(({ value: regionName }) => regionName === currentRegionName.toLowerCase()),
    [currentRegionName]
  );

  const handleChange = useCallback(
    async (selectedRegionName?: string) => {
      const locales = REGIONS_OPTIONS.find(({ value: region }) => region == selectedRegionName)?.locales;
      if (selectedRegionName && locales) {
        updateRegion(selectedRegionName);
        await push(`${asPath ?? ''}`, `${asPath ?? ''}`, { locale: locales[0] });
      }
    },
    [push, slug, updateRegion]
  );

  return (
    <div className="min-w-[100px]">
      <Dropdown
        title="Region"
        defaultOption={selectedOption}
        options={REGIONS_OPTIONS}
        onChange={handleChange}
        value={selectedOption?.value}
      />
    </div>
  );
};
export default RegionSelector;
