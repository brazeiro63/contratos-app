'use client';

import React from 'react';
import { format } from 'date-fns';
import type { Cliente } from '@/types/crm/cliente';

interface ClientesTableProps {
  clientes: Cliente[];
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
  onView?: (cliente: Cliente) => void;
}

export default function ClientesTable({
  clientes,
  onEdit,
  onDelete,
  onView,
}: ClientesTableProps) {
  if (clientes.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum cliente encontrado</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>CPF</th>
            <th>Score</th>
            <th>Total Reservas</th>
            <th>Tags</th>
            <th>Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.cpf}</td>
              <td>
                <span className={`score score-${Math.floor(cliente.score / 20)}`}>
                  {cliente.score}
                </span>
              </td>
              <td>{cliente.totalReservas}</td>
              <td>
                <div className="tags">
                  {cliente.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                  {cliente.tags.length > 3 && (
                    <span className="tag-more">+{cliente.tags.length - 3}</span>
                  )}
                </div>
              </td>
              <td>{format(new Date(cliente.dataCadastro), 'dd/MM/yyyy')}</td>
              <td>
                <div className="action-buttons">
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
    </div>
  );
}
