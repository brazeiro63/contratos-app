'use client';

import React from 'react';

interface ContractCardProps {
  title: string;
  description: string;
  available: boolean;
  onClick: () => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ title, description, available, onClick }) => {
  return (
    <div
      className={`contract-card ${available ? 'available' : 'unavailable'}`}
      onClick={available ? onClick : undefined}
      style={{ cursor: available ? 'pointer' : 'not-allowed' }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      {!available && <span className="coming-soon">Em breve</span>}
    </div>
  );
};

export default ContractCard;
