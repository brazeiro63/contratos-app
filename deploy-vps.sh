#!/bin/bash

# Script para deploy do CRM Frontend na VPS

set -e

echo "🚀 Iniciando deploy do CRM Frontend na VPS..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
VPS_HOST="vps-cdm"
VPS_USER="brazeiro63"
VPS_PATH="/home/brazeiro63/contratos-app"
PROJECT_NAME="crm-frontend"

echo -e "${BLUE}1. Criando arquivo compactado...${NC}"
cd ..
tar -czf /tmp/contratos-app.tar.gz \
  --exclude='contratos-app/node_modules' \
  --exclude='contratos-app/.next' \
  --exclude='contratos-app/out' \
  --exclude='contratos-app/out-static' \
  --exclude='contratos-app/.git' \
  --exclude='contratos-app/*.log' \
  contratos-app/
cd contratos-app

echo -e "${BLUE}2. Enviando para VPS...${NC}"
scp /tmp/contratos-app.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/

echo -e "${BLUE}3. Executando deploy na VPS...${NC}"
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
set -e

# Extrair arquivos
cd /home/brazeiro63
rm -rf contratos-app-new
mkdir -p contratos-app-new
tar -xzf /tmp/contratos-app.tar.gz -C contratos-app-new --strip-components=1

# Backup da versão atual se existir
if [ -d "contratos-app" ]; then
  echo "Fazendo backup da versão atual..."
  mv contratos-app contratos-app-backup-$(date +%Y%m%d-%H%M%S)
fi

# Mover nova versão
mv contratos-app-new contratos-app
cd contratos-app

# Verificar arquivos
ls -la docker-compose.yml Dockerfile 2>/dev/null || echo "Arquivos Docker não encontrados!"

# Build e deploy com Docker
echo "Building e iniciando container..."
docker compose down 2>/dev/null || true
docker compose up -d --build

# Aguardar container iniciar
echo "Aguardando container iniciar..."
sleep 10

# Verificar status
if docker ps | grep -q crm-frontend; then
  echo "✅ Container crm-frontend está rodando!"
  docker ps | grep crm-frontend
else
  echo "❌ Erro: Container não está rodando"
  docker logs crm-frontend
  exit 1
fi

# Limpar
rm /tmp/contratos-app.tar.gz
ENDSSH

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "Para verificar logs:"
echo "  ssh ${VPS_USER}@${VPS_HOST} 'docker logs -f crm-frontend'"
echo ""
echo "Para verificar status:"
echo "  ssh ${VPS_USER}@${VPS_HOST} 'docker ps | grep crm-frontend'"

# Limpar arquivo local
rm /tmp/contratos-app.tar.gz
