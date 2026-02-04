import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Target,
  Users,
  ShoppingCart,
  DollarSign,
  Percent,
  ArrowRight,
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { InsightCard, InsightsSummary } from '../common/InsightCard';
import { HealthScore } from '../common/StatusIndicator';
import { CashFlowCard, CashFlowForecast, UpcomingExpenses, ARAPSummary } from '../common/CashFlowCard';
import { SparklineChart } from '../charts/SparklineChart';
import { DonutChart, DonutLegend } from '../charts/DonutChart';
import { wellBeforeMetrics, monthlyTargets, cashFlowMetrics } from '../../data/wellbefore';
import { wellBeforeInsights, getInsightCounts } from '../../data/insights';
import { formatCurrency, formatNumber, formatPercentPlain } from '../../utils/format';

export function WellBeforeExecutiveDashboard() {
  const metrics = wellBeforeMetrics;
  const insights = wellBeforeInsights;
  const insightCounts = getInsightCounts(insights);

  // Calculate overall health score (simplified formula)
  const healthScore = Math.round(
    (monthlyTargets.revenue.percentComplete * 0.3 +
      monthlyTargets.grossMargin.percentComplete * 0.25 +
      (100 - Math.min(100, (metrics.marketing.cac.blended.current / monthlyTargets.cac.target) * 100 - 100)) * 0.25 +
      metrics.fulfillment.onTimeRate.current * 0.2)
  );

  // Revenue by channel for donut chart
  const revenueByChannel = [
    { name: 'Shopify', value: metrics.revenue.byChannel.shopify, color: '#3b82f6' },
    { name: 'Amazon', value: metrics.revenue.byChannel.amazon, color: '#f59e0b' },
    { name: 'Wholesale', value: metrics.revenue.byChannel.wholesale, color: '#22c55e' },
    { name: 'Subscriptions', value: metrics.revenue.byChannel.subscriptions, color: '#8b5cf6' },
  ];

  // Split insights by priority
  const criticalInsights = insights.filter((i) => i.type === 'critical');
  const warningInsights = insights.filter((i) => i.type === 'warning');
  const otherInsights = insights.filter((i) => i.type === 'success' || i.type === 'info');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Summary Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good afternoon, Shahzil</h1>
            <p className="text-blue-100 mt-1">Here's how WellBefore is performing today</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm">Overall Health</p>
            <div className="flex items-center gap-2 mt-1">
              <HealthScore score={healthScore} size="sm" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div>
            <p className="text-blue-200 text-sm">Today's Revenue</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(metrics.revenue.today.current)}</p>
            <div className="flex items-center gap-1 mt-1 text-sm">
              {metrics.revenue.today.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-300" />
              )}
              <span className={metrics.revenue.today.trend === 'up' ? 'text-emerald-300' : 'text-red-300'}>
                {metrics.revenue.today.changePercent >= 0 ? '+' : ''}{metrics.revenue.today.changePercent.toFixed(1)}%
              </span>
              <span className="text-blue-200">vs yesterday</span>
            </div>
          </div>
          <div>
            <p className="text-blue-200 text-sm">MTD Progress</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(metrics.revenue.mtd.current, true)}</p>
            <div className="mt-2">
              <div className="w-full h-2 bg-blue-400/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${monthlyTargets.revenue.percentComplete}%` }}
                />
              </div>
              <p className="text-xs text-blue-200 mt-1">
                {monthlyTargets.revenue.percentComplete.toFixed(0)}% to {formatCurrency(monthlyTargets.revenue.target, true)} goal
              </p>
            </div>
          </div>
          <div>
            <p className="text-blue-200 text-sm">LTV:CAC Ratio</p>
            <p className="text-3xl font-bold mt-1">{metrics.customers.ltvCacRatio.current.toFixed(1)}:1</p>
            <p className="text-sm text-emerald-300 mt-1">Above 3:1 target</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Gross Margin</p>
            <p className="text-3xl font-bold mt-1">{formatPercentPlain(metrics.profitability.grossMargin.current)}</p>
            <div className="flex items-center gap-1 mt-1 text-sm">
              <TrendingDown className="w-4 h-4 text-amber-300" />
              <span className="text-amber-300">
                {metrics.profitability.grossMargin.changePercent.toFixed(1)}%
              </span>
              <span className="text-blue-200">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* 💰 CASH FLOW - CEO's First Priority */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <CashFlowCard metrics={cashFlowMetrics} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <CashFlowForecast metrics={cashFlowMetrics} />
        </div>
      </div>

      {/* AR/AP and Upcoming Expenses */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6">
          <ARAPSummary metrics={cashFlowMetrics} />
        </div>
        <div className="col-span-12 md:col-span-6">
          <UpcomingExpenses expenses={cashFlowMetrics.upcomingExpenses} />
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
        {/* Left Column - Metrics */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Orders Today"
              value={metrics.orders.today}
              format="number"
              subtitle="vs yesterday"
              showStatus
            />
            <MetricCard
              title="AOV"
              value={metrics.orders.averageValue}
              format="currency"
              subtitle="vs last week"
              showStatus
            />
            <MetricCard
              title="ROAS (Blended)"
              value={metrics.marketing.roas.blended}
              subtitle="vs last month"
              showStatus
            />
            <MetricCard
              title="Repeat Rate"
              value={metrics.customers.repeatRate}
              format="percent"
              subtitle="vs last month"
              showStatus
            />
          </div>

          {/* Revenue Trend with Sparkline */}
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
              color="blue"
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

        {/* Right Column - Summary Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue by Channel</h3>
            <DonutChart
              data={revenueByChannel}
              height={180}
              centerValue={formatCurrency(metrics.revenue.mtd.current, true)}
              centerLabel="MTD Revenue"
            />
            <div className="mt-4">
              <DonutLegend data={revenueByChannel} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">New Customers</p>
                    <p className="text-xs text-slate-500">This month</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatNumber(monthlyTargets.newCustomers.current)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Net Profit</p>
                    <p className="text-xs text-slate-500">MTD</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(metrics.profitability.netProfit.current, true)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <ShoppingCart className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Orders MTD</p>
                    <p className="text-xs text-slate-500">This month</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatNumber(metrics.orders.mtd.current)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Percent className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">On-Time Rate</p>
                    <p className="text-xs text-slate-500">Fulfillment</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatPercentPlain(metrics.fulfillment.onTimeRate.current)}
                </p>
              </div>
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">Inventory Alerts</h3>
            </div>
            <ul className="space-y-2">
              {metrics.inventory.stockoutRisk.slice(0, 3).map((item) => (
                <li key={item.sku} className="flex items-center justify-between text-sm">
                  <span className="text-amber-900 dark:text-amber-200 truncate mr-2">{item.name}</span>
                  <span className="font-medium text-amber-700 dark:text-amber-400 whitespace-nowrap">
                    {item.daysOnHand}d left
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:underline">
              View all inventory <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
