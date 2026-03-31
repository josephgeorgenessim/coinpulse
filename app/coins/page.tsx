import { fetcher } from '@/coingecko.actions';
import DataTable from '@/components/DataTable';
import CustomPagination from '@/components/Pagination';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { MarketsFallback } from './fallback';

const columns: DataTableColumn<CoinMarketData>[] = [
  {
    header: '#',
    cellClassName: 'rank-cell w-10',
    cell: (coin) => coin.market_cap_rank,
  },
  {
    header: 'Token',
    cellClassName: 'token-cell',
    cell: (coin) => (
      <Link
        href={`/coins/${coin.id}`}
        className="flex items-center gap-3 hover:text-purple-100 transition-colors"
      >
        <Image
          src={coin.image}
          alt={coin.name}
          width={32}
          height={32}
          className="rounded-full bg-dark-400"
        />
        <div className="flex flex-col">
          <p className="font-medium line-clamp-1">{coin.name} ({coin.symbol})</p>
        </div>
      </Link>
    ),
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: (coin) => formatCurrency(coin.current_price),
  },
  {
    header: '24h Change',
    cellClassName: 'change-cell',
    cell: (coin) => {
      const isPositive = coin.price_change_percentage_24h > 0;
      return (
        <div
          className={cn(
            'price-change',
            isPositive ? 'text-green-500' : 'text-red-500'
          )}
        >
          <p className="flex items-center gap-1">
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </p>
        </div>
      );
    },
  },
  {
    header: 'Market Cap',
    cellClassName: 'market-cap-cell',
    cell: (coin) => formatCurrency(coin.market_cap),
  },
];

const MarketsTable = async ({ currentPage }: { currentPage: number }) => {
  try {
    const perPage = 10;
    const markets = await fetcher<CoinMarketData[]>(
      'coins/markets',
      {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage.toString(),
        page: currentPage.toString(),
        sparkline: 'false',
      },
      60
    );

    return (
      <div className="flex flex-col gap-8">
        <DataTable
          columns={columns}
          data={markets || []}
          rowKey={(coin) => coin.id}
          headerCellClassName="py-4! "
          bodyCellClassName="py-4! "
        />

        <CustomPagination
          currentPage={currentPage}
          hasMorePages={markets.length === perPage}
          route="/coins"
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching market data:', error);
    return <div>Error loading market data.</div>;
  }
};

const page = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  return (
    <main className="main-container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">All Coins</h1>
        </div>

        <Suspense fallback={<MarketsFallback />}>
          <MarketsTable currentPage={currentPage} />
        </Suspense>
      </div>
    </main>
  );
};

export default page;