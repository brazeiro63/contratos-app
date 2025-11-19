'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ClientesFilters from '@/components/crm/ClientesFilters';
import ClientesTable from '@/components/crm/ClientesTable';
import ClienteForm from '@/components/crm/ClienteForm';
import { clientesApi } from '@/lib/api/clientes';
import type {
  Cliente,
  ClientesResponse,
  ClienteFilters,
  CreateClienteDto,
  ClienteSortableField,
} from '@/types/crm/cliente';

export default function ClientesListClient() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [meta, setMeta] = useState<ClientesResponse['meta'] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ClienteFilters>({
    take: 10,
    skip: 0,
    sort: [{ field: 'dataCadastro', direction: 'desc' }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);

  const loadClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientesApi.list(filters);
      setClientes(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.skip, filters.take, filters.tag, filters.origem, filters.sort]);

  const takeValue = meta?.take ?? filters.take ?? 10;
  const currentPage = meta ? Math.floor(meta.skip / takeValue) + 1 : 1;
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / takeValue)) : 1;
  const hasNextPage = meta ? meta.hasMore : false;
  const hasPrevPage = currentPage > 1;

  const filteredClientes = useMemo(() => {
    if (!searchTerm) {
      return clientes;
    }
    return clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clientes, searchTerm]);

  const handlePageChange = (page: number) => {
    const take = filters.take ?? 10;
    setFilters((prev) => ({
      ...prev,
      skip: (page - 1) * take,
      take,
    }));
  };

  const handlePageSizeChange = (take: number) => {
    setFilters((prev) => ({
      ...prev,
      take,
      skip: 0,
    }));
  };

  const handleFiltersChange = (partial: Partial<ClienteFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
      skip: 0,
    }));
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      tag: undefined,
      origem: undefined,
      skip: 0,
    }));
  };

  const handleSortChange = (field: ClienteSortableField) => {
    setFilters((prev) => {
      const sort = prev.sort ?? [];
      const existingIndex = sort.findIndex((rule) => rule.field === field);
      let nextSort: ClienteFilters['sort'];

      if (existingIndex === -1) {
        nextSort = [{ field, direction: 'asc' as const }, ...sort];
      } else {
        const existing = sort[existingIndex];
        if (existing.direction === 'asc') {
          nextSort = [{ field, direction: 'desc' as const }, ...sort.filter((_, idx) => idx !== existingIndex)];
        } else {
          nextSort = sort.filter((_, idx) => idx !== existingIndex);
        }
      }

      return {
        ...prev,
        sort: nextSort.length ? nextSort : undefined,
        skip: 0,
      };
    });
  };

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      await clientesApi.sync();
      setFeedback('Sincronização iniciada com Stays!');
      await loadClientes();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao sincronizar clientes');
    } finally {
      setSyncLoading(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const openCreateForm = () => {
    setEditingCliente(null);
    setShowForm(true);
  };

  const openEditForm = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCliente(null);
  };

  const handleSubmit = async (data: CreateClienteDto) => {
    setFormLoading(true);
    try {
      if (editingCliente) {
        await clientesApi.update(editingCliente.id, data);
        setFeedback('Cliente atualizado com sucesso!');
      } else {
        await clientesApi.create(data);
        setFeedback('Cliente criado com sucesso!');
      }
      closeForm();
      await loadClientes();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao salvar cliente');
    } finally {
      setFormLoading(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleDelete = async (cliente: Cliente) => {
    if (!confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
      return;
    }

    try {
      await clientesApi.delete(cliente.id);
      setFeedback('Cliente excluído com sucesso!');
      await loadClientes();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao excluir cliente');
    } finally {
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const initialFormData: CreateClienteDto | undefined = editingCliente
    ? {
        staysClientId: editingCliente.staysClientId,
        nome: editingCliente.nome,
        cpf: editingCliente.cpf,
        email: editingCliente.email,
        telefone: editingCliente.telefone,
        tags: editingCliente.tags,
        score: editingCliente.score,
        preferencias: editingCliente.preferencias,
        observacoes: editingCliente.observacoes,
        origem: editingCliente.origem,
      }
    : undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar clientes</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadClientes}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-page">
      <div className="crm-shell">
        <div className="crm-header">
          <div>
            <h1>Clientes</h1>
            <p>Cadastre, edite e acompanhe clientes do CRM Casas de Margarida</p>
          </div>
          <div className="crm-header-actions">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSync} disabled={syncLoading}>
              {syncLoading ? 'Sincronizando...' : 'Sincronizar Stays'}
            </button>
            <button onClick={openCreateForm}>Novo Cliente</button>
          </div>
        </div>

        {feedback && <div className="crm-feedback">{feedback}</div>}

        <div className="crm-stats">
          <div className="crm-stat-card">
            <span>Total de clientes</span>
            <strong>{meta?.total ?? clientes.length}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Clientes filtrados</span>
            <strong>{filteredClientes.length}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Página</span>
            <strong>
              {currentPage}/{totalPages}
            </strong>
          </div>
        </div>

        <ClientesFilters
          filters={filters}
          onFilterChange={handleFiltersChange}
          onClear={handleClearFilters}
        />

        <div className="crm-table-card">
          <ClientesTable
            clientes={filteredClientes}
            onView={(cliente) => router.push(`/crm/clientes/${cliente.id}`)}
            onEdit={openEditForm}
            onDelete={handleDelete}
            sortRules={filters.sort}
            onSort={handleSortChange}
          />

          {meta && (
            <div className="crm-pagination">
              <div className="crm-pagination-info">
                Mostrando{' '}
                <span>
                  {meta.total === 0 ? 0 : meta.skip + 1} -{' '}
                  {Math.min(meta.skip + (meta.take ?? clientes.length), meta.total)}
                </span>{' '}
                de <span>{meta.total}</span> clientes
              </div>
              <div className="crm-pagination-controls">
                <button onClick={() => handlePageChange(1)} disabled={!hasPrevPage}>
                  «
                </button>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevPage}>
                  Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage}>
                  Próxima
                </button>
                <button onClick={() => handlePageChange(totalPages)} disabled={!hasNextPage}>
                  »
                </button>
                <select
                  value={filters.take ?? 10}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="crm-form-card">
            <div className="crm-form-card__header">
              <h2>{editingCliente ? 'Editar cliente' : 'Novo cliente'}</h2>
              <button onClick={closeForm} aria-label="Fechar formulário">
                ×
              </button>
            </div>
            <ClienteForm
              initialData={initialFormData}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              loading={formLoading}
            />
          </div>
        )}
      </div>
      <style jsx>{`
        .crm-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2ff, #f8fafc 60%);
          padding: 32px 20px 40px;
        }

        .crm-shell {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .crm-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
        }

        .crm-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
        }

        .crm-header p {
          color: #475569;
          margin-top: 6px;
        }

        .crm-header-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .crm-header-actions input {
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #c7d2fe;
          min-width: 260px;
        }

        .crm-header-actions button {
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          background: #4f46e5;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 15px 30px rgba(79, 70, 229, 0.3);
          cursor: pointer;
        }

        .crm-feedback {
          padding: 14px 18px;
          border-radius: 12px;
          background: #e0f2fe;
          color: #075985;
          border: 1px solid #bae6fd;
        }

        .crm-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .crm-stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 18px 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
        }

        .crm-stat-card span {
          font-size: 13px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .crm-stat-card strong {
          display: block;
          margin-top: 6px;
          font-size: 28px;
          color: #0f172a;
        }

        .crm-table-card {
          background: #fff;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
        }

        .crm-pagination {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          color: #475569;
          font-size: 14px;
        }

        .crm-pagination-controls button,
        .crm-pagination-controls select {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5f5;
          background: #fff;
          cursor: pointer;
        }

        .crm-pagination-controls button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .crm-form-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        }

        .crm-form-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .crm-form-card__header h2 {
          margin: 0;
          font-size: 20px;
          color: #0f172a;
        }

        .crm-form-card__header button {
          font-size: 28px;
          line-height: 1;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #94a3b8;
        }

        @media (max-width: 640px) {
          .crm-header-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .crm-header-actions input {
            min-width: auto;
          }

          .crm-pagination-controls {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
