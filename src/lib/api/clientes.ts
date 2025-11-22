import { apiClient } from './client';
import type {
  Cliente,
  ClientesResponse,
  ClienteFilters,
  CreateClienteDto,
  UpdateClienteDto,
} from '@/types/crm/cliente';

const CRM_ENDPOINT = '/clientes';

const buildQuery = (filters: ClienteFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.skip !== undefined) {
    params.append('skip', String(filters.skip));
  }
  if (filters.take !== undefined) {
    params.append('take', String(filters.take));
  }
  if (filters.tag) {
    params.append('tag', filters.tag);
  }
  if (filters.origem) {
    params.append('origem', filters.origem);
  }
  if (filters.sort?.length) {
    filters.sort.forEach((rule) => {
      params.append('sort', `${rule.field}:${rule.direction}`);
    });
  }

  return params.toString();
};

export const clientesApi = {
  list: async (filters: ClienteFilters = {}): Promise<ClientesResponse> => {
    const query = buildQuery(filters);
    return apiClient.get<ClientesResponse>(
      `${CRM_ENDPOINT}${query ? `?${query}` : ''}`
    );
  },

  getById: async (id: string): Promise<Cliente> => {
    return apiClient.get<Cliente>(`${CRM_ENDPOINT}/${id}`);
  },

  create: async (data: CreateClienteDto): Promise<Cliente> => {
    return apiClient.post<Cliente>(CRM_ENDPOINT, data);
  },

  update: async (id: string, data: UpdateClienteDto): Promise<Cliente> => {
    return apiClient.patch<Cliente>(`${CRM_ENDPOINT}/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`${CRM_ENDPOINT}/${id}`);
  },

  sync: async (limit = 100): Promise<{ message?: string }> => {
    return apiClient.post<{ message?: string }>(`${CRM_ENDPOINT}/sync`, { limit });
  },
};
