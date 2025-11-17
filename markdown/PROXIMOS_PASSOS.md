# ✅ Deploy Concluído - Próximos Passos

## Status Atual

### 🟢 CRM Frontend - VPS (RODANDO)
- **URL**: http://46.202.151.92:3000
- **Container**: crm-frontend
- **Status**: ✅ Rodando e respondendo
- **Porta**: 3000
- **API Backend**: https://api-crm.casasdemargarida.com.br/api

### 🟡 Contratos Estáticos - Hostinger (PENDENTE)
- **Build pronto**: `out-static/`
- **Aguardando**: Upload para Hostinger

---

## Próximos Passos

### 1. Configurar Domínio/Subdomínio para o CRM

Você precisa configurar um domínio ou subdomínio para acessar o CRM, pois acessar via IP:porta não é ideal.

**Opções:**

#### Opção A: Subdomínio (Recomendado)
```
crm.casasdemargarida.com.br → http://46.202.151.92:3000
```

**Como fazer:**
1. Acesse o painel DNS da Hostinger (ou onde seu domínio está)
2. Adicione um registro A:
   - **Tipo**: A
   - **Nome**: crm
   - **Apontando para**: 46.202.151.92
3. Configure um reverse proxy no servidor (nginx/caddy) na porta 80/443
   - Ou use Cloudflare Tunnel (gratuito)

#### Opção B: Usar Cloudflare Tunnel (Sem configurar servidor)
```bash
# Na VPS, instalar cloudflared
ssh vps-cdm
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Criar tunnel
cloudflared tunnel login
cloudflared tunnel create crm-frontend
cloudflared tunnel route dns crm-frontend crm.casasdemargarida.com.br

# Criar config
nano ~/.cloudflared/config.yml
```

```yaml
tunnel: <TUNNEL-ID>
credentials-file: /home/brazeiro63/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: crm.casasdemargarida.com.br
    service: http://localhost:3000
  - service: http_status:404
```

```bash
# Rodar como serviço
cloudflared service install
sudo systemctl start cloudflared
```

### 2. Fazer Upload do Build Estático

```bash
# Opção A: Via script (se tiver acesso SSH à Hostinger)
./build-static.sh
scp -r out-static/* hostinger:/public_html/

# Opção B: Manual (via File Manager Hostinger)
1. Acesse Hostinger File Manager
2. Navegue até public_html/
3. Faça upload de todos os arquivos de out-static/
```

### 3. Verificar Integração CRM ↔ Backend

Teste se o CRM está conseguindo se comunicar com o backend:

```bash
# Acesse: http://46.202.151.92:3000/crm/clientes
# Deve listar os clientes da API
```

Se houver erro de CORS, adicione no backend (NestJS):

```typescript
// main.ts
app.enableCors({
  origin: ['http://46.202.151.92:3000', 'http://crm.casasdemargarida.com.br'],
  credentials: true,
});
```

### 4. Configurar HTTPS (Certificado SSL)

Para produção, configure HTTPS:

**Com nginx:**
```bash
ssh vps-cdm
sudo apt install nginx certbot python3-certbot-nginx

# Criar config do nginx
sudo nano /etc/nginx/sites-available/crm
```

```nginx
server {
    listen 80;
    server_name crm.casasdemargarida.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/crm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Certificado SSL
sudo certbot --nginx -d crm.casasdemargarida.com.br
```

---

## Comandos Úteis

### Gerenciar CRM na VPS

```bash
# Ver logs em tempo real
ssh vps-cdm 'docker logs -f crm-frontend'

# Reiniciar container
ssh vps-cdm 'cd /home/brazeiro63/contratos-app && docker compose restart'

# Parar container
ssh vps-cdm 'cd /home/brazeiro63/contratos-app && docker compose down'

# Iniciar container
ssh vps-cdm 'cd /home/brazeiro63/contratos-app && docker compose up -d'

# Ver status
ssh vps-cdm 'docker ps | grep crm-frontend'

# Entrar no container
ssh vps-cdm 'docker exec -it crm-frontend sh'
```

### Re-deploy (Atualizar código)

```bash
# Fazer alterações no código e executar:
./deploy-vps.sh
```

### Build Estático (Atualizar Hostinger)

```bash
./build-static.sh
# Depois fazer upload do out-static/
```

---

## URLs Finais

Após completar os passos acima:

- **Contratos Estáticos**: https://casasdemargarida.com.br/
- **CRM**: https://crm.casasdemargarida.com.br/
- **API Backend**: https://api-crm.casasdemargarida.com.br/api

---

## Troubleshooting

### CRM não carrega clientes
1. Verificar se backend está rodando
2. Verificar logs: `docker logs crm-frontend`
3. Verificar variável de ambiente `NEXT_PUBLIC_API_URL`

### Container não inicia
```bash
ssh vps-cdm 'docker logs crm-frontend'
```

### Porta 3000 não acessível
```bash
ssh vps-cdm 'sudo ufw allow 3000'
```

### Rebuild completo
```bash
ssh vps-cdm
cd /home/brazeiro63/contratos-app
docker compose down
docker compose build --no-cache
docker compose up -d
```
