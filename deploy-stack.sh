#!/bin/bash

# Script para deploy do CRM Frontend como Docker Stack (Swarm)

set -e

echo "🚀 Iniciando deploy do CRM Frontend Stack na VPS..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configurações
VPS_HOST="vps-cdm"
VPS_USER="brazeiro63"
STACK_NAME="crm-frontend-stack"

echo -e "${BLUE}1. Criando arquivo compactado...${NC}"
cd ..
tar -czf /tmp/contratos-app-stack.tar.gz \
  --exclude='contratos-app/node_modules' \
  --exclude='contratos-app/.next' \
  --exclude='contratos-app/out' \
  --exclude='contratos-app/out-static' \
  --exclude='contratos-app/.git' \
  --exclude='contratos-app/*.log' \
  contratos-app/
cd contratos-app

echo -e "${BLUE}2. Enviando para VPS...${NC}"
scp /tmp/contratos-app-stack.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/

echo -e "${BLUE}3. Fazendo build da imagem na VPS...${NC}"
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
set -e

# Extrair arquivos
cd /home/brazeiro63
rm -rf contratos-app-build
mkdir -p contratos-app-build
tar -xzf /tmp/contratos-app-build.tar.gz -C contratos-app-build --strip-components=1 2>/dev/null || \
tar -xzf /tmp/contratos-app-stack.tar.gz -C contratos-app-build --strip-components=1

cd contratos-app-build

echo "Building Docker image..."
docker build -t crm-frontend:latest .

echo "✅ Imagem criada com sucesso!"
docker images | grep crm-frontend

# Limpar
cd ..
rm -rf contratos-app-build
rm /tmp/contratos-app-stack.tar.gz
ENDSSH

echo -e "${BLUE}4. Enviando stack file...${NC}"
scp docker-stack.yml ${VPS_USER}@${VPS_HOST}:/tmp/crm-frontend-stack.yml

echo -e "${BLUE}5. Deploying stack...${NC}"
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
set -e

echo "Deploying stack..."
docker stack deploy -c /tmp/crm-frontend-stack.yml crm-frontend-stack

echo "Aguardando serviço iniciar..."
sleep 10

echo "Verificando status do serviço..."
docker service ls | grep crm-frontend

echo "Verificando logs..."
SERVICE_ID=$(docker service ps crm-frontend-stack_crm-frontend -q --filter "desired-state=running" | head -n1)
if [ -n "$SERVICE_ID" ]; then
  CONTAINER_ID=$(docker inspect --format '{{.Status.ContainerStatus.ContainerID}}' $SERVICE_ID)
  if [ -n "$CONTAINER_ID" ]; then
    echo "Últimas linhas do log:"
    docker logs $CONTAINER_ID 2>&1 | tail -20
  fi
fi

# Limpar
rm /tmp/crm-frontend-stack.yml
ENDSSH

echo -e "${GREEN}✅ Deploy do stack concluído!${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Verificar se o DNS está apontando:"
echo "   crm.casasdemargarida.com → 46.202.151.92"
echo ""
echo "2. Aguardar certificado SSL (pode levar alguns minutos)"
echo ""
echo "3. Acessar: https://crm.casasdemargarida.com"
echo ""
echo -e "${BLUE}Comandos úteis:${NC}"
echo "  Ver serviços:  ssh ${VPS_USER}@${VPS_HOST} 'docker service ls | grep crm'"
echo "  Ver logs:      ssh ${VPS_USER}@${VPS_HOST} 'docker service logs crm-frontend-stack_crm-frontend'"
echo "  Atualizar:     ssh ${VPS_USER}@${VPS_HOST} 'docker service update crm-frontend-stack_crm-frontend --force'"
echo "  Remover stack: ssh ${VPS_USER}@${VPS_HOST} 'docker stack rm crm-frontend-stack'"

# Limpar arquivo local
rm /tmp/contratos-app-stack.tar.gz
