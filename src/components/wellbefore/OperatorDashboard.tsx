import { clsx } from 'clsx';
import { Package, AlertTriangle } from 'lucide-react';
import { MetricCard, MiniMetric } from '../common/MetricCard';
import { ProgressBar, StatusBadge } from '../common/StatusIndicator';
import { RevenueChart } from '../charts/RevenueChart';
import { DonutChart, DonutLegend } from '../charts/DonutChart';
import { ChannelTable, InventoryTable } from '../charts/DataTable';
import {
  wellBeforeMetrics,
  dailyMetrics,
  channelPerformance,
  monthlyTargets,
  weeklyComparison,
} from '../../data/wellbefore';
import { formatCurrency, formatNumber } from '../../utils/format';

export function WellBeforeOperatorDashboard() {
  const metrics = wellBeforeMetrics;

  // Revenue by channel for donut chart
  const revenueByChannel = [
    { name: 'Shopify', value: metrics.revenue.byChannel.shopify, color: '#3b82f6' },
    { name: 'Amazon', value: metrics.revenue.byChannel.amazon, color: '#f59e0b' },
    { name: 'Wholesale', value: metrics.revenue.byChannel.wholesale, color: '#22c55e' },
    { name: 'Subscriptions', value: metrics.revenue.byChannel.subscriptions, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-4">
      {/* Header with quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            WellBefore Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleTimeString()} • MTD: {((new Date().getDate() / 30) * 100).toFixed(0)}% through month
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Cash Position</p>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(metrics.profitability.cashPosition, true)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Runway</p>
            <p className="text-base sm:text-lg font-bold text-emerald-600">{metrics.profitability.runway} mo</p>
          </div>
        </div>
      </div>

      {/* Target Progress Bar - scrollable on mobile */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 overflow-x-auto">
        <div className="flex lg:grid lg:grid-cols-5 gap-4 min-w-max lg:min-w-0">
        <div className="min-w-[120px]">
          <ProgressBar
            current={monthlyTargets.revenue.current}
            target={monthlyTargets.revenue.target}
            label="Revenue"
          />
          <p className="text-xs text-slate-500 mt-1">
            {formatCurrency(monthlyTargets.revenue.current, true)} / {formatCurrency(monthlyTargets.revenue.target, true)}
          </p>
        </div>
        <div className="min-w-[120px]">
          <ProgressBar
            current={monthlyTargets.orders.current}
            target={monthlyTargets.orders.target}
            label="Orders"
          />
          <p className="text-xs text-slate-500 mt-1">
            {formatNumber(monthlyTargets.orders.current)} / {formatNumber(monthlyTargets.orders.target)}
          </p>
        </div>
        <div className="min-w-[120px]">
          <ProgressBar
            current={monthlyTargets.newCustomers.current}
            target={monthlyTargets.newCustomers.target}
            label="Customers"
          />
          <p className="text-xs text-slate-500 mt-1">
            {formatNumber(monthlyTargets.newCustomers.current)} / {formatNumber(monthlyTargets.newCustomers.target)}
          </p>
        </div>
        <div className="min-w-[120px]">
          <ProgressBar
            current={monthlyTargets.grossMargin.current}
            target={monthlyTargets.grossMargin.target}
            label="Margin"
          />
          <p className="text-xs text-slate-500 mt-1">
            {monthlyTargets.grossMargin.current}% / {monthlyTargets.grossMargin.target}%
          </p>
        </div>
        <div className="min-w-[120px]">
          <ProgressBar
            current={monthlyTargets.cac.target}
            target={monthlyTargets.cac.current}
            label="CAC"
          />
          <p className="text-xs text-slate-500 mt-1">
            ${monthlyTargets.cac.current} / ${monthlyTargets.cac.target} target
          </p>
        </div>
        </div>
      </div>

      {/* Main Grid - Dense Layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* Revenue Section */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Top metrics row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              title="Today's Revenue"
              value={metrics.revenue.today}
              format="currency"
              subtitle="vs yesterday"
              compact
            />
            <MetricCard
              title="MTD Revenue"
              value={metrics.revenue.mtd}
              format="currency"
              subtitle="vs last month"
              compact
            />
            <MetricCard
              title="Today's Orders"
              value={metrics.orders.today}
              format="number"
              subtitle="vs yesterday"
              compact
            />
            <MetricCard
              title="AOV"
              value={metrics.orders.averageValue}
              format="currency"
              subtitle="vs last week"
              compact
            />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Revenue & Orders (30 Days)</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-slate-600 dark:text-slate-400">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-amber-500" />
                  <span className="text-slate-600 dark:text-slate-400">Orders</span>
                </div>
              </div>
            </div>
            <RevenueChart data={dailyMetrics} height={220} />
          </div>

          {/* Marketing Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Marketing Performance (MTD)</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  Spend: {formatCurrency(metrics.marketing.spend.mtd.current, true)} / {formatCurrency(metrics.marketing.spend.budget, true)}
                </span>
                <StatusBadge
                  status={metrics.marketing.spend.pacing > 100 ? 'warning' : 'healthy'}
                  label={`${metrics.marketing.spend.pacing.toFixed(0)}% paced`}
                />
              </div>
            </div>
            <ChannelTable channels={channelPerformance} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue by Channel</h3>
            <DonutChart
              data={revenueByChannel}
              height={160}
              centerValue={formatCurrency(metrics.revenue.mtd.current, true)}
              centerLabel="MTD"
            />
            <div className="mt-4">
              <DonutLegend data={revenueByChannel} />
            </div>
          </div>

          {/* Customer Metrics */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Customer Health</h3>
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
              <MiniMetric
                label="LTV"
                value={metrics.customers.ltv.current}
                change={metrics.customers.ltv.changePercent}
                format="currency"
              />
              <MiniMetric
                label="CAC (Blended)"
                value={metrics.marketing.cac.blended.current}
                change={metrics.marketing.cac.blended.changePercent}
                format="currency"
                invertTrendColor
              />
              <MiniMetric
                label="LTV:CAC Ratio"
                value={metrics.customers.ltvCacRatio.current}
                change={metrics.customers.ltvCacRatio.changePercent}
              />
              <MiniMetric
                label="Repeat Rate"
                value={metrics.customers.repeatRate.current}
                change={metrics.customers.repeatRate.changePercent}
                format="percent"
              />
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">New vs Returning</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-blue-600">{metrics.orders.newVsReturning.new}%</span>
                  <span className="text-xs text-slate-400">/</span>
                  <span className="text-sm font-semibold text-emerald-600">{metrics.orders.newVsReturning.returning}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profitability */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Profitability</h3>
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
              <MiniMetric
                label="Gross Margin"
                value={metrics.profitability.grossMargin.current}
                change={metrics.profitability.grossMargin.changePercent}
                format="percent"
              />
              <MiniMetric
                label="Contribution Margin"
                value={metrics.profitability.contributionMargin.current}
                change={metrics.profitability.contributionMargin.changePercent}
                format="percent"
              />
              <MiniMetric
                label="OpEx Ratio"
                value={metrics.profitability.operatingExpenseRatio.current}
                change={metrics.profitability.operatingExpenseRatio.changePercent}
                format="percent"
                invertTrendColor
              />
              <MiniMetric
                label="Net Profit (MTD)"
                value={metrics.profitability.netProfit.current}
                change={metrics.profitability.netProfit.changePercent}
                format="currency"
              />
            </div>
          </div>

          {/* Fulfillment */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Fulfillment</h3>
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
              <MiniMetric
                label="Shipped Today"
                value={metrics.fulfillment.shippedToday.current}
                change={metrics.fulfillment.shippedToday.changePercent}
              />
              <MiniMetric
                label="On-Time Rate"
                value={metrics.fulfillment.onTimeRate.current}
                change={metrics.fulfillment.onTimeRate.changePercent}
                format="percent"
              />
              <MiniMetric
                label="Avg Ship Time"
                value={metrics.fulfillment.avgShipTime.current}
                change={metrics.fulfillment.avgShipTime.changePercent}
                invertTrendColor
              />
              <MiniMetric
                label="Cost/Order"
                value={metrics.fulfillment.costPerOrder.current}
                change={metrics.fulfillment.costPerOrder.changePercent}
                format="currency"
                invertTrendColor
              />
            </div>
          </div>
        </div>

        {/* Inventory Alerts - Full Width */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stockout Risk */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">Stockout Risk ({metrics.inventory.stockoutRisk.length})</h3>
            </div>
            <InventoryTable items={metrics.inventory.stockoutRisk} type="stockout" />
          </div>

          {/* Dead Stock */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <Package className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">Dead Stock ({metrics.inventory.deadStock.length})</h3>
              <span className="text-xs text-slate-500">
                {formatCurrency(metrics.inventory.deadStock.reduce((s, i) => s + i.value, 0), true)} tied up
              </span>
            </div>
            <InventoryTable items={metrics.inventory.deadStock} type="deadstock" />
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="col-span-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 overflow-x-auto">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Period Comparison</h3>
          <div className="flex lg:grid lg:grid-cols-5 gap-4 min-w-max lg:min-w-0">
            {['Revenue', 'Orders', 'AOV', 'Ad Spend', 'New Customers'].map((metric, i) => {
              const keys = ['revenue', 'orders', 'aov', 'adSpend', 'newCustomers'] as const;
              const key = keys[i];
              const thisWeek = weeklyComparison.thisWeek[key];
              const lastWeek = weeklyComparison.lastWeek[key];
              const lastYear = weeklyComparison.lastYear[key];
              const wowChange = ((thisWeek - lastWeek) / lastWeek) * 100;
              const yoyChange = ((thisWeek - lastYear) / lastYear) * 100;

              return (
                <div key={metric} className="text-center min-w-[80px]">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{metric === 'New Customers' ? 'New Cust' : metric}</p>
                  <p className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">
                    {metric === 'Revenue' || metric === 'Ad Spend' || metric === 'AOV'
                      ? formatCurrency(thisWeek, true)
                      : formatNumber(thisWeek)}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 mt-1">
                    <span className={clsx('text-xs font-medium', wowChange >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                      {wowChange >= 0 ? '+' : ''}{wowChange.toFixed(1)}% WoW
                    </span>
                    <span className={clsx('text-xs font-medium', yoyChange >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                      {yoyChange >= 0 ? '+' : ''}{yoyChange.toFixed(1)}% YoY
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
