export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'AUD' | 'CAD';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = rate units of this currency
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.79 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUSD: 153.5 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 84.2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToUSD: 1.52 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateToUSD: 1.38 },
};

export function convertAmount(amountInUSD: number, targetCurrency: SupportedCurrency): string {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.USD;
  const converted = amountInUSD * config.rateToUSD;

  if (targetCurrency === 'JPY') {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${config.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function parseUsdAmount(str: string): number {
  if (!str) return 0;
  // Match first number or digits in string
  const clean = str.replace(/,/g, '');
  const match = clean.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}
