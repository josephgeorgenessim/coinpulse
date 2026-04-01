'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import SearchEngine from './SearchEngine';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
      <div className="main-container inner flex items-center justify-between py-3">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/assets/logo.svg"
            alt="coinPulse logo"
            width={132}
            height={40}
            className="w-auto h-8 lg:h-10"
          />
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={cn('nav-link text-sm font-medium transition-colors hover:text-foreground', {
              'text-foreground font-bold': pathname === '/',
              'text-muted-foreground': pathname !== '/',
            })}
          >
            Home
          </Link>

          <SearchEngine />

          <Link
            href="/coins"
            className={cn('nav-link text-sm font-medium transition-colors hover:text-foreground', {
              'text-foreground font-bold': pathname === '/coins',
              'text-muted-foreground': pathname !== '/coins',
            })}
          >
            All Coins
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
