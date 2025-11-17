# 🚀 Deploy Completo - Contratos & CRM

## Status Atual

✅ **CRM Frontend**: Deployado na VPS com Docker Swarm + Traefik  
⏳ **DNS**: Pendente configuração  
⏳ **Contratos**: Build pronto, pendente upload

## 📖 Documentação

- **`CONFIGURACAO_DNS.md`** - ⭐ **LEIA PRIMEIRO** - Como configurar DNS
- **`STATUS_DEPLOY.md`** - Status detalhado de todos os componentes
- **`PROXIMOS_PASSOS.md`** - Próximas ações e troubleshooting
- **`DEPLOY.md`** - Guia técnico completo

## ⚡ Quick Start

### 1. Configure DNS (URGENTE)

Adicione no painel DNS da Hostinger:

```
Tipo: A
Nome: crm
Valor: 46.202.151.92

Tipo: A
Nome: api-crm
Valor: 46.202.151.92
```

**Leia**: `CONFIGURACAO_DNS.md` para detalhes

### 2. Aguarde e Teste

Aguarde 15-30 min, depois:

```bash
curl -I https://crm.casasdemargarida.com
```

### 3. Upload Contratos Estáticos

```bash
./build-static.sh
# Depois fazer upload da pasta out-static/ na Hostinger
```

## 🛠️ Comandos

```bash
# Re-deploy CRM
./deploy-stack.sh

# Build estático
./build-static.sh

# Ver logs
ssh vps-cdm 'docker service logs -f crm-frontend-stack_crm-frontend'

# Status
ssh vps-cdm 'docker service ls | grep crm'
```

## 🌐 URLs (após DNS)

- CRM: https://crm.casasdemargarida.com
- API: https://api-crm.casasdemargarida.com
- Contratos: https://contratos.casasdemargarida.com

## 📞 Suporte

Ver `CONFIGURACAO_DNS.md` para troubleshooting detalhado.
