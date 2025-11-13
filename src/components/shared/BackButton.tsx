import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="back-button"
      type="button"
    >
      ← Voltar para início
    </button>
  );
};

export default BackButton;
