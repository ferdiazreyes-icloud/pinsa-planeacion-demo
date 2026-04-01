'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer, Area, AreaChart
} from 'recharts'

type DataPoint = {
  label: string
  fillRate: number | null
  target: number
}

export default function FillRateChart({ data }: { data: DataPoint[] }) {
  const filled = data.filter(d => d.fillRate !== null)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="fillRateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }}
          formatter={(v) => [`${Number(v).toFixed(1)}%`, 'Fill Rate']}
        />
        <ReferenceLine y={95} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Meta 95%', fill: '#10b981', fontSize: 10, position: 'right' }} />
        <Area type="monotone" dataKey="fillRate" stroke="#3b82f6" strokeWidth={2.5} fill="url(#fillRateGrad)" dot={{ r: 3, fill: '#3b82f6' }} connectNulls={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
