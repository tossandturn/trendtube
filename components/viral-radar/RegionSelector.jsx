import React from 'react';

/**
 * 支持的区域数据
 */
export const REGIONS = [
  { code: 'US', name: 'United States', flag: '🇺🇸', language: 'English' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', language: 'Japanese' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', language: 'Korean' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', language: 'English' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', language: 'Chinese' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', language: 'Chinese' },
];

/**
 * 区域选择器组件
 * 支持单选/多选，多种变体样式
 */
const RegionSelector = ({
  selectedRegion,
  onRegionChange,
  multiSelect = false,
  selectedRegions = [],
  onRegionsChange,
  size = 'md',
  variant = 'pills',
  showLabel = true,
  className = '',
}) => {
  // 尺寸配置
  const sizeConfig = {
    sm: {
      container: 'gap-1',
      button: 'px-2 py-1 text-xs gap-0.5',
      flag: 'text-sm',
      card: 'p-2',
      cardFlag: 'text-2xl',
      cardText: 'text-xs',
    },
    md: {
      container: 'gap-2',
      button: 'px-3 py-1.5 text-sm gap-1',
      flag: 'text-base',
      card: 'p-3',
      cardFlag: 'text-3xl',
      cardText: 'text-sm',
    },
    lg: {
      container: 'gap-3',
      button: 'px-4 py-2 text-base gap-1',
      flag: 'text-lg',
      card: 'p-4',
      cardFlag: 'text-4xl',
      cardText: 'text-base',
    },
  };

  const config = sizeConfig[size];

  // 处理多选切换
  const handleMultiSelect = (code) => {
    if (!onRegionsChange) return;
    
    const newSelection = selectedRegions.includes(code)
      ? selectedRegions.filter(r => r !== code)
      : [...selectedRegions, code];
    
    onRegionsChange(newSelection);
  };

  // Pills 变体
  if (variant === 'pills') {
    return (
      <div className={`${className}`}>
        {showLabel && (
          <label className="block text-slate-400 text-sm mb-2">Region</label>
        )}
        <div className={`flex flex-wrap ${config.container}`}>
          {REGIONS.map((region) => {
            const isSelected = multiSelect 
              ? selectedRegions.includes(region.code)
              : selectedRegion === region.code;
            
            return (
              <button
                key={region.code}
                onClick={() => multiSelect 
                  ? handleMultiSelect(region.code)
                  : onRegionChange(region.code)
                }
                className={`
                  ${config.button} rounded-lg font-medium transition-all duration-200
                  flex items-center border
                  ${isSelected
                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                  }
                `}
                title={`${region.name} (${region.language})`}
              >
                <span className={config.flag}>{region.flag}</span>
                <span>{region.code}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Tabs 变体
  if (variant === 'tabs') {
    return (
      <div className={`${className}`}>
        {showLabel && (
          <label className="block text-slate-400 text-sm mb-2">Region</label>
        )}
        <div className="flex border-b border-slate-700">
          {REGIONS.map((region) => {
            const isSelected = multiSelect 
              ? selectedRegions.includes(region.code)
              : selectedRegion === region.code;
            
            return (
              <button
                key={region.code}
                onClick={() => multiSelect 
                  ? handleMultiSelect(region.code)
                  : onRegionChange(region.code)
                }
                className={`
                  ${config.button} font-medium transition-all duration-200
                  flex items-center gap-1.5 border-b-2 -mb-px
                  ${isSelected
                    ? 'text-indigo-400 border-indigo-400'
                    : 'text-slate-400 border-transparent hover:text-slate-300 hover:border-slate-600'
                  }
                `}
              >
                <span className={config.flag}>{region.flag}</span>
                <span>{region.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Cards 变体
  return (
    <div className={`${className}`}>
      {showLabel && (
        <label className="block text-slate-400 text-sm mb-3">Select Region</label>
      )}
      <div className={`grid grid-cols-3 sm:grid-cols-6 ${config.container}`}>
        {REGIONS.map((region) => {
          const isSelected = multiSelect 
            ? selectedRegions.includes(region.code)
            : selectedRegion === region.code;
          
          return (
            <button
              key={region.code}
              onClick={() => multiSelect 
                ? handleMultiSelect(region.code)
                : onRegionChange(region.code)
              }
              className={`
                ${config.card} rounded-xl border transition-all duration-200
                flex flex-col items-center justify-center gap-1
                ${isSelected
                  ? 'bg-indigo-500/10 border-indigo-500 text-white'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600'
                }
              `}
            >
              <span className={config.cardFlag}>{region.flag}</span>
              <span className={`${config.cardText} font-medium`}>{region.code}</span>
              <span className="text-xs text-slate-500">{region.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 区域快速选择器
 * 简化版的区域选择器，用于工具栏等紧凑场景
 */
export const RegionQuickSelector = ({
  selectedRegion,
  onRegionChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700 ${className}`}>
      {REGIONS.map((region) => (
        <button
          key={region.code}
          onClick={() => onRegionChange(region.code)}
          className={`
            px-2 py-1 rounded-md text-sm font-medium transition-all
            ${selectedRegion === region.code
              ? 'bg-indigo-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }
          `}
          title={region.name}
        >
          {region.flag}
        </button>
      ))}
    </div>
  );
};

export default RegionSelector;
