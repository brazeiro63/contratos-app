'use client';

import { useEffect, useMemo, useState } from 'react';
import { reservasApi } from '@/lib/api/reservas';
import type {
  BookingSource,
  PaymentStatus,
  Reserva,
  ReservaStatus,
  ReservasFilters,
  ReservasResponse,
} from '@/types/crm/reserva';

const STATUS_CONFIG: Array<{
  value: ReservaStatus;
  label: string;
  description: string;
}> = [
  { value: 'LEAD', label: 'Leads', description: 'Novos contatos captados' },
  { value: 'ORCAMENTO', label: 'Orçamentos', description: 'Propostas enviadas' },
  {
    value: 'AGUARDANDO_PAGAMENTO',
    label: 'Aguardando pagamento',
    description: 'Cobranças pendentes',
  },
  { value: 'CONFIRMADO', label: 'Confirmados', description: 'Reservas garantidas' },
  {
    value: 'CHECKIN_AGENDADO',
    label: 'Check-in agendado',
    description: 'Preparar equipe local',
  },
  { value: 'ATIVO', label: 'Hospedados', description: 'Hóspedes no imóvel' },
  { value: 'CHECKOUT', label: 'Check-out', description: 'Saídas recentes' },
  { value: 'CONCLUIDO', label: 'Concluídos', description: 'Processo finalizado' },
  { value: 'CANCELADO', label: 'Cancelados', description: 'Reservas perdidas' },
];

const STATUS_LABELS = STATUS_CONFIG.reduce<Record<ReservaStatus, string>>(
  (acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  },
  {
    LEAD: 'Leads',
    ORCAMENTO: 'Orçamento',
    AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
    CONFIRMADO: 'Confirmado',
    CHECKIN_AGENDADO: 'Check-in agendado',
    ATIVO: 'Ativo',
    CHECKOUT: 'Check-out',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
  },
);

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
  PARCIAL: 'Parcial',
  ATRASADO: 'Atrasado',
  ESTORNADO: 'Estornado',
};

