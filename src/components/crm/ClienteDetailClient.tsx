'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientesApi } from '@/lib/api/clientes';
import type { Cliente } from '@/types/crm/cliente';

interface ClienteDetailClientProps {
  id: string;
}

export default function ClienteDetailClient({ id }: ClienteDetailClientProps) {
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadCliente();
  }, [id]);

  const renderTag = (tag: string) => (
    <span
      key={tag}
      className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100"
    >
      {tag}
    </span>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando cliente...</p>
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
            <div className="mt-4">
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

  const totalReservas = cliente.totalReservas;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/crm/clientes')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Voltar para lista
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-700">
                  {cliente.nome.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cliente CRM</p>
                <h1 className="text-2xl font-bold text-gray-900">{cliente.nome}</h1>
                <p className="text-sm text-gray-500 mt-1">ID: {cliente.id}</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {cliente.tags && cliente.tags.length > 0 ? (
                cliente.tags.map(renderTag)
              ) : (
                <span className="text-sm text-gray-500">Nenhuma tag aplicada</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Contatos
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-800">
                <p><span className="text-gray-500">Email:</span> {cliente.email}</p>
                <p><span className="text-gray-500">Telefone:</span> {cliente.telefone}</p>
                <p><span className="text-gray-500">CPF:</span> {cliente.cpf}</p>
                <p><span className="text-gray-500">Origem:</span> {cliente.origem || 'Não informado'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Indicadores
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-xs text-blue-600 uppercase">Score</p>
                  <p className="text-3xl font-bold text-blue-900">{cliente.score}</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <p className="text-xs text-green-600 uppercase">Reservas</p>
                  <p className="text-3xl font-bold text-green-900">{totalReservas}</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                  <p className="text-xs text-purple-600 uppercase">Valor gasto</p>
                  <p className="text-lg font-bold text-purple-900">
                    R$ {Number(cliente.valorTotalGasto || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                  <p className="text-xs text-orange-600 uppercase">Cadastro</p>
                  <p className="text-sm font-semibold text-orange-900">
                    {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {cliente.observacoes && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Observações
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
                {cliente.observacoes}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contratos Recentes</h2>
              <span className="text-sm text-gray-500">
                {cliente.contratos?.length || 0} registros
              </span>
            </div>
            {cliente.contratos && cliente.contratos.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {cliente.contratos.map((contrato) => (
                  <li key={contrato.id} className="py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {contrato.tipo.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {contrato.status} · {new Date(contrato.geradoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhum contrato registrado</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Interações Recentes</h2>
              <span className="text-sm text-gray-500">
                {cliente.interacoes?.length || 0} registros
              </span>
            </div>
            {cliente.interacoes && cliente.interacoes.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {cliente.interacoes.map((interacao) => (
                  <li key={interacao.id} className="py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {interacao.tipo} · {interacao.categoria}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(interacao.dataHora).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">{interacao.descricao}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma interação registrada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
