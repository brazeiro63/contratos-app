# 🚀 Deploy para Hostinger - Frontend Contratos

## 📋 Pré-requisitos

- Conta Hostinger com hospedagem ativa
- Domínio `contratos.casasdemargarida.com.br` configurado
- Acesso FTP ou File Manager

## 🔧 Preparar Build

### 1. Gerar arquivos estáticos

```bash
npm run build
```

Isso irá criar a pasta `out/` com todos os arquivos HTML, CSS, JS e assets.

## 📤 Upload para Hostinger

### Opção A: Via File Manager (Recomendado)

1. Acesse o **hPanel** da Hostinger
2. Vá em **Websites** → Selecione o site `contratos.casasdemargarida.com.br`
3. Clique em **File Manager**
4. Navegue até a pasta `public_html`
5. **Delete** todos os arquivos antigos (se houver)
6. **Upload** todo o conteúdo da pasta `out/` para `public_html`

### Opção B: Via FTP

1. Conecte ao FTP da Hostinger:
   - Host: `ftp.casasdemargarida.com.br`
   - Usuário: [seu usuário]
   - Senha: [sua senha]
   - Porta: 21

2. Navegue até `/public_html`
3. Delete arquivos antigos
4. Upload do conteúdo de `out/` para `/public_html`

## 🔗 Configurar Domínio

1. No hPanel, vá em **Domains**
2. Certifique-se que `contratos.casasdemargarida.com.br` aponta para o site correto
3. SSL deve estar ativado automaticamente (Let's Encrypt)

## ⚙️ Configurações Importantes

### Arquivo .htaccess (Criar em public_html)

```apache
# Redirecionar HTTP para HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Suporte para rotas do Next.js
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 🧪 Testar Deploy

1. Acesse: https://contratos.casasdemargarida.com.br
2. Teste a navegação entre páginas
3. Teste a geração de PDFs
4. Verifique se os formulários funcionam

## 🔄 Atualização Futura

Para atualizar o site:

1. Rode `npm run build` localmente
2. Delete arquivos antigos em `public_html`
3. Upload do novo conteúdo de `out/`

## 📝 Variáveis de Ambiente

O arquivo `.env.production` já está configurado:

```env
NEXT_PUBLIC_API_URL=https://api-crm.casasdemargarida.com.br/api
```

Esta variável é embutida no build estático, então qualquer mudança requer novo build e upload.

## ⚠️ Troubleshooting

### Páginas não carregam (404)
- Verifique se o arquivo `.htaccess` existe e está correto
- Certifique-se que todos os arquivos foram enviados

### CSS não carrega
- Limpe o cache do navegador
- Verifique permissões dos arquivos (644 para arquivos, 755 para pastas)

### API não responde
- Verifique se o backend está rodando na VPS
- Teste manualmente: `curl https://api-crm.casasdemargarida.com.br/api`
- Verifique CORS no backend

## 📊 Estrutura de Arquivos no Servidor

```
public_html/
├── .htaccess
├── index.html
├── property-management.html
├── rental-contract.html
├── _next/
│   └── static/
│       ├── chunks/
│       ├── css/
│       └── media/
└── ...outros arquivos estáticos
```

## 🌐 URLs

- **Frontend:** https://contratos.casasdemargarida.com.br
- **API Backend:** https://api-crm.casasdemargarida.com.br/api
