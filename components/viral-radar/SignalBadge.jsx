import React from 'react';

/**
 * 信号徽章组件
 * 展示视频的信号类型： trending(热门) / viral(病毒式传播) / breakout(突破性) / early(早期)
 */
const SignalBadge = ({
  type,
  size = 'md',
  animated = false,
  onClick,
}) => {
  // 信号配置
  const signalConfig = {
    trending: {
      label: 'Trending',
      icon: '🔥',
      gradient: 'from-orange-500 to-red-500',
      shadow: 'shadow-orange-500/30',
      description: '正在热门趋势中',
    },
    viral: {
      label: 'Viral',
      icon: '🚀',
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/30',
      description: '病毒式传播',
    },
    breakout: {
      label: 'Breakout',
      icon: '⚡',
      gradient: 'from-yellow-400 to-amber-500',
      shadow: 'shadow-yellow-500/30',
      description: '突破性增长',
    },
    early: {
      label: 'Early',
      icon: '⏰',
      gradient: 'from-emerald-400 to-teal-500',
      shadow: 'shadow-emerald-500/30',
      description: '早期信号',
    },
  };

  const config = signalConfig[type];

  // 尺寸配置
  const sizeConfig = {
    sm: {
      container: 'px-1.5 py-0.5 text-xs gap-0.5',
      icon: 'text-xs',
    },
    md: {
      container: 'px-2.5 py-1 text-sm gap-1',
      icon: 'text-sm',
    },
    lg: {
      container: 'px-3 py-1.5 text-base gap-1.5',
      icon: 'text-base',
    },
  };

  return (
    <span
      onClick={onClick}
      title={config.description}
      className={`
        inline-flex items-center rounded-full font-medium text-white
        bg-gradient-to-r ${config.gradient}
        ${sizeConfig[size].container}
        ${animated ? `animate-pulse ${config.shadow} shadow-lg` : ''}
        ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
      `}
    >
      <span className={sizeConfig[size].icon}>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

/**
 * 信号列表组件
 * 展示多个信号徽章
 */
export const SignalList = ({
  signals,
  size = 'md',
  animated = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {signals.map((signal, index) => (
        <SignalBadge
          key={index}
          type={signal}
          size={size}
          animated={animated}
        />
      ))}
    </div>
  );
};

export default SignalBadge;
