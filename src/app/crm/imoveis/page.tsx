import ImoveisListClient from '@/components/crm/ImoveisListClient';

export const metadata = {
  title: 'Imóveis | CRM',
  description: 'Inventário de imóveis sincronizados com a Stays',
};

export default function ImoveisPage() {
  return <ImoveisListClient />;
}
