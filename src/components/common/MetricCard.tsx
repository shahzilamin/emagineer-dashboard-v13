import { clsx } from 'clsx';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { MetricValue, HealthStatus, TrendDirection } from '../../types';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/format';

interface MetricCardProps {
  title: string;
  value: number | MetricValue;
  format?: 'currency' | 'number' | 'percent';
  subtitle?: string;
  showTrend?: boolean;
  showStatus?: boolean;
  compact?: boolean;
  className?: string;
  invertTrendColor?: boolean; // For metrics where down is good (like CAC)
}

const trendIcons: Record<TrendDirection, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const statusConfig: Record<HealthStatus, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  healthy: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  critical: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
};

export function MetricCard({
  title,
  value,
  format = 'number',
  subtitle,
  showTrend = true,
  showStatus = false,
  compact = false,
  className,
  invertTrendColor = false,
}: MetricCardProps) {
  const isMetricValue = typeof value === 'object';
  const displayValue = isMetricValue ? value.current : value;
  const trend = isMetricValue ? value.trend : undefined;
  const changePercent = isMetricValue ? value.changePercent : undefined;
  const status = isMetricValue ? value.status : undefined;

  const formattedValue = (() => {
    switch (format) {
      case 'currency':
        return formatCurrency(displayValue, compact);
      case 'percent':
        return `${displayValue.toFixed(1)}%`;
      default:
        return formatNumber(displayValue, compact);
    }
  })();

  const getTrendColor = (trend: TrendDirection | undefined) => {
    if (!trend || trend === 'flat') return 'text-slate-400 dark:text-slate-500';

    const isPositive = trend === 'up';
    const isGood = invertTrendColor ? !isPositive : isPositive;

    return isGood
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-red-600 dark:text-red-400';
  };

  const TrendIcon = trend ? trendIcons[trend] : null;
  const StatusConfig = status ? statusConfig[status] : null;
  const StatusIcon = StatusConfig?.icon;

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700',
        compact ? 'p-3' : 'p-4',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
            {title}
          </p>
          <p
            className={clsx(
              'font-bold text-slate-900 dark:text-white mt-1',
              compact ? 'text-xl' : 'text-2xl'
            )}
          >
            {formattedValue}
          </p>

          {showTrend && trend && changePercent !== undefined && (
            <div
              className={clsx(
                'flex items-center gap-1 mt-1',
                getTrendColor(trend)
              )}
            >
              {TrendIcon && <TrendIcon className="w-3.5 h-3.5" />}
              <span className="text-xs font-medium">
                {formatPercent(changePercent)}
              </span>
              {subtitle && (
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {subtitle}
                </span>
              )}
            </div>
          )}

          {!showTrend && subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {showStatus && StatusConfig && StatusIcon && (
          <div className={clsx('p-2 rounded-lg', StatusConfig.bg)}>
            <StatusIcon className={clsx('w-4 h-4', StatusConfig.color)} />
          </div>
        )}
      </div>
    </div>
  );
}

// Mini version for dense displays
export function MiniMetric({
  label,
  value,
  change,
  format = 'number',
  invertTrendColor = false,
}: {
  label: string;
  value: number;
  change?: number;
  format?: 'currency' | 'number' | 'percent';
  invertTrendColor?: boolean;
}) {
  const formattedValue = (() => {
    switch (format) {
      case 'currency':
        return formatCurrency(value, true);
      case 'percent':
        return `${value.toFixed(1)}%`;
      default:
        return formatNumber(value, true);
    }
  })();

  const getChangeColor = (change: number) => {
    if (change === 0) return 'text-slate-400';
    const isPositive = change > 0;
    const isGood = invertTrendColor ? !isPositive : isPositive;
    return isGood ? 'text-emerald-500' : 'text-red-500';
  };

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {formattedValue}
        </span>
        {change !== undefined && (
          <span className={clsx('text-xs font-medium', getChangeColor(change))}>
            {formatPercent(change)}
          </span>
        )}
      </div>
    </div>
  );
}
