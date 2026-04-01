import { getCoinDetails, getCoinOHLC } from '@/coingecko.actions';
import CoinDetailClient from '../../../components/CoinDetailClient';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const coin = await getCoinDetails(id);
    return {
      title: `${coin.name} (${coin.symbol.toUpperCase()}) Price, Market Cap & Stats | CoinPulse`,
      description: `View real-time ${coin.name} price, market cap, volume and other statistics on CoinPulse.`,
    };
  } catch (error) {
    return {
      title: 'Coin Pulse',
    };
  }
}

const CoinPage = async ({ params }: PageProps) => {
  const { id } = await params;

  let coin;
  let ohlcData;

  try {
    [coin, ohlcData] = await Promise.all([
      getCoinDetails(id),
      getCoinOHLC(id, 7), // Default to 7 days
    ]);
  } catch (error) {
    console.error('Error fetching coin data:', error);
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/coins" className="hover:text-foreground transition-colors">
          Coins
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-bold capitalize">{coin.id}</span>
      </nav>

      {/* Main Content */}
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Coin Details...</div>}>
        <CoinDetailClient coin={coin} initialOHLCData={ohlcData} />
      </Suspense>
      
      {/* Description Section */}
      <section className="mt-12 bg-card p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">About {coin.name}</h2>
        <div 
          className="prose prose-invert max-w-none text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: coin.description.en || 'No description available for this coin.' }}
        />
      </section>
    </main>
  );
};

export default CoinPage;
