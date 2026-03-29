import { fetcher } from '@/coingecko.actions';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import DataTable from '../DataTable';

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: 'Name',
    cellClassName: 'name-cell',
    cell: (coin) => {
      const item = coin.item;

      return (
        <Link href={`/coins/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link>
      );
    },
  },
  {
    header: '24h Change',
    cellClassName: 'name-cell',
    cell: (coin) => {
      const item = coin.item;
      const isTrending = item.data.price_change_percentage_24h.usd > 0;

      return (
        <div
          className={cn(
            'price-change',
            isTrending ? 'text-green-500' : 'text-red-500'
          )}
        >
          <p>
            {isTrending ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {item.data.price_change_percentage_24h.usd.toFixed(2)}%
          </p>
        </div>
      );
    },
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: (coin) => formatCurrency(coin.item.data.price),
  },
];

const TrendingCoins = async () => {
  const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    '/search/trending',
    undefined,
    60
  );
  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>

      <div id="trending-coins">
        <DataTable
          columns={columns}
          data={trendingCoins.coins.slice(0, 6) || []}
          rowKey={(coin) => coin.item.id}
          headerCellClassName="py-3! "
          bodyCellClassName="py-3! "
        />
      </div>
    </div>
  );
};

export default TrendingCoins;
