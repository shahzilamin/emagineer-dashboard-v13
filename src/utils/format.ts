// Formatting utilities for the dashboard

export const formatCurrency = (value: number, compact = false): string => {
  if (compact && Math.abs(value) >= 1000000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
};

export const formatNumber = (value: number, compact = false): string => {
  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
};

export const formatPercent = (value: number, decimals = 1): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatPercentPlain = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatChange = (value: number, isPercent = false): string => {
  const prefix = value >= 0 ? '+' : '';
  if (isPercent) {
    return `${prefix}${value.toFixed(1)}%`;
  }
  return `${prefix}${formatNumber(value)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export const getDaysRemaining = (daysOnHand: number): string => {
  if (daysOnHand <= 7) return `${daysOnHand} days - CRITICAL`;
  if (daysOnHand <= 14) return `${daysOnHand} days - LOW`;
  return `${daysOnHand} days`;
};
