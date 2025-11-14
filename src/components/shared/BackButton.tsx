'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="back-button"
      type="button"
    >
      ← Voltar para início
    </button>
  );
};

export default BackButton;
