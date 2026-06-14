import { useState, useCallback } from 'react';
import type { Region } from '../components/RegionFilter';

// YouTube区域代码映射
export const regionToYouTubeCode: Record<Region, string> = {
  US: 'US',
  JP: 'JP',
  KR: 'KR',
  GB: 'GB',
  HK: 'HK',
  TW: 'TW',
};

// 区域名称映射
export const regionNames: Record<Region, string> = {
  US: 'United States',
  JP: 'Japan',
  KR: 'South Korea',
  GB: 'United Kingdom',
  HK: 'Hong Kong',
  TW: 'Taiwan',
};

// 模拟YouTube数据按区域过滤
// 在实际应用中，这里会调用API获取特定区域的数据
export const filterDataByRegion = <T extends { region?: string; country?: string }>(
  data: T[],
  region: Region
): T[] => {
  if (!data || data.length === 0) return [];
  
  const regionCode = regionToYouTubeCode[region];
  
  // 如果数据有region或country字段，进行过滤
  return data.filter((item) => {
    if (item.region) return item.region === regionCode;
    if (item.country) return item.country === regionCode;
    // 如果没有区域字段，返回所有数据（默认行为）
    return true;
  });
};

// Hook for managing region filter state
export const useRegionFilter = (defaultRegion: Region = 'US') => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(defaultRegion);

  const handleRegionChange = useCallback((region: Region) => {
    setSelectedRegion(region);
    // 这里可以添加其他副作用，比如触发数据重新获取
  }, []);

  return {
    selectedRegion,
    setSelectedRegion,
    handleRegionChange,
    regionCode: regionToYouTubeCode[selectedRegion],
    regionName: regionNames[selectedRegion],
  };
};

export default useRegionFilter;
