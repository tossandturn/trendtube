import React from 'react';

/**
 * VPS (Viral Potential Score) 仪表盘组件
 * 展示视频的爆款潜力分数
 */
const VPSGauge = ({
  score,
  size = 'md',
  showLabel = true,
  showScore = true,
  className = '',
}) => {
  // 确保分数在0-100范围内
  const clampedScore = Math.max(0, Math.min(100, score));

  // 根据分数获取等级和颜色
  const getGradeInfo = (s) => {
    if (s >= 90) return { grade: 'S', color: 'text-amber-400', bgColor: 'from-amber-400 to-orange-500', label: '爆款' };
    if (s >= 80) return { grade: 'A', color: 'text-emerald-400', bgColor: 'from-emerald-400 to-teal-500', label: '优秀' };
    if (s >= 60) return { grade: 'B', color: 'text-blue-400', bgColor: 'from-blue-400 to-cyan-500', label: '良好' };
    if (s >= 40) return { grade: 'C', color: 'text-slate-400', bgColor: 'from-slate-400 to-gray-500', label: '一般' };
    return { grade: 'D', color: 'text-red-400', bgColor: 'from-red-400 to-rose-500', label: '较低' };
  };

  const gradeInfo = getGradeInfo(clampedScore);

  // 尺寸配置
  const sizeConfig = {
    sm: {
      container: 'h-1.5',
      text: 'text-xs',
      score: 'text-sm',
    },
    md: {
      container: 'h-2',
      text: 'text-sm',
      score: 'text-lg',
    },
    lg: {
      container: 'h-3',
      text: 'text-base',
      score: 'text-xl',
    },
    xl: {
      container: 'h-4',
      text: 'text-lg',
      score: 'text-3xl',
    },
  };

  const config = sizeConfig[size];

  // 计算进度条颜色渐变
  const getProgressColor = (s) => {
    if (s >= 80) return 'bg-gradient-to-r from-emerald-500 to-teal-400';
    if (s >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-400';
    if (s >= 40) return 'bg-gradient-to-r from-yellow-500 to-amber-400';
    return 'bg-gradient-to-r from-red-500 to-orange-400';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 标签和分数 */}
      {(showLabel || showScore) && (
        <div className="flex items-center justify-between mb-1.5">
          {showLabel && (
            <div className="flex items-center gap-2">
              <span className={`${config.text} font-medium text-slate-300`}>VPS</span>
              <span className={`${config.text} px-1.5 py-0.5 rounded bg-slate-700/50 ${gradeInfo.color}`}>
                {gradeInfo.label}
              </span>
            </div>
          )}
          {showScore && (
            <div className="flex items-center gap-2">
              <span className={`${config.score} font-bold ${gradeInfo.color}`}>
                {clampedScore}
              </span>
              <span className={`${config.text} text-slate-500`}>/100</span>
            </div>
          )}
        </div>
      )}

      {/* 进度条 */}
      <div className={`relative ${config.container} bg-slate-700/50 rounded-full overflow-hidden`}>
        <div
          className={`absolute top-0 left-0 h-full ${getProgressColor(clampedScore)} 
                      rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedScore}%` }}
        >
          {/* 闪光效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* 刻度标记 */}
      <div className="flex justify-between mt-1 text-[10px] text-slate-500">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
};

/**
 * VPS卡片组件
 * 展示VPS分数的详细卡片
 */
export const VPSCard = ({
  score,
  title = 'Viral Potential Score',
  description = '基于多维度算法计算的爆款潜力评分',
  factors = [],
}) => {
  const gradeInfo = score >= 90 
    ? { grade: 'S', color: 'text-amber-400', bg: 'from-amber-400/20 to-orange-500/20', border: 'border-amber-400/30' }
    : score >= 80 
    ? { grade: 'A', color: 'text-emerald-400', bg: 'from-emerald-400/20 to-teal-500/20', border: 'border-emerald-400/30' }
    : score >= 60 
    ? { grade: 'B', color: 'text-blue-400', bg: 'from-blue-400/20 to-cyan-500/20', border: 'border-blue-400/30' }
    : score >= 40 
    ? { grade: 'C', color: 'text-slate-400', bg: 'from-slate-400/20 to-gray-500/20', border: 'border-slate-400/30' }
    : { grade: 'D', color: 'text-red-400', bg: 'from-red-400/20 to-rose-500/20', border: 'border-red-400/30' };

  return (
    <div className={`bg-gradient-to-br ${gradeInfo.bg} border ${gradeInfo.border} rounded-xl p-6`}>
      <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`text-5xl font-bold ${gradeInfo.color}`}>{score}</div>
        <div className="flex flex-col">
          <span className={`text-2xl font-bold ${gradeInfo.color}`}>Grade {gradeInfo.grade}</span>
          <span className="text-slate-400 text-sm">/ 100</span>
        </div>
      </div>

      <VPSGauge score={score} size="md" showLabel={false} showScore={false} />

      {factors.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-slate-300 font-medium text-sm">评分维度</h4>
          {factors.map((factor, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">{factor.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <span className="text-slate-300 text-sm w-8 text-right">{factor.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VPSGauge;
