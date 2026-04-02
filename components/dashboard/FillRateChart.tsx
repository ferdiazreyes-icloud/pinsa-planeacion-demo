'use client'

import ReactECharts from 'echarts-for-react'

type DataPoint = { label: string; fillRate: number | null; target: number }

export default function FillRateChart({ data }: { data: DataPoint[] }) {
  const option = {
    grid: { top: 12, right: 32, bottom: 20, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: { name: string; value: number | null; seriesName: string }[]) => {
        const p = params[0]
        if (!p || p.value === null) return ''
        return `<span style="font-weight:600;color:#3D4466">${p.name}</span><br/><span style="color:#242d51;font-weight:700">${Number(p.value).toFixed(1)}%</span> Fill Rate`
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
      min: 85,
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ECEDF3', type: 'dashed' } },
      axisLabel: { color: '#8E93AF', fontSize: 10, formatter: (v: number) => `${v}%` },
    },
    markLine: {},
    series: [
      {
        name: 'Fill Rate',
        type: 'line',
        data: data.map(d => d.fillRate),
        smooth: 0.4,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: '#242d51', width: 2.5 },
        itemStyle: { color: '#242d51', borderWidth: 2, borderColor: '#fff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(36,45,81,0.18)' },
              { offset: 1, color: 'rgba(36,45,81,0)' },
            ],
          },
        },
        markLine: {
          silent: true,
          symbol: 'none',
          label: { color: '#1A7A6E', fontSize: 10, position: 'end', formatter: '95%' },
          lineStyle: { color: '#1A7A6E', type: 'dashed', width: 1.5 },
          data: [{ yAxis: 95 }],
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 200 }} notMerge />
}
