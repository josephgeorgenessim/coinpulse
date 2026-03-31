import React from 'react';
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface CustomPaginationProps {
  currentPage: number;
  hasMorePages?: boolean;
  route?: string;
  className?: string;
}

const CustomPagination = ({
  currentPage,
  hasMorePages = true,
  route = '/coins',
  className,
}: CustomPaginationProps) => {
  return (
    <ShadcnPagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${route}?page=${Math.max(1, currentPage - 1)}`}
            className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
          />
        </PaginationItem>

        {currentPage > 3 && (
          <>
            <PaginationItem>
              <PaginationLink href={`${route}?page=1`}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {[...Array(5)].map((_, i) => {
          const pageNumber = currentPage - 2 + i;
          if (pageNumber <= 0) return null;
          // Limit to a reasonable number of pages if we don't know the total
          // For now, if hasMorePages is true, we keep showing next pages
          if (!hasMorePages && pageNumber > currentPage) return null;
          if (pageNumber > currentPage + 2) return null;

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={`${route}?page=${pageNumber}`}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {hasMorePages && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext href={`${route}?page=${currentPage + 1}`} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </ShadcnPagination>
  );
};

export default CustomPagination;
