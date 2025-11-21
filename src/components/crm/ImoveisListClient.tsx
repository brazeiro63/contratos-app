'use client';

import { useEffect, useMemo, useState } from 'react';
import ImovelForm from '@/components/crm/ImovelForm';
import { imoveisApi } from '@/lib/api/imoveis';
import type { CreateImovelDto, Imovel } from '@/types/crm/imovel';

const STATUS_LABELS: Record<string, string> = {
  DISPONIVEL: 'Disponível',
  OCUPADO: 'Ocupado',
  MANUTENCAO: 'Manutenção',
  LIMPEZA: 'Limpeza',
};

export default function ImoveisListClient() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingImovel, setEditingImovel] = useState<Imovel | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);

  const loadImoveis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await imoveisApi.list({ skip, take });
      setImoveis(response.data);
      setTotal(response.meta?.total ?? response.data.length);
      setHasMore(
        response.meta?.hasMore ??
          response.data.length + skip < (response.meta?.total ?? response.data.length)
      );
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
    const term = search.toLowerCase();
    return imoveis.filter((imovel) =>
      [
        imovel.nome,
        imovel.endereco,
        imovel.tipo,
        imovel.responsavelLocal ?? '',
        STATUS_LABELS[imovel.status] ?? imovel.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [imoveis, search]);

  const currentPage = Math.floor(skip / take) + 1;
  const totalPages = Math.max(1, Math.ceil(total / take));
  const disponiveis = imoveis.filter((imovel) => imovel.status === 'DISPONIVEL').length;
  const ocupados = imoveis.filter((imovel) => imovel.status === 'OCUPADO').length;
  const manutencao = imoveis.filter((imovel) =>
    imovel.status === 'MANUTENCAO' || imovel.status === 'LIMPEZA'
  ).length;

  const openCreateForm = () => {
    setEditingImovel(null);
    setShowForm(true);
  };

  const openEditForm = (imovel: Imovel) => {
    setEditingImovel(imovel);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingImovel(null);
  };

  const handleSubmit = async (data: CreateImovelDto) => {
    setFormLoading(true);
    try {
      if (editingImovel) {
        await imoveisApi.update(editingImovel.id, data);
        setFeedback('Propriedade atualizada com sucesso!');
      } else {
        await imoveisApi.create(data);
        setFeedback('Propriedade criada com sucesso!');
      }
      closeForm();
      await loadImoveis();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao salvar propriedade');
    } finally {
      setFormLoading(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleDelete = async (imovel: Imovel) => {
    if (!confirm(`Deseja excluir a propriedade ${imovel.nome}?`)) {
      return;
    }

    try {
      await imoveisApi.delete(imovel.id);
      setFeedback('Propriedade removida com sucesso!');
      await loadImoveis();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao excluir propriedade');
    } finally {
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      await imoveisApi.sync(100);
      setFeedback('Sincronização com a Stays iniciada!');
      await loadImoveis();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao sincronizar imóveis');
    } finally {
      setSyncLoading(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

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

  return (
    <div className="crm-page">
      <div className="crm-shell">
        <div className="crm-header">
          <div>
            <h1>Imóveis</h1>
            <p>Gerencie propriedades, responsáveis e instruções de operação</p>
          </div>
          <div className="crm-header-actions">
            <input
              type="text"
              placeholder="Buscar por nome, endereço ou status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" onClick={handleSync} disabled={syncLoading}>
              {syncLoading ? 'Sincronizando...' : 'Sincronizar Stays'}
            </button>
            <button type="button" onClick={openCreateForm}>
              Nova Propriedade
            </button>
          </div>
        </div>

        {feedback && <div className="crm-feedback">{feedback}</div>}

        <div className="crm-stats">
          <div className="crm-stat-card">
            <span>Total de imóveis</span>
            <strong>{total}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Disponíveis</span>
            <strong>{disponiveis}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Em operação</span>
            <strong>{ocupados}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Manutenção / Limpeza</span>
            <strong>{manutencao}</strong>
          </div>
        </div>

        <div className="crm-table-card">
          <div className="crm-table-wrapper">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Unidade</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th>Capacidade</th>
                  <th>Instruções &amp; Comodidades</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="crm-empty">
                      Nenhuma propriedade encontrada
                    </td>
                  </tr>
                ) : (
                  filtered.map((imovel) => (
                    <tr key={imovel.id}>
                      <td>
                        <div className="crm-imovel-nome">{imovel.nome}</div>
                        <div className="crm-imovel-meta">{imovel.endereco}</div>
                        <div className="crm-imovel-meta">
                          {imovel.tipo} {imovel.staysImovelId ? `• Stays ${imovel.staysImovelId}` : ''}
                        </div>
                      </td>
                      <td>
                        <span className={`crm-status-badge crm-status-${imovel.status.toLowerCase()}`}>
                          {STATUS_LABELS[imovel.status] ?? imovel.status}
                        </span>
                      </td>
                      <td>
                        <div className="crm-imovel-resp">{imovel.responsavelLocal ?? '—'}</div>
                        <div className="crm-imovel-meta">{imovel.responsavelContato ?? ''}</div>
                      </td>
                      <td>{imovel.capacidade}</td>
                      <td>
                        <div className="crm-instrucoes">
                          {imovel.instrucoes?.wifiRede && (
                            <span>Wi-Fi: {imovel.instrucoes.wifiRede}</span>
                          )}
                          {imovel.instrucoes?.wifiSenha && (
                            <span>Senha: {imovel.instrucoes.wifiSenha}</span>
                          )}
                          {imovel.instrucoes?.codigoEntrada && (
                            <span>Código: {imovel.instrucoes.codigoEntrada}</span>
                          )}
                          {imovel.instrucoes?.regrasCasa && (
                            <span>Regras: {imovel.instrucoes.regrasCasa}</span>
                          )}
                        </div>
                        {imovel.comodidades?.length ? (
                          <div className="crm-chip-group">
                            {imovel.comodidades.slice(0, 3).map((comodidade) => (
                              <span key={comodidade} className="crm-chip">
                                {comodidade}
                              </span>
                            ))}
                            {imovel.comodidades.length > 3 && (
                              <span className="crm-chip crm-chip-muted">
                                +{imovel.comodidades.length - 3}
                              </span>
                            )}
                          </div>
                        ) : null}
                      </td>
                      <td className="crm-actions-cell">
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-icon"
                            title="Editar"
                            onClick={() => openEditForm(imovel)}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-danger"
                            title="Excluir"
                            onClick={() => handleDelete(imovel)}
                          >
                            🗑️
                          </button>
                        </div>
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
              <span className="font-semibold">{total === 0 ? 0 : skip + 1}</span> a{' '}
              <span className="font-semibold">{Math.min(skip + take, total)}</span> de{' '}
              <span className="font-semibold">{total}</span> imóveis
            </div>
            <div className="crm-pagination-controls">
              <button onClick={() => setSkip(Math.max(0, skip - take))} disabled={skip === 0}>
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button onClick={() => setSkip(skip + take)} disabled={!hasMore}>
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

        {showForm && (
          <div className="crm-form-card">
            <div className="crm-form-card__header">
              <h2>{editingImovel ? 'Editar propriedade' : 'Nova propriedade'}</h2>
              <button onClick={closeForm} aria-label="Fechar formulário">
                ×
              </button>
            </div>
            <ImovelForm
              initialData={editingImovel ?? undefined}
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
          background: linear-gradient(135deg, #eef2ff, #f8fafc 70%);
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
          max-width: 520px;
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
          min-width: 220px;
        }

        .crm-header-actions button {
          padding: 12px 18px;
          border-radius: 10px;
          border: none;
          background: #4f46e5;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 12px 25px rgba(79, 70, 229, 0.2);
        }

        .crm-header-actions button:last-child {
          background: #2563eb;
        }

        .crm-header-actions button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
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
          font-size: 26px;
          color: #0f172a;
        }

        .crm-table-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
        }

        .crm-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .crm-table {
          width: 100%;
          min-width: 880px;
          border-collapse: collapse;
        }

        .crm-table thead th {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #475569;
          padding: 14px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .crm-table tbody td {
          padding: 16px 14px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: top;
          color: #0f172a;
        }

        .crm-table tbody tr:last-child td {
          border-bottom: none;
        }

        .crm-imovel-nome {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .crm-imovel-meta {
          font-size: 12px;
          color: #94a3b8;
        }

        .crm-imovel-resp {
          font-weight: 600;
        }

        .crm-status-badge {
          display: inline-flex;
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .crm-status-disponivel {
          background: #dcfce7;
          color: #166534;
        }

        .crm-status-ocupado {
          background: #fee2e2;
          color: #b91c1c;
        }

        .crm-status-manutencao {
          background: #fef3c7;
          color: #92400e;
        }

        .crm-status-limpeza {
          background: #e0e7ff;
          color: #3730a3;
        }

        .crm-instrucoes {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12px;
          color: #475569;
          margin-bottom: 8px;
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

        .action-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .btn-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-icon:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.1);
        }

        .btn-icon:focus-visible {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }

        .btn-icon.btn-danger {
          background: #fee2e2;
          border-color: #fecaca;
          color: #b91c1c;
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
          gap: 8px;
          flex-wrap: wrap;
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
          .crm-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .crm-header-actions {
            flex-direction: column;
            width: 100%;
          }

          .crm-header-actions input,
          .crm-header-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
