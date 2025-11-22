'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ContractCard from '@/components/shared/ContractCard';
import { CONTRACT_TYPES } from '@/constants/contractTypes';

export default function Home() {
  const router = useRouter();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Gerador de Contratos</h1>
        <p className="subtitle">Casas de Margarida Administração de Imóveis Ltda.</p>
        <p className="description">Selecione o tipo de contrato que deseja gerar:</p>
      </header>

      <section className="home-crm-shortcuts">
        <div>
          <p className="shortcut-title">CRM Operação</p>
          <p className="shortcut-subtitle">Acesse rapidamente as telas do CRM</p>
        </div>
        <div className="shortcut-actions">
          <button type="button" onClick={() => router.push('/crm/reservas')}>
            📋 Pipeline de Reservas
          </button>
          <button type="button" onClick={() => router.push('/crm/clientes')}>
            👥 Clientes
          </button>
          <button type="button" onClick={() => router.push('/crm/imoveis')}>
            🏠 Imóveis
          </button>
        </div>
      </section>

      <div className="contract-grid">
        {CONTRACT_TYPES.map(contract => (
          <ContractCard
            key={contract.id}
            title={contract.title}
            description={contract.description}
            available={contract.available}
            onClick={() => router.push(contract.path)}
          />
        ))}
      </div>
    </div>
  );
}