const ORIGEM_LABELS: Record<BookingSource, string> = {
  AIRBNB: 'Airbnb',
  BOOKING: 'Booking.com',
  DIRETO: 'Direto',
  EXPEDIA: 'Expedia',
  OUTRO: 'Outro',
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function ReservasBoardClient() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [meta, setMeta] = useState<ReservasResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservaStatus | 'ALL'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [origemFilter, setOrigemFilter] = useState<BookingSource | 'ALL'>('ALL');
  const [checkInFrom, setCheckInFrom] = useState('');
  const [checkInTo, setCheckInTo] = useState('');
  const [filters, setFilters] = useState<ReservasFilters>({
    skip: 0,
    take: 60,
  });

  const loadReservas = async () => {
    try {
      setLoading(true);
      setError(null);

      const request: ReservasFilters = { skip: filters.skip, take: filters.take };
      if (statusFilter !== 'ALL') request.status = statusFilter;
      if (paymentFilter !== 'ALL') request.paymentStatus = paymentFilter;
      if (origemFilter !== 'ALL') request.origem = origemFilter;
      if (checkInFrom) request.checkInFrom = new Date(checkInFrom).toISOString();
      if (checkInTo) request.checkInTo = new Date(checkInTo).toISOString();

      const response = await reservasApi.list(request);
      setReservas(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.skip, filters.take, statusFilter, paymentFilter, origemFilter, checkInFrom, checkInTo]);

  const filteredReservas = useMemo(() => {
    if (!search.trim()) return reservas;
    const term = search.trim().toLowerCase();
    return reservas.filter((reserva) =>
      [
        reserva.id,
        reserva.staysReservaId ?? '',
        reserva.imovel.nome,
        reserva.imovel.endereco,
        reserva.cliente.nome,
        reserva.cliente.email,
        reserva.cliente.telefone,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [reservas, search]);

  const groupedByStatus = useMemo(() => {
    const map = new Map<ReservaStatus, Reserva[]>();
    (Object.keys(STATUS_LABELS) as ReservaStatus[]).forEach((status) => {
      map.set(status, []);
    });
    filteredReservas.forEach((reserva) => {
      map.get(reserva.status)?.push(reserva);
    });

    return STATUS_CONFIG.map((stage) => ({
      ...stage,
      reservas: map.get(stage.value) ?? [],
    }));
  }, [filteredReservas]);

  const stats = useMemo(() => {
    const total = meta?.total ?? reservas.length;
    const confirmadas = reservas.filter((r) =>
      ['CONFIRMADO', 'CHECKIN_AGENDADO', 'ATIVO'].includes(r.status),
    ).length;
    const pendentesPagamento = reservas.filter((r) =>
      ['PENDENTE', 'ATRASADO'].includes(r.paymentStatus),
    ).length;
    const proximasEntradas = reservas.filter((r) => {
      const diff =
        (new Date(r.checkIn).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    }).length;
    return { total, confirmadas, pendentesPagamento, proximasEntradas };
  }, [reservas, meta]);

  const handlePageChange = (direction: 'prev' | 'next') => {
    setFilters((prev) => {
      const take = prev.take ?? 60;
      const currentSkip = prev.skip ?? 0;
      const skip = direction === 'next' ? currentSkip + take : Math.max(0, currentSkip - take);
      return { ...prev, skip, take };
    });
  };

  if (loading && !reservas.length) {
    return (
      <div className="crm-page">
        <div className="crm-shell">
          <div className="crm-table-card text-center py-16">
            <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Carregando reservas...</p>
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
            <h1>Reservas</h1>
            <p>Pipeline completo desde o lead até o check-out</p>
          </div>
          <div className="crm-header-actions">
            <input
              type="text"
              placeholder="Buscar por hóspede, imóvel ou ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="button" onClick={loadReservas} disabled={loading}>
              Atualizar
            </button>
          </div>
        </div>

        {error && <div className="crm-feedback crm-feedback--error">{error}</div>}

        <div className="filters-bar">
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as ReservaStatus | 'ALL')}
            options={[
              { value: 'ALL', label: 'Todos' },
              ...STATUS_CONFIG.map((stage) => ({
                value: stage.value,
                label: stage.label,
              })),
            ]}
          />
          <FilterSelect
            label="Pagamento"
            value={paymentFilter}
            onChange={(value) => setPaymentFilter(value as PaymentStatus | 'ALL')}
            options={[
              { value: 'ALL', label: 'Todos' },
              ...Object.entries(PAYMENT_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <FilterSelect
            label="Origem"
            value={origemFilter}
            onChange={(value) => setOrigemFilter(value as BookingSource | 'ALL')}
            options={[
              { value: 'ALL', label: 'Todas' },
              ...Object.entries(ORIGEM_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <FilterInput
            label="Check-in de"
            type="date"
            value={checkInFrom}
            onChange={(value) => setCheckInFrom(value)}
          />
          <FilterInput
            label="Check-in até"
            type="date"
            value={checkInTo}
            onChange={(value) => setCheckInTo(value)}
          />
        </div>

        <div className="crm-stats">
          <div className="crm-stat-card">
            <span>Total no período</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Reservas confirmadas</span>
            <strong>{stats.confirmadas}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Pendentes de pagamento</span>
            <strong>{stats.pendentesPagamento}</strong>
          </div>
          <div className="crm-stat-card">
            <span>Check-ins próximos (7 dias)</span>
            <strong>{stats.proximasEntradas}</strong>
          </div>
        </div>

        <div className="pipeline-grid">
          {groupedByStatus.map((stage) => (
            <div key={stage.value} className="pipeline-column">
              <div className="pipeline-column__header">
                <div>
                  <h3>{stage.label}</h3>
                  <p>{stage.description}</p>
                </div>
                <span className="pipeline-count">{stage.reservas.length}</span>
              </div>
              <div className="pipeline-cards">
                {stage.reservas.length === 0 ? (
                  <div className="pipeline-empty">Sem reservas neste estágio</div>
                ) : (
                  stage.reservas.map((reserva) => (
                    <ReservaCard key={reserva.id} reserva={reserva} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="crm-pagination">
          <div>
            Mostrando{' '}
            <span className="font-semibold">
              {meta ? (meta.total === 0 ? 0 : (meta.skip ?? 0) + 1) : 0}
            </span>{' '}
            a{' '}
            <span className="font-semibold">
              {meta ? Math.min((meta.skip ?? 0) + (meta.take ?? reservas.length), meta.total) : reservas.length}
            </span>{' '}
            de <span className="font-semibold">{meta?.total ?? reservas.length}</span> reservas
          </div>
          <div className="crm-pagination-controls">
            <button
              type="button"
              onClick={() => handlePageChange('prev')}
              disabled={loading || (filters.skip ?? 0) === 0}
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => handlePageChange('next')}
              disabled={loading || !(meta?.hasMore ?? false)}
            >
              Próxima
            </button>
            <select
              value={filters.take}
              onChange={(event) =>
                setFilters({ skip: 0, take: Number(event.target.value) })
              }
            >
              <option value={30}>30</option>
              <option value={60}>60</option>
              <option value={90}>90</option>
            </select>
          </div>
        </div>
      </div>

      <style jsx>{`
        .crm-page {
          min-height: 100vh;
          background: #f1f5f9;
          padding: 32px 20px 40px;
        }

        .crm-shell {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .filters-bar {
          background: #fff;
          border-radius: 16px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
        }

        .pipeline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
        }

        .pipeline-column {
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: #fff;
          min-height: 320px;
          display: flex;
          flex-direction: column;
        }

        .pipeline-column__header {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .pipeline-column__header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .pipeline-column__header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .pipeline-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 700;
        }

        .pipeline-cards {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pipeline-empty {
          padding: 20px;
          text-align: center;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px dashed #e2e8f0;
          color: #94a3b8;
        }

        .crm-feedback {
          padding: 14px 18px;
          border-radius: 12px;
          background: #e0f2fe;
          color: #075985;
          border: 1px solid #bae6fd;
        }

        .crm-feedback--error {
          background: #fee2e2;
          border-color: #fecaca;
          color: #b91c1c;
        }
      `}</style>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="filter-group">
      <label>{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <style jsx>{`
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
        }

        select {
          border-radius: 10px;
          border: 1px solid #cbd5f5;
          padding: 10px;
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}

function FilterInput({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="filter-group">
      <label>{label}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      <style jsx>{`
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
        }

        input {
          border-radius: 10px;
          border: 1px solid #cbd5f5;
          padding: 10px;
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}

function ReservaCard({ reserva }: { reserva: Reserva }) {
  return (
    <div className="reserva-card">
      <div className="reserva-card__header">
        <div>
          <span className="reserva-id">{reserva.id}</span>
          {reserva.staysReservaId && (
            <span className="reserva-stays">Stays {reserva.staysReservaId}</span>
          )}
        </div>
        <span className={`status-badge status-${reserva.status.toLowerCase()}`}>
          {STATUS_LABELS[reserva.status]}
        </span>
      </div>
      <div className="reserva-card__dates">
        <div>
          <strong>{formatDate(reserva.checkIn)}</strong>
          <span>Check-in</span>
        </div>
        <div>
          <strong>{formatDate(reserva.checkOut)}</strong>
          <span>Check-out</span>
        </div>
      </div>
      <div className="reserva-card__section">
        <p className="reserva-title">{reserva.imovel.nome}</p>
        <small>{reserva.imovel.endereco}</small>
      </div>
      <div className="reserva-card__section">
        <p className="reserva-title">{reserva.cliente.nome}</p>
        <small>{reserva.cliente.email}</small>
      </div>
      <div className="reserva-card__meta">
        <span>{reserva.totalHospedes} hóspedes</span>
        {reserva.imovel.responsavelLocal && (
          <span>Resp.: {reserva.imovel.responsavelLocal}</span>
        )}
      </div>
      <div className="reserva-card__tags">
        <span className={`payment-badge payment-${reserva.paymentStatus.toLowerCase()}`}>
          {PAYMENT_LABELS[reserva.paymentStatus]}
        </span>
        <span className="origem-badge">{ORIGEM_LABELS[reserva.origem]}</span>
      </div>
      {reserva.valorTotal && (
        <div className="reserva-card__value">
          Valor: {currencyFormatter.format(Number(reserva.valorTotal))}
        </div>
      )}

      <style jsx>{`
        .reserva-card {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: linear-gradient(180deg, #fff, #f8fafc);
        }

        .reserva-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .reserva-id {
          font-weight: 700;
          color: #0f172a;
        }

        .reserva-stays {
          font-size: 12px;
          color: #64748b;
          margin-left: 8px;
        }

        .status-badge {
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-lead {
          background: #e0f2fe;
          color: #0369a1;
        }

        .status-orcamento {
          background: #fef3c7;
          color: #92400e;
        }

        .status-aguardando_pagamento {
          background: #fee2e2;
          color: #b91c1c;
        }

        .status-confirmado,
        .status-checkin_agendado {
          background: #dcfce7;
          color: #166534;
        }

        .status-ativo {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-checkout {
          background: #ede9fe;
          color: #6d28d9;
        }

        .status-concluido {
          background: #e2e8f0;
          color: #1e293b;
        }

        .status-cancelado {
          background: #f8fafc;
          color: #94a3b8;
          border: 1px dashed #cbd5f5;
        }

        .reserva-card__dates {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: #f1f5f9;
        }

        .reserva-card__section {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .reserva-title {
          margin: 0;
          font-weight: 600;
          color: #0f172a;
        }

        .reserva-card__section small {
          color: #64748b;
        }

        .reserva-card__meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          color: #475569;
          font-size: 13px;
        }

        .reserva-card__tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .payment-badge,
        .origem-badge {
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 600;
        }

        .payment-pendente {
          background: #fee2e2;
          color: #b91c1c;
        }

        .payment-pago {
          background: #dcfce7;
          color: #166534;
        }

        .payment-parcial {
          background: #fef3c7;
          color: #92400e;
        }

        .payment-atrasado {
          background: #ffe4e6;
          color: #be123c;
        }

        .payment-estornado {
          background: #e2e8f0;
          color: #475569;
        }

        .origem-badge {
          border: 1px solid #cbd5f5;
          background: #f8fafc;
          color: #475569;
        }

        .reserva-card__value {
          font-weight: 600;
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return value;
  }
}
