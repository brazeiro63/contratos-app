export interface Cliente {
  id: string;
  staysClientId?: string;
  nome: string;
  cpf: string | null;
  email: string;
  telefone: string;
  tags: string[];
  score: number;
  preferencias?: Record<string, unknown>;
  observacoes?: string;
  origem?: string;
  dataCadastro: string;
  ultimaAtualizacao: string;
  ultimaReserva?: string;
  totalReservas: number;
  valorTotalGasto: number;
  // Relações quando incluídas
  contratos?: {
    id: string;
    tipo: string;
    status: string;
    geradoEm: string;
  }[];
  interacoes?: {
    id: string;
    tipo: string;
    categoria: string;
    descricao: string;
    dataHora: string;
  }[];
}

export interface CreateClienteDto {
  staysClientId?: string;
  nome: string;
  cpf?: string | null;
  email: string;
  telefone: string;
  tags?: string[];
  score?: number;
  preferencias?: Record<string, unknown>;
  observacoes?: string;
  origem?: string;
}

export type UpdateClienteDto = Partial<CreateClienteDto>;

export interface ClientesResponse {
  data: Cliente[];
  meta: {
    skip: number;
    take: number;
    total: number;
    hasMore: boolean;
  };
}

export interface ClienteFilters {
  skip?: number;
  take?: number;
  tag?: string;
  origem?: string;
  sort?: ClienteSortRule[];
}

export type ClienteSortableField =
  | 'nome'
  | 'email'
  | 'telefone'
  | 'cpf'
  | 'score'
  | 'dataCadastro'
  | 'ultimaAtualizacao'
  | 'ultimaReserva'
  | 'totalReservas'
  | 'valorTotalGasto'
  | 'origem';

export interface ClienteSortRule {
  field: ClienteSortableField;
  direction: 'asc' | 'desc';
}
