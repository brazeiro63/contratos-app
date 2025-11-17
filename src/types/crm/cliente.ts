export interface Cliente {
  id: string;
  staysClientId?: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  tags: string[];
  score: number;
  preferencias?: any;
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
  cpf: string;
  email: string;
  telefone: string;
  tags?: string[];
  score?: number;
  preferencias?: any;
  observacoes?: string;
  origem?: string;
}

export interface UpdateClienteDto extends Partial<CreateClienteDto> {}

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
}
