# Plano de Desenvolvimento do CRM - Casas de Margarida

## 1. Visão Geral do Projeto

### 1.1 Objetivo
Evoluir o gerador de contratos atual em um sistema CRM completo que:
- Mantém a funcionalidade de geração de contratos como recurso central
- Complementa os dados da plataforma Stays com informações enriquecidas de clientes
- Gerencia histórico de interações e contratos
- Fornece análises e insights sobre clientes e propriedades

### 1.2 Princípios Fundamentais
1. **Evolução, não substituição**: O gerador de contratos atual será integrado, não reconstruído
2. **Complementaridade**: O CRM complementa a Stays, não duplica funcionalidades
3. **Prioridades**: Gestão de reservas já é bem atendida pela Stays - não é foco do CRM
4. **Integração inteligente**: Cache estratégico de dados da Stays com sincronização eficiente

## 2. Arquitetura do Sistema

### 2.1 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIOS                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND (Hostinger)                           │
│  - React 19 + TypeScript                                        │
│  - Gerador de Contratos (atual)                                 │
│  - Interface do CRM                                             │
│  - React Router DOM                                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND (VPS Casas de Margarida - Docker)          │
│  - Next.js API Routes / NestJS                                  │
│  - Prisma ORM                                                   │
│  - Autenticação JWT                                             │
│  - Cache com Redis                                              │
└─────────────┬───────────────────────────┬───────────────────────┘
              │                           │
              ▼                           ▼
┌──────────────────────────┐   ┌─────────────────────────────────┐
│  PostgreSQL (Docker)     │   │    Stays API (Externo)          │
│  - Porta 5434            │   │  - Dados de Reservas            │
│  - Dados do CRM          │   │  - Dados de Clientes            │
│  - Histórico             │   │  - Dados de Propriedades        │
└──────────────────────────┘   └─────────────────────────────────┘
              │
              ▼
