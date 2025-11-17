#!/bin/bash

set -e

echo "🚀 Deploy de Integração Backend com API Stays"
echo "=============================================="

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações
REMOTE_HOST="vps-cdm"
REMOTE_USER="brazeiro63"
REMOTE_PATH="/home/brazeiro63/crm-backend"
LOCAL_PATH="./backend-integration"

echo -e "${BLUE}📦 Criando pacote...${NC}"
cd $LOCAL_PATH
tar czf backend-updates.tar.gz stays/ clientes/ app.module.ts config/
cd ..

echo -e "${BLUE}📤 Enviando para VPS...${NC}"
scp $LOCAL_PATH/backend-updates.tar.gz $REMOTE_HOST:$REMOTE_PATH/

echo -e "${BLUE}🔧 Instalando no VPS...${NC}"
ssh $REMOTE_HOST << 'ENDSSH'
cd /home/brazeiro63/crm-backend

echo "Extraindo arquivos..."
tar xzf backend-updates.tar.gz

echo "Movendo para src/..."
mv stays/ src/ 2>/dev/null || true
mv clientes/ src/ 2>/dev/null || true
mv app.module.ts src/

echo "Configurando .env..."
if [ ! -f .env ]; then
  echo "Criando .env a partir do exemplo..."
  cp config/.env.example .env
  echo "⚠️  ATENÇÃO: Configure as variáveis de ambiente em .env"
fi

echo "Limpando arquivos temporários..."
rm -rf backend-updates.tar.gz config/

echo "Rebuilding imagem Docker..."
docker build -t crm-backend:latest .

echo "Atualizando serviço..."
docker service update crm-stack_crm-backend --force

echo "Aguardando serviço iniciar..."
sleep 5

echo "Logs do serviço:"
docker service logs --tail 20 crm-stack_crm-backend

ENDSSH

echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo "🔍 Testar endpoints:"
echo "  curl https://api-crm.casasdemargarida.com/api/clientes"
echo ""
echo "📋 Ver logs:"
echo "  ssh vps-cdm 'docker service logs -f crm-stack_crm-backend'"
