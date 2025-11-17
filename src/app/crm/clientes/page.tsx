import React from 'react';
import ClientesListClient from '@/components/crm/ClientesListClient';

export const metadata = {
  title: 'Clientes | CRM',
  description: 'Gerenciamento de clientes',
};

// Forçar renderização dinâmica para esta página
export const dynamic = 'force-dynamic';

export default function ClientesPage() {
  return <ClientesListClient />;
}
