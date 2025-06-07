'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { SummaryData, DisplayPeriod } from '@/types';
import { formatCurrency, formatDailyCost } from '@/utils/calculations';
import CategoryPieChart from './CategoryPieChart';

interface SummaryCardProps {
  summaryData: SummaryData;
  displayPeriod: DisplayPeriod;
  onDisplayPeriodChange: (period: DisplayPeriod) => void;
}

/**
 * 集計表示カード
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ summaryData, displayPeriod, onDisplayPeriodChange }) => {
  const getTotalCost = () => {
    switch (displayPeriod) {
      case 'day':
        return summaryData.totalCostPerDay;
      case 'month':
        return summaryData.totalCostPerMonth;
      case 'year':
        return summaryData.totalCostPerYear;
      default:
        return summaryData.totalCostPerDay;
    }
  };

  const getPeriodLabel = () => {
    switch (displayPeriod) {
      case 'day':
        return '1日';
      case 'month':
        return '1ヶ月';
      case 'year':
        return '1年';
      default:
        return '1日';
    }
  };

  const totalCost = getTotalCost();

  // 表示期間の循環切り替えロジック
  const handlePreviousPeriod = () => {
    switch (displayPeriod) {
      case 'day':
        onDisplayPeriodChange('year');
        break;
      case 'month':
        onDisplayPeriodChange('day');
        break;
      case 'year':
        onDisplayPeriodChange('month');
        break;
    }
  };

  const handleNextPeriod = () => {
    switch (displayPeriod) {
      case 'day':
        onDisplayPeriodChange('month');
        break;
      case 'month':
        onDisplayPeriodChange('year');
        break;
      case 'year':
        onDisplayPeriodChange('day');
        break;
    }
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3, position: 'relative', maxWidth: 600, mx: 'auto' }}>
          {/* 左の三角形アイコン */}
          <IconButton
            onClick={handlePreviousPeriod}
            sx={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'primary.main'
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Typography variant="h3" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(totalCost)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {getPeriodLabel()}
          </Typography>

          {/* 右の三角形アイコン */}
          <IconButton
            onClick={handleNextPeriod}
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'primary.main'
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* 円グラフの表示 */}
        {summaryData.categorySummary.length > 0 && (
          <CategoryPieChart
            summaryData={summaryData}
            displayPeriod={displayPeriod}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              1日
            </Typography>
            <Typography variant="h6" component="div">
              {formatDailyCost(summaryData.totalCostPerDay)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              1ヶ月
            </Typography>
            <Typography variant="h6" component="div">
              {formatCurrency(summaryData.totalCostPerMonth)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              1年
            </Typography>
            <Typography variant="h6" component="div">
              {formatCurrency(summaryData.totalCostPerYear)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;