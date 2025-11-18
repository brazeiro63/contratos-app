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
} from '@/types/crm/cliente';

export default function ClientesListClient() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [meta, setMeta] = useState<ClientesResponse['meta'] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ClienteFilters>({ take: 10, skip: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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
  }, [filters.skip, filters.take, filters.tag, filters.origem]);

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">
              Cadastre, edite e acompanhe clientes do CRM Casas de Margarida
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Novo Cliente
            </button>
          </div>
        </div>

        {feedback && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
            {feedback}
          </div>
        )}

        <ClientesFilters
          filters={filters}
          onFilterChange={handleFiltersChange}
          onClear={handleClearFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Total de clientes</p>
            <p className="text-3xl font-bold text-gray-900">
              {meta?.total ?? clientes.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Clientes filtrados</p>
            <p className="text-3xl font-bold text-gray-900">{filteredClientes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Página</p>
            <p className="text-3xl font-bold text-gray-900">
              {currentPage}/{totalPages}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <ClientesTable
            clientes={filteredClientes}
            onView={(cliente) => router.push(`/crm/clientes/${cliente.id}`)}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />

          {meta && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600">
              <div>
                Mostrando{' '}
                <span className="font-semibold">
                  {meta.total === 0 ? 0 : meta.skip + 1}
                </span>{' '}
                a{' '}
                <span className="font-semibold">
                  {Math.min(meta.skip + (meta.take ?? clientes.length), meta.total)}
                </span>{' '}
                de{' '}
                <span className="font-semibold">{meta.total}</span> clientes
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={!hasPrevPage}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50"
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-2">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50"
                >
                  Próxima
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={!hasNextPage}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50"
                >
                  »
                </button>
                <select
                  value={filters.take ?? 10}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCliente ? 'Editar cliente' : 'Novo cliente'}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                aria-label="Fechar formulário"
              >
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
    </div>
  );
}