┌──────────────────────────┐
│    Redis (Portainer)     │
│  - Cache de Stays API    │
│  - Sessões               │
│  - Filas de Jobs         │
└──────────────────────────┘
```

### 2.2 Decisões Técnicas

#### Frontend
- **Hospedagem**: Hostinger (atual)
- **Framework**: React 19.2.0 + TypeScript
- **Build**: Vite
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **PDF**: pdfMake

#### Backend
- **Hospedagem**: VPS Casas de Margarida (Docker + Portainer)
- **Framework**: Next.js (recomendado) ou NestJS
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL (porta 5434)
- **Cache**: Redis (já disponível no Portainer)
- **Autenticação**: JWT + bcrypt

#### Infraestrutura
- **Containerização**: Docker
- **Orquestração**: Portainer (já configurado)
- **Rede**: Frontend e Backend no mesmo datacenter, IPs diferentes
- **Banco**: PostgreSQL preferido pelo usuário (em vez de MySQL da Hostinger)

## 3. Modelo de Dados

### 3.1 Entidades Principais

#### ClienteCRM
```typescript
{
  id: string
  staysClientId?: string // Referência ao ID na Stays
  nome: string
  cpf: string
  email: string
  telefone: string

  // Dados enriquecidos (não disponíveis na Stays)
  tags: string[] // ex: ["VIP", "Retorno frequente", "Corporativo"]
  score: number // Pontuação de cliente
  preferencias: json // Preferências específicas
  observacoes: string
  origem: string // Como conheceu a empresa

  // Metadados
  dataCadastro: DateTime
  ultimaAtualizacao: DateTime
  ultimaReserva?: DateTime
  totalReservas: number
  valorTotalGasto: Decimal
}
```

#### ContratoGerado
```typescript
{
  id: string
  tipo: "ADMINISTRACAO_IMOVEL" | "LOCACAO_TEMPORADA"
  clienteId: string // FK para ClienteCRM
  staysReservaId?: string // Referência à reserva na Stays

  // Dados do contrato
  dadosContrato: json // Dados completos usados na geração
  pdfUrl: string // URL do PDF armazenado
  status: "RASCUNHO" | "GERADO" | "ASSINADO" | "CANCELADO"

  // Metadados
  geradoEm: DateTime
  geradoPor: string // Usuário que gerou
  versao: number

  // Relacionamentos
  interacoes: Interacao[]
}
```

#### Interacao
```typescript
{
  id: string
  clienteId: string // FK para ClienteCRM
  contratoId?: string // FK para ContratoGerado (opcional)

  tipo: "EMAIL" | "TELEFONE" | "WHATSAPP" | "PRESENCIAL" | "NOTA"
  descricao: string
  categoria: "DUVIDA" | "RECLAMACAO" | "ELOGIO" | "SUPORTE" | "COMERCIAL"

  // Metadados
  dataHora: DateTime
  registradoPor: string
  anexos?: string[] // URLs de arquivos anexados
}
```

#### ImovelCRM
```typescript
{
  id: string
  staysImovelId?: string // Referência ao ID na Stays

  // Dados básicos (sincronizados da Stays)
  endereco: string
  tipo: string
  capacidade: number

  // Dados operacionais (específicos do CRM)
  historicoManutencao: json[]
  custosOperacionais: json[]
  documentacao: string[] // URLs de documentos
  observacoes: string

  // Metadados
  ultimaVistoria?: DateTime
  proximaManutencao?: DateTime
}
```

#### StaysCache
```typescript
{
  id: string
  tipo: "CLIENTE" | "RESERVA" | "IMOVEL"
  staysId: string // ID na Stays
  dados: json // Dados completos da API

  // Controle de cache
  ultimaSync: DateTime
  proximaSync: DateTime
  versao: number
  ativo: boolean
}
```

#### Usuario
```typescript
{
  id: string
  nome: string
  email: string
  senha: string // hash bcrypt
  papel: "ADMIN" | "GERENTE" | "OPERADOR"

  // Metadados
  ativo: boolean
  ultimoAcesso?: DateTime
  dataCriacao: DateTime
}
```

### 3.2 Relacionamentos

```
ClienteCRM 1 ─── N ContratoGerado
ClienteCRM 1 ─── N Interacao
ContratoGerado 1 ─── N Interacao
ImovelCRM 1 ─── N ContratoGerado
Usuario 1 ─── N ContratoGerado (criador)
Usuario 1 ─── N Interacao (registrador)
```

## 4. Estratégia de Integração com Stays API

### 4.1 Princípios de Integração

1. **Cache Inteligente**: Dados da Stays são cacheados no PostgreSQL via tabela StaysCache
2. **Sincronização Seletiva**: Apenas dados necessários são sincronizados
3. **TTL Configurável**: Diferentes tipos de dados têm diferentes tempos de expiração
4. **Fallback**: Sistema funciona mesmo se Stays API estiver indisponível (usa cache)

### 4.2 Estratégia de Cache

```typescript
// Exemplo de TTL por tipo de dado
const CACHE_TTL = {
  CLIENTE: 24 * 60 * 60, // 24 horas
  RESERVA_ATIVA: 6 * 60 * 60, // 6 horas
  RESERVA_HISTORICA: 7 * 24 * 60 * 60, // 7 dias
  IMOVEL: 24 * 60 * 60 // 24 horas
};
```

### 4.3 Endpoints Stays a Integrar

```typescript
// Prioridade 1 - Essenciais
GET /api/clients/:id // Buscar dados de cliente
GET /api/reservations/:id // Buscar dados de reserva
GET /api/properties/:id // Buscar dados de imóvel

