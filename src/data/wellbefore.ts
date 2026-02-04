import type {
  WellBeforeMetrics,
  TimeSeriesPoint,
  ChannelMetrics,
  CohortData,
  InventoryItem,
  ProductMetrics,
  DailyMetrics,
} from '../types';

// Helper to generate trend data
const generateTrendData = (days: number, baseValue: number, volatility: number = 0.15): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  let value = baseValue;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add some realistic variance with slight upward trend
    const change = (Math.random() - 0.45) * volatility * value;
    value = Math.max(value + change, baseValue * 0.7);

    // Weekend dip
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.75 : 1;

    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * weekendMultiplier),
    });
  }

  return data;
};

// Daily metrics for the past 30 days
export const dailyMetrics: DailyMetrics[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const baseRevenue = 27500; // ~$10M annual / 365
  const variance = (Math.random() - 0.5) * 0.3;
  const weekendMultiplier = isWeekend ? 0.72 : 1;
  const revenue = Math.round(baseRevenue * (1 + variance) * weekendMultiplier);
  const orders = Math.round(revenue / 68); // ~$68 AOV

  return {
    date: date.toISOString().split('T')[0],
    revenue,
    orders,
    aov: Math.round(revenue / orders * 100) / 100,
    visitors: Math.round(orders / 0.028), // ~2.8% conversion
    conversionRate: 2.6 + Math.random() * 0.6,
  };
});

// Channel performance
export const channelPerformance: ChannelMetrics[] = [
  {
    channel: 'Meta Ads',
    spend: 42500,
    revenue: 127500,
    orders: 1875,
    cac: 22.67,
    roas: 3.0,
    cpc: 1.85,
    conversionRate: 2.4,
    trend: 'up',
  },
  {
    channel: 'Google Ads',
    spend: 31200,
    revenue: 93600,
    orders: 1350,
    cac: 23.11,
    roas: 3.0,
    cpc: 2.15,
    conversionRate: 3.1,
    trend: 'up',
  },
  {
    channel: 'Email (Klaviyo)',
    spend: 2800,
    revenue: 84000,
    orders: 1200,
    cac: 2.33,
    roas: 30.0,
    cpc: 0,
    conversionRate: 4.2,
    trend: 'up',
  },
  {
    channel: 'Organic Search',
    spend: 0,
    revenue: 156000,
    orders: 2300,
    cac: 0,
    roas: Infinity,
    cpc: 0,
    conversionRate: 3.8,
    trend: 'flat',
  },
  {
    channel: 'Direct',
    spend: 0,
    revenue: 198000,
    orders: 2900,
    cac: 0,
    roas: Infinity,
    cpc: 0,
    conversionRate: 5.2,
    trend: 'up',
  },
  {
    channel: 'Referral',
    spend: 4500,
    revenue: 45000,
    orders: 680,
    cac: 6.62,
    roas: 10.0,
    cpc: 0,
    conversionRate: 3.5,
    trend: 'down',
  },
];

// Cohort data
export const cohortData: CohortData[] = [
  { cohort: 'Jan 2024', customers: 2450, ltv30: 72, ltv60: 98, ltv90: 118, ltv365: 185, repeatRate: 28 },
  { cohort: 'Feb 2024', customers: 2680, ltv30: 68, ltv60: 94, ltv90: 112, ltv365: 172, repeatRate: 26 },
  { cohort: 'Mar 2024', customers: 3120, ltv30: 71, ltv60: 96, ltv90: 115, ltv365: 178, repeatRate: 27 },
  { cohort: 'Apr 2024', customers: 2890, ltv30: 74, ltv60: 102, ltv90: 124, ltv365: 195, repeatRate: 31 },
  { cohort: 'May 2024', customers: 3250, ltv30: 69, ltv60: 95, ltv90: 116, ltv365: 180, repeatRate: 29 },
  { cohort: 'Jun 2024', customers: 2980, ltv30: 73, ltv60: 101, ltv90: 122, ltv365: 188, repeatRate: 30 },
  { cohort: 'Jul 2024', customers: 2750, ltv30: 70, ltv60: 97, ltv90: 118, ltv365: null, repeatRate: 28 },
  { cohort: 'Aug 2024', customers: 3100, ltv30: 75, ltv60: 104, ltv90: 126, ltv365: null, repeatRate: 32 },
  { cohort: 'Sep 2024', customers: 3420, ltv30: 72, ltv60: 99, ltv90: null, ltv365: null, repeatRate: 29 },
  { cohort: 'Oct 2024', customers: 3680, ltv30: 76, ltv60: 105, ltv90: null, ltv365: null, repeatRate: 33 },
  { cohort: 'Nov 2024', customers: 4250, ltv30: 78, ltv60: null, ltv90: null, ltv365: null, repeatRate: 31 },
  { cohort: 'Dec 2024', customers: 4890, ltv30: 82, ltv60: null, ltv90: null, ltv365: null, repeatRate: 34 },
];

