#!/bin/bash

# Script para gerar build estático para Hostinger

set -e

echo "🏗️  Gerando build estático para Hostinger..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}1. Fazendo backup das páginas do CRM...${NC}"
if [ -d "src/app/crm" ]; then
  cp -r src/app/crm /tmp/crm-backup-$(date +%Y%m%d-%H%M%S)
fi

echo -e "${BLUE}2. Copiando configuração estática...${NC}"
cp next.config.ts next.config.docker.backup
cp next.config.static.ts next.config.ts

echo -e "${BLUE}3. Removendo páginas dinâmicas do CRM...${NC}"
rm -rf src/app/crm

echo -e "${BLUE}4. Limpando cache...${NC}"
rm -rf .next

echo -e "${BLUE}5. Executando build...${NC}"
npm run build

echo -e "${BLUE}6. Movendo build para out-static...${NC}"
rm -rf out-static
mv out out-static

echo -e "${BLUE}7. Restaurando arquivos...${NC}"
cp next.config.docker.backup next.config.ts
git restore src/app/crm 2>/dev/null || cp -r /tmp/crm-backup-* src/app/crm 2>/dev/null || true

echo -e "${GREEN}✅ Build estático concluído!${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Faça upload da pasta 'out-static' para o servidor Hostinger"
echo "2. No File Manager da Hostinger, copie todo conteúdo de 'out-static' para 'public_html'"
echo ""
echo "Arquivos gerados em: ./out-static/"
ls -lh out-static/ | head -10