// Prioridade 2 - Complementares
GET /api/clients // Listar clientes
GET /api/reservations // Listar reservas (com filtros)
```

### 4.4 Fluxo de Sincronização

```
1. Usuário solicita dados → Backend verifica cache
2. Se cache válido → Retorna cache
3. Se cache expirado → Consulta Stays API
4. Atualiza cache → Retorna dados
5. Se Stays API falhar → Retorna cache mesmo expirado (com aviso)
```

## 5. Fases de Desenvolvimento

### Fase 1: Migração para Next.js (2-3 semanas)

**Objetivos:**
- Migrar frontend React para Next.js
- Configurar estrutura de API routes
- Manter gerador de contratos funcionando

**Tarefas:**
- [ ] Criar novo projeto Next.js
- [ ] Migrar componentes React existentes
- [ ] Configurar React Router para Next.js routing
- [ ] Criar primeiras API routes de teste
- [ ] Manter compatibilidade com formulários existentes
- [ ] Configurar build e deploy

**Entregas:**
- Aplicação Next.js funcionando com gerador de contratos
- Estrutura básica de API routes
- Deploy funcional no Hostinger

### Fase 2: Setup do Backend (2-3 semanas)

**Objetivos:**
- Configurar backend containerizado no VPS
- Estabelecer conexão com PostgreSQL
- Implementar autenticação básica

**Tarefas:**
- [ ] Criar Dockerfile para backend
- [ ] Configurar Prisma com PostgreSQL (porta 5434)
- [ ] Implementar schema inicial do banco
- [ ] Configurar autenticação JWT
- [ ] Configurar CORS para frontend Hostinger
- [ ] Setup do Redis para cache
- [ ] Deploy no Portainer

**Entregas:**
- Backend rodando em container Docker
- Banco PostgreSQL conectado e funcional
- Sistema de autenticação implementado
- API documentada (Swagger/OpenAPI)

### Fase 3: Integração com Stays API (3-4 semanas)

**Objetivos:**
- Implementar cliente da Stays API
- Criar sistema de cache inteligente
- Desenvolver sincronização de dados

**Tarefas:**
- [ ] Estudar documentação da Stays API
- [ ] Criar cliente HTTP para Stays API
- [ ] Implementar StaysCache no banco
- [ ] Desenvolver lógica de sincronização
- [ ] Criar endpoints de proxy para Stays
- [ ] Implementar tratamento de erros e fallback
- [ ] Configurar jobs de sincronização periódica

**Entregas:**
- Cliente Stays API funcional
- Sistema de cache operacional
- Endpoints de integração disponíveis
- Documentação de integração

### Fase 4: Módulo de Clientes (2-3 semanas)

**Objetivos:**
- Criar CRUD de clientes enriquecidos
- Implementar visualização de dados da Stays
- Desenvolver sistema de tags e scoring

**Tarefas:**
- [ ] Criar API de clientes (CRUD)
- [ ] Desenvolver interface de cadastro/edição
- [ ] Implementar listagem com filtros
- [ ] Criar visualização de dados da Stays
- [ ] Implementar sistema de tags
- [ ] Desenvolver algoritmo de scoring
- [ ] Criar dashboard de cliente individual

**Entregas:**
- CRUD completo de clientes
- Interface de gestão de clientes
- Sistema de tags funcionando
- Visualização integrada Stays + CRM

### Fase 5: Módulo de Contratos (2-3 semanas)

**Objetivos:**
- Integrar gerador de contratos ao CRM
- Criar histórico de contratos
- Vincular contratos a clientes e reservas Stays

**Tarefas:**
- [ ] Migrar lógica de geração de PDFs para backend
- [ ] Criar sistema de armazenamento de PDFs
- [ ] Implementar histórico de contratos
- [ ] Vincular contratos a clientes CRM
- [ ] Vincular contratos a reservas Stays
- [ ] Criar interface de histórico
- [ ] Implementar busca e filtros de contratos

**Entregas:**
- Gerador de contratos integrado ao CRM
- Sistema de armazenamento de PDFs
- Histórico completo de contratos
- Vinculação com Stays funcionando

### Fase 6: Módulo de Interações (2 semanas)

**Objetivos:**
- Criar sistema de registro de interações
- Implementar timeline de interações por cliente
- Desenvolver categorização e busca

**Tarefas:**
- [ ] Criar API de interações (CRUD)
- [ ] Desenvolver interface de registro
- [ ] Implementar timeline de cliente
- [ ] Criar sistema de anexos
- [ ] Implementar filtros e busca
- [ ] Desenvolver notificações de follow-up

**Entregas:**
- Sistema de interações completo
- Timeline de cliente funcional
- Sistema de anexos operacional

### Fase 7: Módulo de Imóveis (2 semanas)

**Objetivos:**
- Criar cadastro complementar de imóveis
- Implementar gestão de manutenção
- Registrar custos operacionais

**Tarefas:**
- [ ] Criar API de imóveis (CRUD)
- [ ] Desenvolver interface de gestão
- [ ] Implementar histórico de manutenção
- [ ] Criar controle de custos
- [ ] Desenvolver sistema de documentação
- [ ] Implementar alertas de manutenção

**Entregas:**
- CRUD de imóveis funcionando
- Sistema de manutenção operacional
- Controle de custos implementado

### Fase 8: Analytics e Dashboards (3 semanas)

**Objetivos:**
- Criar dashboard principal do CRM
- Implementar KPIs e métricas
- Desenvolver relatórios

**Tarefas:**
- [ ] Criar dashboard principal
- [ ] Implementar KPIs de clientes
- [ ] Desenvolver métricas de contratos
- [ ] Criar análise de receita
- [ ] Implementar gráficos e visualizações
- [ ] Desenvolver exportação de relatórios

**Entregas:**
- Dashboard principal funcional
- KPIs implementados
- Sistema de relatórios operacional

### Fase 9: Refinamentos e Otimizações (2 semanas)

**Objetivos:**
- Melhorar performance
- Ajustar UX
- Correção de bugs

**Tarefas:**
- [ ] Otimizar queries do banco
- [ ] Melhorar cache e sincronização
- [ ] Ajustar interfaces baseado em feedback
- [ ] Corrigir bugs identificados
- [ ] Documentar sistema completo
- [ ] Criar guia de usuário

**Entregas:**
- Sistema otimizado
- Documentação completa
- Guia de usuário

## 6. Stack Tecnológico Completo

### Frontend
```json
{
  "framework": "Next.js 14+",
  "linguagem": "TypeScript 5+",
  "ui": "React 19",
  "estilo": "CSS Modules / Tailwind CSS",
  "formulários": "React Hook Form + Zod",
  "tabelas": "TanStack Table",
  "gráficos": "Recharts / Chart.js",
  "pdf": "pdfMake",
  "http": "Axios / Fetch API",
  "state": "React Context / Zustand"
}
```

### Backend
```json
{
  "framework": "Next.js API Routes / NestJS",
  "linguagem": "TypeScript 5+",
  "orm": "Prisma",
  "validação": "Zod",
  "autenticação": "JWT + bcrypt",
  "cache": "Redis",
  "jobs": "Bull / BullMQ",
  "api-client": "Axios",
  "documentação": "Swagger / OpenAPI"
}
```

### Banco de Dados
```json
{
  "primário": "PostgreSQL 15+",
  "porta": 5434,
  "orm": "Prisma",
  "migrações": "Prisma Migrate",
  "cache": "Redis"
}
```

### DevOps
```json
{
  "containerização": "Docker",
  "orquestração": "Portainer",
  "ci-cd": "GitHub Actions",
  "versionamento": "Git / GitHub",
  "monitoramento": "A definir (Sentry, LogRocket)"
}
```

## 7. Infraestrutura e Deploy

### 7.1 Ambiente de Produção

#### Frontend (Hostinger)
```bash
# Build do Next.js para export estático ou SSR
npm run build
npm run start # se SSR, ou export estático para Hostinger
```

#### Backend (VPS Docker)
```dockerfile
# Dockerfile do Backend
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/crm
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - STAYS_API_KEY=${STAYS_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    ports:
      - "5434:5432"
    environment:
      - POSTGRES_DB=crm
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 7.2 Variáveis de Ambiente

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5434/crm"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura"
JWT_EXPIRES_IN="7d"

# Stays API
STAYS_API_URL="https://api.stays.com.br"
STAYS_API_KEY="sua-api-key-da-stays"

# App
NODE_ENV="production"
PORT=3001

# CORS
FRONTEND_URL="https://contratos.casasdemargarida.com.br"
```

### 7.3 Configuração de Rede

```
Frontend (Hostinger): https://contratos.casasdemargarida.com.br
Backend (VPS): https://api-crm.casasdemargarida.com.br
PostgreSQL: localhost:5434 (dentro do Docker)
Redis: localhost:6379 (dentro do Docker)
```

## 8. Segurança

### 8.1 Medidas de Segurança

1. **Autenticação e Autorização**
   - JWT com expiração configurável
   - Refresh tokens para sessões longas
   - Controle de acesso baseado em papéis (RBAC)

2. **Proteção de Dados**
   - Senhas com bcrypt (10+ rounds)
   - HTTPS obrigatório
   - Sanitização de inputs (Zod)
   - Proteção contra SQL Injection (Prisma)
   - Proteção contra XSS (sanitização de outputs)

3. **API**
   - Rate limiting
   - CORS configurado
   - Validação de inputs em todas as rotas
   - Logs de auditoria

4. **Banco de Dados**
   - Backups automáticos diários
   - Credenciais em variáveis de ambiente
   - Conexão apenas dentro do Docker

### 8.2 LGPD e Privacidade

1. **Dados Sensíveis**
   - CPF armazenado de forma segura
   - Possibilidade de anonimização
   - Logs de acesso a dados pessoais

2. **Direitos do Titular**
   - Funcionalidade de exportação de dados
   - Possibilidade de exclusão de dados
   - Histórico de consentimentos

## 9. Métricas e KPIs

### 9.1 KPIs de Clientes
- Total de clientes cadastrados
- Clientes ativos (com reservas nos últimos 12 meses)
- Taxa de retorno de clientes
- Score médio de clientes
- Valor médio por cliente (LTV)

### 9.2 KPIs de Contratos
- Total de contratos gerados
- Contratos por tipo
- Contratos por período
- Taxa de conversão (reserva → contrato)

### 9.3 KPIs de Interações
- Total de interações por período
- Interações por tipo
- Tempo médio de resposta
- Satisfação do cliente (se implementado)

### 9.4 KPIs Operacionais
- Tempo de resposta da API
- Taxa de cache hit/miss
- Taxa de sincronização com Stays
- Uptime do sistema

## 10. Roadmap Futuro

### Versão 2.0 (Futuro)
- [ ] Assinatura digital de contratos
- [ ] Integração com WhatsApp Business API
- [ ] Sistema de notificações push
- [ ] App mobile (React Native)
- [ ] Integração com sistema de pagamentos
- [ ] Portal do cliente (self-service)
- [ ] Sistema de tickets/suporte
- [ ] Integração com ferramentas de marketing (Mailchimp, RD Station)

### Versão 3.0 (Futuro Distante)
- [ ] IA para análise preditiva de clientes
- [ ] Chatbot para atendimento
- [ ] Automações avançadas
- [ ] Multi-idiomas
- [ ] Multi-tenant (franquias)

## 11. Considerações Finais

Este plano representa a evolução natural do gerador de contratos em um CRM completo e funcional. O desenvolvimento é incremental, permitindo validação constante de cada fase antes de avançar para a próxima.

### Próximos Passos Imediatos:
1. Validar acesso à Stays API e estudar documentação
2. Configurar ambiente de desenvolvimento local
3. Iniciar Fase 1: Migração para Next.js
4. Configurar repositório com branches de desenvolvimento

### Estimativa Total de Desenvolvimento:
- **Tempo estimado**: 20-25 semanas (5-6 meses)
- **Recursos necessários**: 1-2 desenvolvedores full-stack
- **Investimento estimado**: A definir baseado em recursos

---

**Última atualização**: 2025-01-13
**Versão do documento**: 1.0
**Status**: Planejamento aprovado