// Inventory at risk
export const stockoutRisk: InventoryItem[] = [
  { sku: 'WB-N95-100', name: 'N95 Respirator 100-Pack', daysOnHand: 8, quantity: 450, value: 13500, velocity: 56 },
  { sku: 'WB-SANI-32', name: 'Hand Sanitizer 32oz', daysOnHand: 12, quantity: 890, value: 7120, velocity: 74 },
  { sku: 'WB-GLOVE-M', name: 'Nitrile Gloves Medium', daysOnHand: 6, quantity: 320, value: 4800, velocity: 53 },
  { sku: 'WB-MASK-50', name: 'Surgical Mask 50-Pack', daysOnHand: 11, quantity: 620, value: 9300, velocity: 56 },
];

export const deadStock: InventoryItem[] = [
  { sku: 'WB-FACE-SHD', name: 'Face Shield (Discontinued)', daysOnHand: 245, quantity: 1200, value: 3600, velocity: 2 },
  { sku: 'WB-GOWN-L', name: 'Isolation Gown Large', daysOnHand: 156, quantity: 850, value: 8500, velocity: 5 },
  { sku: 'WB-THERM-V1', name: 'Thermometer V1 (Old Model)', daysOnHand: 198, quantity: 340, value: 5100, velocity: 1 },
];

// Top products
export const topProducts: ProductMetrics[] = [
  { sku: 'WB-N95-100', name: 'N95 Respirator 100-Pack', revenue: 156000, units: 5200, margin: 42, returnRate: 1.2 },
  { sku: 'WB-MASK-50', name: 'Surgical Mask 50-Pack', revenue: 134000, units: 8900, margin: 38, returnRate: 0.8 },
  { sku: 'WB-SANI-32', name: 'Hand Sanitizer 32oz', revenue: 98000, units: 12250, margin: 45, returnRate: 0.5 },
  { sku: 'WB-GLOVE-M', name: 'Nitrile Gloves Medium', revenue: 87000, units: 5800, margin: 35, returnRate: 1.5 },
  { sku: 'WB-TEST-RAP', name: 'Rapid Test Kit 2-Pack', revenue: 76000, units: 9500, margin: 52, returnRate: 2.1 },
  { sku: 'WB-THERM-IR', name: 'Infrared Thermometer', revenue: 68000, units: 2720, margin: 48, returnRate: 3.2 },
  { sku: 'WB-KIT-FIRST', name: 'First Aid Kit Complete', revenue: 54000, units: 1800, margin: 41, returnRate: 1.8 },
  { sku: 'WB-OXI-PULSE', name: 'Pulse Oximeter', revenue: 45000, units: 1500, margin: 55, returnRate: 4.5 },
];

