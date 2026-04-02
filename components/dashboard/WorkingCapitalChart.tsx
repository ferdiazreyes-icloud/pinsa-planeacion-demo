'use client'

import ReactECharts from 'echarts-for-react'

type DataPoint = { label: string; wc: number | null }

export default function WorkingCapitalChart({ data }: { data: DataPoint[] }) {
  const option = {
    grid: { top: 12, right: 48, bottom: 20, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: { name: string; value: number | null }[]) => {
        const p = params[0]
        if (!p || p.value === null) return ''
        return `<span style="font-weight:600;color:#3D4466">${p.name}</span><br/><span style="color:#B87D1A;font-weight:700">$${(p.value / 1e6).toFixed(1)}M</span> Capital de trabajo`
      },
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.label),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8E93AF', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      min: 260_000_000,
      max: 330_000_000,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ECEDF3', type: 'dashed' } },
      axisLabel: { color: '#8E93AF', fontSize: 10, formatter: (v: number) => `$${(v / 1e6).toFixed(0)}M` },
    },
    series: [
      {
        name: 'Capital de trabajo',
        type: 'line',
        data: data.map(d => d.wc),
        smooth: 0.4,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: '#B87D1A', width: 2.5 },
        itemStyle: { color: '#B87D1A', borderWidth: 2, borderColor: '#fff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(184,125,26,0.2)' },
              { offset: 1, color: 'rgba(184,125,26,0)' },
            ],
          },
        },
        markLine: {
          silent: true,
          symbol: 'none',
          label: { color: '#1A7A6E', fontSize: 10, position: 'end', formatter: '$280M' },
          lineStyle: { color: '#1A7A6E', type: 'dashed', width: 1.5 },
          data: [{ yAxis: 280_000_000 }],
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 200 }} notMerge />
}
