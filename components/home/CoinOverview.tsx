import { fetcher } from '@/coingecko.actions';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

import { CoinOverviewFallback } from './fallback';

const CoinOverview = async () => {
  try {
    const coin = await fetcher<CoinDetailsData>('/coins/bitcoin', {
      dex_pair_format: 'symbol',
    });

    return (
      <div id="coin-overview">
        <div className="header pt-2">
          <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
          <div className="info">
            <p>
              {coin.name} / {coin.symbol}
            </p>
            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching coin overview:', error);
    return <CoinOverviewFallback />;
  }
};

export default CoinOverview;
