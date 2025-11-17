import { apiClient } from './client';

export interface ClienteStays {
  id: string;
  nome: string;
  email?: string;
  tipo: string;
  isUsuario: boolean;
  dataCadastro: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ClientesStaysResponse {
  data: ClienteStays[];
  pagination: PaginationMetadata;
}

export interface ClienteFilters {
  hasReservations?: boolean;
  reservationFilter?: 'arrival' | 'departure';
  reservationFrom?: string;
  reservationTo?: string;
}

export const clientesApi = {
  list: async (
    filters: ClienteFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<ClientesStaysResponse> => {
    const params = new URLSearchParams();

    params.append('page', String(page));
    params.append('limit', String(limit));

    if (filters.hasReservations !== undefined) {
      params.append('hasReservations', String(filters.hasReservations));
    }
    if (filters.reservationFilter) {
      params.append('reservationFilter', filters.reservationFilter);
    }
    if (filters.reservationFrom) {
      params.append('reservationFrom', filters.reservationFrom);
    }
    if (filters.reservationTo) {
      params.append('reservationTo', filters.reservationTo);
    }

    const query = params.toString();
    return apiClient.get<ClientesStaysResponse>(
      `/clientes${query ? `?${query}` : ''}`
    );
  },

  getById: async (id: string): Promise<ClienteStays> => {
    return apiClient.get<ClienteStays>(`/clientes/${id}`);
  },
};
