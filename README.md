# Gerador de Contratos - Casas de Margarida

Sistema de geração de contratos para administração de imóveis e locação por temporada.

## 🚀 Deploy

### Para Desenvolvimento Local

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

### Para Produção (Hostinger)

1. **Gerar arquivos estáticos:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Use o arquivo `contratos-frontend-deploy.zip` gerado
   - Faça upload para a pasta `public_html` na Hostinger
   - Ou siga as instruções detalhadas em `DEPLOY-HOSTINGER.md`

## 🌐 URLs

- **Frontend:** https://contratos.casasdemargarida.com.br
- **API Backend:** https://api-crm.casasdemargarida.com.br/api

## 📦 Estrutura

- `src/app/` - Páginas Next.js (App Router)
- `src/components/` - Componentes React
- `src/templates/` - Templates de PDF (pdfMake)
- `src/constants/` - Constantes e configurações
- `out/` - Arquivos estáticos gerados (não versionado)

## 🔧 Tecnologias

- Next.js 16
- React 19
- TypeScript
- React Hook Form + Zod
- pdfMake

## 📝 Variáveis de Ambiente

- `.env.local` - Desenvolvimento local
- `.env.production` - Produção (Hostinger)

## 🛠️ Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build para produção (gera pasta `out/`)
- `npm run lint` - Linter

## 📄 Licença

Propriedade de Casas de Margarida Administração de Imóveis Ltda.
