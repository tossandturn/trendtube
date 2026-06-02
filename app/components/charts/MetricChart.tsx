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
}

export function MetricChart({ data, dataKey = 'value', color = '#3b82f6', height = 200 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => {
          if (v >= 1000000) return (v/1000000).toFixed(0)+'M'
          if (v >= 1000) return (v/1000).toFixed(0)+'K'
          return v.toString()
        }} />
        <Tooltip contentStyle={{backgroundColor:'white',border:'1px solid #e5e7eb',borderRadius:'6px',fontSize:'11px'}} />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#grad-${color.replace('#', '')})`} strokeWidth={2} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} activeDot={{r:3}} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
