'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface DataPoint {
  name: string
  value: number
  [key: string]: any
}

interface ChartProps {
  data: DataPoint[]
  dataKey?: string
  color?: string
  height?: number
  gradient?: boolean
}

export function MetricLineChart({ data, dataKey = 'value', color = '#3b82f6', height = 250, gradient = true }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="name"
          stroke="#9ca3af"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#9ca3af"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            if (value >= 1000000) return (value / 1000000).toFixed(0) + 'M'
            if (value >= 1000) return (value / 1000).toFixed(0) + 'K'
            return value.toString()
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          formatter={(value) => {
            const num = Number(value || 0)
            if (num >= 1000000) return [(num / 1000000).toFixed(2) + 'M', '']
            if (num >= 1000) return [(num / 1000).toFixed(1) + 'K', '']
            return [num.toLocaleString(), '']
          }}
        />
        {gradient && (
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`url(#gradient-${color.replace('#', '')})`}
            strokeWidth={2}
          />
        )}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: 'white' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
