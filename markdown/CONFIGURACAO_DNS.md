# Configuração DNS Necessária

## ✅ Deploy Completo do CRM Frontend

O CRM Frontend está deployado como Docker Stack com Traefik configurado para HTTPS automático via Let's Encrypt.

## 📋 Registros DNS Necessários

Você precisa adicionar os seguintes registros DNS no painel da Hostinger (ou onde seu domínio está registrado):

### No painel DNS do domínio `casasdemargarida.com.br`:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | crm | 46.202.151.92 | 3600 |
| A | api-crm | 46.202.151.92 | 3600 |
| A | contratos | 46.202.151.92 | 3600 |

**OU se preferir usar CNAME:**

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| CNAME | crm | casasdemargarida.com.br | 3600 |
| CNAME | api-crm | casasdemargarida.com.br | 3600 |
| CNAME | contratos | casasdemargarida.com.br | 3600 |

## 🌐 URLs Finais

Após configurar o DNS, você terá:

- **CRM Frontend**: https://crm.casasdemargarida.com.br
- **API Backend**: https://api-crm.casasdemargarida.com.br
- **Contratos Estáticos**: https://contratos.casasdemargarida.com.br

## 🔍 Status Atual

### ✅ Configurado e Funcionando:
- ✅ CRM Frontend - Docker Stack deployado
- ✅ Traefik com Let's Encrypt configurado
- ✅ API Backend rodando
- ✅ Labels corretas do Traefik aplicadas

### ⏳ Pendente:
- ⏳ Configuração DNS (você precisa fazer)
- ⏳ Upload dos contratos estáticos na Hostinger

## 📝 Como Configurar DNS na Hostinger

1. Acesse o painel da Hostinger
2. Vá em **Domínios** → **casasdemargarida.com.br** → **DNS/Registros DNS**
3. Clique em **Adicionar Registro**
4. Adicione os 3 registros acima (crm, api-crm, contratos)
5. Aguarde propagação DNS (pode levar de 5 minutos a 48 horas, geralmente 15-30 minutos)

## 🧪 Como Testar

### Verificar DNS (após configurar):
```bash
nslookup crm.casasdemargarida.com.br
nslookup api-crm.casasdemargarida.com.br
```

Deve retornar: `46.202.151.92`

### Testar HTTPS:
```bash
curl -I https://crm.casasdemargarida.com.br
curl -I https://api-crm.casasdemargarida.com.br
```

Deve retornar: `HTTP/2 200` (pode levar alguns minutos para o certificado ser gerado)

### Verificar certificado SSL:
```bash
ssh vps-cdm
cat /etc/traefik/letsencrypt/acme.json | grep -i "crm.casasdemargarida.com.br"
```

## 🔧 Verificar Logs do Traefik

Se houver problemas com HTTPS:

```bash
ssh vps-cdm
docker service logs traefik_traefik | grep -i "crm"
```

## 📊 Verificar Status dos Serviços

```bash
# Ver todos os serviços
ssh vps-cdm 'docker service ls | grep crm'

# Ver logs do CRM Frontend
ssh vps-cdm 'docker service logs crm-frontend-stack_crm-frontend'

# Ver logs do Backend
ssh vps-cdm 'docker service logs crm-backend-stack_crm-backend'
```

## 🚨 Troubleshooting

### DNS não resolve
- Aguarde até 30 minutos para propagação
- Limpe cache DNS: `sudo systemd-resolve --flush-caches`
- Teste com: `dig crm.casasdemargarida.com.br`

### HTTPS não funciona (ERR_CERT_COMMON_NAME_INVALID)
- Verifique se o DNS está resolvendo corretamente primeiro
- Aguarde Let's Encrypt gerar o certificado (pode levar 5-10 minutos)
- Veja logs do Traefik: `docker service logs traefik_traefik`

### Certificado não é gerado
- Certifique-se de que a porta 80 e 443 estão abertas no firewall
- Verifique se outro serviço não está usando essas portas
- Reinicie o Traefik: `docker service update traefik_traefik --force`

## ✨ Próximos Passos

1. **Configure o DNS** (seguindo instruções acima)
2. **Aguarde propagação** (15-30 minutos)
3. **Teste o acesso**: https://crm.casasdemargarida.com.br
4. **Faça upload dos contratos estáticos** para a Hostinger (use o script `./build-static.sh`)

## 📞 Comandos de Gerenciamento

```bash
# Re-deploy do CRM Frontend
./deploy-stack.sh

# Reiniciar serviço CRM
ssh vps-cdm 'docker service update crm-frontend-stack_crm-frontend --force'

# Remover stack (cuidado!)
ssh vps-cdm 'docker stack rm crm-frontend-stack'

# Ver todas as rotas do Traefik
ssh vps-cdm 'docker exec $(docker ps -q -f name=traefik) traefik dump'
```
