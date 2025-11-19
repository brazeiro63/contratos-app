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
      <div className="crm-page">
        <div className="crm-shell">
          <div className="crm-table-card text-center py-16">
            <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Carregando imóveis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crm-page">
        <div className="crm-shell">
          <div className="crm-detail-card crm-detail-card--error">
            <h3>Erro ao carregar imóveis</h3>
            <p>{error}</p>
            <button onClick={loadImoveis}>Tentar novamente</button>
          </div>
        </div>
      </div>
    );
  }

  const currentPage = Math.floor(skip / take) + 1;
  const totalPages = Math.max(1, Math.ceil(total / take));

  return (
    <div className="crm-page">
      <div className="crm-shell">
        <div className="crm-header">
          <div>
            <h1>Imóveis</h1>
            <p>Inventário dos imóveis cadastrados no CRM</p>
          </div>
          <input
            type="text"
            placeholder="Buscar por endereço ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="crm-stats">
          <div className="crm-stat-card">
            <span>Total de imóveis</span>
            <strong>{total}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Filtrados</span>
            <strong>{filtered.length}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Página</span>
            <strong>{currentPage}/{totalPages}</strong>
          </div>
        </div>

        <div className="crm-table-card">
          <div className="crm-table-wrapper">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Unidade</th>
                  <th>Tipo</th>
                  <th>Capacidade</th>
                  <th>Última Vistoria</th>
                  <th>Próxima Manutenção</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="crm-empty">
                      Nenhum imóvel encontrado
                    </td>
                  </tr>
                ) : (
                  filtered.map((imovel) => (
                    <tr key={imovel.id}>
                      <td>
                        <div className="crm-imovel-nome">{imovel.nome}</div>
                        <div className="crm-imovel-meta">{imovel.endereco}</div>
                        <div className="crm-imovel-meta">ID: {imovel.staysImovelId ?? '—'}</div>
                      </td>
                      <td>{imovel.tipo}</td>
                      <td>{imovel.capacidade}</td>
                      <td>
                        {imovel.ultimaVistoria
                          ? new Date(imovel.ultimaVistoria).toLocaleDateString('pt-BR')
                          : '—'}
                      </td>
                      <td>
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

          <div className="crm-pagination">
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
            <div className="crm-pagination-controls">
              <button
                onClick={() => setSkip(Math.max(0, skip - take))}
                disabled={skip === 0}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setSkip(skip + take)}
                disabled={!hasMore}
              >
                Próxima
              </button>
              <select
                value={take}
                onChange={(e) => {
                  setTake(Number(e.target.value));
                  setSkip(0);
                }}
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
      <style jsx>{`
        .crm-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2ff, #f8fafc 70%);
          padding: 32px 20px 40px;
        }

        .crm-shell {
          max-width: 1100px;
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

        .crm-header input {
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #c7d2fe;
          min-width: 260px;
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
          padding: 0;
          border: 1px solid #e2e8f0;
          box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
          overflow: hidden;
        }

        .crm-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .crm-table {
          width: 100%;
          min-width: 720px;
          border-collapse: collapse;
        }

        .crm-table thead th {
          padding: 14px;
          background: #f8fafc;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #475569;
          letter-spacing: 0.05em;
        }

        .crm-table tbody td {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          color: #0f172a;
        }

        .crm-table tbody tr:last-child td {
          border-bottom: none;
        }

        .crm-imovel-nome {
          font-weight: 600;
          color: #0f172a;
        }

        .crm-imovel-meta {
          font-size: 12px;
          color: #94a3b8;
        }

        .crm-empty {
          text-align: center;
          padding: 32px;
          color: #94a3b8;
        }

        .crm-pagination {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
          color: #475569;
        }

        .crm-pagination-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
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

        @media (max-width: 640px) {
          .crm-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .crm-header input {
            width: 100%;
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
}
