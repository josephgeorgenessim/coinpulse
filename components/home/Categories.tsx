import { fetcher } from '@/coingecko.actions';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import DataTable from '../DataTable';
import { CategoriesFallback } from './fallback';

const columns: DataTableColumn<Category>[] = [
    {
        header: 'Category',
        cellClassName: 'category-cell',
        cell: (category) => (
            <div className="flex items-center gap-2">
                <p className="line-clamp-1">{category.name}</p>
            </div>
        ),
    },
    {
        header: 'Top Gainers',
        cellClassName: 'top-gainers-cell',
        cell: (category) => (
            <div className="flex -space-x-2">
                {category.top_3_coins.map((icon, i) => (
                    <Image
                        key={i}
                        src={icon}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-full border border-dark-400 min-w-6 min-h-6 bg-dark-400"
                    />
                ))}
            </div>
        ),
    },
    {
        header: '24h Change',
        cellClassName: 'change-cell',
        cell: (category) => {
            const isPositive = category.market_cap_change_24h > 0;

            return (
                <div
                    className={cn(
                        'price-change',
                        isPositive ? 'text-green-500' : 'text-red-500'
                    )}
                >
                    <p>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {Math.abs(category.market_cap_change_24h).toFixed(2)}%
                    </p>
                </div>
            );
        },
    },
    {
        header: 'Market Cap',
        cellClassName: 'market-cap-cell',
        cell: (category) => formatCurrency(category.market_cap),
    },
    {
        header: '24h Volume',
        cellClassName: 'volume-cell',
        cell: (category) => formatCurrency(category.volume_24h),
    },
];

const Categories = async () => {
    try {
        const categories = await fetcher<Category[]>(
            '/coins/categories',
            undefined,
            60
        );

        return (
            <div id="categories">
                <h4>Top Categories</h4>

                <div className="categories-table">
                    <DataTable
                        columns={columns}
                        data={categories.slice(0, 6) || []}
                        rowKey={(category) => category.name}
                        headerCellClassName="py-3! "
                        bodyCellClassName="py-3! "
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching categories:', error);
        return <CategoriesFallback />;
    }
};

export default Categories;
