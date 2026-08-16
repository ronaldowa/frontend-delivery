# Frontend Delivery

Frontend em Next.js para atendimento com IA e consultas RAG em documentos PDF.

## Visao Geral

Este projeto fornece uma interface web para conversar com uma API de IA, consultar documentos da base de conhecimento e testar respostas recuperadas por RAG. O frontend usa rotas internas do Next.js como proxy para evitar problemas de CORS no navegador.

## Tecnologias

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS
- ESLint
- lucide-react

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- API backend rodando localmente ou disponivel em uma URL acessivel

Por padrao, o frontend espera a API em:

```text
http://127.0.0.1:8000
```

## Configuracao

Crie o arquivo de ambiente local a partir do exemplo:

```bash
cp .env.example .env.local
```

Variavel disponivel:

```env
API_BASE_URL=http://127.0.0.1:8000
API_JWT_SECRET_KEY=dev-secret-change-me
API_JWT_ISSUER=rag-frontend
API_JWT_AUDIENCE=rag-backend
API_JWT_EXPIRES_SECONDS=300
```

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Rode o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse no navegador:

```text
http://127.0.0.1:3000
```

## Scripts

| Comando | Descricao |
|---|---|
| `npm run dev` | Inicia o servidor local de desenvolvimento. |
| `npm run build` | Gera a build de producao. |
| `npm run start` | Executa a build de producao. |
| `npm run lint` | Executa a validacao com ESLint. |

## Estrutura

```text
src/
  app/
    api/
      chat/route.ts
      health/route.ts
      rag/pdf-test/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    ChatPanel.tsx
    RagTestPanel.tsx
    SourceList.tsx
    StatusBadge.tsx
  lib/
    api.ts
    text.ts
    types.ts
```

## Rotas Internas

| Rota | Metodo | Destino no backend |
|---|---|---|
| `/api/health` | GET | `/health` |
| `/api/chat` | POST | `/api/v1/chat` |
| `/api/rag/pdf-test` | POST | `/api/v1/rag/pdf/test` |

## Funcionalidades

- Chat com assistente de IA
- Consulta direta em documentos PDF via RAG
- Exibicao de fontes retornadas pela API
- Tratamento de erros quando o backend esta indisponivel
- Layout responsivo
- Headers basicos de seguranca configurados no Next.js
- JWT Bearer gerado nas rotas proxy para comunicacao com o backend

## Seguranca Basica

O arquivo `next.config.ts` aplica headers HTTP basicos em todas as rotas:

- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

As chamadas para o backend passam por `src/lib/api.ts`, que gera um JWT HS256 server-side e envia o header `Authorization: Bearer <token>`. O valor de `API_JWT_SECRET_KEY` deve ser igual ao `JWT_SECRET_KEY` configurado no backend.

## Validacao

Antes de publicar ou abrir um pull request, rode:

```bash
npm run lint
npm run build
```

## Observacoes

- O frontend depende do backend para responder perguntas.
- Arquivos locais como `.env.local`, `.next/`, `node_modules/` e logs sao ignorados pelo Git.
- Ajuste `API_BASE_URL` quando a API estiver em outro host ou ambiente.

## Licenca

MIT.

Autor: Ronaldo Aguiar.
