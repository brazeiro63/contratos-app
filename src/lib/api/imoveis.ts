import { apiClient } from './client';
import type {
  CreateImovelDto,
  ImoveisResponse,
  Imovel,
  UpdateImovelDto,
} from '@/types/crm/imovel';

export interface ImoveisFilters {
  skip?: number;
  take?: number;
  tipo?: string;
}

const IMOVEIS_ENDPOINT = '/imoveis';

const buildQuery = (filters: ImoveisFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.skip !== undefined) params.append('skip', String(filters.skip));
  if (filters.take !== undefined) params.append('take', String(filters.take));
  if (filters.tipo) params.append('tipo', filters.tipo);

  return params.toString();
};

export const imoveisApi = {
  list: async (filters: ImoveisFilters = {}) => {
    const query = buildQuery(filters);
    return apiClient.get<ImoveisResponse>(
      `${IMOVEIS_ENDPOINT}${query ? `?${query}` : ''}`,
    );
  },
  create: async (data: CreateImovelDto) => {
    return apiClient.post<Imovel>(IMOVEIS_ENDPOINT, data);
  },
  update: async (id: string, data: UpdateImovelDto) => {
    return apiClient.patch<Imovel>(`${IMOVEIS_ENDPOINT}/${id}`, data);
  },
  delete: async (id: string) => {
    return apiClient.delete<void>(`${IMOVEIS_ENDPOINT}/${id}`);
  },
  sync: async (limit = 100) => {
    return apiClient.post(`${IMOVEIS_ENDPOINT}/sync`, { limit });
  },
};
