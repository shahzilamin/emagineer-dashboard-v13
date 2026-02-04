// Common types
export type TrendDirection = 'up' | 'down' | 'flat';
export type HealthStatus = 'healthy' | 'warning' | 'critical';
export type TimeRange = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year';

export interface MetricValue {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: TrendDirection;
  status: HealthStatus;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface DailyMetrics {
  date: string;
  revenue: number;
  orders: number;
  aov: number;
  visitors: number;
  conversionRate: number;
}

// WellBefore Types
export interface WellBeforeMetrics {
  revenue: {
    today: MetricValue;
    mtd: MetricValue;
    ytd: MetricValue;
    byChannel: {
      shopify: number;
      amazon: number;
      wholesale: number;
      subscriptions: number;
    };
    trend: TimeSeriesPoint[];
  };
  orders: {
    today: MetricValue;
    mtd: MetricValue;
    averageValue: MetricValue;
    newVsReturning: { new: number; returning: number };
  };
  marketing: {
    spend: {
      today: MetricValue;
      mtd: MetricValue;
      budget: number;
      pacing: number;
    };
    cac: {
      blended: MetricValue;
      byChannel: {
        meta: number;
        google: number;
        email: number;
        organic: number;
      };
    };
    roas: {
      blended: MetricValue;
      byChannel: {
        meta: number;
        google: number;
        email: number;
      };
    };
    channelPerformance: ChannelMetrics[];
  };
  customers: {
    ltv: MetricValue;
    ltvCacRatio: MetricValue;
    repeatRate: MetricValue;
    churnRisk: number;
    cohorts: CohortData[];
  };
  inventory: {
    totalValue: number;
    stockoutRisk: InventoryItem[];
    deadStock: InventoryItem[];
    topProducts: ProductMetrics[];
  };
  fulfillment: {
    shippedToday: MetricValue;
    onTimeRate: MetricValue;
    avgShipTime: MetricValue;
    costPerOrder: MetricValue;
  };
  profitability: {
    grossMargin: MetricValue;
    contributionMargin: MetricValue;
    netProfit: MetricValue;
    operatingExpenseRatio: MetricValue;
    cashPosition: number;
    runway: number;
  };
}

export interface ChannelMetrics {
  channel: string;
  spend: number;
  revenue: number;
  orders: number;
  cac: number;
  roas: number;
  cpc: number;
  conversionRate: number;
  trend: TrendDirection;
}

export interface CohortData {
  cohort: string;
  customers: number;
  ltv30: number | null;
  ltv60: number | null;
  ltv90: number | null;
  ltv365: number | null;
  repeatRate: number;
}

export interface InventoryItem {
  sku: string;
  name: string;
  daysOnHand: number;
  quantity: number;
  value: number;
  velocity: number;
}

export interface ProductMetrics {
  sku: string;
  name: string;
  revenue: number;
  units: number;
  margin: number;
  returnRate: number;
}

export interface DashboardState {
  company: 'wellbefore' | 'd2cbuilders' | 'portfolio';
  view: 'operator' | 'executive';
  timeRange: TimeRange;
  darkMode: boolean;
}

export interface Insight {
  id: string;
  type: 'success' | 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  metric?: string;
  action?: string;
  owner?: string;
  timestamp: Date;
}

export interface ClientMetrics {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  margin: number;
  trend: TrendDirection;
  riskLevel: HealthStatus;
  laborHours?: number;
  pallets?: number;
}

export interface D2CBuildersMetrics {
  revenue: {
    today: MetricValue;
    mtd: MetricValue;
    ytd: MetricValue;
    byStream: {
      shipping: number;
      pickPack: number;
      storage: number;
      hourly: number;
    };
    trend: TimeSeriesPoint[];
  };
  clients: {
    active: number;
    totalRevenue: ClientMetrics[];
    profitability: ClientMetrics[];
    churnRisk: ClientMetrics[];
    concentration: number;
  };
  operations: {
    ordersToday: MetricValue;
    ordersMtd: MetricValue;
    ordersPerLaborHour: MetricValue;
    errorRate: MetricValue;
    onTimeRate: MetricValue;
    avgShipTime: MetricValue;
  };
  warehouse: {
    utilization: MetricValue;
    revenuePerSqFt: MetricValue;
    palletsStored: number;
    storageByClient: { client: string; pallets: number; revenue: number }[];
  };
  costs: {
    laborCost: MetricValue;
    laborCostPerOrder: MetricValue;
    shippingMargin: MetricValue;
    overhead: number;
    profitMarginByClient: ClientMetrics[];
  };
  profitability: {
    grossMargin: MetricValue;
    netProfit: MetricValue;
    ebitda: MetricValue;
  };
}
