'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { SummaryData, DisplayPeriod } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface CategoryPieChartProps {
  summaryData: SummaryData;
  displayPeriod: DisplayPeriod;
}

/**
 * カテゴリ別円グラフコンポーネント
 */
const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ summaryData, displayPeriod }) => {
  const theme = useTheme();

  // カテゴリ別データを表示期間に応じて変換
  const chartData = summaryData.categorySummary.map((category) => {
    let value: number;
    switch (displayPeriod) {
      case 'day':
        value = category.totalCostPerDay;
        break;
      case 'month':
        value = category.totalCostPerMonth;
        break;
      case 'year':
        value = category.totalCostPerYear;
        break;
      default:
        value = category.totalCostPerDay;
    }

    return {
      name: category.category,
      value,
      itemCount: category.itemCount
    };
  });

  // カラーパレット（Material-UIのテーマカラーを使用）
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE'
  ];

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            boxShadow: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(data.value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.itemCount}件
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // カスタムレジェンド
  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 1 }}>
        {payload.map((entry: any, index: number) => (
          <Box
            key={`legend-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: 'grey.50'
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: '50%'
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CategoryPieChart;