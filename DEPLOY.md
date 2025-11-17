# Guia de Deploy - Contratos e CRM

Este projeto está dividido em duas partes:

## 1. Aplicação Estática (Contratos) - Hostinger Web Hosting

A aplicação de geração de contratos é 100% estática e pode ser hospedada em qualquer servidor web.

### Build Estático

```bash
# Criar build estático (sem CRM)
cp next.config.static.ts next.config.ts
rm -rf .next src/app/crm
npm run build
```

O build estático será gerado na pasta `out/` ou você pode usar a pasta `out-static/` já criada.

### Deploy na Hostinger

1. Acesse o painel da Hostinger
2. Vá para File Manager
3. Faça upload de todos os arquivos da pasta `out-static/` para o diretório `public_html/`
4. Acesse seu domínio

## 2. CRM Frontend - VPS Docker

O CRM precisa de Next.js SSR e roda em um container Docker na VPS.

### Build e Deploy Docker

#### Opção A: Build na VPS

```bash
# 1. Copiar código para a VPS
scp -r /home/brazeiro63/contratos-app vps-cdm:/root/

# 2. Na VPS, build e deploy
ssh vps-cdm
cd /root/contratos-app
docker-compose up -d --build
```

#### Opção B: Build local e push

```bash
# 1. Build da imagem
docker build -t crm-frontend:latest .

# 2. Salvar imagem
docker save crm-frontend:latest | gzip > crm-frontend.tar.gz

# 3. Copiar para VPS
scp crm-frontend.tar.gz vps-cdm:/root/

# 4. Na VPS, carregar imagem
ssh vps-cdm
docker load < /root/crm-frontend.tar.gz
cd /root/contratos-app
docker-compose up -d
```

### Configuração do Docker Compose

O `docker-compose.yml` já está configurado. Certifique-se de que:

1. A rede `crm-network` existe (compartilhada com o backend)
2. O serviço `api-crm` está rodando
3. A variável `NEXT_PUBLIC_API_URL` aponta para o backend correto

### Acessar o CRM

Após o deploy, o CRM estará disponível em:
- Local: http://localhost:3000
- VPS: http://IP_DA_VPS:3000

### Integração com Backend

O CRM se comunica com o backend através da variável `NEXT_PUBLIC_API_URL`.

No `docker-compose.yml`, está configurado para usar `http://api-crm:3001/api` (comunicação interna do Docker).

Para desenvolvimento local, crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Estrutura de Arquivos

```
contratos-app/
├── out-static/          # Build estático para Hostinger
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home (estático)
│   │   ├── rental-contract/   # Contratos (estático)
│   │   ├── property-management/ # Gestão (estático)
│   │   └── crm/               # CRM (dinâmico)
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── Dockerfile           # Para build Docker do CRM
├── docker-compose.yml   # Orquestração do CRM
├── next.config.ts       # Config standalone (Docker)
└── next.config.static.ts # Config export (Hostinger)
```

## Verificar Status

### Hostinger (Estático)
Acesse a URL do site no navegador.

### VPS (CRM)
```bash
ssh vps-cdm
docker ps | grep crm-frontend
docker logs crm-frontend
```

## Troubleshooting

### Build Estático Falha
- Certifique-se de ter removido `src/app/crm/` antes do build
- Use `next.config.static.ts` (com `output: 'export'`)

### Container Docker Não Inicia
```bash
# Ver logs
docker logs crm-frontend

# Reconstruir
docker-compose down
docker-compose up -d --build
```

### Erro de Conexão com API
- Verifique se o backend está rodando
- Verifique a rede Docker: `docker network inspect crm-network`
- Verifique a variável `NEXT_PUBLIC_API_URL`
