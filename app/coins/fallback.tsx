import React from 'react';
import DataTable from '@/components/DataTable';

const marketsColumns: DataTableColumn<any>[] = [
  {
    header: '#',
    cellClassName: 'rank-cell w-10',
    cell: () => <div className="rank-line skeleton animate-pulse" />,
  },
  {
    header: 'Token',
    cellClassName: 'token-cell',
    cell: () => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full skeleton animate-pulse" />
        <div className="name-line skeleton animate-pulse" />
      </div>
    ),
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: () => <div className="price-line skeleton animate-pulse" />,
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
    header: 'Market Cap',
    cellClassName: 'market-cap-cell',
    cell: () => <div className="price-line skeleton animate-pulse" />,
  },
];

export const MarketsFallback = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      <DataTable
        columns={marketsColumns}
        data={Array.from({ length: 20 })}
        rowKey={(_, index) => index}
        headerCellClassName="py-4! "
        bodyCellClassName="py-4! "
      />

      <div className="flex justify-center gap-2">
        <div className="w-24 h-10 rounded-md skeleton animate-pulse" />
        <div className="w-10 h-10 rounded-md skeleton animate-pulse" />
        <div className="w-10 h-10 rounded-md skeleton animate-pulse" />
        <div className="w-10 h-10 rounded-md skeleton animate-pulse" />
        <div className="w-24 h-10 rounded-md skeleton animate-pulse" />
      </div>
    </div>
  );
};
