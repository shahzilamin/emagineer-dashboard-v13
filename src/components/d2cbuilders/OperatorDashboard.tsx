import { clsx } from 'clsx';
import { Users, AlertTriangle, TrendingDown } from 'lucide-react';
import { MetricCard, MiniMetric } from '../common/MetricCard';
import { ProgressBar, StatusBadge } from '../common/StatusIndicator';
import { DonutChart, DonutLegend } from '../charts/DonutChart';
import { ClientTable } from '../charts/DataTable';
import {
  d2cBuildersMetrics,
  clientsByProfitability,
  churnRiskClients,
  revenueByStreamTrend,
  monthlyTargets,
  laborEfficiencyByDay,
  clientPipeline,
} from '../../data/d2cbuilders';
import { formatCurrency, formatNumber, formatPercentPlain } from '../../utils/format';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export function D2CBuildersOperatorDashboard() {
  const metrics = d2cBuildersMetrics;

  // Revenue by stream for donut chart
  const revenueByStream = [
    { name: 'Shipping', value: metrics.revenue.byStream.shipping, color: '#3b82f6' },
    { name: 'Pick & Pack', value: metrics.revenue.byStream.pickPack, color: '#22c55e' },
    { name: 'Storage', value: metrics.revenue.byStream.storage, color: '#f59e0b' },
    { name: 'Hourly', value: metrics.revenue.byStream.hourly, color: '#8b5cf6' },
  ];

  // Custom tooltip for stacked bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-500">{entry.name}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatCurrency(entry.value, true)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            D2C Builders Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleTimeString()} • {metrics.clients.active} active clients
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Warehouse Util</p>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {formatPercentPlain(metrics.warehouse.utilization.current)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Pallets</p>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{metrics.warehouse.palletsStored}</p>
          </div>
        </div>
      </div>

      {/* Target Progress */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <ProgressBar
            current={monthlyTargets.revenue.current}
            target={monthlyTargets.revenue.target}
            label="Revenue"
          />
          <p className="text-xs text-slate-500 mt-1">
            {formatCurrency(monthlyTargets.revenue.current, true)} / {formatCurrency(monthlyTargets.revenue.target, true)}
          </p>
        </div>
        <div>
          <ProgressBar
            current={monthlyTargets.orders.current}
            target={monthlyTargets.orders.target}
            label="Orders"
          />
          <p className="text-xs text-slate-500 mt-1">
            {formatNumber(monthlyTargets.orders.current)} / {formatNumber(monthlyTargets.orders.target)}
          </p>
        </div>
        <div>
          <ProgressBar
            current={monthlyTargets.onTimeRate.current}
            target={monthlyTargets.onTimeRate.target}
            label="On-Time"
          />
          <p className="text-xs text-slate-500 mt-1">
            {monthlyTargets.onTimeRate.current}% / {monthlyTargets.onTimeRate.target}%
          </p>
        </div>
        <div>
          <ProgressBar
            current={monthlyTargets.errorRate.target}
            target={monthlyTargets.errorRate.current}
            label="Error Rate"
          />
          <p className="text-xs text-slate-500 mt-1">
            {monthlyTargets.errorRate.current}% / {monthlyTargets.errorRate.target}%
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <ProgressBar
            current={monthlyTargets.grossMargin.current}
            target={monthlyTargets.grossMargin.target}
            label="Margin"
          />
          <p className="text-xs text-slate-500 mt-1">
            {monthlyTargets.grossMargin.current}% / {monthlyTargets.grossMargin.target}%
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Top metrics */}
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
              title="Orders Today"
              value={metrics.operations.ordersToday}
              format="number"
              subtitle="vs yesterday"
              compact
            />
            <MetricCard
              title="Orders/Labor Hr"
              value={metrics.operations.ordersPerLaborHour}
              subtitle="vs last week"
              compact
            />
          </div>

          {/* Revenue by Stream Trend */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue by Stream (6 Months)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByStreamTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="shipping" name="Shipping" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pickPack" name="Pick & Pack" stackId="a" fill="#22c55e" />
                <Bar dataKey="storage" name="Storage" stackId="a" fill="#f59e0b" />
                <Bar dataKey="hourly" name="Hourly" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Client Profitability Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Client Profitability</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Top client concentration:</span>
                <span className={clsx(
                  'font-semibold',
                  metrics.clients.concentration > 25 ? 'text-amber-600' : 'text-slate-900 dark:text-white'
                )}>
                  {metrics.clients.concentration.toFixed(1)}%
                </span>
              </div>
            </div>
            <ClientTable clients={clientsByProfitability} />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue by Stream</h3>
            <DonutChart
              data={revenueByStream}
              height={160}
              centerValue={formatCurrency(metrics.revenue.mtd.current, true)}
              centerLabel="MTD"
            />
            <div className="mt-4">
              <DonutLegend data={revenueByStream} />
            </div>
          </div>

          {/* Operations Metrics */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Operations</h3>
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
              <MiniMetric
                label="Orders MTD"
                value={metrics.operations.ordersMtd.current}
                change={metrics.operations.ordersMtd.changePercent}
              />
              <MiniMetric
                label="On-Time Rate"
                value={metrics.operations.onTimeRate.current}
                change={metrics.operations.onTimeRate.changePercent}
                format="percent"
              />
              <MiniMetric
                label="Error Rate"
                value={metrics.operations.errorRate.current}
                change={metrics.operations.errorRate.changePercent}
                format="percent"
                invertTrendColor
              />
              <MiniMetric
                label="Avg Ship Time"
                value={metrics.operations.avgShipTime.current}
                change={metrics.operations.avgShipTime.changePercent}
                invertTrendColor
              />
            </div>
          </div>

          {/* Cost Metrics */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Costs & Margins</h3>
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
              <MiniMetric
                label="Labor Cost (MTD)"
                value={metrics.costs.laborCost.current}
                change={metrics.costs.laborCost.changePercent}
                format="currency"
                invertTrendColor
              />
              <MiniMetric
                label="Labor/Order"
                value={metrics.costs.laborCostPerOrder.current}
                change={metrics.costs.laborCostPerOrder.changePercent}
                format="currency"
                invertTrendColor
              />
              <MiniMetric
                label="Shipping Margin"
                value={metrics.costs.shippingMargin.current}
                change={metrics.costs.shippingMargin.changePercent}
                format="percent"
              />
              <MiniMetric
                label="Gross Margin"
                value={metrics.profitability.grossMargin.current}
                change={metrics.profitability.grossMargin.changePercent}
                format="percent"
              />
            </div>
          </div>

          {/* Warehouse */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Warehouse</h3>
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
              <MiniMetric
                label="Utilization"
                value={metrics.warehouse.utilization.current}
                change={metrics.warehouse.utilization.changePercent}
                format="percent"
              />
              <MiniMetric
                label="Revenue/Sq Ft"
                value={metrics.warehouse.revenuePerSqFt.current}
                change={metrics.warehouse.revenuePerSqFt.changePercent}
                format="currency"
              />
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-slate-500">Pallets Stored</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {metrics.warehouse.palletsStored}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-slate-500">Overhead (MTD)</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(metrics.costs.overhead, true)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width - At Risk Clients & Pipeline */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Churn Risk Clients */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                At-Risk Clients ({churnRiskClients.length})
              </h3>
            </div>
            <div className="space-y-2">
              {churnRiskClients.map((client) => (
                <div
                  key={client.id}
                  className={clsx(
                    'flex items-center justify-between p-3 rounded-lg',
                    client.riskLevel === 'critical' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-amber-50 dark:bg-amber-900/20'
                  )}
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{client.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(client.revenue, true)}/mo • {client.margin.toFixed(1)}% margin
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={client.riskLevel} size="sm" />
                    {client.trend === 'down' && (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Client Pipeline
              </h3>
              <span className="text-xs text-slate-500">
                Weighted: {formatCurrency(clientPipeline.reduce((s, c) => s + c.estimatedRevenue * (c.probability / 100), 0), true)}/mo
              </span>
            </div>
            <div className="space-y-2">
              {clientPipeline.map((prospect) => (
                <div
                  key={prospect.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{prospect.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(prospect.estimatedRevenue, true)}/mo est. • {prospect.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16">
                      <ProgressBar
                        current={prospect.probability}
                        target={100}
                        showPercent={false}
                        height="sm"
                      />
                    </div>
                    <span className="text-sm font-medium text-blue-600">{prospect.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Labor Efficiency Chart */}
        <div className="col-span-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Labor Efficiency by Day</h3>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {laborEfficiencyByDay.map((day) => {
              const isAboveTarget = day.ordersPerHour >= day.target;
              return (
                <div key={day.day} className="text-center">
                  <p className="text-xs text-slate-500 mb-2">{day.day}</p>
                  <div className="relative h-24 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <div
                      className={clsx(
                        'absolute bottom-0 left-0 right-0 rounded-lg transition-all',
                        isAboveTarget ? 'bg-emerald-500' : 'bg-amber-500'
                      )}
                      style={{ height: `${(day.ordersPerHour / 16) * 100}%` }}
                    />
                    <div
                      className="absolute left-0 right-0 border-t-2 border-dashed border-slate-400"
                      style={{ top: `${100 - (day.target / 16) * 100}%` }}
                    />
                  </div>
                  <p className={clsx(
                    'text-sm font-semibold mt-2',
                    isAboveTarget ? 'text-emerald-600' : 'text-amber-600'
                  )}>
                    {day.ordersPerHour}
                  </p>
                  <p className="text-xs text-slate-400">orders/hr</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Dashed line = {laborEfficiencyByDay[0].target} orders/hr target
          </p>
        </div>
      </div>
    </div>
  );
}
