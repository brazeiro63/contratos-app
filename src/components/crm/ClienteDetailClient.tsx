'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientesApi, ClienteStays } from '@/lib/api/clientes';

interface ClienteDetailClientProps {
  id: string;
}

export default function ClienteDetailClient({ id }: ClienteDetailClientProps) {
  const router = useRouter();
  const [cliente, setCliente] = useState<ClienteStays | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCliente();
  }, [id]);

  const loadCliente = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientesApi.getById(id);
      setCliente(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cliente');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando detalhes do cliente...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar cliente</h3>
            <p className="text-red-600">{error || 'Cliente não encontrado'}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={loadCliente}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => router.push('/crm/clientes')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Voltar para lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/crm/clientes')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← Voltar para lista de clientes
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Cliente</h1>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-2xl">
                {cliente.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{cliente.nome}</h2>
              <p className="text-gray-600">ID: {cliente.id}</p>
            </div>
            <div className="ml-auto">
              {cliente.isUsuario ? (
                <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Usuário
                </span>
              ) : (
                <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                  Convidado
                </span>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{cliente.email || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{cliente.tipo}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Data de Cadastro</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(cliente.dataCadastro).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status de Usuário</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {cliente.isUsuario ? 'Sim' : 'Não'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reservas */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservas</h3>
            <p className="text-gray-600 text-sm">
              Informações sobre reservas estarão disponíveis em breve.
            </p>
          </div>

          {/* Interações */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interações</h3>
            <p className="text-gray-600 text-sm">
              Histórico de interações estará disponível em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
