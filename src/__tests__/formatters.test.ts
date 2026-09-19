import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatLakhs,
  formatDate,
  getCategoryColor,
} from '../utils/formatters';

describe('Formatters Utility Test Suite', () => {
  describe('formatCurrency', () => {
    it('formats standard integer numbers into Indian Rupee locale', () => {
      const formatted = formatCurrency(5000);
      expect(formatted).toContain('5,000');
      expect(formatted).toContain('₹');
    });

    it('formats lakhs correctly in Indian number format (e.g., 1,50,000)', () => {
      const formatted = formatCurrency(150000);
      expect(formatted).toContain('1,50,000');
    });

    it('handles 0 and negative values safely', () => {
      expect(formatCurrency(0)).toContain('0');
      expect(formatCurrency(-500)).toContain('500');
    });
  });

  describe('formatLakhs', () => {
    it('formats values over 1 Crore into Cr', () => {
      expect(formatLakhs(15000000)).toBe('₹1.50 Cr');
    });

    it('formats values over 1 Lakh into Lakh', () => {
      expect(formatLakhs(450000)).toBe('₹4.50 Lakh');
    });

    it('formats small values using formatCurrency fallback', () => {
      expect(formatLakhs(4500)).toContain('4,500');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date string into readable Indian standard format', () => {
      const formatted = formatDate('2026-03-15T10:30:00Z');
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });

    it('formats standard YYYY-MM-DD string', () => {
      const formatted = formatDate('2026-04-01');
      expect(formatted).toContain('2026');
    });
  });

  describe('getCategoryColor', () => {
    it('returns expected distinct HEX color codes for known categories', () => {
      expect(getCategoryColor('Food & Dining')).toBe('#FF6B6B');
      expect(getCategoryColor('Transport')).toBe('#4D96FF');
      expect(getCategoryColor('Shopping')).toBe('#FFB800');
      expect(getCategoryColor('Bills')).toBe('#9B51E0');
      expect(getCategoryColor('Salary')).toBe('#10B981');
      expect(getCategoryColor('Investment')).toBe('#2F66F6');
    });

    it('returns default fallback color for undefined or other category', () => {
      expect(getCategoryColor('Others')).toBe('#64748B');
      // @ts-expect-error test unknown string
      expect(getCategoryColor('RandomUnknown')).toBe('#64748B');
    });
  });
});
