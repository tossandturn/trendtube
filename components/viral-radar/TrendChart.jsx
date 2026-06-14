import React, { useMemo } from 'react';

/**
 * 趋势图表组件
 * 使用SVG绘制简单的折线图
 */
const TrendChart = ({
  data,
  title,
  description,
  height = 200,
  showGrid = true,
  showDots = true,
  fillArea = true,
  lineColor = '#6366f1',
  fillColor = 'rgba(99, 102, 241, 0.2)',
  className = '',
}) => {
  // 计算图表尺寸和比例
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 800;
  const chartHeight = height;
  const width = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // 计算数据范围
  const maxValue = useMemo(() => {
    const values = data.flatMap(d => [d.value, d.value2 || 0]);
    return Math.max(...values) * 1.1; // 增加10%边距
  }, [data]);

  const minValue = useMemo(() => {
    const values = data.flatMap(d => [d.value, d.value2 || 0]);
    return Math.min(0, ...values);
  }, [data]);

  // 坐标转换函数
  const scaleX = (index) => padding.left + (index / (data.length - 1)) * width;
  const scaleY = (value) => padding.top + innerHeight - ((value - minValue) / (maxValue - minValue)) * innerHeight;

  // 生成路径
  const generatePath = (values) => {
    return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(v)}`).join(' ');
  };

  // 生成填充区域路径
  const generateAreaPath = (values) => {
    const linePath = generatePath(values);
    const bottomY = padding.top + innerHeight;
    return `${linePath} L ${scaleX(values.length - 1)} ${bottomY} L ${scaleX(0)} ${bottomY} Z`;
  };

  // 生成网格线
  const gridLines = useMemo(() => {
    const lines = [];
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const y = padding.top + (innerHeight / steps) * i;
      const value = maxValue - ((maxValue - minValue) / steps) * i;
      lines.push({ y, value });
    }
    return lines;
  }, [maxValue, minValue, innerHeight]);

  // 格式化数值
  const formatValue = (v) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return v.toString();
  };

  if (data.length === 0) {
    return (
      <div className={`bg-slate-800/50 rounded-xl border border-slate-700 p-6 ${className}`}>
        {title && <h3 className="text-white font-semibold mb-2">{title}</h3>}
        <div className="flex items-center justify-center h-48 text-slate-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 rounded-xl border border-slate-700 p-6 ${className}`}>
      {/* 标题 */}
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-white font-semibold text-lg">{title}</h3>}
          {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
        </div>
      )}

      {/* 图表 */}
      <div className="relative" style={{ height: chartHeight }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 网格线 */}
          {showGrid && gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={chartWidth - padding.right}
                y2={line.y}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={line.y + 4}
                textAnchor="end"
                fill="#64748b"
                fontSize="12"
              >
                {formatValue(line.value)}
              </text>
            </g>
          ))}

          {/* 填充区域 */}
          {fillArea && (
            <path
              d={generateAreaPath(data.map(d => d.value))}
              fill={fillColor}
              className="transition-all duration-500"
            />
          )}

          {/* 主线条 */}
          <path
            d={generatePath(data.map(d => d.value))}
            fill="none"
            stroke={lineColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />

          {/* 对比线条 */}
          {data[0]?.value2 !== undefined && (
            <path
              d={generatePath(data.map(d => d.value2))}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* 数据点 */}
          {showDots && data.map((point, i) => (
            <g key={i}>
              <circle
                cx={scaleX(i)}
                cy={scaleY(point.value)}
                r="5"
                fill={lineColor}
                stroke="#1e293b"
                strokeWidth="2"
                className="hover:r-6 transition-all cursor-pointer"
              />
              {point.value2 !== undefined && (
                <circle
                  cx={scaleX(i)}
                  cy={scaleY(point.value2)}
                  r="4"
                  fill="#10b981"
                  stroke="#1e293b"
                  strokeWidth="2"
                />
              )}
            </g>
          ))}

          {/* X轴标签 */}
          {data.map((point, i) => (
            <text
              key={`label-${i}`}
              x={scaleX(i)}
              y={chartHeight - 10}
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
              transform={`rotate(-30, ${scaleX(i)}, ${chartHeight - 10})`}
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lineColor }} />
          <span className="text-slate-400 text-sm">Current Trend</span>
        </div>
        {data[0]?.value2 !== undefined && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-400 text-sm">Previous Period</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 迷你趋势图
 * 用于卡片等紧凑场景
 */
export const MiniTrendChart = ({
  data,
  color = '#6366f1',
  height = 40,
  className = '',
}) => {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = data[data.length - 1] >= data[0];

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div 
        className={`absolute top-0 right-0 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
      >
        {isPositive ? '↑' : '↓'} {Math.abs(((data[data.length - 1] - data[0]) / data[0]) * 100).toFixed(1)}%
      </div>
    </div>
  );
};

/**
 * 柱状趋势图
 * 使用柱状图展示趋势
 */
export const BarTrendChart = ({
  data,
  title,
  height = 200,
  barColor = '#6366f1',
  className = '',
}) => {
  const maxValue = Math.max(...data.map(d => d.value)) * 1.1;

  return (
    <div className={`bg-slate-800/50 rounded-xl border border-slate-700 p-6 ${className}`}>
      {title && <h3 className="text-white font-semibold text-lg mb-4">{title}</h3>}
      
      <div className="relative" style={{ height }}>
        <div className="flex items-end justify-between gap-2 h-full">
          {data.map((point, i) => {
            const heightPercent = (point.value / maxValue) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ 
                      height: `${heightPercent}%`, 
                      backgroundColor: barColor,
                      minHeight: '4px'
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {point.value.toLocaleString()}
                  </div>
                </div>
                <span className="text-slate-400 text-xs truncate w-full text-center">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
