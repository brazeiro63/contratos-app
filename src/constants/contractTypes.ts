export interface ContractType {
  id: string;
  title: string;
  description: string;
  path: string;
  available: boolean;
  icon?: string;
}

export const CONTRACT_TYPES: ContractType[] = [
  {
    id: 'administracao',
    title: 'Contrato de Administração de Imóvel',
    description: 'Para gestão de imóveis destinados a locação por temporada',
    path: '/property-management',
    available: true
  },
  {
    id: 'locacao',
    title: 'Contrato de Locação por Temporada',
    description: 'Para aluguel temporário de imóveis residenciais',
    path: '/rental-contract',
    available: true
  },
  {
    id: 'venda',
    title: 'Contrato de Compra e Venda',
    description: 'Para transações de venda de imóveis',
    path: '/contrato/venda',
    available: false
  }
];
