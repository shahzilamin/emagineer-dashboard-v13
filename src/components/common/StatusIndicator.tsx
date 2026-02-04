import { clsx } from 'clsx';
import type { HealthStatus, TrendDirection } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatusIndicatorProps {
  status: HealthStatus;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<HealthStatus, { bg: string; text: string; dot: string }> = {
  healthy: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  critical: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function StatusBadge({ status, label, size = 'sm' }: StatusIndicatorProps) {
  const colors = statusColors[status];
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        colors.bg,
        colors.text,
        sizeClasses[size]
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {displayLabel}
    </span>
  );
}

// Just the dot
export function StatusDot({ status, size = 'md' }: { status: HealthStatus; size?: 'sm' | 'md' | 'lg' }) {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <span
      className={clsx(
        'rounded-full animate-pulse',
        statusColors[status].dot,
        dotSizes[size]
      )}
    />
  );
}

// Trend arrow with optional value
export function TrendArrow({
  direction,
  value,
  invertColor = false,
  size = 'md',
}: {
  direction: TrendDirection;
  value?: number;
  invertColor?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const getColor = () => {
    if (direction === 'flat') return 'text-slate-400 dark:text-slate-500';
    const isPositive = direction === 'up';
    const isGood = invertColor ? !isPositive : isPositive;
    return isGood
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-red-600 dark:text-red-400';
  };

  const Icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;

  return (
    <div className={clsx('flex items-center gap-1', getColor())}>
      <Icon className={iconSizes[size]} />
      {value !== undefined && (
        <span className={clsx('font-medium', textSizes[size])}>
          {value >= 0 ? '+' : ''}
          {value.toFixed(1)}%
        </span>
      )}
    </div>
  );
}

// Progress bar towards goal
export function ProgressBar({
  current,
  target,
  label,
  showPercent = true,
  height = 'md',
}: {
  current: number;
  target: number;
  label?: string;
  showPercent?: boolean;
  height?: 'sm' | 'md' | 'lg';
}) {
  const percent = Math.min((current / target) * 100, 100);
  const isOnTrack = percent >= 90;
  const isWarning = percent >= 75 && percent < 90;

  const barColor = isOnTrack
    ? 'bg-emerald-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-red-500';

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {percent.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full rounded-full bg-slate-200 dark:bg-slate-700',
          heightClasses[height]
        )}
      >
        <div
          className={clsx('rounded-full transition-all duration-500', barColor, heightClasses[height])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// Health score circle
export function HealthScore({
  score,
  label,
  size = 'md',
}: {
  score: number; // 0-100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const getColor = () => {
    if (score >= 80) return { stroke: 'stroke-emerald-500', text: 'text-emerald-600' };
    if (score >= 60) return { stroke: 'stroke-amber-500', text: 'text-amber-600' };
    return { stroke: 'stroke-red-500', text: 'text-red-600' };
  };

  const colors = getColor();
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: { container: 'w-16 h-16', text: 'text-lg', label: 'text-xs' },
    md: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-xs' },
    lg: { container: 'w-32 h-32', text: 'text-3xl', label: 'text-sm' },
  };

  return (
    <div className={clsx('relative', sizeClasses[size].container)}>
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="40%"
          strokeWidth="8"
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx="50%"
          cy="50%"
          r="40%"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className={clsx('transition-all duration-500', colors.stroke)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={clsx('font-bold', sizeClasses[size].text, colors.text)}>
          {score}
        </span>
        {label && (
          <span className={clsx('text-slate-500 dark:text-slate-400', sizeClasses[size].label)}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
