import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { clsx } from 'clsx';
import { formatCurrency, formatPercentPlain } from '../../utils/format';

interface DonutChartProps {
  data: { name: string; value: number; color?: string }[];
  centerLabel?: string;
  centerValue?: string;
  height?: number;
  format?: 'currency' | 'number' | 'percent';
  className?: string;
}

const defaultColors = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
];

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  height = 200,
  format = 'currency',
  className,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;

    const item = payload[0].payload;
    const percentage = ((item.value / total) * 100).toFixed(1);

    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.fill }}
          />
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {item.name}
          </span>
        </div>
        <p className="text-lg font-bold text-slate-900 dark:text-white">
          {format === 'currency' ? formatCurrency(item.value) : item.value.toLocaleString()}
        </p>
        <p className="text-xs text-slate-500">{percentage}% of total</p>
      </div>
    );
  };

  return (
    <div className={clsx('relative', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || defaultColors[index % defaultColors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && (
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Legend component to go with donut chart
export function DonutLegend({
  data,
  format = 'currency',
  showPercent = true,
}: {
  data: { name: string; value: number; color?: string }[];
  format?: 'currency' | 'number' | 'percent';
  showPercent?: boolean;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-2">
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        return (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    item.color || defaultColors[index % defaultColors.length],
                }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {format === 'currency'
                  ? formatCurrency(item.value, true)
                  : item.value.toLocaleString()}
              </span>
              {showPercent && (
                <span className="text-xs text-slate-400 w-12 text-right">
                  {formatPercentPlain(percentage)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
