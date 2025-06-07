import { useState, useCallback } from 'react';
import { Item, ItemFormData, SummaryData, CategorySummary } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { createItemFromFormData, calculateCostPerMonth, calculateCostPerYear } from '@/utils/calculations';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'ichinichi_items';

/**
 * アイテム管理のカスタムフック
 */
export const useItems = () => {
  const [items, setItems] = useLocalStorage<Item[]>(STORAGE_KEY, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 新しいアイテムを追加
   */
  const addItem = useCallback(async (data: ItemFormData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const newItemData = createItemFromFormData(data);
      const newItem: Item = {
        ...newItemData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setItems(prevItems => [...prevItems, newItem]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アイテムの追加に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setItems]);

  /**
   * アイテムを更新
   */
  const updateItem = useCallback(async (id: string, data: ItemFormData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedItemData = createItemFromFormData(data);
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { 
                ...item, 
                ...updatedItemData,
                updatedAt: new Date().toISOString() 
              }
            : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アイテムの更新に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setItems]);

  /**
   * アイテムを削除
   */
  const deleteItem = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アイテムの削除に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setItems]);

  /**
   * IDでアイテムを取得
   */
  const getItem = useCallback((id: string): Item | undefined => {
    return items.find(item => item.id === id);
  }, [items]);

  /**
   * 集計データを計算
   */
  const getSummaryData = useCallback((): SummaryData => {
    const totalCostPerDay = items.reduce((sum, item) => sum + item.costPerDay, 0);
    
    // 各アイテムの月額・年額を正しく計算してから合計
    const totalCostPerMonth = items.reduce((sum, item) => sum + calculateCostPerMonth(item), 0);
    const totalCostPerYear = items.reduce((sum, item) => sum + calculateCostPerYear(item), 0);
    
    // カテゴリ別集計
    const categoryMap = new Map<string, { items: Item[]; itemCount: number }>();
    
    items.forEach(item => {
      const category = item.category || '未分類';
      const existing = categoryMap.get(category) || { items: [], itemCount: 0 };
      categoryMap.set(category, {
        items: [...existing.items, item],
        itemCount: existing.itemCount + 1
      });
    });

    const categorySummary: CategorySummary[] = Array.from(categoryMap.entries())
      .map(([category, data]) => {
        const totalCostPerDay = data.items.reduce((sum, item) => sum + item.costPerDay, 0);
        const totalCostPerMonth = data.items.reduce((sum, item) => sum + calculateCostPerMonth(item), 0);
        const totalCostPerYear = data.items.reduce((sum, item) => sum + calculateCostPerYear(item), 0);
        
        return {
          category,
          totalCostPerDay,
          totalCostPerMonth,
          totalCostPerYear,
          itemCount: data.itemCount
        };
      })
      .sort((a, b) => b.totalCostPerDay - a.totalCostPerDay);

    return {
      totalCostPerDay,
      totalCostPerMonth,
      totalCostPerYear,
      categorySummary
    };
  }, [items]);

  /**
   * カテゴリでフィルタリング
   */
  const getItemsByCategory = useCallback((category?: string): Item[] => {
    if (!category) {
      return items;
    }
    return items.filter(item => item.category === category);
  }, [items]);

  /**
   * 全てのカテゴリを取得
   */
  const getAllCategories = useCallback((): string[] => {
    const categories = new Set<string>();
    items.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories).sort();
  }, [items]);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    getSummaryData,
    getItemsByCategory,
    getAllCategories,
    clearError
  };
};