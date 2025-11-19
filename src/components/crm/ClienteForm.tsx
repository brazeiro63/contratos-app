'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import type { CreateClienteDto } from '@/types/crm/cliente';

interface ClienteFormProps {
  initialData?: Partial<CreateClienteDto>;
  onSubmit: (data: CreateClienteDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ClienteForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClienteDto>({
    defaultValues: initialData || {
      tags: [],
      score: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="cliente-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="nome">
            Nome <span className="required">*</span>
          </label>
          <input
            id="nome"
            type="text"
            {...register('nome', { required: 'Nome é obrigatório', minLength: 3, maxLength: 100 })}
            placeholder="Nome completo"
          />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            type="text"
            {...register('cpf', {
              setValueAs: (value: string) => value?.trim() || undefined,
              pattern: {
                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
                message: 'CPF inválido (use XXX.XXX.XXX-XX ou 11 dígitos)',
              },
            })}
            placeholder="000.000.000-00"
          />
          {errors.cpf && <span className="error">{errors.cpf.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email é obrigatório',
            })}
            placeholder="email@exemplo.com"
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefone">
            Telefone <span className="required">*</span>
          </label>
          <input
            id="telefone"
            type="text"
            {...register('telefone', {
              required: 'Telefone é obrigatório',
              pattern: {
                value: /^(\+55\s?)?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
                message: 'Telefone inválido (use formato brasileiro)',
              },
            })}
            placeholder="(00) 00000-0000"
          />
          {errors.telefone && <span className="error">{errors.telefone.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="origem">Origem</label>
          <input
            id="origem"
            type="text"
            {...register('origem')}
            placeholder="Ex: Website, Indicação, Redes Sociais"
          />
        </div>

        <div className="form-group">
          <label htmlFor="score">Score (0-100)</label>
          <input
            id="score"
            type="number"
            min="0"
            max="100"
            {...register('score', {
              valueAsNumber: true,
              min: 0,
              max: 100,
            })}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            {...register('observacoes', { maxLength: 1000 })}
            rows={4}
            placeholder="Observações sobre o cliente..."
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </div>
    </form>
  );
}
