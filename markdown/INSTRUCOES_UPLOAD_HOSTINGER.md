# 📦 Instruções de Upload - Hostinger

## Arquivo Pronto para Upload

**Arquivo**: `contratos-static.zip` (1.4 MB)
**Localização**: `/home/brazeiro63/contratos-app/contratos-static.zip`

## 📋 Passo a Passo

### 1. Download do Zip (se necessário)

Se você estiver em outro computador, baixe o arquivo:

```bash
scp brazeiro63@seu-servidor:/home/brazeiro63/contratos-app/contratos-static.zip ~/Downloads/
```

### 2. Acesse o File Manager da Hostinger

1. Faça login no painel da Hostinger
2. Vá em **Hospedagem** → Seu domínio
3. Clique em **File Manager**
4. Navegue até a pasta **public_html/**

### 3. Limpe o Diretório (Importante!)

⚠️ **Antes de fazer upload**, limpe o conteúdo atual de `public_html/`:

1. Selecione todos os arquivos em `public_html/`
2. **NÃO DELETE** os seguintes (se existirem):
   - `.htaccess`
   - `cgi-bin/`
   - `error_log`
3. Delete tudo mais

### 4. Faça Upload do Zip

1. Dentro de `public_html/`, clique em **Upload**
2. Selecione `contratos-static.zip`
3. Aguarde o upload completar

### 5. Extraia o Zip

1. Após upload, você verá `contratos-static.zip` em `public_html/`
2. Clique com botão direito no arquivo → **Extract**
3. Confirme extração na pasta atual
4. Aguarde a extração completar

### 6. Limpe o Zip

Após extrair, delete o arquivo `contratos-static.zip` para economizar espaço.

### 7. Verifique a Estrutura

A estrutura final deve ficar assim:

```
public_html/
├── _next/
├── _not-found/
├── property-management/
├── rental-contract/
├── index.html
├── 404.html
├── favicon.ico
├── next.svg
├── vercel.svg
├── file.svg
├── globe.svg
└── window.svg
```

## ✅ Teste o Site

Após upload, acesse:

- **Home**: https://contratos.casasdemargarida.com.br
- **Contratos**: https://contratos.casasdemargarida.com.br/rental-contract
- **Gestão**: https://contratos.casasdemargarida.com.br/property-management

## 🔧 Configuração Opcional: .htaccess

Se quiser adicionar redirecionamentos ou configurações extras, crie um arquivo `.htaccess` em `public_html/`:

```apache
# Forçar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Habilitar compressão
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Cache de arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## 🚨 Troubleshooting

### Página em branco
- Verifique se extraiu o zip corretamente
- Certifique-se de que `index.html` está em `public_html/`

### Erro 404 em rotas
- Next.js estático usa HTML para cada rota
- `/rental-contract` → `/rental-contract.html`
- A Hostinger deve fazer isso automaticamente

### CSS não carrega
- Verifique se a pasta `_next/` foi extraída corretamente
- Limpe cache do navegador (Ctrl + Shift + R)

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs de erro no painel da Hostinger
2. Certifique-se de que o domínio está apontando corretamente
3. Aguarde até 24h para propagação DNS completa

---

**Build gerado em**: $(date '+%Y-%m-%d %H:%M:%S')
**Páginas incluídas**: Home, Contratos de Locação, Gestão de Propriedades
