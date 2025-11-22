'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { clientesApi } from '@/lib/api/clientes';
import type { Cliente } from '@/types/crm/cliente';

export default function ClienteDetailClient() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const id = params?.id;
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCliente = async () => {
      if (!id) {
        setError('ID do cliente inválido.');
        setLoading(false);
        return;
      }
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
      <div className="crm-detail-page">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando cliente...</p>
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="crm-detail-page">
        <div className="crm-detail-card crm-detail-card--error">
          <h3>Erro ao carregar cliente</h3>
          <p>{error || 'Cliente não encontrado'}</p>
          <button onClick={() => router.push('/crm/clientes')}>Voltar para lista</button>
        </div>
      </div>
    );
  }

  const totalReservas = cliente.totalReservas;

  return (
    <>
    <div className="crm-detail-page">
      <div className="crm-detail-shell">
        <button onClick={() => router.push('/crm/clientes')} className="crm-back-button">
          ← Voltar para lista
        </button>

        <div className="crm-detail-card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="crm-avatar">
                <span>
                  {cliente.nome.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="crm-label">Cliente CRM</p>
                <h1>{cliente.nome}</h1>
                <p className="crm-meta">ID: {cliente.id}</p>
              </div>
            </div>

            <div className="crm-chip-group">
              {cliente.tags && cliente.tags.length > 0 ? (
                cliente.tags.map(renderTag)
              ) : (
                <span className="crm-chip crm-chip-muted">Nenhuma tag</span>
              )}
            </div>
          </div>

        </div>

        <div className="crm-detail-grid">
          <div className="crm-info-card">
            <h3>Contatos</h3>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>
                  {cliente.email || cliente.emails?.[0] || 'Não informado'}
                  {cliente.emails && cliente.emails.length > 1 && (
                    <div className="crm-chip-group mt-2">
                      {cliente.emails.slice(1).map((mail, idx) => (
                        <span key={idx} className="crm-chip">{mail}</span>
                      ))}
                    </div>
                  )}
                </dd>
              </div>
              <div>
                <dt>Telefone</dt>
                <dd>
                  {cliente.telefone || cliente.telefones?.[0] || 'Não informado'}
                  {cliente.telefones && cliente.telefones.length > 1 && (
                    <div className="crm-chip-group mt-2">
                      {cliente.telefones.slice(1).map((phone, idx) => (
                        <span key={idx} className="crm-chip">{phone}</span>
                      ))}
                    </div>
                  )}
                </dd>
              </div>
              <div><dt>CPF</dt><dd>{cliente.cpf ?? 'Não informado'}</dd></div>
              <div><dt>Origem</dt><dd>{cliente.origem || 'Não informado'}</dd></div>
              {cliente.documentos && cliente.documentos.length > 0 && (
                <div>
                  <dt>Documentos</dt>
                  <dd className="crm-chip-group">
                    {cliente.documentos.map((doc, idx) => (
                      <span key={idx} className="crm-chip">
                        {doc.tipo || 'DOC'}: {doc.numero}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="crm-info-card">
            <h3>Indicadores</h3>
            <div className="crm-metric-grid">
              <div>
                <span>Score</span>
                <strong>{cliente.score}</strong>
              </div>
              <div>
                <span>Reservas</span>
                <strong>{totalReservas}</strong>
              </div>
              <div>
                <span>Valor gasto</span>
                <strong>
                  R$ {Number(cliente.valorTotalGasto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
              </div>
              <div>
                <span>Cadastro</span>
                <strong>{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</strong>
              </div>
            </div>
          </div>
        </div>

        {!!cliente.observacoes && (
          <div className="crm-detail-card">
            <h3>Observações</h3>
            <p>{cliente.observacoes}</p>
          </div>
        )}

        <div className="crm-detail-grid">
          <div className="crm-detail-card">
            <div className="crm-detail-card__header">
              <h2>Contratos Recentes</h2>
              <span>{cliente.contratos?.length || 0} registros</span>
            </div>
            {cliente.contratos && cliente.contratos.length > 0 ? (
              <ul>
                {cliente.contratos.map((contrato) => (
                  <li key={contrato.id}>
                    <p>{contrato.tipo.replace('_', ' ')}</p>
                    <small>
                      Status: {contrato.status} · {new Date(contrato.geradoEm).toLocaleDateString('pt-BR')}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="crm-empty">Nenhum contrato registrado</p>
            )}
          </div>

          <div className="crm-detail-card">
            <div className="crm-detail-card__header">
              <h2>Interações Recentes</h2>
              <span>{cliente.interacoes?.length || 0} registros</span>
            </div>
            {cliente.interacoes && cliente.interacoes.length > 0 ? (
              <ul>
                {cliente.interacoes.map((interacao) => (
                  <li key={interacao.id}>
                    <p>
                      {interacao.tipo} · {interacao.categoria}
                    </p>
                    <small>{new Date(interacao.dataHora).toLocaleString('pt-BR')}</small>
                    <span>{interacao.descricao}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="crm-empty">Nenhuma interação registrada</p>
            )}
          </div>
        </div>
      </div>
    </div>
      <style jsx>{`
        .crm-detail-page {
          min-height: 100vh;
          padding: 32px 20px 40px;
          background: linear-gradient(135deg, #eef2ff, #f8fafc 70%);
        }

        .crm-detail-shell {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .crm-back-button {
          align-self: flex-start;
          background: transparent;
          border: none;
          color: #475569;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0;
        }

        .crm-detail-card {
          background: #fff;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
          border: 1px solid #e2e8f0;
        }

        .crm-detail-card--error {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
          color: #b91c1c;
        }

        .crm-detail-card--error button {
          margin-top: 16px;
          background: #475569;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          cursor: pointer;
        }

        .crm-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 32px;
          font-weight: 700;
        }
      `}</style>
    </>
  );
}
