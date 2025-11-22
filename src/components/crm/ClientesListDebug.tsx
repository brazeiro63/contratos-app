'use client';

import { useState, useEffect } from 'react';

export default function ClientesListDebug() {
  const [status, setStatus] = useState('Iniciando...');
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus('Fazendo requisição...');
        const url = 'https://api-crm.casasdemargarida.com.br/api/clientes?page=1&limit=5';

        const response = await fetch(url);
        setStatus(`Response status: ${response.status}`);

        const json = await response.json();
        setStatus('Dados recebidos!');
        setData(json);
      } catch (error) {
        setStatus(`Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Debug - Clientes</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">Status:</h2>
          <p className="text-lg">{status}</p>
        </div>

        {data != null && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Dados:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
