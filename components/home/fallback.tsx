import React from 'react';
import DataTable from '../DataTable';
import { cn } from '@/lib/utils';

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2 pb-5">
        <div className="header-image skeleton animate-pulse" />
        <div className="info">
          <div className="header-line-sm skeleton animate-pulse" />
          <div className="header-line-lg skeleton animate-pulse" />
        </div>
      </div>
      <div className="chart">
        <div className="chart-skeleton skeleton animate-pulse" />
      </div>
    </div>
  );
};

const trendingColumns: DataTableColumn<any>[] = [
  {
    header: 'Name',
    cellClassName: 'name-cell',
    cell: () => (
      <div className="name-link">
        <div className="name-image skeleton animate-pulse" />
        <div className="name-line skeleton animate-pulse" />
      </div>
    ),
  },
  {
    header: '24h Change',
    cellClassName: 'change-cell',
    cell: () => (
      <div className="price-change">
        <div className="change-icon skeleton animate-pulse" />
        <div className="change-line skeleton animate-pulse" />
      </div>
    ),
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: () => <div className="price-line skeleton animate-pulse" />,
  },
];

export const TrendingCoinsFallback = () => {
  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <div className="trending-coins-table">
        <DataTable
          columns={trendingColumns}
          data={Array.from({ length: 6 })}
          rowKey={(_, index) => index}
          headerCellClassName="py-3! "
          bodyCellClassName="py-3! "
        />
      </div>
    </div>
  );
};
