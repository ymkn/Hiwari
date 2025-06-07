'use client';

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import ItemList from '@/components/ItemList';

/**
 * データ一覧画面
 */
export default function ItemsPage() {
  const router = useRouter();
  const { items, deleteItem, error, clearError } = useData();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddItem = () => {
    router.push('/items/new');
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteItem(itemToDelete);
        setSnackbarMessage('アイテムを削除しました');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    clearError();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          アイテム一覧
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
        >
          新規追加
        </Button>
      </Box>

      {items.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          登録件数: {items.length}件
        </Typography>
      )}

      <ItemList
        items={items}
        onDelete={handleDeleteRequest}
      />

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          アイテムの削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            このアイテムを削除してもよろしいですか？
            この操作は取り消すことができません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            キャンセル
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 成功・エラーメッセージ */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'}>
          {error || snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}