'use client';

import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material';
import { Item } from '@/types';
import { formatDailyCost } from '@/utils/calculations';

interface TopItemsRankingProps {
  items: Item[];
}

/**
 * 高コストアイテムランキング表コンポーネント
 * 1日あたりのコスト順で上位10件を表示
 */
export default function TopItemsRanking({ items }: TopItemsRankingProps) {
  // 高コスト順にソートして上位10件を取得
  const topItems = items
    .sort((a, b) => b.costPerDay - a.costPerDay)
    .slice(0, 10);

  if (topItems.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        高コストランキング
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {topItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {index + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {formatDailyCost(item.costPerDay)}
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