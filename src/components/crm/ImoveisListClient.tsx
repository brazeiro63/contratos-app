'use client';

import { useEffect, useMemo, useState } from 'react';
import { imoveisApi } from '@/lib/api/imoveis';
import type { Imovel } from '@/types/crm/imovel';

export default function ImoveisListClient() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const loadImoveis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await imoveisApi.list({ skip, take });
      setImoveis(response.data);
      setTotal(response.meta?.total ?? response.data.length);
      setHasMore(response.meta?.hasMore ?? response.data.length + skip < (response.meta?.total ?? response.data.length));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImoveis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, take]);

  const filtered = useMemo(() => {
    if (!search) return imoveis;
    return imoveis.filter((imovel) =>
      imovel.endereco.toLowerCase().includes(search.toLowerCase()) ||
      imovel.tipo.toLowerCase().includes(search.toLowerCase()),
    );
  }, [imoveis, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-700 font-semibold mb-2">Erro</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadImoveis}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const currentPage = Math.floor(skip / take) + 1;
  const totalPages = Math.max(1, Math.ceil(total / take));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Imóveis</h1>
            <p className="text-gray-600">
              Inventário dos imóveis cadastrados no CRM
            </p>
          </div>
          <input
            type="text"
            placeholder="Buscar por endereço ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Vistoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Manutenção
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Nenhum imóvel encontrado
                    </td>
                  </tr>
                ) : (
                  filtered.map((imovel) => (
                    <tr key={imovel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {imovel.endereco}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {imovel.staysImovelId ?? '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{imovel.tipo}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{imovel.capacidade}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {imovel.ultimaVistoria
                          ? new Date(imovel.ultimaVistoria).toLocaleDateString('pt-BR')
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {imovel.proximaManutencao
                          ? new Date(imovel.proximaManutencao).toLocaleDateString('pt-BR')
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600">
            <div>
              Mostrando{' '}
              <span className="font-semibold">
                {total === 0 ? 0 : skip + 1}
              </span>{' '}
              a{' '}
              <span className="font-semibold">
                {Math.min(skip + take, total)}
              </span>{' '}
              de{' '}
              <span className="font-semibold">{total}</span> imóveis
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSkip(Math.max(0, skip - take))}
                disabled={skip === 0}
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setSkip(skip + take)}
                disabled={!hasMore}
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
              >
                Próxima
              </button>
              <select
                value={take}
                onChange={(e) => {
                  setTake(Number(e.target.value));
                  setSkip(0);
                }}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