// Main metrics object
export const wellBeforeMetrics: WellBeforeMetrics = {
  revenue: {
    today: {
      current: 31245,
      previous: 28890,
      change: 2355,
      changePercent: 8.15,
      trend: 'up',
      status: 'healthy',
    },
    mtd: {
      current: 847320,
      previous: 798450,
      change: 48870,
      changePercent: 6.12,
      trend: 'up',
      status: 'healthy',
    },
    ytd: {
      current: 9847000,
      previous: 8234000,
      change: 1613000,
      changePercent: 19.59,
      trend: 'up',
      status: 'healthy',
    },
    byChannel: {
      shopify: 658900,
      amazon: 124500,
      wholesale: 48200,
      subscriptions: 15720,
    },
    trend: generateTrendData(30, 27500, 0.18),
  },
  orders: {
    today: {
      current: 462,
      previous: 428,
      change: 34,
      changePercent: 7.94,
      trend: 'up',
      status: 'healthy',
    },
    mtd: {
      current: 12458,
      previous: 11890,
      change: 568,
      changePercent: 4.78,
      trend: 'up',
      status: 'healthy',
    },
    averageValue: {
      current: 67.64,
      previous: 67.12,
      change: 0.52,
      changePercent: 0.77,
      trend: 'up',
      status: 'healthy',
    },
    newVsReturning: { new: 68, returning: 32 },
  },
  marketing: {
    spend: {
      today: {
        current: 2850,
        previous: 2720,
        change: 130,
        changePercent: 4.78,
        trend: 'up',
        status: 'healthy',
      },
      mtd: {
        current: 81000,
        previous: 76500,
        change: 4500,
        changePercent: 5.88,
        trend: 'up',
        status: 'healthy',
      },
      budget: 95000,
      pacing: 85.26,
    },
    cac: {
      blended: {
        current: 18.42,
        previous: 16.85,
        change: 1.57,
        changePercent: 9.32,
        trend: 'up',
        status: 'warning', // CAC rising is concerning
      },
      byChannel: {
        meta: 22.67,
        google: 23.11,
        email: 2.33,
        organic: 0,
      },
    },
    roas: {
      blended: {
        current: 3.24,
        previous: 3.45,
        change: -0.21,
        changePercent: -6.09,
        trend: 'down',
        status: 'warning',
      },
      byChannel: {
        meta: 3.0,
        google: 3.0,
        email: 30.0,
      },
    },
    channelPerformance,
  },
  customers: {
    ltv: {
      current: 142,
      previous: 135,
      change: 7,
      changePercent: 5.19,
      trend: 'up',
      status: 'healthy',
    },
    ltvCacRatio: {
      current: 7.71,
      previous: 8.01,
      change: -0.3,
      changePercent: -3.75,
      trend: 'down',
      status: 'healthy', // Still above 3:1 target
    },
    repeatRate: {
      current: 31.2,
      previous: 29.8,
      change: 1.4,
      changePercent: 4.70,
      trend: 'up',
      status: 'healthy',
    },
    churnRisk: 847, // customers who haven't purchased in 90+ days
    cohorts: cohortData,
  },
  inventory: {
    totalValue: 485000,
    stockoutRisk,
    deadStock,
    topProducts,
  },
  fulfillment: {
    shippedToday: {
      current: 448,
      previous: 412,
      change: 36,
      changePercent: 8.74,
      trend: 'up',
      status: 'healthy',
    },
    onTimeRate: {
      current: 96.8,
      previous: 97.2,
      change: -0.4,
      changePercent: -0.41,
      trend: 'down',
      status: 'healthy',
    },
    avgShipTime: {
      current: 1.4,
      previous: 1.3,
      change: 0.1,
      changePercent: 7.69,
      trend: 'up',
      status: 'healthy',
    },
    costPerOrder: {
      current: 4.85,
      previous: 4.72,
      change: 0.13,
      changePercent: 2.75,
      trend: 'up',
      status: 'healthy',
    },
  },
  profitability: {
    grossMargin: {
      current: 42.5,
      previous: 43.2,
      change: -0.7,
      changePercent: -1.62,
      trend: 'down',
      status: 'warning',
    },
    contributionMargin: {
      current: 28.4,
      previous: 29.1,
      change: -0.7,
      changePercent: -2.41,
      trend: 'down',
      status: 'warning',
    },
    netProfit: {
      current: 124500,
      previous: 118200,
      change: 6300,
      changePercent: 5.33,
      trend: 'up',
      status: 'healthy',
    },
    operatingExpenseRatio: {
      current: 14.1,
      previous: 14.5,
      change: -0.4,
      changePercent: -2.76,
      trend: 'down',
      status: 'healthy',
    },
    cashPosition: 892000,
    runway: 18,
  },
};

