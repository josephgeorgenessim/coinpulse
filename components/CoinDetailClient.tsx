'use client';

import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import React, { useState, useEffect } from 'react';
import CandlestickChart from './CandlestickChart';
import CoinStats from './CoinStats';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

interface CoinDetailClientProps {
  coin: CoinDetailsData;
  initialOHLCData: OHLCData[];
}

const CoinDetailClient = ({ coin, initialOHLCData }: CoinDetailClientProps) => {
  const { price: livePriceData, isConnected } = useCoinGeckoWebSocket({
    coinId: coin.id,
    poolId: '', // Not used for C1 channel
  });

  // Use live price if available, otherwise fall back to initial data
  const currentPrice = livePriceData?.usd ?? coin.market_data.current_price.usd;
  const priceChange24h = livePriceData?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd;
  const isPositive = priceChange24h >= 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={coin.image.large} 
            alt={coin.name} 
            className="w-16 h-16 rounded-full shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-extrabold tracking-tight">{coin.name}</h1>
              <span className="text-xl font-medium text-muted-foreground uppercase">{coin.symbol}</span>
              <span className="bg-muted px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                Rank #{coin.market_cap_rank}
              </span>
            </div>
            {/* Live Indicator */}
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              )} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {isConnected ? 'Real-time updates active' : 'Offline / Polling Mode'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right">
          <div className="flex items-center md:justify-end gap-2 mb-1">
            <span className="text-4xl font-black tabular-nums tracking-tighter">
              {formatCurrency(currentPrice)}
            </span>
            <div className={cn(
              "flex items-center px-2 py-1 rounded-lg text-sm font-bold shadow-sm border",
              isPositive 
                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                : "bg-red-500/10 text-red-500 border-red-500/20"
            )}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(priceChange24h).toFixed(2)}%
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            24h High: <span className="text-foreground">{formatCurrency(coin.market_data.high_24h.usd)}</span> | 
            24h Low: <span className="text-foreground">{formatCurrency(coin.market_data.low_24h.usd)}</span>
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border shadow-md rounded-2xl p-6 ring-1 ring-white/5">
             <CandlestickChart 
              coinId={coin.id} 
              data={initialOHLCData} 
              height={450}
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold">Market Chart</h3>
              </div>
            </CandlestickChart>
          </div>
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-1">
          <CoinStats coin={coin} livePriceData={livePriceData} />
        </div>
      </div>
    </div>
  );
};

export default CoinDetailClient;
