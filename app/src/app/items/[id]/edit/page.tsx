'use client';

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { ItemFormData } from '@/types';
import ItemForm from '@/components/ItemForm';

/**
 * データ編集画面
 */
export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const { getItem, updateItem, error, clearError } = useData();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<ItemFormData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const itemId = params.id as string;

  // 編集対象のアイテム情報を取得
  useEffect(() => {
    if (itemId) {
      const item = getItem(itemId);
      if (item) {
        const formData: ItemFormData = {
          name: item.name,
          price: item.price,
          paymentInterval: item.paymentInterval,
          paymentPeriod: item.paymentPeriod,
          usagePeriod: item.usagePeriod,
          category: item.category
        };
        setInitialData(formData);
      } else {
        setNotFound(true);
      }
    }
  }, [itemId, getItem]);

  const handleSubmit = async (data: ItemFormData) => {
    setLoading(true);
    try {
      await updateItem(itemId, data);
      // 成功時は一覧画面に戻る
      router.push('/items');
    } catch (error) {
      console.error('Failed to update item:', error);
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

  if (notFound) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            アイテムが見つかりません
          </Typography>
          <Typography variant="body2">
            指定されたアイテムは存在しないか、削除されている可能性があります。
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (!initialData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
        アイテム編集
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        アイテムの情報を編集してください。変更内容は保存時に1日あたりのコストに反映されます。
      </Typography>

      <ItemForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitLabel="更新"
      />

      {/* エラーメッセージ */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {error || 'アイテムの更新に失敗しました'}
        </Alert>
      </Snackbar>
    </Box>
  );
}