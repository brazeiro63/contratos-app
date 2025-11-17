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
    </div>
  );
}
