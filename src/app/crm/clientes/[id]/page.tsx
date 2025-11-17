import React from 'react';
import ClienteDetailClient from '@/components/crm/ClienteDetailClient';

interface ClienteDetailPageProps {
  params: { id: string };
}

export default function ClienteDetailPage({ params }: ClienteDetailPageProps) {
  return <ClienteDetailClient id={params.id} />;
}
