import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { TimeSeriesPoint, DailyMetrics } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

interface RevenueChartProps {
  data: DailyMetrics[] | TimeSeriesPoint[];
  height?: number;
  showOrders?: boolean;
  className?: string;
}

export function RevenueChart({
  data,
  height = 300,
  showOrders = true,
  className,
}: RevenueChartProps) {
  // Transform data to ensure consistent format
  const chartData = data.map((d) => {
    if ('revenue' in d) {
      return {
        date: d.date,
        revenue: d.revenue,
        orders: 'orders' in d ? d.orders : undefined,
      };
    }
    return {
      date: d.date,
      revenue: d.value,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
          {formatDate(label)}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {entry.name === 'Revenue'
                ? formatCurrency(entry.value)
                : entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
            className="dark:stroke-slate-700"
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis
            yAxisId="revenue"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={50}
          />
          {showOrders && chartData[0]?.orders !== undefined && (
            <YAxis
              yAxisId="orders"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              width={40}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            yAxisId="revenue"
            dataKey="revenue"
            name="Revenue"
            fill="url(#revenueGradient)"
            radius={[4, 4, 0, 0]}
          />
          {showOrders && chartData[0]?.orders !== undefined && (
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
