'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Item, ItemFormData, SummaryData } from '@/types';
import { useItems } from '@/hooks/useItems';

interface DataContextType {
  items: Item[];
  loading: boolean;
  error: string | null;
  addItem: (data: ItemFormData) => Promise<void>;
  updateItem: (id: string, data: ItemFormData) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItem: (id: string) => Item | undefined;
  getSummaryData: () => SummaryData;
  getItemsByCategory: (category?: string) => Item[];
  getAllCategories: () => string[];
  clearError: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

/**
 * データコンテキストプロバイダー
 */
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const itemsHook = useItems();

  const value: DataContextType = {
    ...itemsHook
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * データコンテキストを使用するフック
 */
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;