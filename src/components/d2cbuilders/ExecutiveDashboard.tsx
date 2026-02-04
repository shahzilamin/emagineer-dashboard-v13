import { clsx } from 'clsx';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Target,
  Users,
  ArrowRight,
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { InsightCard, InsightsSummary } from '../common/InsightCard';
import { HealthScore } from '../common/StatusIndicator';
import { SparklineChart } from '../charts/SparklineChart';
import { DonutChart, DonutLegend } from '../charts/DonutChart';
import {
  d2cBuildersMetrics,
  clientsByProfitability,
  churnRiskClients,
  monthlyTargets,
  clientPipeline,
} from '../../data/d2cbuilders';
import { d2cBuildersInsights, getInsightCounts } from '../../data/insights';
import { formatCurrency, formatNumber, formatPercentPlain } from '../../utils/format';

export function D2CBuildersExecutiveDashboard() {
  const metrics = d2cBuildersMetrics;
  const insights = d2cBuildersInsights;
  const insightCounts = getInsightCounts(insights);

  // Calculate health score
  const healthScore = Math.round(
    (monthlyTargets.revenue.percentComplete * 0.3 +
      monthlyTargets.onTimeRate.percentComplete * 0.25 +
      monthlyTargets.grossMargin.percentComplete * 0.25 +
      monthlyTargets.errorRate.percentComplete * 0.2)
  );

  // Revenue by stream for donut chart
  const revenueByStream = [
    { name: 'Shipping', value: metrics.revenue.byStream.shipping, color: '#3b82f6' },
    { name: 'Pick & Pack', value: metrics.revenue.byStream.pickPack, color: '#22c55e' },
    { name: 'Storage', value: metrics.revenue.byStream.storage, color: '#f59e0b' },
    { name: 'Hourly', value: metrics.revenue.byStream.hourly, color: '#8b5cf6' },
  ];

  // Split insights by priority
  const criticalInsights = insights.filter((i) => i.type === 'critical');
  const warningInsights = insights.filter((i) => i.type === 'warning');
  const otherInsights = insights.filter((i) => i.type === 'success' || i.type === 'info');

  // Top 5 clients by revenue
  const topClients = [...clientsByProfitability].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Summary Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good afternoon, Shahzil</h1>
            <p className="text-emerald-100 mt-1">Here's how D2C Builders is performing today</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-200 text-sm">Overall Health</p>
            <div className="flex items-center gap-2 mt-1">
              <HealthScore score={healthScore} size="sm" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
          <div>
            <p className="text-emerald-200 text-xs sm:text-sm">Today's Revenue</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{formatCurrency(metrics.revenue.today.current)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
              {metrics.revenue.today.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-300" />
              )}
              <span className={metrics.revenue.today.trend === 'up' ? 'text-emerald-300' : 'text-red-300'}>
                {metrics.revenue.today.changePercent >= 0 ? '+' : ''}{metrics.revenue.today.changePercent.toFixed(1)}%
              </span>
              <span className="text-emerald-200 hidden sm:inline">vs yesterday</span>
            </div>
          </div>
          <div>
            <p className="text-emerald-200 text-xs sm:text-sm">MTD Progress</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{formatCurrency(metrics.revenue.mtd.current, true)}</p>
            <div className="mt-2">
              <div className="w-full h-1.5 sm:h-2 bg-emerald-400/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${monthlyTargets.revenue.percentComplete}%` }}
                />
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                {monthlyTargets.revenue.percentComplete.toFixed(0)}% to {formatCurrency(monthlyTargets.revenue.target, true)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-emerald-200 text-xs sm:text-sm">Orders Today</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{formatNumber(metrics.operations.ordersToday.current)}</p>
            <p className="text-xs sm:text-sm text-emerald-300 mt-1">
              {formatPercentPlain(metrics.operations.onTimeRate.current)} on-time
            </p>
          </div>
          <div>
            <p className="text-emerald-200 text-xs sm:text-sm">Gross Margin</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{formatPercentPlain(metrics.profitability.grossMargin.current)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
              <span className="text-amber-300">
                {metrics.profitability.grossMargin.changePercent.toFixed(1)}%
              </span>
              <span className="text-emerald-200 hidden sm:inline">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Summary */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700">
            <Target className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Action Items</h2>
            <p className="text-sm text-slate-500">
              {insightCounts.critical + insightCounts.warning} issues need your attention
            </p>
          </div>
        </div>
        <InsightsSummary {...insightCounts} />
      </div>

      {/* Critical Alerts */}
      {criticalInsights.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Critical - Requires Immediate Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Orders/Labor Hr"
              value={metrics.operations.ordersPerLaborHour}
              subtitle="vs last week"
              showStatus
            />
            <MetricCard
              title="Error Rate"
              value={metrics.operations.errorRate}
              format="percent"
              subtitle="vs last month"
              showStatus
              invertTrendColor
            />
            <MetricCard
              title="Warehouse Util"
              value={metrics.warehouse.utilization}
              format="percent"
              subtitle="vs last month"
              showStatus
            />
            <MetricCard
              title="Net Profit MTD"
              value={metrics.profitability.netProfit}
              format="currency"
              subtitle="vs last month"
              showStatus
            />
          </div>

          {/* Revenue Trend */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Revenue Trend</h3>
                <p className="text-sm text-slate-500">Last 30 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(metrics.revenue.mtd.current, true)}
                </p>
                <p className="text-sm text-emerald-600">
                  +{metrics.revenue.mtd.changePercent.toFixed(1)}% MTD
                </p>
              </div>
            </div>
            <SparklineChart
              data={metrics.revenue.trend}
              height={120}
              color="green"
              showTooltip
            />
          </div>

          {/* Warning Insights */}
          {warningInsights.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Needs Attention
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warningInsights.slice(0, 4).map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {/* Wins & Opportunities */}
          {otherInsights.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Wins & Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue by Stream</h3>
            <DonutChart
              data={revenueByStream}
              height={180}
              centerValue={formatCurrency(metrics.revenue.mtd.current, true)}
              centerLabel="MTD Revenue"
            />
            <div className="mt-4">
              <DonutLegend data={revenueByStream} />
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Top Clients by Revenue</h3>
            <div className="space-y-3">
              {topClients.map((client, i) => (
                <div key={client.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{client.name}</p>
                      <p className="text-xs text-slate-500">{client.orders.toLocaleString()} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(client.revenue, true)}
                    </p>
                    <p className={clsx(
                      'text-xs font-medium',
                      client.margin >= 28 ? 'text-emerald-600' : client.margin >= 22 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {formatPercentPlain(client.margin)} margin
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
              View all clients <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* At-Risk Clients Alert */}
          {churnRiskClients.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                  At-Risk Clients ({churnRiskClients.length})
                </h3>
              </div>
              <ul className="space-y-2">
                {churnRiskClients.slice(0, 3).map((client) => (
                  <li key={client.id} className="flex items-center justify-between text-sm">
                    <span className="text-amber-900 dark:text-amber-200">{client.name}</span>
                    <span className="font-medium text-amber-700 dark:text-amber-400">
                      {formatPercentPlain(client.margin)} margin
                    </span>
                  </li>
                ))}
              </ul>
              <button className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:underline">
                Review all at-risk <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Pipeline */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">Client Pipeline</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Weighted value: <span className="font-bold">
                {formatCurrency(clientPipeline.reduce((s, c) => s + c.estimatedRevenue * (c.probability / 100), 0), true)}
              </span>/mo
            </p>
            <ul className="space-y-2">
              {clientPipeline.map((prospect) => (
                <li key={prospect.name} className="flex items-center justify-between text-sm">
                  <span className="text-blue-900 dark:text-blue-200">{prospect.name}</span>
                  <span className="font-medium text-blue-700 dark:text-blue-400">
                    {prospect.probability}% • {formatCurrency(prospect.estimatedRevenue, true)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
