# 🤖 Guia de Contexto para Agentes de IA (Jules / Gemini / Meta IA)

Bem-vindo ao repositório do **LisLock**! Este ficheiro dita as regras, a arquitetura e as salvaguardas do nosso sistema. Lê atentamente antes de iniciares qualquer tarefa.

## 1. Stack e Tecnologias
- **Framework:** Next.js 15 (App Router - estritamente Server Components por defeito).
- **Linguagem:** TypeScript estrito (`tsc --noEmit`).
- **Styling:** Tailwind CSS e componentes shadcn/ui.
- **Base de Dados:** MongoDB (via Mongoose ou driver nativo).
- **Ícones:** Lucide-React.
- **Idiomas:** Português de Portugal (pt-PT) como primário. Inglês (en-IE) como legacia e *fallback*.

## 2. Comandos de Arranque e Ambiente
- **Instalação:** `npm ci` (preferencial) ou `npm install`.
- **Desenvolvimento:** `npm run dev`.
- **Linting e Tipos:** `npm run lint` e `npx tsc --noEmit`.
- **Build:** `npm run build`.
- **Testes:** Se não existir script de teste configurado, criar testes na pasta `/__tests__/` utilizando Vitest e mencionar no Pull Request.
- **Ambiente de Base de Dados Local:** O agente deve usar `MONGO_URI=mongodb://localhost:27017/lislock_dev` criado num `.env.local`. **NUNCA usar credenciais ou tentar aceder a bases de dados de produção.**

## 3. Regras de Código (Cruciais)
1. **Server vs Client:** NUNCA passes funções (como `onClick`) de um Server Component para um Client Component (evita o erro `Event handlers cannot be passed to Client Component props`). Se precisares de interatividade, adiciona `"use client";` na LINHA 1 do ficheiro.
2. **Hidratação:** NUNCA cries instâncias de `new Date()` no lado do servidor sem as sincronizares corretamente com o cliente.
3. **Formatação de Datas:** O padrão a usar é sempre o pt-PT (ex: `Intl.DateTimeFormat("pt-PT")`), abandonando o antigo `en-IE`.
4. **Traduções:** O sistema está a ser migrado de Inglês para Português Europeu. Nunca hardcodar novas strings em inglês na UI do cliente. Utiliza a pasta de dicionários (`/src/lib/dictionaries/`, se aplicável) ou traduz de forma explícita para pt-PT, que é a fonte da verdade.
5. **Cuidado com Regex PT:** Os números de telefone em PT (ex: `+351...`) requerem *escape* do sinal `+` quando usados em queries de Regex: `new RegExp(telefone.replace(/\+/g, "\\+"))`.

## 4. Estrutura do Repositório e Áreas de Trabalho
- `/src/app/` -> Rotas principais do site (Homepage, Services, Admin).
- `/src/app/customer/bookings/` -> Área de Cliente (Pesquisa e Estado da Reserva).
- `/src/components/` -> Componentes de UI (UI geral e componentes shadcn).
- `/src/components/booking/` -> Componentes de UI específicos de reservas.
- `/src/lib/` -> Funções utilitárias (Base de Dados, Google Ads, Dicionários).
- `/src/types/` -> Tipagens TypeScript.
- **`/scripts/agent-tools/` -> ZONA SEGURA DO AGENTE:** Local onde o agente PODE e DEVE criar scripts de recolha de dados, ferramentas CLI, análises e relatórios. Ficheiros nesta diretoria não interferem com o *build* do Next.js.

## 5. O que o Agente PODE e DEVE Fazer Sozinho
- Ler código e gerar relatórios na diretoria `/scripts/agent-tools/reports/`.
- Criar ferramentas CLI ou scripts Node/TS em `/scripts/agent-tools/` (com um README curto explicativo).
- Escrever testes unitários para a lógica de negócio.
- Corrigir bugs marcados com `// TODO: ` ou `// FIX: `.
- Traduzir componentes de UI restantes (de `en-IE` para `pt-PT`), mantendo a integridade do design Tailwind.
- Realizar *refactoring* pequeno e limpo, assegurando que a tipagem TypeScript se mantém intacta.
- **Modo da Base de Dados:** O agente opera em modo *read-only* por defeito. Queries de escrita/mutação só devem ser feitas mediante flag explícita no *prompt*.

## 6. O que o Agente NÃO DEVE FAZER (Zonas Proibidas)
- **NÃO alterar** a lógica de submissão de reservas na rota `/api/booking`.
- **NÃO remover** a proteção de "Datas no Passado" implementada no frontend do calendário (`DateTimeAvailabilityField`).
- **NÃO apagar** a lógica de "smart search" que cruza números de telemóvel com e sem DDD na Área de Cliente.
- **NÃO alterar** schemas do Mongoose sem criar uma *migration* correspondente.
- **NÃO tocar** nos ficheiros `.env`, em chaves de API, nem na configuração do Google Ads.
- **NUNCA** fazer *push* direto para a *branch* `main`. Todo o código gerado deve ser submetido através de um Pull Request com descrição clara.

## 7. Checklist de Validação (Antes de Abrir PR)
Antes de o agente submeter código, tem de validar e garantir as seguintes condições:
- [ ] `npx tsc --noEmit` corre sem erros de tipagem.
- [ ] `npm run lint` corre limpo, sem warnings críticos.
- [ ] `npm run build` é concluído com sucesso.
- [ ] Todos os testes existentes passam.
- [ ] Não foram introduzidas novas *strings* de UI hardcodadas em Inglês.
- [ ] A pasta `/api/booking` (e rotas críticas associadas) não sofreu alterações não solicitadas.