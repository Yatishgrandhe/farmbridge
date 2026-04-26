'use client'

import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'

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

export function DataChart({
  data,
  xAxisKey,
  yAxisKey,
  type = 'line',
  title,
  height = 400,
  color = 'var(--color-crisis)' // Default to crisis color, which is a css variable
}: DataChartProps) {
  
  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="h-full border border-dashed border-wheat/20 rounded-[1.2rem_0.85rem_1.2rem_0.85rem] bg-soil/25 grid place-items-center px-4">
          <div className="text-center">
            <p className="text-wheat/70 font-semibold">No dataset available yet</p>
            <p className="text-wheat/50 font-mono text-xs mt-1 uppercase tracking-wider">
              Data will appear here after sync
            </p>
          </div>
        </div>
      )
    }

    const commonProps = {
      data,
      margin: { top: 20, right: 20, bottom: 20, left: 20 }
    }

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-ash)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-wheat)' }} />
            <Bar dataKey={yAxisKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-ash)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-wheat)' }} />
            <Area type="monotone" dataKey={yAxisKey} stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>
        )
      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-ash)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-wheat)' }} />
            <Line type="monotone" dataKey={yAxisKey} stroke={color} strokeWidth={3} dot={{ r: 4, fill: color }} activeDot={{ r: 6 }} />
          </LineChart>
        )
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-panel p-6"
    >
      <h3 className="font-display text-wheat text-xl font-semibold mb-6">{title}</h3>
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
