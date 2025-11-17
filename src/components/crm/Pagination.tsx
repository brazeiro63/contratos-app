'use client';

import React from 'react';

interface PaginationProps {
  skip: number;
  take: number;
  total: number;
  hasMore: boolean;
  onNext: () => void;
  onPrev: () => void;
  onGoToPage?: (page: number) => void;
}

export default function Pagination({
  skip,
  take,
  total,
  hasMore,
  onNext,
  onPrev,
  onGoToPage,
}: PaginationProps) {
  const currentPage = Math.floor(skip / take);
  const totalPages = Math.ceil(total / take);
  const startItem = skip + 1;
  const endItem = Math.min(skip + take, total);

  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(0, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Mostrando {startItem} - {endItem} de {total} registros
      </div>
      <div className="pagination-controls">
        <button
          className="btn-pagination"
          onClick={onPrev}
          disabled={skip === 0}
        >
          ← Anterior
        </button>

        {onGoToPage && (
          <div className="pagination-pages">
            {startPage > 0 && (
              <>
                <button
                  className="btn-page"
                  onClick={() => onGoToPage(0)}
                >
                  1
                </button>
                {startPage > 1 && <span className="pagination-ellipsis">...</span>}
              </>
            )}

            {pages.map((page) => (
              <button
                key={page}
                className={`btn-page ${page === currentPage ? 'active' : ''}`}
                onClick={() => onGoToPage(page)}
              >
                {page + 1}
              </button>
            ))}

            {endPage < totalPages - 1 && (
              <>
                {endPage < totalPages - 2 && (
                  <span className="pagination-ellipsis">...</span>
                )}
                <button
                  className="btn-page"
                  onClick={() => onGoToPage(totalPages - 1)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}

        <button
          className="btn-pagination"
          onClick={onNext}
          disabled={!hasMore}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
