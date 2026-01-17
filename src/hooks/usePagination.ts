/**
 * Hotel PMS - usePagination Hook
 * Pagination state management hook
 */

import * as React from 'react';

/**
 * Pagination options
 */
interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

/**
 * Pagination state
 */
interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Pagination actions
 */
interface PaginationActions {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  goToPage: (page: number) => void;
}

/**
 * usePagination - Pagination state management
 */
export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems: initialTotalItems = 0,
}: PaginationOptions = {}): PaginationState & PaginationActions {
  const [page, setPageState] = React.useState(initialPage);
  const [pageSize, setPageSizeState] = React.useState(initialPageSize);
  const [totalItems, setTotalItemsState] = React.useState(initialTotalItems);

  // Calculate derived values
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Ensure page is within bounds when totalPages changes
  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPageState(totalPages);
    }
  }, [page, totalPages]);

  // Actions
  const setPage = React.useCallback((newPage: number) => {
    setPageState(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const setPageSize = React.useCallback((newPageSize: number) => {
    setPageSizeState(newPageSize);
    setPageState(1); // Reset to first page when page size changes
  }, []);

  const setTotalItems = React.useCallback((total: number) => {
    setTotalItemsState(total);
  }, []);

  const nextPage = React.useCallback(() => {
    if (hasNextPage) {
      setPageState((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = React.useCallback(() => {
    if (hasPrevPage) {
      setPageState((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const firstPage = React.useCallback(() => {
    setPageState(1);
  }, []);

  const lastPage = React.useCallback(() => {
    setPageState(totalPages);
  }, [totalPages]);

  const goToPage = React.useCallback(
    (targetPage: number) => {
      setPage(targetPage);
    },
    [setPage]
  );

  return {
    // State
    page,
    pageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,

    // Actions
    setPage,
    setPageSize,
    setTotalItems,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    goToPage,
  };
}

/**
 * Generate page numbers for pagination UI
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const sidePages = Math.floor((maxVisible - 3) / 2);

  // Always show first page
  pages.push(1);

  // Calculate start and end of middle section
  let startPage = Math.max(2, currentPage - sidePages);
  let endPage = Math.min(totalPages - 1, currentPage + sidePages);

  // Adjust if we're near the beginning or end
  if (currentPage <= sidePages + 2) {
    endPage = maxVisible - 2;
  } else if (currentPage >= totalPages - sidePages - 1) {
    startPage = totalPages - maxVisible + 3;
  }

  // Add ellipsis if needed
  if (startPage > 2) {
    pages.push('ellipsis');
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add ellipsis if needed
  if (endPage < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}
