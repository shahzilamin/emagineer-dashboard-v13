import type {
  D2CBuildersMetrics,
  TimeSeriesPoint,
  ClientMetrics,
} from '../types';

// Helper to generate trend data
const generateTrendData = (days: number, baseValue: number, volatility: number = 0.12): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  let value = baseValue;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const change = (Math.random() - 0.45) * volatility * value;
    value = Math.max(value + change, baseValue * 0.75);

    // Weekday variance - 3PL busier mid-week
    const dayOfWeek = date.getDay();
    let dayMultiplier = 1;
    if (dayOfWeek === 0) dayMultiplier = 0.3; // Sunday
    if (dayOfWeek === 6) dayMultiplier = 0.5; // Saturday
    if (dayOfWeek === 2 || dayOfWeek === 3) dayMultiplier = 1.15; // Tue/Wed peak

    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * dayMultiplier),
    });
  }

  return data;
};

// Client data - 12 active clients for a $2M 3PL
export const clients: ClientMetrics[] = [
  {
    id: 'CL001',
    name: 'FitGear Pro',
    revenue: 38500,
    orders: 2850,
    margin: 28.5,
    trend: 'up',
    riskLevel: 'healthy',
    laborHours: 285,
    pallets: 42,
  },
  {
    id: 'CL002',
    name: 'Wellness Direct',
    revenue: 32400,
    orders: 2420,
    margin: 31.2,
    trend: 'up',
    riskLevel: 'healthy',
    laborHours: 218,
    pallets: 38,
  },
  {
    id: 'CL003',
    name: 'Pet Paradise',
    revenue: 28900,
    orders: 1890,
    margin: 26.8,
    trend: 'flat',
    riskLevel: 'healthy',
    laborHours: 198,
    pallets: 56,
  },
  {
    id: 'CL004',
    name: 'TechAccessories',
    revenue: 24200,
    orders: 3200,
    margin: 22.4,
    trend: 'up',
    riskLevel: 'warning',
    laborHours: 320,
    pallets: 18,
  },
  {
    id: 'CL005',
    name: 'BeautyBox Co',
    revenue: 21800,
    orders: 1650,
    margin: 34.5,
    trend: 'up',
    riskLevel: 'healthy',
    laborHours: 132,
    pallets: 24,
  },
  {
    id: 'CL006',
    name: 'HomeEssentials',
    revenue: 18500,
    orders: 980,
    margin: 29.8,
    trend: 'down',
    riskLevel: 'warning',
    laborHours: 112,
    pallets: 35,
  },
  {
    id: 'CL007',
    name: 'ActiveWear Plus',
    revenue: 15200,
    orders: 1120,
    margin: 25.2,
    trend: 'flat',
    riskLevel: 'healthy',
    laborHours: 134,
    pallets: 22,
  },
  {
    id: 'CL008',
    name: 'GourmetSnacks',
    revenue: 12800,
    orders: 890,
    margin: 18.5,
    trend: 'down',
    riskLevel: 'critical',
    laborHours: 156,
    pallets: 28,
  },
  {
    id: 'CL009',
    name: 'BabyBoutique',
    revenue: 11500,
    orders: 720,
    margin: 32.1,
    trend: 'up',
    riskLevel: 'healthy',
    laborHours: 86,
    pallets: 16,
  },
  {
    id: 'CL010',
    name: 'OutdoorGear',
    revenue: 9800,
    orders: 540,
    margin: 27.4,
    trend: 'flat',
    riskLevel: 'healthy',
    laborHours: 72,
    pallets: 32,
  },
  {
    id: 'CL011',
    name: 'VitaSupply',
    revenue: 8200,
    orders: 680,
    margin: 24.8,
    trend: 'up',
    riskLevel: 'healthy',
    laborHours: 68,
    pallets: 14,
  },
  {
    id: 'CL012',
    name: 'CleanLiving',
    revenue: 6400,
    orders: 420,
    margin: 21.2,
    trend: 'down',
    riskLevel: 'warning',
    laborHours: 58,
    pallets: 12,
  },
];

// Client profitability sorted
export const clientsByProfitability = [...clients].sort((a, b) => b.margin - a.margin);

// Clients at churn risk (declining volume or margin)
export const churnRiskClients = clients.filter(
  (c) => c.riskLevel === 'warning' || c.riskLevel === 'critical' || c.trend === 'down'
);

// Storage breakdown by client
export const storageByClient = clients.map((c) => ({
  client: c.name,
  pallets: c.pallets || 0,
  revenue: Math.round((c.pallets || 0) * 85), // $85/pallet/month avg
}));

