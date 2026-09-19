import { describe, it, expect } from 'vitest';
import { parseIndianBankSms } from '../utils/smsParserEngine';

describe('Indian Banking SMS & UPI Parser Engine', () => {
  it('parses HDFC Bank Debit Card expense correctly', () => {
    const text = 'HDFC Bank: Rs.2,450.00 spent at ZOMATO BANGALORE on 14-Sep-26 using Debit Card XX5678. Avail Bal: Rs 84,200.';
    const result = parseIndianBankSms(text);

    expect(result.merchant).toBe('Zomato');
    expect(result.amount).toBe(2450);
    expect(result.category).toBe('Food & Dining');
    expect(result.type).toBe('expense');
    expect(result.bankName).toBe('HDFC Bank');
    expect(result.last4).toBe('5678');
    expect(result.paymentMethod).toBe('Debit Card');
    expect(result.availableBalance).toBe(84200);
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it('parses SBI Salary Credit correctly', () => {
    const text = 'SBI Card: Rs 125,000.00 credited to account XX4321 on 01-Sep-2026 by NEFT-TechCorp Payroll. Avl Bal: INR 1,84,500.';
    const result = parseIndianBankSms(text);

    expect(result.type).toBe('income');
    expect(result.amount).toBe(125000);
    expect(result.category).toBe('Salary');
    expect(result.bankName).toBe('SBI');
    expect(result.last4).toBe('4321');
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it('parses ICICI Bank Uber Ride correctly', () => {
    const text = 'ICICI Bank: INR 620.00 debited for UBER RIDES INDIA on 16-Sep-26. Avail balance: Rs 42,100.';
    const result = parseIndianBankSms(text);

    expect(result.merchant).toBe('Uber Rides');
    expect(result.amount).toBe(620);
    expect(result.category).toBe('Transport');
    expect(result.type).toBe('expense');
    expect(result.bankName).toBe('ICICI Bank');
    expect(result.availableBalance).toBe(42100);
  });

  it('parses Axis Bank PVR Cinemas ticket purchase', () => {
    const text = 'Axis Bank: Rs 1,499.00 spent on your Credit Card XX9012 at PVR CINEMAS BANGALORE on 15-Sep-26.';
    const result = parseIndianBankSms(text);

    expect(result.merchant).toBe('Movie & Entertainment');
    expect(result.amount).toBe(1499);
    expect(result.category).toBe('Entertainment');
    expect(result.bankName).toBe('Axis Bank');
    expect(result.last4).toBe('9012');
    expect(result.paymentMethod).toBe('Credit Card');
  });

  it('parses Kotak Mahindra Bank Swiggy UPI order', () => {
    const text = 'Kotak Bank: INR 850.00 paid to SWIGGY BANGALORE via UPI ref 498210398. Avl Bal: Rs 19,400.';
    const result = parseIndianBankSms(text);

    expect(result.merchant).toBe('Swiggy');
    expect(result.amount).toBe(850);
    expect(result.category).toBe('Food & Dining');
    expect(result.bankName).toBe('Kotak Mahindra Bank');
    expect(result.paymentMethod).toBe('UPI');
  });

  it('parses PNB BESCOM Electricity Bill payment', () => {
    const text = 'PNB: Rs 3,850.00 debited from A/c XX7890 towards BESCOM ELECTRICITY BILL on 12-Sep-26.';
    const result = parseIndianBankSms(text);

    expect(result.merchant).toBe('Utility Bill / Telecom');
    expect(result.amount).toBe(3850);
    expect(result.category).toBe('Bills');
    expect(result.bankName).toBe('PNB');
    expect(result.last4).toBe('7890');
  });

  it('parses Paytm Wallet payment', () => {
    const text = 'Paytm: Paid Rs 349.00 to BLUE TOKAI COFFEE ROASTERS using Paytm Wallet.';
    const result = parseIndianBankSms(text);

    expect(result.merchant).toBe('Coffee & Cafe');
    expect(result.amount).toBe(349);
    expect(result.category).toBe('Food & Dining');
    expect(result.bankName).toBe('Paytm Payments Bank');
    expect(result.paymentMethod).toBe('Wallet');
  });

  it('parses PhonePe UPI Transfer', () => {
    const text = 'PhonePe: Money transferred! Rs 1,200.00 sent to Apollo Pharmacy via UPI ID apollo@icici.';
    const result = parseIndianBankSms(text);

    expect(result.merchant).toBe('Pharmacy & Healthcare');
    expect(result.amount).toBe(1200);
    expect(result.category).toBe('Healthcare');
    expect(result.bankName).toBe('PhonePe');
    expect(result.paymentMethod).toBe('UPI');
  });

  it('parses Google Pay Amazon order', () => {
    const text = 'Google Pay: You paid Rs 4,800.00 to Amazon India for Order #408-98123-11 via UPI.';
    const result = parseIndianBankSms(text);

    expect(result.merchant).toBe('Amazon India');
    expect(result.amount).toBe(4800);
    expect(result.category).toBe('Shopping');
    expect(result.bankName).toBe('Google Pay');
  });

  it('parses Zerodha Mutual Fund auto-SIP UPI investment', () => {
    const text = 'UPI Alert: Rs 15,000.00 transferred to ZERODHA BROKING LTD for Auto-SIP mutual fund.';
    const result = parseIndianBankSms(text);

    expect(result.merchant).toBe('Mutual Fund / SIP Investment');
    expect(result.amount).toBe(15000);
    expect(result.category).toBe('Investment');
    expect(result.bankName).toBe('UPI Network');
  });
});
