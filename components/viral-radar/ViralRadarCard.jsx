import React from 'react';
import SignalBadge from './SignalBadge';
import VPSGauge from './VPSGauge';

/**
 * 爆款雷达卡片组件
 * 展示单个视频的VPS分数、分级和信号标签
 */
const ViralRadarCard = ({
  title,
  channelName,
  thumbnail,
  vpsScore,
  grade,
  category,
  signals,
  viewCount,
  growthRate,
  publishedAt,
  onClick,
}) => {
  // 格式化数字
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // 格式化时间
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // 分级颜色
  const gradeColors = {
    S: 'from-amber-400 to-orange-500',
    A: 'from-emerald-400 to-teal-500',
    B: 'from-blue-400 to-cyan-500',
    C: 'from-slate-400 to-gray-500',
    D: 'from-red-400 to-rose-500',
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden 
                 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 
                 transition-all duration-300 cursor-pointer"
    >
      {/* 缩略图区域 */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* 分级徽章 */}
        <div className={`absolute top-2 right-2 w-8 h-8 rounded-lg bg-gradient-to-br ${gradeColors[grade]} 
                        flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
          {grade}
        </div>
        {/* 信号徽章 */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {signals.map((signal, idx) => (
            <SignalBadge key={idx} type={signal} size="sm" />
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>

        {/* 频道信息 */}
        <p className="text-slate-400 text-xs mb-3">{channelName}</p>

        {/* VPS仪表盘 */}
        <div className="mb-3">
          <VPSGauge score={vpsScore} size="sm" showLabel />
        </div>

        {/* 统计数据 */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              👁 {formatNumber(viewCount)}
            </span>
            <span className={`${growthRate > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {growthRate > 0 ? '↑' : '↓'} {Math.abs(growthRate).toFixed(1)}%
            </span>
          </div>
          <span className="text-slate-500">{formatTime(publishedAt)}</span>
        </div>

        {/* 类别标签 */}
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <span className="inline-block px-2 py-1 bg-slate-700/50 rounded text-slate-300 text-xs">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViralRadarCard;
