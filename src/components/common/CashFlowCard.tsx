import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Clock,
} from 'lucide-react';
import { SparklineChart } from '../charts/SparklineChart';
import { formatCurrency } from '../../utils/format';

interface CashFlowMetrics {
  currentCash: number;
  creditAvailable: number;
  totalLiquidity: number;
  weeklyForecast: {
    week: string;
    inflow: number;
    outflow: number;
    netCash: number;
    endingCash: number;
  }[];
  cashTrend: { date: string; value: number }[];
  accountsReceivable: {
    total: number;
    current: number;
    days30to60: number;
    days60to90: number;
    over90: number;
  };
  accountsPayable: {
    total: number;
    dueThisWeek: number;
    dueNextWeek: number;
    due30Days: number;
  };
  upcomingExpenses: {
    name: string;
    amount: number;
    dueDate: string;
    category: string;
  }[];
  burnRate: number;
  runway: number;
  daysToPayroll: number;
  workingCapital: number;
  cashConversionCycle: {
    dso: number;
    dio: number;
    dpo: number;
    ccc: number;
  };
  status: 'critical' | 'warning' | 'healthy';
  statusMessage: string;
}

interface CashFlowCardProps {
  metrics: CashFlowMetrics;
}

export function CashFlowCard({ metrics }: CashFlowCardProps) {
  const statusColors = {
    critical: 'from-red-600 to-red-700',
    warning: 'from-amber-500 to-amber-600',
    healthy: 'from-emerald-600 to-emerald-700',
  };

  const StatusIcon = metrics.status === 'healthy' ? CheckCircle2 : AlertTriangle;

  return (
    <div className={`bg-gradient-to-r ${statusColors[metrics.status]} rounded-2xl p-6 text-white`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/20">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Cash Position</h2>
            <p className="text-white/70 text-sm">Real-time treasury view</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20">
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-medium capitalize">{metrics.status}</span>
        </div>
      </div>

      {/* Main Numbers */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <p className="text-white/70 text-sm">Available Cash</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(metrics.currentCash, true)}</p>
        </div>
        <div>
          <p className="text-white/70 text-sm">Credit Line</p>
          <p className="text-2xl font-semibold mt-1">+{formatCurrency(metrics.creditAvailable, true)}</p>
        </div>
        <div>
          <p className="text-white/70 text-sm">Total Liquidity</p>
          <p className="text-2xl font-semibold mt-1">{formatCurrency(metrics.totalLiquidity, true)}</p>
        </div>
      </div>

      {/* Cash Trend Mini Chart */}
      <div className="bg-white/10 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">14-Day Cash Trend</span>
          <span className="text-xs text-white/70">
            {metrics.cashTrend[metrics.cashTrend.length - 1].value > metrics.cashTrend[0].value ? (
              <span className="flex items-center gap-1 text-emerald-300">
                <TrendingUp className="w-3 h-3" /> Building
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-300">
                <TrendingDown className="w-3 h-3" /> Declining
              </span>
            )}
          </span>
        </div>
        <SparklineChart
          data={metrics.cashTrend}
          height={60}
          color="white"
          showTooltip
        />
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-white/70" />
            <span className="text-xs text-white/70">Runway</span>
          </div>
          <p className="text-xl font-bold">{metrics.runway} mo</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-white/70" />
            <span className="text-xs text-white/70">To Payroll</span>
          </div>
          <p className="text-xl font-bold">{metrics.daysToPayroll}d</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-white/70" />
            <span className="text-xs text-white/70">Burn/Mo</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(metrics.burnRate, true)}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-white/70" />
            <span className="text-xs text-white/70">Working Cap</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(metrics.workingCapital, true)}</p>
        </div>
      </div>

      {/* Status Message */}
      <p className="text-sm text-white/80 mt-4 italic">{metrics.statusMessage}</p>
    </div>
  );
}

export function CashFlowForecast({ metrics }: CashFlowCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-slate-500" />
        4-Week Cash Forecast
      </h3>
      
      <div className="space-y-3">
        {metrics.weeklyForecast.map((week, idx) => (
          <div
            key={week.week}
            className={`p-3 rounded-lg ${
              week.netCash < 0
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-slate-50 dark:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-900 dark:text-white">
                {week.week}
                {idx === 0 && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Current
                  </span>
                )}
              </span>
              <span
                className={`font-bold ${
                  week.netCash >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {week.netCash >= 0 ? '+' : ''}{formatCurrency(week.netCash, true)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  {formatCurrency(week.inflow, true)}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  {formatCurrency(week.outflow, true)}
                </span>
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                → {formatCurrency(week.endingCash, true)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UpcomingExpenses({ expenses }: { expenses: CashFlowMetrics['upcomingExpenses'] }) {
  const categoryIcons: Record<string, string> = {
    inventory: '📦',
    payroll: '👥',
    marketing: '📢',
    operations: '🏢',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const daysUntil = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        Upcoming Expenses
      </h3>
      
      <div className="space-y-3">
        {expenses.slice(0, 5).map((expense) => {
          const days = daysUntil(expense.dueDate);
          const isUrgent = days <= 7;
          
          return (
            <div
              key={expense.name}
              className={`flex items-center justify-between p-2 rounded-lg ${
                isUrgent ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{categoryIcons[expense.category] || '💰'}</span>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {expense.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(expense.dueDate)}
                    {isUrgent && (
                      <span className="ml-2 text-amber-600 font-medium">
                        ({days}d)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <span className={`font-bold ${isUrgent ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'}`}>
                {formatCurrency(expense.amount, true)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ARAPSummary({ metrics }: CashFlowCardProps) {
  const arTotal = metrics.accountsReceivable.total;
  const apTotal = metrics.accountsPayable.total;
  const netPosition = arTotal - apTotal;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">AR/AP Summary</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* AR */}
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Receivables</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(arTotal, true)}
          </p>
          {metrics.accountsReceivable.over90 > 0 && (
            <p className="text-xs text-red-500 mt-1">
              ⚠️ {formatCurrency(metrics.accountsReceivable.over90, true)} over 90d
            </p>
          )}
        </div>
        
        {/* AP */}
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">Payables</p>
          <p className="text-xl font-bold text-red-700 dark:text-red-300">
            {formatCurrency(apTotal, true)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {formatCurrency(metrics.accountsPayable.dueThisWeek, true)} due this week
          </p>
        </div>
      </div>
      
      {/* Net Position */}
      <div className={`p-3 rounded-lg ${
        netPosition >= 0 
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Net Position</span>
          <span className={`text-lg font-bold ${
            netPosition >= 0 ? 'text-blue-600' : 'text-amber-600'
          }`}>
            {netPosition >= 0 ? '+' : ''}{formatCurrency(netPosition, true)}
          </span>
        </div>
      </div>
      
      {/* Cash Conversion Cycle */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 mb-2">Cash Conversion Cycle</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">
            DSO: {metrics.cashConversionCycle.dso}d
          </span>
          <span className="text-slate-400">+</span>
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">
            DIO: {metrics.cashConversionCycle.dio}d
          </span>
          <span className="text-slate-400">-</span>
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">
            DPO: {metrics.cashConversionCycle.dpo}d
          </span>
          <span className="text-slate-400">=</span>
          <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 font-bold text-blue-700 dark:text-blue-300">
            {metrics.cashConversionCycle.ccc}d
          </span>
        </div>
      </div>
    </div>
  );
}
