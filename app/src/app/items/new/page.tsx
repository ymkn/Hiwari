'use client';

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { ItemFormData } from '@/types';
import ItemForm from '@/components/ItemForm';

/**
 * データ登録画面
 */
export default function NewItemPage() {
  const router = useRouter();
  const { addItem, error, clearError } = useData();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (data: ItemFormData) => {
    setLoading(true);
    try {
      await addItem(data);
      // 成功時はホーム画面に戻る
      router.push('/');
    } catch (error) {
      console.error('Failed to add item:', error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    clearError();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
        新規アイテム追加
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        アイテムの情報を入力してください。価格と使用期間から1日あたりのコストを自動計算します。
      </Typography>

      <ItemForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitLabel="追加"
      />

      {/* エラーメッセージ */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {error || 'アイテムの追加に失敗しました'}
        </Alert>
      </Snackbar>
    </Box>
  );
}