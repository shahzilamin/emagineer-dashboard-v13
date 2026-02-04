import { clsx } from 'clsx';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight,
  User,
} from 'lucide-react';
import type { Insight } from '../../types';
import { formatRelativeTime } from '../../utils/format';

interface InsightCardProps {
  insight: Insight;
  compact?: boolean;
  onClick?: () => void;
}

const typeConfig = {
  critical: {
    icon: AlertCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    badgeColor: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  },
};

export function InsightCard({ insight, compact = false, onClick }: InsightCardProps) {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  if (compact) {
    return (
      <div
        className={clsx(
          'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
          config.bgColor,
          config.borderColor,
          'hover:shadow-sm'
        )}
        onClick={onClick}
      >
        <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', config.iconColor)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {insight.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {insight.owner} • {formatRelativeTime(insight.timestamp)}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-xl border p-4 transition-shadow',
        config.bgColor,
        config.borderColor,
        onClick && 'cursor-pointer hover:shadow-md'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            'p-2 rounded-lg',
            insight.type === 'critical'
              ? 'bg-red-100 dark:bg-red-900/40'
              : insight.type === 'warning'
              ? 'bg-amber-100 dark:bg-amber-900/40'
              : insight.type === 'success'
              ? 'bg-emerald-100 dark:bg-emerald-900/40'
              : 'bg-blue-100 dark:bg-blue-900/40'
          )}
        >
          <Icon className={clsx('w-5 h-5', config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {insight.title}
            </h3>
            {insight.metric && (
              <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', config.badgeColor)}>
                {insight.metric}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            {insight.description}
          </p>

          {insight.action && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                → {insight.action}
              </span>
              {insight.owner && (
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <User className="w-3 h-3" />
                  {insight.owner}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {formatRelativeTime(insight.timestamp)}
        </span>
        {onClick && (
          <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View Details →
          </button>
        )}
      </div>
    </div>
  );
}

// Summary bar for insights
export function InsightsSummary({
  critical,
  warning,
  success,
  info,
}: {
  critical: number;
  warning: number;
  success: number;
  info: number;
}) {
  return (
    <div className="flex items-center gap-4">
      {critical > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {critical} Critical
          </span>
        </div>
      )}
      {warning > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {warning} Warning
          </span>
        </div>
      )}
      {success > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {success} Good
          </span>
        </div>
      )}
      {info > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {info} Info
          </span>
        </div>
      )}
    </div>
  );
}
