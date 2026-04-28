'use client'

import type { CSSProperties } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'
import styles from './DataChart.module.css'

export type ChartType = 'bar' | 'line' | 'area'

interface DataChartProps {
  data: Array<Record<string, string | number | null>>
  xAxisKey: string
  yAxisKey: string
  type?: ChartType
  title: string
  height?: number
  color?: string
}

const AXIS_COLOR = 'var(--text-muted)'
const GRID_STROKE = 'rgba(122, 117, 104, 0.14)'
const TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text-primary)',
}

export function DataChart({
  data,
  xAxisKey,
  yAxisKey,
  type = 'line',
  title,
  height = 400,
  color = 'var(--accent)',
}: DataChartProps) {
  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <p className={styles.emptyTitle}>No dataset available yet</p>
            <p className={styles.emptySubtitle}>Data will appear here after sync</p>
          </div>
        </div>
      )
    }

    const commonProps = {
      data,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
    }

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey={xAxisKey} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey={yAxisKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey={xAxisKey} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Area type="monotone" dataKey={yAxisKey} stroke={color} fill={color} fillOpacity={0.22} />
          </AreaChart>
        )
      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey={xAxisKey} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 3, fill: color }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        )
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