// Main metrics object
export const d2cBuildersMetrics: D2CBuildersMetrics = {
  revenue: {
    today: {
      current: 8420,
      previous: 7890,
      change: 530,
      changePercent: 6.72,
      trend: 'up',
      status: 'healthy',
    },
    mtd: {
      current: 168500,
      previous: 162300,
      change: 6200,
      changePercent: 3.82,
      trend: 'up',
      status: 'healthy',
    },
    ytd: {
      current: 1985000,
      previous: 1720000,
      change: 265000,
      changePercent: 15.41,
      trend: 'up',
      status: 'healthy',
    },
    byStream: {
      shipping: 72400, // Shipping markup - biggest revenue driver
      pickPack: 58200, // Pick & pack fees
      storage: 28700, // Storage fees
      hourly: 9200, // Hourly project work
    },
    trend: generateTrendData(30, 5600, 0.15),
  },
  clients: {
    active: 12,
    totalRevenue: clients,
    profitability: clientsByProfitability,
    churnRisk: churnRiskClients,
    concentration: 22.9, // Top client is 22.9% of revenue
  },
  operations: {
    ordersToday: {
      current: 842,
      previous: 798,
      change: 44,
      changePercent: 5.51,
      trend: 'up',
      status: 'healthy',
    },
    ordersMtd: {
      current: 17360,
      previous: 16890,
      change: 470,
      changePercent: 2.78,
      trend: 'up',
      status: 'healthy',
    },
    ordersPerLaborHour: {
      current: 12.4,
      previous: 11.8,
      change: 0.6,
      changePercent: 5.08,
      trend: 'up',
      status: 'healthy',
    },
    errorRate: {
      current: 0.42,
      previous: 0.38,
      change: 0.04,
      changePercent: 10.53,
      trend: 'up',
      status: 'warning',
    },
    onTimeRate: {
      current: 97.2,
      previous: 97.8,
      change: -0.6,
      changePercent: -0.61,
      trend: 'down',
      status: 'healthy',
    },
    avgShipTime: {
      current: 2.1,
      previous: 1.9,
      change: 0.2,
      changePercent: 10.53,
      trend: 'up',
      status: 'warning',
    },
  },
  warehouse: {
    utilization: {
      current: 78.5,
      previous: 74.2,
      change: 4.3,
      changePercent: 5.80,
      trend: 'up',
      status: 'healthy',
    },
    revenuePerSqFt: {
      current: 8.42,
      previous: 8.15,
      change: 0.27,
      changePercent: 3.31,
      trend: 'up',
      status: 'healthy',
    },
    palletsStored: 337,
    storageByClient,
  },
  costs: {
    laborCost: {
      current: 62400,
      previous: 58900,
      change: 3500,
      changePercent: 5.94,
      trend: 'up',
      status: 'warning',
    },
    laborCostPerOrder: {
      current: 3.59,
      previous: 3.48,
      change: 0.11,
      changePercent: 3.16,
      trend: 'up',
      status: 'healthy',
    },
    shippingMargin: {
      current: 18.2,
      previous: 19.1,
      change: -0.9,
      changePercent: -4.71,
      trend: 'down',
      status: 'warning',
    },
    overhead: 24500,
    profitMarginByClient: clientsByProfitability,
  },
  profitability: {
    grossMargin: {
      current: 26.8,
      previous: 27.5,
      change: -0.7,
      changePercent: -2.55,
      trend: 'down',
      status: 'warning',
    },
    netProfit: {
      current: 28400,
      previous: 26800,
      change: 1600,
      changePercent: 5.97,
      trend: 'up',
      status: 'healthy',
    },
    ebitda: {
      current: 32100,
      previous: 30200,
      change: 1900,
      changePercent: 6.29,
      trend: 'up',
      status: 'healthy',
    },
  },
};

// Weekly operations data
export const weeklyOperations = {
  mon: { orders: 892, laborHours: 72, errors: 3 },
  tue: { orders: 1024, laborHours: 84, errors: 5 },
  wed: { orders: 1156, laborHours: 92, errors: 4 },
  thu: { orders: 1089, laborHours: 88, errors: 6 },
  fri: { orders: 945, laborHours: 76, errors: 3 },
  sat: { orders: 412, laborHours: 32, errors: 1 },
  sun: { orders: 124, laborHours: 8, errors: 0 },
};

// Revenue by stream trend (last 6 months)
export const revenueByStreamTrend = [
  { month: 'Aug', shipping: 68200, pickPack: 54800, storage: 26400, hourly: 8100 },
  { month: 'Sep', shipping: 70100, pickPack: 55900, storage: 27100, hourly: 7800 },
  { month: 'Oct', shipping: 71800, pickPack: 57200, storage: 27800, hourly: 8500 },
  { month: 'Nov', shipping: 74500, pickPack: 59800, storage: 28200, hourly: 9800 },
  { month: 'Dec', shipping: 78200, pickPack: 62400, storage: 28500, hourly: 11200 },
  { month: 'Jan', shipping: 72400, pickPack: 58200, storage: 28700, hourly: 9200 },
];

// Monthly targets
export const monthlyTargets = {
  revenue: { target: 180000, current: 168500, percentComplete: 93.6 },
  orders: { target: 18500, current: 17360, percentComplete: 93.8 },
  onTimeRate: { target: 98, current: 97.2, percentComplete: 99.2 },
  errorRate: { target: 0.3, current: 0.42, percentComplete: 71.4 },
  grossMargin: { target: 28, current: 26.8, percentComplete: 95.7 },
};

// Labor efficiency by day of week
export const laborEfficiencyByDay = [
  { day: 'Mon', ordersPerHour: 12.4, target: 12.0 },
  { day: 'Tue', ordersPerHour: 12.2, target: 12.0 },
  { day: 'Wed', ordersPerHour: 12.6, target: 12.0 },
  { day: 'Thu', ordersPerHour: 12.4, target: 12.0 },
  { day: 'Fri', ordersPerHour: 12.4, target: 12.0 },
  { day: 'Sat', ordersPerHour: 12.9, target: 12.0 },
  { day: 'Sun', ordersPerHour: 15.5, target: 12.0 },
];

// New client pipeline
export const clientPipeline = [
  { name: 'HealthyHarvest', status: 'negotiating', estimatedRevenue: 15000, probability: 75 },
  { name: 'ModernHome', status: 'proposal', estimatedRevenue: 22000, probability: 40 },
  { name: 'SportsNutrition', status: 'discovery', estimatedRevenue: 28000, probability: 20 },
];
