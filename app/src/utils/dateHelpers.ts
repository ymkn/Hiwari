import dayjs from 'dayjs';

/**
 * 日付を YYYY-MM-DD 形式でフォーマット
 */
export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * 日付を表示用にフォーマット (YYYY年MM月DD日)
 */
export const formatDateDisplay = (date: string | Date): string => {
  return dayjs(date).format('YYYY年MM月DD日');
};

/**
 * 今日の日付を YYYY-MM-DD 形式で取得
 */
export const getTodayString = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

/**
 * 日付の妥当性をチェック
 */
export const isValidDate = (date: string): boolean => {
  return dayjs(date).isValid();
};

/**
 * 開始日が終了日より前かチェック
 */
export const isStartBeforeEnd = (startDate: string, endDate: string): boolean => {
  return dayjs(startDate).isBefore(dayjs(endDate)) || dayjs(startDate).isSame(dayjs(endDate));
};

/**
 * 2つの日付の差（日数）を計算
 */
export const getDaysDifference = (startDate: string, endDate: string): number => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, 'day') + 1; // 終了日を含むため+1
};

/**
 * 指定した日数後の日付を取得
 */
export const addDays = (date: string, days: number): string => {
  return dayjs(date).add(days, 'day').format('YYYY-MM-DD');
};

/**
 * 指定した月数後の日付を取得
 */
export const addMonths = (date: string, months: number): string => {
  return dayjs(date).add(months, 'month').format('YYYY-MM-DD');
};

/**
 * 指定した年数後の日付を取得
 */
export const addYears = (date: string, years: number): string => {
  return dayjs(date).add(years, 'year').format('YYYY-MM-DD');
};

/**
 * 日付範囲が有効かチェック
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }
  return isStartBeforeEnd(startDate, endDate);
};