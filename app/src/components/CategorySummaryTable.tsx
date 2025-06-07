'use client';

import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { SummaryData } from '@/types';
import { formatCurrency, formatDailyCost } from '@/utils/calculations';

interface CategorySummaryTableProps {
  summaryData: SummaryData;
}

/**
 * 分類別集計表コンポーネント
 */
export default function CategorySummaryTable({ summaryData }: CategorySummaryTableProps) {
  if (summaryData.categorySummary.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        分類別集計
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>分類</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">件数</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">1日</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">1ヶ月</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">1年</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summaryData.categorySummary.map((category) => (
              <TableRow
                key={category.category}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {category.category}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {category.itemCount}件
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatDailyCost(category.totalCostPerDay)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatCurrency(category.totalCostPerMonth)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatCurrency(category.totalCostPerYear)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}