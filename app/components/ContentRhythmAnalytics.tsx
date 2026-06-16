'use client'

import { useState } from 'react'

interface DropoffPoint {
  time: string
  percentage: number
  similarAvg: number
}

interface ContentRhythmData {
  averageProgress: string
  completionRate: number
  completionRating: string
  stars: number
  totalDuration: string
  dropoffData: DropoffPoint[]
  comparisonVideos: {
    title: string
    completionRate: number
    color: string
  }[]
}

interface ContentRhythmAnalyticsProps {
  data?: ContentRhythmData
}

const defaultData: ContentRhythmData = {
  averageProgress: '2分50秒',
  completionRate: 53.4,
  completionRating: '播放完成度较好',
  stars: 5,
  totalDuration: '5分24秒',
  dropoffData: [
    { time: '00:00', percentage: 0, similarAvg: 0 },
    { time: '00:30', percentage: 8.2, similarAvg: 12.5 },
    { time: '01:00', percentage: 15.6, similarAvg: 22.3 },
    { time: '01:30', percentage: 22.1, similarAvg: 28.7 },
    { time: '02:00', percentage: 28.5, similarAvg: 35.2 },
    { time: '02:30', percentage: 35.8, similarAvg: 41.6 },
    { time: '03:00', percentage: 42.3, similarAvg: 48.9 },
    { time: '03:30', percentage: 38.7, similarAvg: 45.2 },
    { time: '04:00', percentage: 45.2, similarAvg: 52.1 },
    { time: '04:30', percentage: 48.9, similarAvg: 55.8 },
    { time: '05:00', percentage: 46.6, similarAvg: 53.4 },
    { time: '05:24', percentage: 46.6, similarAvg: 53.4 },
  ],
  comparisonVideos: [
    { title: '同类作品平均', completionRate: 42.8, color: '#9ca3af' },
    { title: '优秀视频参考', completionRate: 68.5, color: '#10b981' },
    { title: '当前视频', completionRate: 53.4, color: '#ec4899' },
  ],
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= stars ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ContentRhythmAnalytics({ data = defaultData }: ContentRhythmAnalyticsProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const maxDropoff = Math.max(...data.dropoffData.map((d) => d.percentage))

  return (
    <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-400 to-pink-600" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">内容节奏</h2>
          <span className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full">留存分析</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">平均播放进度</div>
          <div className="text-2xl font-black text-pink-600 data-mono">{data.averageProgress}</div>
          <div className="text-xs text-gray-500 mt-1">视频时长: {data.totalDuration}</div>
        </div>

        <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">完播率</div>
          <div className="text-2xl font-black text-pink-600 data-mono">{data.completionRate}%</div>
          <div className="text-xs text-gray-500 mt-1">高于同类作品 {data.completionRate - 42.8}%</div>
        </div>

        <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">完成度评价</div>
          <div className="text-lg font-bold text-gray-900 mb-1">{data.completionRating}</div>
          <StarRating stars={data.stars} />
        </div>
      </div>

      {/* Dropoff Chart */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">流失趋势</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-pink-500" />
              <span className="text-gray-600">本视频</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gray-300" />
              <span className="text-gray-600">同类作品</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Y-axis labels */}
          <div className="flex">
            <div className="flex flex-col justify-between h-64 pr-2 text-xs text-gray-400 w-10">
              <span>50%</span>
              <span>40%</span>
              <span>30%</span>
              <span>20%</span>
              <span>10%</span>
              <span>0%</span>
            </div>

            {/* Chart area */}
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[5, 4, 3, 2, 1, 0].map((i) => (
                  <div key={i} className="border-t border-gray-100" />
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-between px-2">
                {data.dropoffData.map((point, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 mx-0.5"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Tooltip */}
                    {hoveredPoint === index && (
                      <div className="absolute -top-16 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-10 whitespace-nowrap">
                        <div className="font-bold">{point.time}</div>
                        <div className="text-pink-300">本视频: {point.percentage}%</div>
                        <div className="text-gray-400">同类: {point.similarAvg}%</div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45" />
                      </div>
                    )}

                    {/* Similar avg bar (background) */}
                    <div
                      className="w-full rounded-t-sm bg-gray-200 transition-all duration-300"
                      style={{ height: `${(point.similarAvg / 50) * 100}%` }}
                    />
                    {/* Current video bar */}
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-pink-500 to-pink-400 transition-all duration-300 absolute bottom-0"
                      style={{
                        height: `${(point.percentage / 50) * 100}%`,
                        opacity: hoveredPoint === index ? 1 : 0.85,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex ml-10 mt-2">
            {data.dropoffData.map((point, index) => (
              <div key={index} className="flex-1 text-center text-[10px] text-gray-400">
                {point.time}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison with similar videos */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">同类作品对比</h3>
        <div className="space-y-4">
          {data.comparisonVideos.map((video, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-32 text-sm text-gray-700">{video.title}</div>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${video.completionRate}%`,
                    backgroundColor: video.color,
                  }}
                >
                  <span className="text-[10px] text-white font-medium">{video.completionRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-semibold text-pink-600">黄金留存点</span>
          </div>
          <p className="text-xs text-pink-800">
            视频前2分钟流失率低于同类作品，开头吸引力强。建议在3:00-3:30处加强内容节奏，此处出现回流峰值。
          </p>
        </div>

        <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs font-semibold text-rose-600">优化建议</span>
          </div>
          <p className="text-xs text-rose-800">
            完播率 {data.completionRate}% 处于良好水平。要进一步提升，建议在视频结尾增加互动引导或悬念设置。
          </p>
        </div>
      </div>
    </div>
  )
}
