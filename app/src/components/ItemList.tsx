'use client';

import React from 'react';
import {
  IconButton,
  Chip,
  Typography,
  Box,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { Item } from '@/types';
import { formatCurrency, formatDailyCost, calculateCostPerMonth, calculateCostPerYear } from '@/utils/calculations';
import { formatDateDisplay } from '@/utils/dateHelpers';

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
}

/**
 * アイテム一覧表示コンポーネント
 */
const ItemList: React.FC<ItemListProps> = ({ items, onDelete }) => {
  const router = useRouter();

  const getPaymentIntervalLabel = (interval: string) => {
    switch (interval) {
      case 'once':
        return '一括';
      case 'monthly':
        return '毎月';
      case 'yearly':
        return '毎年';
      default:
        return interval;
    }
  };

  // DataGridの列定義
  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: '操作',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => router.push(`/items/edit?id=${params.row.id}`)}
            color="primary"
            sx={{ '&:hover': { backgroundColor: 'primary.main', color: 'white' } }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(params.row.id)}
            color="error"
            sx={{ '&:hover': { backgroundColor: 'error.main', color: 'white' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: '名称',
      width: 200,
      sortable: true,
      filterable: true,
    },
    {
      field: 'price',
      headerName: '価格',
      width: 120,
      type: 'number',
      sortable: true,
      filterable: true,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'paymentInterval',
      headerName: '支払間隔',
      width: 120,
      sortable: true,
      filterable: true,
      renderCell: (params) => getPaymentIntervalLabel(params.value),
    },
    {
      field: 'usageStartDate',
      headerName: '開始日',
      width: 120,
      sortable: true,
      filterable: true,
      renderCell: (params) => formatDateDisplay(params.value),
    },
    {
      field: 'usageEndDate',
      headerName: '終了日',
      width: 120,
      sortable: true,
      filterable: true,
      renderCell: (params) => formatDateDisplay(params.value),
    },
    {
      field: 'category',
      headerName: '分類',
      width: 140,
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        params.value ? (
          <Chip
            label={params.value}
            size="small"
            variant="outlined"
            color="primary"
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            未分類
          </Typography>
        )
      ),
    },
    {
      field: 'costPerDay',
      headerName: '1日',
      width: 120,
      type: 'number',
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {formatDailyCost(params.value)}
        </Typography>
      ),
    },
    {
      field: 'costPerMonth',
      headerName: '1ヶ月',
      width: 120,
      type: 'number',
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'costPerYear',
      headerName: '1年',
      width: 120,
      type: 'number',
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
  ];

  // DataGridのデータ準備
  const rows: GridRowsProp = items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    paymentInterval: item.paymentInterval,
    usageStartDate: item.usagePeriod.startDate,
    usageEndDate: item.usagePeriod.endDate,
    category: item.category || '',
    costPerDay: item.costPerDay,
    costPerMonth: calculateCostPerMonth(item),
    costPerYear: calculateCostPerYear(item),
  }));

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          登録されたアイテムがありません
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          最初のアイテムを追加してみましょう
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/items/new')}
        >
          アイテムを追加
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
          sorting: {
            sortModel: [{ field: 'costPerDay', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'grey.50',
            fontWeight: 'bold',
          },
        }}
      />
    </Box>
  );
};

export default ItemList;