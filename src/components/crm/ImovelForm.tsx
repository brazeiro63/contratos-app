'use client';

import { useForm } from 'react-hook-form';
import type { CreateImovelDto, Imovel, ImovelStatus } from '@/types/crm/imovel';

const STATUS_OPTIONS: { value: ImovelStatus; label: string }[] = [
  { value: 'DISPONIVEL', label: 'Disponível' },
  { value: 'OCUPADO', label: 'Ocupado' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
  { value: 'LIMPEZA', label: 'Limpeza' },
];

const RESPONSAVEIS = ['Rosy', 'Felipe', 'Jorge', 'Fabiana'];

type ImovelFormValues = {
  staysImovelId?: string | null;
  nome: string;
  endereco: string;
  tipo: string;
  capacidade: number;
  status: ImovelStatus;
  responsavelLocal?: string | null;
  responsavelContato?: string | null;
  comodidadesText?: string;
  fotosText?: string;
  wifiRede?: string;
  wifiSenha?: string;
  codigoEntrada?: string;
  regrasCasa?: string;
  observacoesExtras?: string;
  observacoes?: string;
};

interface ImovelFormProps {
  initialData?: Imovel;
  onSubmit: (data: CreateImovelDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const parseList = (value?: string | null) => {
  if (!value) return undefined;
  const items = value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
};

const buildInstrucoes = (values: ImovelFormValues) => {
  const payload = {
    wifiRede: values.wifiRede?.trim() || undefined,
    wifiSenha: values.wifiSenha?.trim() || undefined,
    codigoEntrada: values.codigoEntrada?.trim() || undefined,
    regrasCasa: values.regrasCasa?.trim() || undefined,
    observacoesExtras: values.observacoesExtras?.trim() || undefined,
  };

  const entries = Object.entries(payload).filter(([, val]) => Boolean(val));
  if (!entries.length) {
    return undefined;
  }

  return Object.fromEntries(entries);
};

export default function ImovelForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: ImovelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImovelFormValues>({
    defaultValues: {
      staysImovelId: initialData?.staysImovelId ?? undefined,
      nome: initialData?.nome ?? '',
      endereco: initialData?.endereco ?? '',
      tipo: initialData?.tipo ?? '',
      capacidade: initialData?.capacidade ?? 0,
      status: initialData?.status ?? 'DISPONIVEL',
      responsavelLocal: initialData?.responsavelLocal ?? undefined,
      responsavelContato: initialData?.responsavelContato ?? undefined,
      comodidadesText: initialData?.comodidades?.join('\n') ?? '',
      fotosText: initialData?.fotos?.join('\n') ?? '',
      wifiRede: initialData?.instrucoes?.wifiRede ?? '',
      wifiSenha: initialData?.instrucoes?.wifiSenha ?? '',
      codigoEntrada: initialData?.instrucoes?.codigoEntrada ?? '',
      regrasCasa: initialData?.instrucoes?.regrasCasa ?? '',
      observacoesExtras: initialData?.instrucoes?.observacoesExtras ?? '',
      observacoes: initialData?.observacoes ?? '',
    },
  });

  const onSubmitForm = async (values: ImovelFormValues) => {
    const payload: CreateImovelDto = {
      staysImovelId: values.staysImovelId?.trim() || undefined,
      nome: values.nome,
      endereco: values.endereco,
      tipo: values.tipo,
      capacidade: Number(values.capacidade),
      status: values.status,
      responsavelLocal: values.responsavelLocal || undefined,
      responsavelContato: values.responsavelContato || undefined,
      comodidades: parseList(values.comodidadesText),
      fotos: parseList(values.fotosText),
      instrucoes: buildInstrucoes(values),
      observacoes: values.observacoes?.trim() || undefined,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="imovel-form">
      <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nome">Nome da unidade</label>
            <input
              id="nome"
              type="text"
              placeholder="Praça 8 - Flat completo"
              {...register('nome', { required: 'Informe o nome da unidade' })}
            />
            {errors.nome && <span className="error">{errors.nome.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <input
              id="tipo"
              type="text"
              placeholder="Casa, apartamento, flat..."
              {...register('tipo', { required: 'Tipo é obrigatório' })}
            />
            {errors.tipo && <span className="error">{errors.tipo.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="capacidade">Capacidade</label>
            <input
              id="capacidade"
              type="number"
              min={0}
              {...register('capacidade', {
                required: 'Informe a capacidade',
                valueAsNumber: true,
                min: { value: 0, message: 'Capacidade inválida' },
              })}
            />
            {errors.capacidade && <span className="error">{errors.capacidade.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" {...register('status')}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="responsavelLocal">Responsável local</label>
            <select id="responsavelLocal" {...register('responsavelLocal')}>
              <option value="">Selecione...</option>
              {RESPONSAVEIS.map((resp) => (
                <option key={resp} value={resp}>
                  {resp}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="responsavelContato">Contato do responsável</label>
            <input
              id="responsavelContato"
              type="text"
              placeholder="(81) 99999-9999"
              {...register('responsavelContato')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="staysImovelId">ID na Stays</label>
            <input
              id="staysImovelId"
              type="text"
              placeholder="Opcional"
              {...register('staysImovelId')}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="endereco">Endereço completo</label>
            <textarea
              id="endereco"
              rows={3}
              {...register('endereco', { required: 'Endereço é obrigatório' })}
            />
            {errors.endereco && <span className="error">{errors.endereco.message}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="comodidadesText">Comodidades (uma por linha)</label>
            <textarea
              id="comodidadesText"
              rows={3}
              placeholder="Piscina\nAr-condicionado\nCozinha equipada"
              {...register('comodidadesText')}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="fotosText">URLs das fotos (uma por linha)</label>
            <textarea
              id="fotosText"
              rows={3}
              placeholder="https://..."
              {...register('fotosText')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="wifiRede">Rede Wi-Fi</label>
            <input id="wifiRede" type="text" {...register('wifiRede')} />
          </div>

          <div className="form-group">
            <label htmlFor="wifiSenha">Senha Wi-Fi</label>
            <input id="wifiSenha" type="text" {...register('wifiSenha')} />
          </div>

          <div className="form-group">
            <label htmlFor="codigoEntrada">Código da fechadura/portaria</label>
            <input id="codigoEntrada" type="text" {...register('codigoEntrada')} />
          </div>

          <div className="form-group full-width">
            <label htmlFor="regrasCasa">Regras da casa</label>
            <textarea id="regrasCasa" rows={3} {...register('regrasCasa')} />
          </div>

          <div className="form-group full-width">
            <label htmlFor="observacoesExtras">Observações adicionais</label>
            <textarea id="observacoesExtras" rows={3} {...register('observacoesExtras')} />
          </div>

          <div className="form-group full-width">
            <label htmlFor="observacoes">Observações internas</label>
            <textarea id="observacoes" rows={3} {...register('observacoes')} />
          </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Propriedade'}
        </button>
      </div>
    </form>
  );
}
