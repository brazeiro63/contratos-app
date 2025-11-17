# 📦 Instruções de Deploy - Backend com Integração Stays

## Arquivos Criados

### 1. Serviço de Integração Stays
- `stays/stays.service.ts` - Serviço que conecta com a API Stays
- `stays/stays.module.ts` - Módulo do serviço Stays

### 2. Módulo de Clientes
- `clientes/clientes.controller.ts` - Controller com endpoints REST
- `clientes/clientes.service.ts` - Lógica de negócio
- `clientes/clientes.module.ts` - Módulo de clientes

### 3. Configuração
- `app.module.ts` - App module atualizado com novos módulos
- `config/.env.example` - Exemplo de variáveis de ambiente

## 🚀 Deploy no VPS

### Passo 1: Copiar arquivos para o VPS

```bash
# Criar tar com os novos arquivos
cd /home/brazeiro63/contratos-app/backend-integration
tar czf backend-updates.tar.gz stays/ clientes/ app.module.ts

# Enviar para VPS
scp backend-updates.tar.gz vps-cdm:/home/brazeiro63/crm-backend/
```

### Passo 2: Configurar variáveis de ambiente no VPS

```bash
# Conectar ao VPS
ssh vps-cdm

# Ir para pasta do backend
cd /home/brazeiro63/crm-backend

# Criar arquivo .env (se não existir)
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:senha@db:5432/crm?schema=public"
STAYS_API_URL=https://brazeiro.stays.net/external/v1/booking
STAYS_LOGIN=8437c439
STAYS_PASSWORD=5e1f5af7
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_PROD=https://crm.casasdemargarida.com
PORT=3001
NODE_ENV=production
EOF
```

### Passo 3: Extrair arquivos e reorganizar

```bash
# Extrair tar
tar xzf backend-updates.tar.gz

# Mover arquivos para src/
mv stays/ src/
mv clientes/ src/
mv app.module.ts src/

# Limpar
rm backend-updates.tar.gz
```

### Passo 4: Rebuild e redeploy

```bash
# Rebuild da imagem Docker
docker build -t crm-backend:latest .

# Atualizar serviço no Swarm
docker service update crm-stack_crm-backend --force
```

## 🔍 Verificar Deploy

```bash
# Ver logs do serviço
docker service logs -f crm-stack_crm-backend

# Testar endpoint
curl https://api-crm.casasdemargarida.com/api/clientes
```

## 📡 Endpoints Disponíveis

### Listar todos os clientes
```bash
GET https://api-crm.casasdemargarida.com/api/clientes
```

### Listar clientes com reservas
```bash
GET https://api-crm.casasdemargarida.com/api/clientes?hasReservations=true
```

### Listar clientes com chegada em período
```bash
GET https://api-crm.casasdemargarida.com/api/clientes?hasReservations=true&reservationFilter=arrival&reservationFrom=2025-01-01&reservationTo=2025-01-31
```

### Buscar cliente por ID
```bash
GET https://api-crm.casasdemargarida.com/api/clientes/:id
```

## 🔐 Variáveis de Ambiente Necessárias

- `STAYS_API_URL` - URL base da API Stays (https://brazeiro.stays.net/external/v1/booking)
- `STAYS_LOGIN` - Login da API Stays
- `STAYS_PASSWORD` - Senha da API Stays
- `DATABASE_URL` - Connection string do PostgreSQL
- `FRONTEND_URL` - URL do frontend em desenvolvimento
- `FRONTEND_URL_PROD` - URL do frontend em produção
- `PORT` - Porta do servidor (padrão: 3001)
- `NODE_ENV` - Ambiente (production/development)
