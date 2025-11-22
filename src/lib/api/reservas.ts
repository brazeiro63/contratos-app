import { apiClient } from './client';
import type {
  ReservasResponse,
  ReservasFilters,
  Reserva,
} from '@/types/crm/reserva';

const RESERVAS_ENDPOINT = '/reservas';

const buildQuery = (filters: ReservasFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.skip !== undefined) params.append('skip', String(filters.skip));
  if (filters.take !== undefined) params.append('take', String(filters.take));
  if (filters.status) params.append('status', filters.status);
  if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
  if (filters.origem) params.append('origem', filters.origem);
  if (filters.imovelId) params.append('imovelId', filters.imovelId);
  if (filters.clienteId) params.append('clienteId', filters.clienteId);
  if (filters.checkInFrom) params.append('checkInFrom', filters.checkInFrom);
  if (filters.checkInTo) params.append('checkInTo', filters.checkInTo);

  return params.toString();
};

export const reservasApi = {
  list: async (filters: ReservasFilters = {}) => {
    const query = buildQuery(filters);
    return apiClient.get<ReservasResponse>(
      `${RESERVAS_ENDPOINT}${query ? `?${query}` : ''}`,
    );
  },

  findOne: async (id: string) => {
    return apiClient.get<Reserva>(`${RESERVAS_ENDPOINT}/${id}`);
  },
};
