export interface Imovel {
  id: string;
  staysImovelId?: string;
  nome: string;
  endereco: string;
  tipo: string;
  capacidade: number;
  ultimaVistoria?: string | null;
  proximaManutencao?: string | null;
  dataCadastro: string;
}

export interface ImoveisResponse {
  data: Imovel[];
  meta: {
    skip: number;
    take: number;
    total: number;
    hasMore: boolean;
  };
}
