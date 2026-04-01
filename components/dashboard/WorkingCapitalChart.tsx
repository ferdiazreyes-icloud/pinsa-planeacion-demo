'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

type DataPoint = {
  label: string
  wc: number | null
}

export default function WorkingCapitalChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="wcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis
          domain={[260_000_000, 330_000_000]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false} tickLine={false}
          tickFormatter={v => `$${(v / 1_000_000).toFixed(0)}M`}
        />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }}
          formatter={(v) => [`$${(Number(v) / 1_000_000).toFixed(1)}M`, 'Capital de trabajo']}
        />
        <ReferenceLine y={280_000_000} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Meta $280M', fill: '#10b981', fontSize: 10, position: 'right' }} />
        <Area type="monotone" dataKey="wc" stroke="#f59e0b" strokeWidth={2.5} fill="url(#wcGrad)" dot={{ r: 3, fill: '#f59e0b' }} connectNulls={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
