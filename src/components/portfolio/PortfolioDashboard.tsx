import { clsx } from 'clsx';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Warehouse,
  DollarSign,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { InsightCard, InsightsSummary } from '../common/InsightCard';
import { HealthScore, ProgressBar } from '../common/StatusIndicator';
import { SparklineChart } from '../charts/SparklineChart';
import { wellBeforeMetrics, monthlyTargets as wbTargets } from '../../data/wellbefore';
import { d2cBuildersMetrics, monthlyTargets as d2cTargets } from '../../data/d2cbuilders';
import { portfolioInsights, wellBeforeInsights, d2cBuildersInsights, getInsightCounts } from '../../data/insights';
import { formatCurrency, formatPercentPlain } from '../../utils/format';
import { useDashboard } from '../../contexts/DashboardContext';

export function PortfolioDashboard() {
  const { setCompany } = useDashboard();

  const wbMetrics = wellBeforeMetrics;
  const d2cMetrics = d2cBuildersMetrics;

  // Combined metrics
  const combinedRevenue = {
    today: wbMetrics.revenue.today.current + d2cMetrics.revenue.today.current,
    mtd: wbMetrics.revenue.mtd.current + d2cMetrics.revenue.mtd.current,
    ytd: wbMetrics.revenue.ytd.current + d2cMetrics.revenue.ytd.current,
  };

  const combinedProfit = {
    mtd: wbMetrics.profitability.netProfit.current + d2cMetrics.profitability.netProfit.current,
  };

  const combinedCash = wbMetrics.profitability.cashPosition + 350000; // D2C cash estimate

  // Calculate overall health
  const wbHealth = Math.round(
    (wbTargets.revenue.percentComplete * 0.3 +
      wbTargets.grossMargin.percentComplete * 0.25 +
      100 * 0.25 +
      wbMetrics.fulfillment.onTimeRate.current * 0.2)
  );

  const d2cHealth = Math.round(
    (d2cTargets.revenue.percentComplete * 0.3 +
      d2cTargets.onTimeRate.percentComplete * 0.25 +
      d2cTargets.grossMargin.percentComplete * 0.25 +
      d2cTargets.errorRate.percentComplete * 0.2)
  );

  const portfolioHealth = Math.round((wbHealth * 0.7 + d2cHealth * 0.3)); // Weighted by revenue

  // All critical/warning insights
  const allInsights = [...wellBeforeInsights, ...d2cBuildersInsights, ...portfolioInsights];
  const criticalInsights = allInsights.filter((i) => i.type === 'critical');
  const warningInsights = allInsights.filter((i) => i.type === 'warning').slice(0, 4);
  const insightCounts = getInsightCounts(allInsights);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Summary Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Emagineer Portfolio Overview</h1>
            <p className="text-slate-400 mt-1">Combined view of WellBefore and D2C Builders</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Portfolio Health</p>
            <div className="flex items-center gap-2 mt-1">
              <HealthScore score={portfolioHealth} size="sm" />
            </div>
          </div>
        </div>

        {/* Combined Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div>
            <p className="text-slate-400 text-sm">Today's Revenue</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(combinedRevenue.today)}</p>
            <p className="text-sm text-slate-400 mt-1">Combined both companies</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">MTD Revenue</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(combinedRevenue.mtd, true)}</p>
            <p className="text-sm text-emerald-400 mt-1">
              WB: {formatCurrency(wbMetrics.revenue.mtd.current, true)} + D2C: {formatCurrency(d2cMetrics.revenue.mtd.current, true)}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">MTD Net Profit</p>
            <p className="text-3xl font-bold mt-1 text-emerald-400">{formatCurrency(combinedProfit.mtd, true)}</p>
            <p className="text-sm text-slate-400 mt-1">Combined margin</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Cash Position</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(combinedCash, true)}</p>
            <p className="text-sm text-slate-400 mt-1">~{Math.round(combinedCash / (combinedProfit.mtd * 0.5))} months runway</p>
          </div>
        </div>
      </div>

      {/* Alerts Summary */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className={clsx(
            'p-3 rounded-xl',
            insightCounts.critical > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-700'
          )}>
            {insightCounts.critical > 0 ? (
              <AlertCircle className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              {insightCounts.critical > 0
                ? `${insightCounts.critical} Critical Issue${insightCounts.critical > 1 ? 's' : ''}`
                : 'All Systems Operational'}
            </h2>
            <p className="text-sm text-slate-500">
              {insightCounts.critical + insightCounts.warning} total items need attention
            </p>
          </div>
        </div>
        <InsightsSummary {...insightCounts} />
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WellBefore Card */}
        <div
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setCompany('wellbefore')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">WellBefore</h3>
                <p className="text-sm text-slate-500">$10M DTC Ecommerce</p>
              </div>
            </div>
            <HealthScore score={wbHealth} size="sm" label="Health" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">MTD Revenue</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(wbMetrics.revenue.mtd.current, true)}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600">+{wbMetrics.revenue.mtd.changePercent.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">LTV:CAC</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {wbMetrics.customers.ltvCacRatio.current.toFixed(1)}:1
              </p>
              <p className="text-sm text-emerald-600">Above 3:1 target</p>
            </div>
          </div>

          <div className="mb-4">
            <ProgressBar
              current={wbTargets.revenue.current}
              target={wbTargets.revenue.target}
              label={`${wbTargets.revenue.percentComplete.toFixed(0)}% to monthly goal`}
            />
          </div>

          <SparklineChart
            data={wbMetrics.revenue.trend}
            height={60}
            color="blue"
          />

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getInsightCounts(wellBeforeInsights).critical > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  {getInsightCounts(wellBeforeInsights).critical} Critical
                </span>
              )}
              {getInsightCounts(wellBeforeInsights).warning > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  {getInsightCounts(wellBeforeInsights).warning} Warning
                </span>
              )}
            </div>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
              View Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* D2C Builders Card */}
        <div
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setCompany('d2cbuilders')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Warehouse className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">D2C Builders</h3>
                <p className="text-sm text-slate-500">$2M 3PL Operations</p>
              </div>
            </div>
            <HealthScore score={d2cHealth} size="sm" label="Health" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">MTD Revenue</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(d2cMetrics.revenue.mtd.current, true)}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600">+{d2cMetrics.revenue.mtd.changePercent.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Gross Margin</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatPercentPlain(d2cMetrics.profitability.grossMargin.current)}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600">{d2cMetrics.profitability.grossMargin.changePercent.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <ProgressBar
              current={d2cTargets.revenue.current}
              target={d2cTargets.revenue.target}
              label={`${d2cTargets.revenue.percentComplete.toFixed(0)}% to monthly goal`}
            />
          </div>

          <SparklineChart
            data={d2cMetrics.revenue.trend}
            height={60}
            color="green"
          />

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getInsightCounts(d2cBuildersInsights).critical > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  {getInsightCounts(d2cBuildersInsights).critical} Critical
                </span>
              )}
              {getInsightCounts(d2cBuildersInsights).warning > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  {getInsightCounts(d2cBuildersInsights).warning} Warning
                </span>
              )}
            </div>
            <button className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
              View Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Critical Issues Across Portfolio */}
      {criticalInsights.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Critical Issues Across Portfolio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* Needs Attention */}
      {warningInsights.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Needs Attention
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warningInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} compact />
            ))}
          </div>
        </div>
      )}

      {/* Quick Financial Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          Financial Summary (YTD)
        </h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">YTD Revenue</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(combinedRevenue.ytd, true)}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              WB: {formatCurrency(wbMetrics.revenue.ytd.current, true)}
            </p>
            <p className="text-sm text-slate-500">
              D2C: {formatCurrency(d2cMetrics.revenue.ytd.current, true)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Cash Position</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {formatCurrency(combinedCash, true)}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              WB: {formatCurrency(wbMetrics.profitability.cashPosition, true)}
            </p>
            <p className="text-sm text-slate-500">
              D2C: {formatCurrency(350000, true)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Blended Margin</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatPercentPlain(
                (wbMetrics.profitability.grossMargin.current * 0.8 +
                  d2cMetrics.profitability.grossMargin.current * 0.2)
              )}
            </p>
            <p className="text-sm text-slate-500 mt-1">Weighted by revenue</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Est. Runway</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              16+ months
            </p>
            <p className="text-sm text-emerald-600 mt-1">Healthy position</p>
          </div>
        </div>
      </div>
    </div>
  );
}
