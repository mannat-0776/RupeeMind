import { SmsParseResult, CategoryType, TransactionType, PaymentMethod } from '../types';

/**
 * Enterprise Rule Engine for Indian Banking SMS and UPI notifications.
 * Supports: HDFC, SBI, ICICI, Axis, Kotak, PNB, UPI, Paytm, PhonePe, and GPay formats.
 */
export function parseIndianBankSms(smsText: string): SmsParseResult {
  const text = smsText.trim();
  let type: TransactionType = 'expense';
  let amount = 0;
  let merchant = 'Merchant';
  let category: CategoryType = 'Shopping';
  let bankName = 'Bank / UPI';
  let last4 = '';
  let paymentMethod: PaymentMethod = 'UPI';
  let confidence = 0.88;
  let availableBalance: number | null = null;
  let isRecurring = false;

  // 1. Detect Transaction Type (Credit vs Debit)
  const isCredit = /(credited|deposited|received|cashback|refund|salary)/i.test(text) && !/(debited.*reversal)/i.test(text);
  if (isCredit) {
    type = 'income';
    category = 'Salary';
  } else {
    type = 'expense';
  }

  // 2. Extract Amount
  // Matches Rs. 2,450.00 / INR 500 / Rs 1,25,000 / ₹499.50
  const amountMatch = text.match(/(?:Rs\.?|INR|₹|\bRs\b)\s*([\d,]+(?:\.\d{1,2})?)/i) ||
                      text.match(/(?:paid|spent|sent|credited|debited)\s+(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // 3. Extract Available Balance if present
  const balMatch = text.match(/(?:Avail(?:able)?\s*Bal(?:ance)?|Bal(?:ance)?|Avl\s*Lmt)\s*(?:is|:)?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (balMatch && balMatch[1]) {
    availableBalance = parseFloat(balMatch[1].replace(/,/g, ''));
  }

  // 4. Extract Card/Account Last 4 digits
  const last4Match = text.match(/(?:a\/c|acct|account|card|xx|ending with)\s*(?:no\.?)?\s*(?:x+|\*+)?\s*(\d{4})/i) ||
                     text.match(/(?:x+|\*+)(\d{4})/i);
  if (last4Match && last4Match[1]) {
    last4 = last4Match[1];
  }

  // 5. Detect Bank / Provider & Payment Method
  if (/phonepe/i.test(text)) {
    bankName = 'PhonePe';
    paymentMethod = 'UPI';
    confidence += 0.06;
  } else if (/paytm/i.test(text)) {
    bankName = 'Paytm Payments Bank';
    paymentMethod = 'Wallet';
    confidence += 0.06;
  } else if (/gpay|google\s*pay/i.test(text)) {
    bankName = 'Google Pay';
    paymentMethod = 'UPI';
    confidence += 0.06;
  } else if (/hdfc/i.test(text)) {
    bankName = 'HDFC Bank';
    paymentMethod = /credit\s*card/i.test(text) ? 'Credit Card' : /debit\s*card/i.test(text) ? 'Debit Card' : 'UPI';
    confidence += 0.05;
  } else if (/sbi|state\s*bank/i.test(text)) {
    bankName = 'SBI';
    paymentMethod = /credit\s*card|sbi\s*card/i.test(text) ? 'Credit Card' : 'Debit Card';
    confidence += 0.05;
  } else if (/icici/i.test(text)) {
    bankName = 'ICICI Bank';
    paymentMethod = /credit\s*card/i.test(text) ? 'Credit Card' : /debit\s*card/i.test(text) ? 'Debit Card' : 'UPI';
    confidence += 0.05;
  } else if (/axis/i.test(text)) {
    bankName = 'Axis Bank';
    paymentMethod = /credit\s*card/i.test(text) ? 'Credit Card' : 'UPI';
    confidence += 0.05;
  } else if (/kotak/i.test(text)) {
    bankName = 'Kotak Mahindra Bank';
    paymentMethod = 'UPI';
    confidence += 0.05;
  } else if (/pnb|punjab\s*national/i.test(text)) {
    bankName = 'PNB';
    paymentMethod = 'Debit Card';
    confidence += 0.05;
  } else if (/upi/i.test(text)) {
    bankName = 'UPI Network';
    paymentMethod = 'UPI';
    confidence += 0.04;
  }

  // 6. Extract Merchant & Categorize
  if (/zomato/i.test(text)) {
    merchant = 'Zomato';
    category = 'Food & Dining';
    confidence += 0.05;
  } else if (/swiggy/i.test(text)) {
    merchant = 'Swiggy';
    category = 'Food & Dining';
    confidence += 0.05;
  } else if (/blinkit|zepto|instamart|bigbasket/i.test(text)) {
    merchant = text.match(/(blinkit|zepto|instamart|bigbasket)/i)?.[0] || 'Grocery Delivery';
    category = 'Food & Dining';
    confidence += 0.05;
  } else if (/starbucks|cafe\s*coffee\s*day|blue\s*tokai|third\s*wave/i.test(text)) {
    merchant = 'Coffee & Cafe';
    category = 'Food & Dining';
  } else if (/uber|ola|rapido/i.test(text)) {
    merchant = /uber/i.test(text) ? 'Uber Rides' : /ola/i.test(text) ? 'Ola Cabs' : 'Rapido Auto';
    category = 'Transport';
    confidence += 0.05;
  } else if (/metro|irctc|makemytrip|indigo|air\s*india/i.test(text)) {
    merchant = 'Travel & Transit';
    category = 'Travel';
  } else if (/amazon|flipkart|myntra|ajio|zara|h&m/i.test(text)) {
    merchant = /amazon/i.test(text) ? 'Amazon India' : /flipkart/i.test(text) ? 'Flipkart' : 'Shopping';
    category = 'Shopping';
    confidence += 0.05;
  } else if (/bescom|tneb|electricity|airtel|jio|vi\b|broadband|water\s*board/i.test(text)) {
    merchant = 'Utility Bill / Telecom';
    category = 'Bills';
    confidence += 0.05;
  } else if (/netflix|spotify|prime|hotstar|youtube\s*premium|apple\.com/i.test(text)) {
    merchant = 'Digital Subscription';
    category = 'Entertainment';
    isRecurring = true;
    confidence += 0.05;
  } else if (/pvr|inox|cinepolis|bookmyshow/i.test(text)) {
    merchant = 'Movie & Entertainment';
    category = 'Entertainment';
  } else if (/apollo|pharmeasy|1mg|medplus|practo/i.test(text)) {
    merchant = 'Pharmacy & Healthcare';
    category = 'Healthcare';
  } else if (/zerodha|groww|kuvera|indmoney|angelone|upstox|mf\s*central/i.test(text)) {
    merchant = 'Mutual Fund / SIP Investment';
    category = 'Investment';
    confidence += 0.06;
  } else if (/salary|payroll|neft.*credit/i.test(text)) {
    merchant = 'Salary / Employer Payroll';
    category = 'Salary';
    type = 'income';
    confidence += 0.06;
  } else {
    // Dynamic Regex Merchant extraction (e.g. "spent at X on", "vpa X@", "to X on")
    const vpaMatch = text.match(/(?:to\s*VPA|to\s*UPI|vpa)\s*([a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+)/i);
    const toMatch = text.match(/(?:spent\s+at|paid\s+to|transferred\s+to|sent\s+to|at)\s+([A-Za-z0-9\s&'-]{3,25})(?:\s+on|\s+ref|\s+using|\s+avl|\.)/i);
    if (vpaMatch && vpaMatch[1]) {
      merchant = vpaMatch[1];
    } else if (toMatch && toMatch[1]) {
      merchant = toMatch[1].trim();
    } else {
      merchant = bankName + ' Transaction';
      confidence = Math.max(0.70, confidence - 0.15); // lower confidence when merchant couldn't be parsed directly
    }
  }

  // Cap confidence between 0.60 and 0.99
  const finalConfidence = Math.min(0.99, Math.max(0.60, Number(confidence.toFixed(2))));

  return {
    merchant,
    amount: amount || 0,
    category,
    type,
    bankName,
    last4,
    paymentMethod,
    confidence: finalConfidence,
    date: new Date().toISOString().split('T')[0],
    availableBalance,
    isRecurring,
  };
}
