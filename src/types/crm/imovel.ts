export type ImovelStatus = 'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO' | 'LIMPEZA';

export interface ImovelInstrucoes {
  wifiRede?: string;
  wifiSenha?: string;
  codigoEntrada?: string;
  regrasCasa?: string;
  observacoesExtras?: string;
}

export interface Imovel {
  id: string;
  staysImovelId?: string | null;
  nome: string;
  endereco: string;
  tipo: string;
  capacidade: number;
  status: ImovelStatus;
  responsavelLocal?: string | null;
  responsavelContato?: string | null;
  comodidades: string[];
  fotos: string[];
  instrucoes?: ImovelInstrucoes | null;
  ultimaVistoria?: string | null;
  proximaManutencao?: string | null;
  dataCadastro: string;
  observacoes?: string | null;
}

export interface CreateImovelDto {
  staysImovelId?: string;
  nome: string;
  endereco: string;
  tipo: string;
  capacidade: number;
  status?: ImovelStatus;
  responsavelLocal?: string;
  responsavelContato?: string;
  comodidades?: string[];
  fotos?: string[];
  instrucoes?: ImovelInstrucoes;
  observacoes?: string;
}

export type UpdateImovelDto = Partial<CreateImovelDto>;

export interface ImoveisResponse {
  data: Imovel[];
  meta: {
    skip: number;
    take: number;
    total: number;
    hasMore: boolean;
  };
}
