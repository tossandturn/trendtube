import React from 'react';

export type Region = 'US' | 'JP' | 'KR' | 'GB' | 'HK' | 'TW';

interface RegionFilterProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

const regions: { code: Region; name: string; flag: string }[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
];

export const RegionFilter: React.FC<RegionFilterProps> = ({ selectedRegion, onRegionChange }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700">
      <span className="text-slate-400 text-sm mr-2">Region:</span>
      <div className="flex gap-1">
        {regions.map((region) => (
          <button
            key={region.code}
            onClick={() => onRegionChange(region.code)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-all
              flex items-center gap-1.5
              ${selectedRegion === region.code
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
              }
            `}
            title={region.name}
          >
            <span className="text-base">{region.flag}</span>
            <span>{region.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionFilter;
