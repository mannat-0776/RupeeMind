import { CategoryType } from '../types';

export const formatCurrency = (amount: number, symbol: string = '₹'): string => {
  if (isNaN(amount)) return `${symbol}0`;
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Indian currency system formatting (1,00,000)
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
};

export const formatLakhs = (amount: number, symbol: string = '₹'): string => {
  if (amount >= 10000000) {
    return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(2)} Lakh`;
  }
  return formatCurrency(amount, symbol);
};

export const formatDate = (dateString: string): string => {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
};

export const getCategoryColor = (category: CategoryType): string => {
  switch (category) {
    case 'Food & Dining':
      return '#FF6B6B';
    case 'Transport':
      return '#4D96FF';
    case 'Shopping':
      return '#FFB800';
    case 'Bills':
      return '#9B51E0';
    case 'Entertainment':
      return '#FF007A';
    case 'Healthcare':
      return '#00C9A7';
    case 'Salary':
      return '#10B981';
    case 'Investment':
      return '#2F66F6';
    default:
      return '#64748B';
  }
};