// Weekly comparison data
export const weeklyComparison = {
  thisWeek: {
    revenue: 195420,
    orders: 2876,
    aov: 67.94,
    adSpend: 19800,
    newCustomers: 2145,
  },
  lastWeek: {
    revenue: 187650,
    orders: 2798,
    aov: 67.07,
    adSpend: 18950,
    newCustomers: 2012,
  },
  lastYear: {
    revenue: 162300,
    orders: 2456,
    aov: 66.08,
    adSpend: 16200,
    newCustomers: 1845,
  },
};

// Monthly targets and progress
export const monthlyTargets = {
  revenue: { target: 920000, current: 847320, percentComplete: 92.1 },
  orders: { target: 13500, current: 12458, percentComplete: 92.3 },
  newCustomers: { target: 4200, current: 3890, percentComplete: 92.6 },
  grossMargin: { target: 44, current: 42.5, percentComplete: 96.6 },
  cac: { target: 18, current: 18.42, percentComplete: 97.7 }, // Lower is better
};

// Cash Flow & Treasury - THE CEO'S DAILY PULSE
export const cashFlowMetrics = {
  // Current Position
  currentCash: 892000,
  creditAvailable: 250000,
  totalLiquidity: 1142000, // cash + credit
  
  // Weekly Forecast
  weeklyForecast: [
    { week: 'This Week', inflow: 195000, outflow: 142000, netCash: 53000, endingCash: 945000 },
    { week: 'Week 2', inflow: 188000, outflow: 168000, netCash: 20000, endingCash: 965000 },
    { week: 'Week 3', inflow: 192000, outflow: 155000, netCash: 37000, endingCash: 1002000 },
    { week: 'Week 4', inflow: 185000, outflow: 198000, netCash: -13000, endingCash: 989000 }, // Inventory reorder
  ],
  
  // Daily Cash Position (last 14 days)
  cashTrend: Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const baseValue = 850000 + (i * 3000) + (Math.random() - 0.5) * 25000;
    return {
      date: date.toISOString().split('T')[0],
      value: Math.round(baseValue),
    };
  }),
  
  // Accounts Receivable
  accountsReceivable: {
    total: 124500,
    current: 78000,      // 0-30 days
    days30to60: 32000,
    days60to90: 9500,
    over90: 5000,        // At risk
  },
  
  // Accounts Payable  
  accountsPayable: {
    total: 185000,
    dueThisWeek: 42000,
    dueNextWeek: 68000,
    due30Days: 75000,
  },
  
  // Upcoming Major Expenses
  upcomingExpenses: [
    { name: 'Inventory Reorder (N95s)', amount: 85000, dueDate: '2026-02-10', category: 'inventory' },
    { name: 'Payroll', amount: 125000, dueDate: '2026-02-15', category: 'payroll' },
    { name: 'Meta Ads (Weekly)', amount: 12000, dueDate: '2026-02-07', category: 'marketing' },
    { name: 'Warehouse Rent', amount: 28000, dueDate: '2026-02-01', category: 'operations' },
    { name: 'Insurance Premium', amount: 8500, dueDate: '2026-02-20', category: 'operations' },
  ],
  
  // Key Metrics
  burnRate: 385000, // Monthly
  runway: 23, // Months at current burn
  daysToPayroll: 12,
  workingCapital: 892000 + 124500 - 185000, // Cash + AR - AP
  
  // Cash Conversion Cycle
  cashConversionCycle: {
    dso: 18, // Days Sales Outstanding
    dio: 45, // Days Inventory Outstanding
    dpo: 32, // Days Payables Outstanding
    ccc: 31, // DSO + DIO - DPO
  },
  
  // Status
  status: 'healthy' as const, // 'critical' | 'warning' | 'healthy'
  statusMessage: 'Strong liquidity with 23-month runway. Watch Week 4 inventory reorder.',
};
