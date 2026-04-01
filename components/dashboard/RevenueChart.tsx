'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type DataPoint = {
  label: string
  revenue: number
  cogs: number
  isForecast?: boolean
}

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barSize={18}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1_000_000).toFixed(0)}M`} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }}
          formatter={(v, name) => [`$${(Number(v) / 1_000_000).toFixed(1)}M`, name === 'revenue' ? 'Ventas' : 'COGS']}
        />
        <Bar dataKey="revenue" name="revenue" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isForecast ? '#93c5fd' : '#3b82f6'} />
          ))}
        </Bar>
        <Bar dataKey="cogs" name="cogs" stackId="b" fill="#e2e8f0" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isForecast ? '#f1f5f9' : '#cbd5e1'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
