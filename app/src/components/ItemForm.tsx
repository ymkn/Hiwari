'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  InputAdornment
} from '@mui/material';
import { ItemFormData } from '@/types';
import { isValidDateRange, getTodayString, addMonths, addYears } from '@/utils/dateHelpers';
import { calculateCostPerDay, formatCurrencyDetailed } from '@/utils/calculations';

interface ItemFormProps {
  initialData?: ItemFormData;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

/**
 * アイテム入力フォーム
 */
const ItemForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = '保存'
}: ItemFormProps) => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    price: 0,
    paymentInterval: 'once',
    usagePeriod: {
      startDate: getTodayString(),
      endDate: addYears(getTodayString(), 1)
    },
    category: ''
  });

  const [hasPaymentPeriod, setHasPaymentPeriod] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewCost, setPreviewCost] = useState<number>(0);

  // 初期データの設定
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setHasPaymentPeriod(!!initialData.paymentPeriod);
    }
  }, [initialData]);

  // コストプレビューの計算
  useEffect(() => {
    try {
      const cost = calculateCostPerDay(formData);
      setPreviewCost(cost);
    } catch (error) {
      setPreviewCost(0);
    }
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 名称の検証
    if (!formData.name.trim()) {
      newErrors.name = '名称は必須です';
    } else if (formData.name.length > 50) {
      newErrors.name = '名称は50文字以内で入力してください';
    }

    // 価格の検証
    if (formData.price <= 0) {
      newErrors.price = '価格は0より大きい値を入力してください';
    }

    // 使用期間の検証
    if (!isValidDateRange(formData.usagePeriod.startDate, formData.usagePeriod.endDate)) {
      newErrors.usagePeriod = '使用期間の日付が正しくありません';
    }

    // 支払期間の検証（設定されている場合）
    if (hasPaymentPeriod && formData.paymentPeriod) {
      if (!isValidDateRange(formData.paymentPeriod.startDate, formData.paymentPeriod.endDate)) {
        newErrors.paymentPeriod = '支払期間の日付が正しくありません';
      }
    }

    // 分類の検証
    if (formData.category && formData.category.length > 20) {
      newErrors.category = '分類は20文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: ItemFormData = {
      ...formData,
      paymentPeriod: hasPaymentPeriod ? formData.paymentPeriod : undefined
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: keyof ItemFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSelectChange = (field: keyof ItemFormData) => (
    e: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleDateChange = (
    period: 'usagePeriod' | 'paymentPeriod',
    dateType: 'startDate' | 'endDate'
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [period]: {
        ...prev[period]!,
        [dateType]: e.target.value
      }
    }));
  };

  const handlePaymentPeriodToggle = (checked: boolean) => {
    setHasPaymentPeriod(checked);
    if (checked && !formData.paymentPeriod) {
      setFormData(prev => ({
        ...prev,
        paymentPeriod: {
          startDate: prev.usagePeriod.startDate,
          endDate: prev.usagePeriod.endDate
        }
      }));
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 名称 */}
            <TextField
              label="名称"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name || '50文字以内で入力してください'}
              required
              fullWidth
              inputProps={{ maxLength: 50 }}
            />

            {/* 価格 */}
            <TextField
              label="取得価格"
              type="number"
              value={formData.price || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                price: parseFloat(e.target.value) || 0
              }))}
              error={!!errors.price}
              helperText={errors.price}
              required
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">¥</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 1 }}
            />

            {/* 支払間隔 */}
            <FormControl fullWidth required>
              <InputLabel>支払間隔</InputLabel>
              <Select
                value={formData.paymentInterval}
                onChange={handleSelectChange('paymentInterval')}
                label="支払間隔"
              >
                <MenuItem value="once">一括</MenuItem>
                <MenuItem value="monthly">毎月</MenuItem>
                <MenuItem value="yearly">毎年</MenuItem>
              </Select>
            </FormControl>

            {/* 支払期間の設定 */}
            <FormControlLabel
              control={
                <Switch
                  checked={hasPaymentPeriod}
                  onChange={(e) => handlePaymentPeriodToggle(e.target.checked)}
                />
              }
              label="支払期間を指定する"
            />

            {/* 支払期間 */}
            {hasPaymentPeriod && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  支払期間
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="開始日"
                    type="date"
                    value={formData.paymentPeriod?.startDate || ''}
                    onChange={handleDateChange('paymentPeriod', 'startDate')}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1, minWidth: 150 }}
                  />
                  <TextField
                    label="終了日"
                    type="date"
                    value={formData.paymentPeriod?.endDate || ''}
                    onChange={handleDateChange('paymentPeriod', 'endDate')}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1, minWidth: 150 }}
                  />
                </Box>
                {errors.paymentPeriod && (
                  <FormHelperText error>{errors.paymentPeriod}</FormHelperText>
                )}
              </Box>
            )}

            {/* 想定利用期間 */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                想定利用期間 *
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="開始日"
                  type="date"
                  value={formData.usagePeriod.startDate}
                  onChange={handleDateChange('usagePeriod', 'startDate')}
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ flex: 1, minWidth: 150 }}
                />
                <TextField
                  label="終了日"
                  type="date"
                  value={formData.usagePeriod.endDate}
                  onChange={handleDateChange('usagePeriod', 'endDate')}
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ flex: 1, minWidth: 150 }}
                />
              </Box>
              {errors.usagePeriod && (
                <FormHelperText error>{errors.usagePeriod}</FormHelperText>
              )}
            </Box>

            {/* 分類 */}
            <TextField
              label="分類"
              value={formData.category || ''}
              onChange={handleInputChange('category')}
              error={!!errors.category}
              helperText={errors.category || '20文字以内で入力してください（任意）'}
              fullWidth
              inputProps={{ maxLength: 20 }}
            />

            {/* コストプレビュー */}
            {previewCost > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  1日のコスト（プレビュー）
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrencyDetailed(previewCost)}
                </Typography>
              </Alert>
            )}

            {/* ボタン */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={onCancel} disabled={loading}>
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {submitLabel}
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ItemForm;