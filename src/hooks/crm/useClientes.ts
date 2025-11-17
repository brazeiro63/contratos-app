'use client';

import { useState, useEffect, useCallback } from 'react';
import { clientesApi, ClienteStays, ClientesStaysResponse, ClienteFilters } from '@/lib/api/clientes';

export function useClientes(initialFilters: ClienteFilters = {}) {
  const [data, setData] = useState<ClientesStaysResponse | null>(null);
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

  const refresh = useCallback(() => {
    fetchClientes();
  }, [fetchClientes]);

  const updateFilters = useCallback((newFilters: Partial<ClienteFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    clientes: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
  };
}

export function useCliente(id: string | null) {
  const [cliente, setCliente] = useState<ClienteStays | null>(null);
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

// Métodos de criação, atualização e exclusão não estão disponíveis na API Stays read-only
