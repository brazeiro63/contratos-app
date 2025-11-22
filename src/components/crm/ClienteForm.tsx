'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
    control,
    formState: { errors },
  } = useForm<CreateClienteDto>({
    defaultValues: initialData || {
      tags: [],
      score: 0,
      emails: [],
      telefones: [],
      documentos: [],
    },
  });

  const emailsArray = useFieldArray({
    control,
    name: 'emails',
  });

  const telefonesArray = useFieldArray({
    control,
    name: 'telefones',
  });

  const documentosArray = useFieldArray({
    control,
    name: 'documentos',
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
          <label htmlFor="email">Email principal</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="email@exemplo.com"
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Emails adicionais</label>
          <div className="stacked-inputs">
            {emailsArray.fields.map((field, index) => (
              <div key={field.id} className="stacked-input-row">
                <input
                  type="email"
                  {...register(`emails.${index}` as const)}
                  placeholder="email@exemplo.com"
                />
                <button type="button" className="btn-icon" onClick={() => emailsArray.remove(index)}>
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={() => emailsArray.append('')}>
              + Adicionar email
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone principal</label>
          <input
            id="telefone"
            type="text"
            {...register('telefone')}
            placeholder="+55 11 99999-9999"
          />
          {errors.telefone && <span className="error">{errors.telefone.message}</span>}
        </div>

        <div className="form-group">
          <label>Telefones adicionais</label>
          <div className="stacked-inputs">
            {telefonesArray.fields.map((field, index) => (
              <div key={field.id} className="stacked-input-row">
                <input
                  type="text"
                  {...register(`telefones.${index}` as const)}
                  placeholder="+1 555 123456"
                />
                <button type="button" className="btn-icon" onClick={() => telefonesArray.remove(index)}>
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={() => telefonesArray.append('')}>
              + Adicionar telefone
            </button>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Documentos</label>
          <div className="stacked-inputs">
            {documentosArray.fields.map((field, index) => (
              <div key={field.id} className="document-row">
                <select
                  {...register(`documentos.${index}.tipo` as const)}
                  defaultValue={initialData?.documentos?.[index]?.tipo ?? 'CPF'}
                >
                  <option value="CPF">CPF</option>
                  <option value="DNI">DNI</option>
                  <option value="PASSAPORTE">Passaporte</option>
                  <option value="OUTRO">Outro</option>
                </select>
                <input
                  type="text"
                  {...register(`documentos.${index}.numero` as const)}
                  placeholder="Número do documento"
                  defaultValue={initialData?.documentos?.[index]?.numero}
                />
                <button type="button" className="btn-icon" onClick={() => documentosArray.remove(index)}>
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={() => documentosArray.append({ tipo: 'CPF', numero: '' })}>
              + Adicionar documento
            </button>
          </div>
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

      <style jsx>{`
        .cliente-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 600;
          color: #0f172a;
        }

        .form-group input,
        .form-group textarea,
        .form-group select,
        .document-row select,
        .document-row input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #cbd5f5;
          background: #f8fafc;
        }

        .stacked-inputs {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stacked-input-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .document-row {
          display: grid;
          grid-template-columns: 140px 1fr 40px;
          gap: 8px;
          align-items: center;
        }

        .required {
          color: #ef4444;
        }

        .error {
          color: #b91c1c;
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-primary,
        .btn-secondary,
        .btn-icon {
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: #4f46e5;
          color: #fff;
          padding: 12px 18px;
          border-radius: 10px;
          font-weight: 700;
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #0f172a;
          padding: 12px 18px;
          border-radius: 10px;
          font-weight: 600;
        }

        .btn-icon {
          background: #e2e8f0;
          color: #0f172a;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
        }
      `}</style>
    </form>
  );
}
