import { useState, useEffect } from 'react';

/**
 * localStorage を使用した状態管理フック
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // 初期値を取得する関数
  const getStoredValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // 値を設定する関数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 関数の場合は現在の値を渡して実行
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // localStorageに保存
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // コンポーネントマウント時にlocalStorageから値を読み込み
  useEffect(() => {
    setStoredValue(getStoredValue());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue, setValue];
};

/**
 * localStorage から指定したキーの値を削除
 */
export const removeFromLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }
};

/**
 * localStorage をクリア
 */
export const clearLocalStorage = (): void => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

/**
 * localStorage の使用容量を取得（概算）
 */
export const getLocalStorageSize = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  let total = 0;
  try {
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        total += window.localStorage[key].length + key.length;
      }
    }
  } catch (error) {
    console.error('Error calculating localStorage size:', error);
  }
  
  return total;
};