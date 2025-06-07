export interface Item {
  id: string;
  name: string;
  price: number;
  paymentInterval: 'once' | 'monthly' | 'yearly';
  paymentPeriod?: {
    startDate: string;
    endDate: string;
  };
  usagePeriod: {
    startDate: string;
    endDate: string;
  };
  category?: string;
  costPerDay: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFormData {
  name: string;
  price: number;
  paymentInterval: 'once' | 'monthly' | 'yearly';
  paymentPeriod?: {
    startDate: string;
    endDate: string;
  };
  usagePeriod: {
    startDate: string;
    endDate: string;
  };
  category?: string;
}

export interface SummaryData {
  totalCostPerDay: number;
  totalCostPerMonth: number;
  totalCostPerYear: number;
  categorySummary: CategorySummary[];
}

export interface CategorySummary {
  category: string;
  totalCostPerDay: number;
  totalCostPerMonth: number;
  totalCostPerYear: number;
  itemCount: number;
}

export type DisplayPeriod = 'day' | 'month' | 'year';