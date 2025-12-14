export type FetchPageResult<T> = { data: T[]; total: number };

export type UsePaginatedOptions<T> = {
  initialItems?: T[]; // optional local dataset
  pageSize?: number;
  fetchPage?: (page: number, perPage: number, opts?: Record<string, any>) => Promise<FetchPageResult<T>>; // optional remote fetcher
};

export function usePaginated<T>({ initialItems = [], pageSize = 12, fetchPage }: UsePaginatedOptions<T>) {
  let initialTotal = initialItems.length;
  const state = {
    items: [] as T[],
    total: initialTotal,
    page: 0,
    loading: false as boolean,
  };

  // NOTE: we can't use React hooks here since this is a plain helper file; export a factory
  // Consumer components should call createPaginated() inside a component to get reactive state.
  function createPaginated() {
    const { useState, useCallback } = require('react');
    const [items, setItems] = useState<T[]>(initialItems.slice(0, pageSize));
    const [total, setTotal] = useState<number>(initialTotal);
    const [page, setPage] = useState<number>(initialItems.length ? 1 : 0);
    const [loading, setLoading] = useState<boolean>(false);

    const loadPage = useCallback(
      async (p: number, append = false, opts: Record<string, any> = {}) => {
        if (fetchPage) {
          setLoading(true);
          try {
            const res = await fetchPage(p, pageSize, opts);
            setTotal(res.total);
            setItems((prev) => (append ? prev.concat(res.data) : res.data));
            setPage(p);
          } finally {
            setLoading(false);
          }
        } else {
          // local mode: use initialItems
          const start = (p - 1) * pageSize;
          const pageData = initialItems.slice(start, start + pageSize);
          setItems((prev) => (append ? prev.concat(pageData) : pageData));
          setTotal(initialItems.length);
          setPage(p);
        }
      },
      [fetchPage, pageSize]
    );

    const loadMore = useCallback(() => {
      const next = page + 1;
      // if local mode and no more, do nothing
      if (!fetchPage && (next - 1) * pageSize >= initialItems.length) return;
      loadPage(next, true);
    }, [loadPage, page, pageSize, fetchPage]);

    const reset = useCallback((opts: { page?: number; filters?: Record<string, any> } = {}) => {
      const p = opts.page ?? 1;
      // if remote, pass filters to fetcher; local ignores filters (consumer should filter initialItems before passing)
      loadPage(p, false, opts.filters || {});
    }, [loadPage]);

    const hasMore = items.length < total;

    return { items, total, page, loading, loadMore, reset, loadPage, hasMore };
  }

  return { createPaginated };
}