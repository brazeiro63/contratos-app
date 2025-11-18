'use client';

import { useState, useEffect, useCallback } from 'react';
import { clientesApi } from '@/lib/api/clientes';
import type {
  Cliente,
  ClientesResponse,
  ClienteFilters,
} from '@/types/crm/cliente';

export function useClientes(initialFilters: ClienteFilters = {}) {
  const [data, setData] = useState<ClientesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ClienteFilters>(initialFilters);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientesApi.list(filters);
      setData(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  return {
    clientes: data?.data ?? [],
    meta: data?.meta,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchClientes,
  };
}

export function useCliente(id?: string) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setCliente(null);
      return;
    }

    let cancelled = false;

    const fetchCliente = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await clientesApi.getById(id);
        if (!cancelled) {
          setCliente(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCliente();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { cliente, loading, error };
}
