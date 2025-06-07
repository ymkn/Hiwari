import dayjs from 'dayjs';
import { Item, ItemFormData } from '@/types';

/**
 * 支払間隔の日数を取得
 */
export const getPaymentIntervalDays = (interval: 'once' | 'monthly' | 'yearly'): number => {
  switch (interval) {
    case 'once':
      return 0; // 一括の場合は特別扱い
    case 'monthly':
      return 30;
    case 'yearly':
      return 365;
    default:
      return 0;
  }
};

/**
 * 日付範囲の日数を計算
 */
export const getDaysBetweenDates = (startDate: string, endDate: string): number => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, 'day') + 1; // 終了日を含むため+1
};

/**
 * 1日あたりのコストを計算
 */
export const calculateCostPerDay = (data: ItemFormData): number => {
  const usageDays = getDaysBetweenDates(data.usagePeriod.startDate, data.usagePeriod.endDate);
  
  if (usageDays <= 0) {
    return 0;
  }

  // 一括支払いの場合は常に単純計算
  if (data.paymentInterval === 'once') {
    return data.price / usageDays;
  }

  // 定期支払い（毎月・毎年）の場合
  const intervalDays = getPaymentIntervalDays(data.paymentInterval);
  let paymentCount: number;

  if (data.paymentPeriod) {
    // 支払期間が指定されている場合
    const paymentDays = getDaysBetweenDates(data.paymentPeriod.startDate, data.paymentPeriod.endDate);
    paymentCount = Math.ceil(paymentDays / intervalDays);
  } else {
    // 支払期間が指定されていない場合は想定利用期間で計算
    paymentCount = Math.ceil(usageDays / intervalDays);
  }

  const totalCost = data.price * paymentCount;
  return totalCost / usageDays;
};

/**
 * 1ヶ月あたりのコストを計算
 */
export const calculateCostPerMonth = (item: Pick<Item, 'price' | 'paymentInterval' | 'costPerDay'>): number => {
  // 定期支払いの場合は支払間隔を考慮
  if (item.paymentInterval === 'monthly') {
    return item.price; // 月額そのまま
  } else if (item.paymentInterval === 'yearly') {
    return item.price / 12; // 年額を12で割る
  } else {
    // 一括支払いの場合は1日あたりコスト × 30日
    return item.costPerDay * 30;
  }
};

/**
 * 1年あたりのコストを計算
 */
export const calculateCostPerYear = (item: Pick<Item, 'price' | 'paymentInterval' | 'costPerDay'>): number => {
  // 定期支払いの場合は支払間隔を考慮
  if (item.paymentInterval === 'monthly') {
    return item.price * 12; // 月額 × 12ヶ月
  } else if (item.paymentInterval === 'yearly') {
    return item.price; // 年額そのまま
  } else {
    // 一括支払いの場合は1日あたりコスト × 365日
    return item.costPerDay * 365;
  }
};

/**
 * アイテムデータからItemオブジェクトを作成
 */
export const createItemFromFormData = (data: ItemFormData): Omit<Item, 'id' | 'createdAt' | 'updatedAt'> => {
  const costPerDay = calculateCostPerDay(data);
  
  return {
    name: data.name,
    price: data.price,
    paymentInterval: data.paymentInterval,
    paymentPeriod: data.paymentPeriod,
    usagePeriod: data.usagePeriod,
    category: data.category,
    costPerDay
  };
};

/**
 * 金額をフォーマット（カンマ区切り）
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(amount));
};

/**
 * 金額を小数点2桁でフォーマット
 */
export const formatCurrencyDetailed = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * 1日あたりのコスト用フォーマット（四捨五入）
 */
export const formatDailyCost = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(amount));
};

/**
 * 1ヶ月・1年あたりのコストを計算
 */
export const calculateMonthlyAndYearlyCosts = (item: Item): { monthlyAmount: number; yearlyAmount: number } => {
  return {
    monthlyAmount: calculateCostPerMonth(item),
    yearlyAmount: calculateCostPerYear(item)
  };
};