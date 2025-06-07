'use client';

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { DisplayPeriod } from '@/types';
import SummaryCard from '@/components/SummaryCard';
import TopItemsRanking from '@/components/TopItemsRanking';
import CategorySummaryTable from '@/components/CategorySummaryTable';

/**
 * ホーム画面（集計表示）
 */
export default function Home() {
  const router = useRouter();
  const { items, getSummaryData } = useData();
  const [displayPeriod, setDisplayPeriod] = useState<DisplayPeriod>('day');

  const summaryData = getSummaryData();
  const hasItems = items.length > 0;

  const handleAddItem = () => {
    router.push('/items/new');
  };

  const handleViewItems = () => {
    router.push('/items');
  };

  return (
    <Box>

      {hasItems ? (
        <>
          <SummaryCard
            summaryData={summaryData}
            displayPeriod={displayPeriod}
            onDisplayPeriodChange={setDisplayPeriod}
          />

          <TopItemsRanking items={items} />

          <CategorySummaryTable summaryData={summaryData} />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              size="large"
            >
              新規追加
            </Button>
            <Button
              variant="outlined"
              onClick={handleViewItems}
              size="large"
            >
              一覧を見る
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Alert severity="info" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              データが登録されていません
            </Typography>
            <Typography variant="body2">
              まずはアイテムを登録して、1日あたりのコストを計算しましょう。
            </Typography>
          </Alert>
          
          <Card sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                使い方
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                商品やサービスの価格と使用期間を入力すると、
                1日あたりのコストを自動計算します。
              </Typography>
              <Typography variant="body2" color="text.secondary">
                複数のアイテムを登録して、総コストを把握しましょう。
              </Typography>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{ px: 4, py: 1.5 }}
          >
            最初のアイテムを追加
          </Button>
        </Box>
      )}
    </Box>
  );
}
