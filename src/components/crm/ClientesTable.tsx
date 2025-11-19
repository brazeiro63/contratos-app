'use client';

import React from 'react';
import { format } from 'date-fns';
import type { Cliente, ClienteSortRule, ClienteSortableField } from '@/types/crm/cliente';

interface ClientesTableProps {
  clientes: Cliente[];
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
  onView?: (cliente: Cliente) => void;
  sortRules?: ClienteSortRule[];
  onSort?: (field: ClienteSortableField) => void;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

const formatTelefone = (telefone?: string | null) => {
  if (!telefone) return '—';
  const digits = telefone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return telefone;
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return '—';
  }
  return format(new Date(value), 'dd/MM/yyyy');
};

const getScoreVariant = (score: number | null | undefined): 'low' | 'medium' | 'high' => {
  if (!score || score < 40) {
    return 'low';
  }
  if (score < 70) {
    return 'medium';
  }
  return 'high';
};

export default function ClientesTable({
  clientes,
  onEdit,
  onDelete,
  onView,
  sortRules,
  onSort,
}: ClientesTableProps) {
  if (clientes.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum cliente encontrado</p>
      </div>
    );
  }

  const getSortDirection = (field: ClienteSortableField) => {
    return sortRules?.find((rule) => rule.field === field)?.direction;
  };

  const renderSortableHeader = (label: string, field: ClienteSortableField) => {
    const direction = getSortDirection(field);
    return (
      <button
        type="button"
        className={`crm-sortable-header ${direction ? `crm-sortable-header--${direction}` : ''}`}
        onClick={() => onSort?.(field)}
      >
        {label}
        {direction ? <span className="crm-sort-indicator">{direction === 'asc' ? '↑' : '↓'}</span> : null}
      </button>
    );
  };

  return (
    <div className="crm-table-wrapper">
      <table className="crm-table">
        <thead>
          <tr>
            <th>{renderSortableHeader('Cliente', 'nome')}</th>
            <th>{renderSortableHeader('Contato', 'email')}</th>
            <th>{renderSortableHeader('Score', 'score')}</th>
            <th>{renderSortableHeader('Reservas', 'totalReservas')}</th>
            <th>{renderSortableHeader('Última Reserva', 'ultimaReserva')}</th>
            <th>{renderSortableHeader('Valor Gasto', 'valorTotalGasto')}</th>
            <th>{renderSortableHeader('Origem', 'origem')}</th>
            <th>{renderSortableHeader('Cadastro', 'dataCadastro')}</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td className="crm-client-cell">
                <div className="crm-client-name">{cliente.nome}</div>
                <div className="crm-client-meta">CPF: {cliente.cpf ?? '—'}</div>
                <div className="crm-chip-group">
                  {cliente.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="crm-chip">
                      {tag}
                    </span>
                  ))}
                  {cliente.tags.length > 3 && (
                    <span className="crm-chip crm-chip-muted">+{cliente.tags.length - 3}</span>
                  )}
                </div>
              </td>
              <td className="crm-contact-cell">
                <div className="crm-contact-email" title={cliente.email}>
                  {cliente.email}
                </div>
                <div className="crm-contact-phone">{formatTelefone(cliente.telefone)}</div>
              </td>
              <td className="crm-score-cell">
                <span className={`crm-score crm-score--${getScoreVariant(cliente.score)}`}>
                  {cliente.score ?? 0}
                </span>
              </td>
              <td className="crm-metric-cell">
                <div className="crm-metric-value">{cliente.totalReservas}</div>
                <div className="crm-metric-label">
                  {cliente.totalReservas === 1 ? 'reserva' : 'reservas'}
                </div>
              </td>
              <td className="crm-metric-cell">{formatDate(cliente.ultimaReserva)}</td>
              <td className="crm-metric-cell">
                {currencyFormatter.format(Number(cliente.valorTotalGasto ?? 0))}
              </td>
              <td className="crm-metric-cell">
                <span className="crm-origin-badge">{cliente.origem || 'Não informado'}</span>
              </td>
              <td className="crm-metric-cell">{formatDate(cliente.dataCadastro)}</td>
              <td className="crm-actions-cell">
                <div className="action-buttons justify-start">
                  {onView && (
                    <button
                      className="btn-icon"
                      onClick={() => onView(cliente)}
                      title="Ver detalhes"
                    >
                      👁️
                    </button>
                  )}
                  {onEdit && (
                    <button
                      className="btn-icon"
                      onClick={() => onEdit(cliente)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => onDelete(cliente)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .crm-table-wrapper {
          width: 100%;
          overflow-x: auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
          border: 1px solid #e2e8f0;
        }

        .crm-table {
          width: 100%;
          min-width: 960px;
          border-collapse: collapse;
        }

        .crm-table thead th {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #475569;
          padding: 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
        }

        .crm-table tbody td {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: top;
        }

        .crm-table tbody tr:last-child td {
          border-bottom: none;
        }

        .crm-client-name {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .crm-client-meta {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 10px;
        }

        .crm-chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .crm-chip {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #e0f2fe;
          color: #0369a1;
          font-weight: 600;
        }

        .crm-chip-muted {
          background: #f1f5f9;
          color: #475569;
        }

        .crm-contact-email {
          font-size: 14px;
          color: #0f172a;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 260px;
        }

        .crm-contact-phone {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }

        .crm-score {
          display: inline-flex;
          min-width: 48px;
          justify-content: center;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
        }

        .crm-score--high {
          background: #22c55e;
        }

        .crm-score--medium {
          background: #f97316;
        }

        .crm-score--low {
          background: #ef4444;
        }

        .crm-sortable-header {
          background: transparent;
          border: none;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #475569;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          padding: 0;
        }

        .crm-sort-indicator {
          font-size: 14px;
          color: #2563eb;
        }

        .crm-metric-value {
          font-weight: 600;
          color: #0f172a;
        }

        .crm-metric-label {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .crm-origin-badge {
          display: inline-flex;
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        @media (max-width: 1024px) {
          .crm-table {
            min-width: 720px;
          }
        }
      `}</style>
    </div>
  );
}
