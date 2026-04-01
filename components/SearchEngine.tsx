'use client';

import { searchCoins } from '@/coingecko.actions';
import { cn } from '@/lib/utils';
import { Search, X, Loader2, Command, Coins } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, useCallback } from 'react';

const SearchEngine = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchCoin[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Keyboard Shortcuts (Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setSelectedIndex(-1);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Debounced Search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await searchCoins(query);
                setResults(data.coins || []);
                setSelectedIndex(-1);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (coinId: string) => {
        setIsOpen(false);
        router.push(`/coins/${coinId}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelect(results[selectedIndex].id);
        }
    };

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Search Trigger (Navbar) */}
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-muted/50 hover:bg-muted border border-border px-3 py-1.5 rounded-lg text-sm text-muted-foreground transition-all group lg:min-w-[200px]"
            >
                <Search className="w-4 h-4 group-hover:text-foreground transition-colors" />
                <span className="flex-1 text-left hidden sm:inline">Search coins...</span>
                <div className="flex items-center gap-1 bg-background border border-border px-1.5 py-0.5 rounded text-[10px] font-bold">
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                </div>
            </button>

            {/* Search Modal Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 flex items-start justify-center pt-[10vh] px-4"
                    onClick={handleBackdropClick}
                >
                    {/* Modal Content */}
                    <div 
                        ref={modalRef}
                        className="bg-card w-full max-w-xl border border-border shadow-2xl rounded-xl overflow-hidden animate-in slide-in-from-top-4 duration-300"
                        onKeyDown={handleKeyDown}
                    >
                        {/* Search Input Area */}
                        <div className="relative border-b border-border p-4 bg-muted/20">
                            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search bitcoin, eth, solana..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-lg pl-10 pr-10 outline-none placeholder:text-muted-foreground/60"
                            />
                            {loading ? (
                                <Loader2 className="absolute right-7 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 animate-spin" />
                            ) : query && (
                                <button onClick={() => setQuery('')}>
                                    <X className="absolute right-7 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </button>
                            )}
                        </div>

                        {/* Search Results Area */}
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                                        Coins Found
                                    </div>
                                    {results.map((coin, index) => (
                                        <button
                                            key={coin.id}
                                            onClick={() => handleSelect(coin.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all",
                                                index === selectedIndex ? "bg-purple-500/20 text-purple-100 ring-1 ring-purple-500/50" : "hover:bg-muted/50"
                                            )}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Image src={coin.thumb} alt={coin.name} width={24} height={24} className="rounded-full bg-background" />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{coin.name}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {coin.market_cap_rank && (
                                                    <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                        #{coin.market_cap_rank}
                                                    </span>
                                                )}
                                                <Command className="w-3 h-3 text-muted-foreground/30" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : query && !loading ? (
                                <div className="p-10 text-center space-y-4">
                                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto opacity-50">
                                        <Search className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold">No results found for "{query}"</p>
                                        <p className="text-sm text-muted-foreground">Try searching for a different coin name or symbol.</p>
                                    </div>
                                </div>
                            ) : !query && (
                                <div className="p-10 text-center space-y-4 text-muted-foreground/60">
                                    <Coins className="w-12 h-12 mx-auto stroke-[1.5]" />
                                    <p className="text-sm font-medium italic">Type to search for any cryptocurrency globally.</p>
                                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                                        {['BTC', 'ETH', 'SOL', 'Arbitrum'].map(tag => (
                                            <button 
                                                key={tag}
                                                onClick={() => setQuery(tag)}
                                                className="px-2 py-1 bg-muted rounded text-[10px] font-bold hover:bg-muted-foreground/20 hover:text-foreground transition-all"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer / Instructions */}
                        <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between text-[10px] font-medium text-muted-foreground/50">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="bg-muted px-1 rounded border border-border">Enter</kbd> to select
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="bg-muted px-1 rounded border border-border">↑</kbd> <kbd className="bg-muted px-1 rounded border border-border">↓</kbd> to navigate
                                </span>
                            </div>
                            <span className="flex items-center gap-1">
                                <kbd className="bg-muted px-1 rounded border border-border">Esc</kbd> to close
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchEngine;
