'use client';

import React, { useState } from 'react';
import type { ClienteFilters } from '@/types/crm/cliente';

interface ClientesFiltersProps {
  filters: ClienteFilters;
  onFilterChange: (filters: Partial<ClienteFilters>) => void;
  onClear: () => void;
}

export default function ClientesFilters({
  filters,
  onFilterChange,
  onClear,
}: ClientesFiltersProps) {
  const [localTag, setLocalTag] = useState(filters.tag || '');
  const [localOrigem, setLocalOrigem] = useState(filters.origem || '');

  const handleApply = () => {
    onFilterChange({
      tag: localTag || undefined,
      origem: localOrigem || undefined,
      skip: 0, // Reset to first page
    });
  };

  const handleClear = () => {
    setLocalTag('');
    setLocalOrigem('');
    onClear();
  };

  return (
    <div className="filters-container">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="filter-tag">Tag</label>
          <input
            id="filter-tag"
            type="text"
            placeholder="Ex: VIP, Retorno frequente..."
            value={localTag}
            onChange={(e) => setLocalTag(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-origem">Origem</label>
          <input
            id="filter-origem"
            type="text"
            placeholder="Ex: Website, Indicação..."
            value={localOrigem}
            onChange={(e) => setLocalOrigem(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <button className="btn-secondary" onClick={handleClear}>
            Limpar
          </button>
          <button className="btn-primary" onClick={handleApply}>
            Aplicar Filtros
          </button>
        </div>
      </div>
      <style jsx>{`
        .filters-container {
          width: 100%;
          margin-top: 12px;
        }

        .filters-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
        }

        .filter-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 6px;
        }

        .filter-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5f5;
          border-radius: 8px;
          font-size: 14px;
          color: #0f172a;
        }

        .filter-group input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .filter-actions {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          justify-content: flex-end;
        }

        .btn-secondary,
        .btn-primary {
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #475569;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
        }

        .btn-primary {
          background: #2563eb;
          color: #fff;
          box-shadow: 0 10px 15px rgba(37, 99, 235, 0.2);
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
