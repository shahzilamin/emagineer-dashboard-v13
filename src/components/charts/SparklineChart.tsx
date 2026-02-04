import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Tooltip,
} from 'recharts';
import type { TimeSeriesPoint } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

interface SparklineChartProps {
  data: TimeSeriesPoint[];
  type?: 'area' | 'line';
  color?: 'green' | 'blue' | 'amber' | 'red' | 'white';
  height?: number;
  showTooltip?: boolean;
  format?: 'currency' | 'number';
}

const colorMap = {
  green: {
    stroke: '#22c55e',
    fill: '#22c55e',
    gradient: ['#22c55e', '#22c55e00'],
  },
  blue: {
    stroke: '#3b82f6',
    fill: '#3b82f6',
    gradient: ['#3b82f6', '#3b82f600'],
  },
  amber: {
    stroke: '#f59e0b',
    fill: '#f59e0b',
    gradient: ['#f59e0b', '#f59e0b00'],
  },
  red: {
    stroke: '#ef4444',
    fill: '#ef4444',
    gradient: ['#ef4444', '#ef444400'],
  },
  white: {
    stroke: '#ffffff',
    fill: '#ffffff',
    gradient: ['#ffffff', '#ffffff00'],
  },
};

export function SparklineChart({
  data,
  type = 'area',
  color = 'blue',
  height = 40,
  showTooltip = false,
  format = 'currency',
}: SparklineChartProps) {
  const colors = colorMap[color];
  const gradientId = `gradient-${color}-${Math.random().toString(36).substr(2, 9)}`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg">
        <p className="font-medium">
          {format === 'currency' ? formatCurrency(data.value) : data.value.toLocaleString()}
        </p>
        <p className="text-slate-400">{formatDate(data.date)}</p>
      </div>
    );
  };

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors.stroke}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.gradient[0]} stopOpacity={0.3} />
            <stop offset="100%" stopColor={colors.gradient[1]} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        <Area
          type="monotone"
          dataKey="value"
          stroke={colors.stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
