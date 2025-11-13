import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContractCard from '../components/shared/ContractCard';
import { CONTRACT_TYPES } from '../constants/contractTypes';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Gerador de Contratos</h1>
        <p className="subtitle">Casas de Margarida Administração de Imóveis Ltda.</p>
        <p className="description">Selecione o tipo de contrato que deseja gerar:</p>
      </header>

      <div className="contract-grid">
        {CONTRACT_TYPES.map(contract => (
          <ContractCard
            key={contract.id}
            title={contract.title}
            description={contract.description}
            available={contract.available}
            onClick={() => navigate(contract.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
