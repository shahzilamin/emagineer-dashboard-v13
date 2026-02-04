import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import type { ChannelMetrics, ClientMetrics, TrendDirection } from '../../types';
import { formatCurrency, formatPercentPlain } from '../../utils/format';
import { StatusBadge } from '../common/StatusIndicator';

// Channel performance table for WellBefore
export function ChannelTable({ channels }: { channels: ChannelMetrics[] }) {
  const TrendIcon = ({ direction }: { direction: TrendDirection }) => {
    if (direction === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
    if (direction === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Channel
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Spend
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Revenue
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              ROAS
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              CAC
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Orders
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              CVR
            </th>
            <th className="text-center py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Trend
            </th>
          </tr>
        </thead>
        <tbody>
          {channels.map((channel) => (
            <tr
              key={channel.channel}
              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="py-2.5 px-2 font-medium text-slate-900 dark:text-white">
                {channel.channel}
              </td>
              <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-300">
                {channel.spend > 0 ? formatCurrency(channel.spend, true) : '—'}
              </td>
              <td className="py-2.5 px-2 text-right font-semibold text-slate-900 dark:text-white">
                {formatCurrency(channel.revenue, true)}
              </td>
              <td className="py-2.5 px-2 text-right">
                <span
                  className={clsx(
                    'font-semibold',
                    channel.roas >= 3
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : channel.roas >= 2
                      ? 'text-amber-600 dark:text-amber-400'
                      : channel.roas === Infinity
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {channel.roas === Infinity ? '∞' : `${channel.roas.toFixed(1)}x`}
                </span>
              </td>
              <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-300">
                {channel.cac > 0 ? formatCurrency(channel.cac) : '—'}
              </td>
              <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-300">
                {channel.orders.toLocaleString()}
              </td>
              <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-300">
                {formatPercentPlain(channel.conversionRate)}
              </td>
              <td className="py-2.5 px-2 text-center">
                <TrendIcon direction={channel.trend} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Client profitability table for D2C Builders
export function ClientTable({ clients }: { clients: ClientMetrics[] }) {
  const TrendIcon = ({ direction }: { direction: TrendDirection }) => {
    if (direction === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
    if (direction === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Client
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Revenue
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Orders
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Margin
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Pallets
            </th>
            <th className="text-center py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Status
            </th>
            <th className="text-center py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Trend
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className={clsx(
                'border-b border-slate-100 dark:border-slate-800',
                client.riskLevel === 'critical' && 'bg-red-50 dark:bg-red-900/10',
                client.riskLevel === 'warning' && 'bg-amber-50 dark:bg-amber-900/10'
              )}
            >
              <td className="py-2.5 px-2">
                <div className="flex items-center gap-2">
                  {client.riskLevel !== 'healthy' && (
                    <AlertTriangle
                      className={clsx(
                        'w-4 h-4',
                        client.riskLevel === 'critical' ? 'text-red-500' : 'text-amber-500'
                      )}
                    />
                  )}
                  <span className="font-medium text-slate-900 dark:text-white">
                    {client.name}
                  </span>
                </div>
              </td>
              <td className="py-2.5 px-2 text-right font-semibold text-slate-900 dark:text-white">
                {formatCurrency(client.revenue, true)}
              </td>
              <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-300">
                {client.orders.toLocaleString()}
              </td>
              <td className="py-2.5 px-2 text-right">
                <span
                  className={clsx(
                    'font-semibold',
                    client.margin >= 28
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : client.margin >= 22
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {formatPercentPlain(client.margin)}
                </span>
              </td>
              <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-300">
                {client.pallets || '—'}
              </td>
              <td className="py-2.5 px-2 text-center">
                <StatusBadge status={client.riskLevel} size="sm" />
              </td>
              <td className="py-2.5 px-2 text-center">
                <TrendIcon direction={client.trend} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Inventory risk table
export function InventoryTable({
  items,
  type,
}: {
  items: { sku: string; name: string; daysOnHand: number; quantity: number; value: number }[];
  type: 'stockout' | 'deadstock';
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              SKU
            </th>
            <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Product
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Days Left
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Qty
            </th>
            <th className="text-right py-2 px-2 font-medium text-slate-500 dark:text-slate-400">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.sku}
              className={clsx(
                'border-b border-slate-100 dark:border-slate-800',
                type === 'stockout' && item.daysOnHand <= 7 && 'bg-red-50 dark:bg-red-900/10',
                type === 'stockout' && item.daysOnHand > 7 && item.daysOnHand <= 14 && 'bg-amber-50 dark:bg-amber-900/10'
              )}
            >
              <td className="py-2 px-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                {item.sku}
              </td>
              <td className="py-2 px-2 text-slate-900 dark:text-white truncate max-w-[200px]">
                {item.name}
              </td>
              <td className="py-2 px-2 text-right">
                <span
                  className={clsx(
                    'font-semibold',
                    type === 'stockout'
                      ? item.daysOnHand <= 7
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-400'
                  )}
                >
                  {item.daysOnHand}d
                </span>
              </td>
              <td className="py-2 px-2 text-right text-slate-600 dark:text-slate-300">
                {item.quantity.toLocaleString()}
              </td>
              <td className="py-2 px-2 text-right font-medium text-slate-900 dark:text-white">
                {formatCurrency(item.value, true)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
