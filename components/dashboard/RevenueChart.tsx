'use client'

import ReactECharts from 'echarts-for-react'

type DataPoint = { label: string; revenue: number; cogs: number; isForecast?: boolean }

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  const option = {
    grid: { top: 12, right: 16, bottom: 20, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: { name: string; value: number; seriesName: string }[]) => {
        const lines = params.map(p =>
          `<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${p.seriesName === 'Ventas' ? '#242d51' : '#601b4d'};margin-right:5px"></span>` +
          `${p.seriesName}: <b>$${(p.value / 1e6).toFixed(1)}M</b>`
        ).join('<br/>')
        return `<span style="font-weight:600;color:#3D4466">${params[0]?.name ?? ''}</span><br/>${lines}`
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
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ECEDF3', type: 'dashed' } },
      axisLabel: { color: '#8E93AF', fontSize: 10, formatter: (v: number) => `$${(v / 1e6).toFixed(0)}M` },
    },
    series: [
      {
        name: 'Ventas',
        type: 'bar',
        barMaxWidth: 16,
        data: data.map(d => ({
          value: d.revenue,
          itemStyle: { color: d.isForecast ? '#7B8FC4' : '#242d51', borderRadius: [3, 3, 0, 0] },
        })),
      },
      {
        name: 'COGS',
        type: 'bar',
        barMaxWidth: 16,
        data: data.map(d => ({
          value: d.cogs,
          itemStyle: { color: d.isForecast ? '#A87EA0' : '#601b4d', borderRadius: [3, 3, 0, 0] },
        })),
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 200 }} notMerge />
}
