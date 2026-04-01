import React from 'react';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { Info, BarChart3, PieChart, Coins } from 'lucide-react';

interface CoinStatsProps {
  coin: CoinDetailsData;
  livePriceData: ExtendedPriceData | null;
}

const CoinStats = ({ coin, livePriceData }: CoinStatsProps) => {
  const marketData = coin.market_data;
  
  // Use live market cap if available
  const marketCap = livePriceData?.marketCap ?? marketData.market_cap.usd;
  const volume24h = livePriceData?.volume24h ?? marketData.total_volume.usd;

  const stats = [
    {
      label: 'Market Cap',
      value: formatCurrency(marketCap),
      icon: <BarChart3 className="w-4 h-4 text-blue-500" />,
      subValue: `Rank #${coin.market_cap_rank}`,
    },
    {
      label: 'Fully Diluted Valuation',
      value: formatCurrency(marketData.fully_diluted_valuation?.usd || marketCap),
      icon: <PieChart className="w-4 h-4 text-purple-500" />,
      subValue: 'Estimated value',
    },
    {
      label: '24h Trading Volume',
      value: formatCurrency(volume24h),
      icon: <Activity className="w-4 h-4 text-orange-500" />,
      subValue: 'Sum of all trades',
    },
    {
      label: 'Circulating Supply',
      value: `${formatNumber(marketData.circulating_supply)} ${coin.symbol.toUpperCase()}`,
      icon: <Coins className="w-4 h-4 text-yellow-500" />,
      subValue: marketData.max_supply ? `${((marketData.circulating_supply / marketData.max_supply) * 100).toFixed(1)}% of max` : 'Unlimited supply',
    },
  ];

  return (
    <div className="bg-card border border-border shadow-md rounded-2xl overflow-hidden h-full">
      <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Info className="w-5 h-5 text-muted-foreground" />
          Market Statistics
        </h3>
      </div>
      <div className="divide-y divide-border">
        {stats.map((stat, i) => (
          <div key={i} className="p-5 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              {stat.icon}
              <span className="text-sm font-semibold text-muted-foreground">{stat.label}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground font-medium mt-1">
                {stat.subValue}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional Stats Section */}
      <div className="p-5 bg-muted/10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">All Time High</span>
            <p className="text-sm font-bold text-green-500">{formatCurrency(marketData.ath.usd)}</p>
            <p className="text-[10px] text-muted-foreground">{new Date(marketData.ath_date.usd).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">All Time Low</span>
            <p className="text-sm font-bold text-red-500">{formatCurrency(marketData.atl.usd)}</p>
            <p className="text-[10px] text-muted-foreground">{new Date(marketData.atl_date.usd).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Activity Icon since I used it but might have missed the import
const Activity = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

export default CoinStats;
