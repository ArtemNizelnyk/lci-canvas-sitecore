import { FC, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useRegionContext } from '@/context/RegionProvider';
import Dropdown from './Dropdown';
import localizationConfig from '../constants/localizationConfig.json';

const LanguageSelector: FC = () => {
  const { push, asPath, locale: currentLocale = 'en-US' } = useRouter();
  const { region: currentRegionName, updateRegion } = useRegionContext();
  const slug = asPath;

  const localesOptions: {
    label: string;
    value: string;
    region?: string;
  }[] = useMemo(() => {
    const currentRegionConfig = localizationConfig.find(
      ({ region: regionName }) => regionName.toLowerCase() === currentRegionName
    );
    return (
      currentRegionConfig?.locales.map(locale => ({
        label: locale,
        value: locale,
        region: currentRegionConfig?.region?.toLowerCase(),
      })) || []
    );
  }, [currentRegionName]);

  const selectedOption = useMemo(
    () => localesOptions.find(({ value: locale }) => locale === currentLocale) || localesOptions?.[0],
    [localesOptions, currentLocale]
  );

  const handleChange = useCallback(
    async (selectedLocale?: string) => {
      if (selectedLocale) {
        updateRegion(localesOptions[0].region || '');
        await push(`${slug ?? ''}`, '', { locale: selectedLocale });
      }
    },
    [localesOptions, push, slug, updateRegion]
  );

  const isDisable = useMemo(() => localesOptions.length === 1 && !!selectedOption, [localesOptions, selectedOption]);

  return (
    <div className="min-w-[100px]">
      <Dropdown
        title="Language"
        defaultOption={selectedOption}
        options={localesOptions}
        onChange={handleChange}
        value={selectedOption?.value}
        disable={isDisable}
      />
    </div>
  );
};

export default LanguageSelector;
