# SquadUp — Roadmap Inicial do Front-end

## Status de execução (atualizado em 2026-10-26, sessão 38)

| Fase | Descrição | Status |
|------|-----------|--------|
| Fase 1 | Estrutura inicial do projeto | 🟢 Concluída (19/19 tarefas) |
| Fase 2 | Fluxo de entrada do usuário | 🟢 Concluída (8/8 tarefas) |
| — | Refinamento visual (Electric Blue + Dark Slate) | 🟢 Concluído (transversal — sessão 4) |
| Fase 4 | Listagem e busca de partidas | 🟢 Concluída (8/8 tarefas — sessão 5) |
| Fase 5 | Detalhes da partida | 🟢 Concluída (6/6 tarefas — sessão 6) |
| Fase 3 | Perfil do usuário | 🟢 Concluída (6/6 tarefas — sessão 7) |
| Fase 6 | Criação de partida | 🟢 Concluída (5/5 tarefas — sessão 8) |
| Fase 7 | Participação em partida | 🟢 Concluída (5/5 tarefas — sessão 9) |
| Fase 8 | Chat da partida | 🟢 Concluída (6/6 tarefas — sessão 10) |
| Fase 9 | Avaliação pós-partida | 🟢 Concluída (5/5 tarefas — sessão 11) |
| Fase 10 | Denúncia e segurança | 🟢 Concluída (5/5 tarefas — sessão 12) |
| Fase 11 | Moderação (opcional) | 🟢 Concluída (3/3 tarefas — sessão 13) |
| — | Redesign visual premium (theme module, elevação, cor por esporte) | 🟢 Concluído (transversal — sessão 16) |
| Fase 12 | Revisão e polimento final | 🟡 Em andamento (6/8 — 12.1, 12.2, 12.4–12.7 concluídas, sessão 17; 12.8 em andamento, sessão 28) |
| Fase 13 | Integração com o backend real | 🟢 **Concluída (16/16)** — 13.1 sessão 20; 13.2/13.3 sessão 21; 13.4 sessões 22–23; 13.5 sessão 24; 13.6 sessão 25; 13.7 sessão 26; 13.8 sessão 27; 13.9 sessão 28 |
| Fase 14 | Geolocalização real e notificações push | 🟡 Em andamento (7/8 — backend 1–4 concluídas; front 14.1 (itens 5–6) e 14.2 (item 7) concluídos sessões 31–33; item 8 em andamento, sessão 34 — hardening real em dispositivo achou e corrigiu D28–D34) |
| Fase 15 | Polimento visual (design system: tokens, componentes, telas) | 🟢 Concluída (5/5 — sessão 38, branch `feat/visual-polish`, aguardando PR) |

**Progresso geral:** 85/86 tarefas do protótipo+integração concluídas (99%) · Fase 14: 7/8 · Fase 15: 5/5 · 314 testes passando · lint zerado · tsc zerado

Stack confirmada: React Native 0.81.5 · Expo SDK 54 · TypeScript · NativeWind v4 · React Navigation v6 · @expo/vector-icons (MaterialCommunityIcons) · @tanstack/react-query v5 · expo-secure-store (sessão 21) · @playwright/test como dev tooling para screenshots do TCC (sessão 28)

---

## 1. Objetivo do roadmap

Este roadmap organiza a construção inicial do front-end do SquadUp em uma ordem lógica de desenvolvimento. A prioridade é criar um protótipo navegável que represente os principais casos de uso do sistema e demonstre a proposta do produto.

Nesta fase, o desenvolvimento será focado em telas, navegação, componentes visuais e dados mockados.

## 2. Estratégia de desenvolvimento

A construção do front-end será realizada de forma incremental, começando pela estrutura base do aplicativo e evoluindo para os fluxos principais.

A ordem de desenvolvimento segue a lógica:

1. estruturar o projeto;
2. criar navegação;
3. construir autenticação visual;
4. criar perfil do usuário;
5. listar partidas;
6. detalhar partidas;
7. criar partidas;
8. participar de partidas;
9. adicionar interação social;
10. adicionar confiança, avaliação e denúncia.

## 3. Fase 1 — Estrutura inicial do projeto

### Objetivo

Criar a base técnica e visual do aplicativo.

### Tarefas

- Criar projeto React Native;
- Configurar estrutura de pastas;
- Configurar navegação;
- Criar tema base;
- Definir cores, espaçamentos e tipografia;
- Criar componentes reutilizáveis iniciais.

### Componentes iniciais

- Button;
- Input;
- Card;
- Avatar;
- Badge;
- ScreenContainer;
- Header;
- EmptyState;
- RatingDisplay.

### Resultado esperado

Aplicativo inicial rodando com navegação básica e identidade visual mínima.

## 4. Fase 2 — Fluxo de entrada do usuário

### Casos de uso contemplados

- Cadastrar-se no sistema;
- Realizar login;
- Configurar perfil inicial.

### Telas

- Tela de boas-vindas;
- Tela de login;
- Tela de cadastro;
- Tela de configuração inicial de perfil.

### Funcionalidades simuladas

- Login mockado;
- Cadastro mockado;
- Seleção de esportes favoritos;
- Seleção de nível de experiência;
- Cadastro de localização aproximada;
- Upload visual de foto, sem integração real.

### Resultado esperado

Usuário consegue navegar do início do aplicativo até a tela principal após simular cadastro ou login.

## 5. Fase 3 — Perfil do usuário

### Casos de uso contemplados

- Editar perfil;
- Visualizar perfil;
- Visualizar reputação.

### Telas

- Meu perfil;
- Editar perfil;
- Perfil público de outro usuário.

### Informações exibidas

- Foto;
- Nome;
- Bio;
- Localização aproximada;
- Esportes favoritos;
- Nível de experiência;
- Nota média;
- Quantidade de partidas concluídas;
- Selos de confiança;
- Avaliações recebidas.

### Resultado esperado

O protótipo deve demonstrar que o perfil é um elemento central para gerar confiança entre usuários.

## 6. Fase 4 — Listagem e busca de partidas

### Casos de uso contemplados

- Buscar partidas;
- Filtrar partidas;
- Visualizar partidas próximas.

### Telas

- Home com lista de partidas;
- Tela de busca;
- Tela de filtros.

### Informações da partida no card

- Nome ou título da partida;
- Esporte;
- Local;
- Data;
- Horário;
- Vagas disponíveis;
- Nível da partida;
- Organizador;
- Participantes confirmados.

### Filtros previstos

- Esporte;
- Data;
- Localização;
- Nível;
- Partidas com vagas disponíveis.

### Resultado esperado

Usuário consegue visualizar partidas disponíveis e filtrar oportunidades compatíveis com seu interesse.

## 7. Fase 5 — Detalhes da partida

### Casos de uso contemplados

- Visualizar detalhes da partida;
- Visualizar participantes;
- Participar de partida.

### Tela

- Detalhes da partida.

### Informações exibidas

- Esporte;
- Local;
- Data;
- Horário;
- Número de vagas;
- Descrição;
- Nível da partida;
- Organizador;
- Lista de participantes;
- Reputação dos participantes;
- Botão para participar.

### Estados da tela

- Usuário ainda não participa;
- Usuário já participa;
- Partida lotada;
- Participação pendente de aprovação;
- Partida encerrada.

### Resultado esperado

Usuário entende claramente se a partida é adequada para ele e consegue simular participação.

## 8. Fase 6 — Criação de partida

### Casos de uso contemplados

- Criar partida.

### Tela

- Criar partida.

### Campos do formulário

- Modalidade esportiva;
- Título da partida;
- Local;
- Data;
- Horário;
- Quantidade máxima de participantes;
- Nível da partida;
- Descrição;
- Permitir iniciantes;
- Exigir aprovação do organizador.

### Resultado esperado

Usuário consegue preencher visualmente os dados necessários para criar uma partida e visualizar feedback de sucesso.

## 9. Fase 7 — Participação em partida

### Casos de uso contemplados

- Participar de partida;
- Cancelar participação;
- Confirmar presença.

### Telas/elementos

- Botão de participar;
- Estado de participação confirmada;
- Estado de solicitação pendente;
- Confirmação de presença;
- Cancelamento de participação.

### Resultado esperado

O protótipo deve representar o fluxo de entrada do usuário em uma partida e sua mudança de status.

## 10. Fase 8 — Chat da partida

### Casos de uso contemplados

- Conversar no grupo da partida.

### Tela

- Chat da partida.

### Funcionalidades simuladas

- Lista de mensagens;
- Campo para envio de mensagem;
- Identificação dos participantes;
- Mensagens do organizador;
- Avisos da partida.

### Resultado esperado

Usuário consegue visualizar como a comunicação entre participantes aconteceria dentro do aplicativo.

## 11. Fase 9 — Avaliação pós-partida

### Casos de uso contemplados

- Avaliar usuário.

### Telas

- Lista de participantes para avaliar;
- Formulário de avaliação;
- Confirmação de avaliação enviada.

### Critérios de avaliação

- Pontualidade;
- Respeito;
- Comportamento;
- Presença;
- Experiência geral.

### Resultado esperado

O protótipo deve demonstrar como a reputação dos usuários será construída a partir de avaliações pós-partida.

## 12. Fase 10 — Denúncia e segurança

### Casos de uso contemplados

- Denunciar usuário;
- Denunciar comportamento inadequado.

### Telas

- Formulário de denúncia;
- Confirmação de denúncia enviada.

### Campos

- Motivo da denúncia;
- Descrição;
- Partida relacionada;
- Usuário denunciado.

### Resultado esperado

O protótipo deve mostrar que o SquadUp considera segurança e moderação como partes importantes da experiência.

## 13. Fase 11 — Tela administrativa simples

### Casos de uso contemplados

- Moderar denúncias.

### Observação

Esta etapa pode ser opcional para o primeiro protótipo, mas é útil para demonstrar preocupação com segurança.

### Tela

- Lista de denúncias pendentes;
- Detalhes da denúncia;
- Ações administrativas simuladas.

### Ações

- Arquivar denúncia;
- Advertir usuário;
- Suspender usuário;
- Banir usuário.

### Resultado esperado

Representar, ainda que de forma simples, que denúncias não ficam sem tratamento dentro do sistema.

## 14. Ordem sugerida de implementação

A ordem recomendada de implementação é:

1. Estrutura inicial do projeto;
2. Design system básico;
3. Navegação;
4. Boas-vindas;
5. Login;
6. Cadastro;
7. Configuração inicial de perfil;
8. Meu perfil;
9. Home com partidas;
10. Filtros de partidas;
11. Detalhes da partida;
12. Participar de partida;
13. Criar partida;
14. Perfil público de usuário;
15. Chat da partida;
16. Avaliação pós-partida;
17. Denúncia de usuário;
18. Moderação simples;
19. Ajustes visuais;
20. Revisão do fluxo completo.

## 15. MVP visual para apresentação acadêmica

Para a apresentação inicial, o protótipo deve priorizar as seguintes telas:

1. Tela de boas-vindas;
2. Tela de cadastro/login;
3. Tela de configuração de perfil;
4. Home com partidas próximas;
5. Detalhes da partida;
6. Criar partida;
7. Perfil do usuário;
8. Chat da partida;
9. Avaliação pós-partida;
10. Denúncia de usuário.

Essas telas são suficientes para demonstrar os três pilares do SquadUp:

- Social;
- Logístico;
- Saúde.

## 16. Critérios de aceite do protótipo

O protótipo inicial será considerado adequado se:

- permitir navegação entre as principais telas;
- representar a proposta social do aplicativo;
- demonstrar como o usuário encontra uma partida;
- demonstrar como o usuário cria uma partida;
- demonstrar mecanismos de confiança;
- utilizar dados mockados coerentes;
- possuir visual consistente;
- estar adequado para apresentação acadêmica.

## 17. Fora do escopo inicial

Nesta primeira etapa não será necessário implementar:

- backend real;
- autenticação real;
- banco de dados;
- geolocalização real;
- chat em tempo real;
- notificações push;
- upload real de imagem;
- moderação real;
- avaliações persistidas;
- integração com mapas.

Esses recursos poderão ser desenvolvidos posteriormente em PG2.

## 18. Próxima evolução após o protótipo

> **Backend já existe e está adiantado** (`../back`, FastAPI + SQLModel): auth JWT, matches,
> mensagens, ratings e reports já persistidos e testados. Antes de iniciar a integração,
> consultar `.status/backend-contract.md` (comparação completa de contrato, sessão 18) e as
> dívidas D14–D18 em `.status/queue.md`.

Após a validação das telas, as próximas etapas serão:

- refinar os casos de uso;
- modelar banco de dados;
- definir contratos da API;
- implementar backend com FastAPI;
- integrar frontend com backend;
- testar fluxos principais;
- preparar versão funcional do MVP.

---

## 19. Fase 13 — Integração com o backend real

> Detalhamento tarefa-a-tarefa do plano mestre em `.status/backend-contract.md` §6. **Etapa 1
> (backend) concluída em 2026-07-08** — `../back/.status/roadmap.md` Fase 11 e 12 ambas 🟢 —
> então esta fase já pode começar. As sub-fases 13.4–13.8 são independentes entre si (todas
> dependem só de 13.2/13.3) e podem ser feitas em qualquer ordem.

### Objetivo

Substituir os seis Contexts mockados (`AuthContext`, `MatchesContext`, `MatchFiltersContext`,
`MessagesContext`, `RatingsContext`, `ReportsContext`) por consumo real da API do backend,
mantendo as mesmas interfaces públicas de hook sempre que possível, para minimizar mudanças nas
telas.

### 13.1 — Tipos alinhados ao contrato real

- Dividir `types.User` em `PublicUser` (dados públicos) e `MyProfile extends PublicUser { email, role }`;
- Dividir `types.Match` em `MatchSummary` (`organizerId`, `confirmedCount`, `availableSlots`) e
  `MatchDetail extends MatchSummary` (`organizer`, `participants`);
- Ajustar `Rating`/`Report` para refletir o shape real (`raterUser`→`rater` só se o backend
  aplicar D-B; `ratedUser`/`match` viram opcionais ou removidos conforme decisão D-B/D-C do
  backend);
- Rodar `npx tsc --noEmit` e ajustar todos os usos quebrados pelos novos tipos (esperado —
  é o objetivo do exercício: expor em tempo de compilação todo lugar que assumia o shape antigo).

### 13.2 — Camada de infraestrutura de API

- Criar `src/services/api/client.ts`: wrapper de `fetch` tipado, parse de
  `{ detail: { code, message } }`, anexação de `Authorization: Bearer`;
- Criar `src/services/adapters/`: funções puras de conversão (`toUser`, `toMatchSummary`,
  `toRatingPayload`, etc.) isolando `snake_case↔camelCase` e achatamento/expansão de objetos;
- Criar módulo de storage seguro de token com `expo-secure-store` (não `AsyncStorage` — dado
  sensível, CLAUDE.md §4);
- Adicionar `expo-secure-store` às dependências (`npx expo install expo-secure-store`);
- Configurar `EXPO_PUBLIC_API_URL` via variável de ambiente (`.env` + `app.config.ts`), com um
  `.env.example` versionado (mesmo padrão já usado em `../back`) — **atenção:** `localhost` não
  funciona a partir de um dispositivo físico ou emulador via Expo Go, que não alcançam o
  `localhost` da máquina de desenvolvimento; usar o IP da rede local (`http://192.168.x.x:8000`)
  ou o túnel do Expo (`expo start --tunnel`) ao testar fora do `npm run web`;
- **Backend já deployado em produção** (2026-07-08): `https://squadup-api.up.railway.app` — é o
  valor de `EXPO_PUBLIC_API_URL` para builds de apresentação/produção (13.9, Trilha C do
  `plano-de-entrega.md`); ambiente local continua usando o IP de rede acima durante o
  desenvolvimento das tarefas 13.4–13.8.

### 13.3 — React Query

- Instalar `@tanstack/react-query` (já previsto no CLAUDE.md §2, nunca instalado até aqui);
- Configurar `QueryClientProvider` no root do app (`App.tsx`);
- Definir convenção de query keys (`["matches", filters]`, `["match", id]`, `["ratings", userId]`, etc.).

### 13.4 — Auth real — ✅ concluída (sessões 22–23)

- ✅ **Concluído (sessão 22):** Adicionar campo de **idade** ao fluxo de cadastro — entrou em
  `RegisterScreen` (decisão do usuário), reaproveitando o campo "Data de nascimento" que já
  existia na tela mas nunca chegava a ser usado. A idade **não é digitada** — é calculada a partir
  da data de nascimento (`parseBirthDate`/`calculateAge`, novos em `src/utils/date.ts`), com regra
  de negócio de **18+ obrigatório** (decisão de segurança do produto, não só o `gt=0` do schema do
  backend). `register()` já ganhou o 4º parâmetro `age: number` (D15 resolvida) — a assinatura
  pública **não** ficou 100% igual à de antes desta sessão, só estável a partir de agora em diante;
- ✅ **Concluído (sessão 23):** `AuthContext` reescrito por dentro chamando `POST /auth/register` →
  `POST /auth/login` em sequência dentro de `completeProfile` (registro não retorna token, e o
  backend só aceita `location` — coletado só em `ProfileSetupScreen` — junto do resto do payload),
  mantendo a assinatura pública (`login`, `register` com `age`, `completeProfile`, `logout`) para
  não alterar as telas de novo;
- ✅ **Concluído (sessão 23):** `access_token`/`refresh_token` salvos no storage seguro (13.2) após
  login/register;
- ✅ **Concluído (sessão 23):** Interceptor de refresh automático em 401 no cliente HTTP (13.2), via
  `setUnauthorizedHandler` — registrado pelo `AuthContext`, usa `POST /auth/refresh`;
- ✅ **Concluído (sessão 23), com um ajuste de rota:** tela de boot restaura a sessão via
  `GET /users/me` (não `GET /auth/me` — só `/users/me` devolve `average_rating`/`matches_played`,
  necessários para fechar o tipo `MyProfile`) antes de decidir entre `AuthNavigator`/`AppNavigator`;
- ✅ **Concluído (sessão 23):** `logout()` chama `POST /auth/logout` com o refresh token antes de
  limpar o estado local (e está isento do interceptor de refresh — ver correção de bug na sessão 23,
  `progress.md`).

### 13.5 — Matches reais

- `MatchesContext`/`MatchFiltersContext` → hooks de React Query contra `GET /matches` (com filtros
  `sport`/`date`/`location`/`level`/`has_open_slots`);
- Adicionar filtro de **data** e **localização** em `FiltersScreen`/`MatchFiltersContext` (D18 — o
  backend já aceita, o front nunca expôs);
- `MatchDetailScreen` busca `MatchDetail` sob demanda via `GET /matches/{id}`;
- `CreateMatchScreen` envia só o payload de criação (`POST /matches`), deixando o backend gerar
  `id`/`organizer`/`status`/`participants`;
- `useMatchParticipation` migra `join`/`cancel` para `POST /matches/{id}/join` e `/leave`;
- Adicionar botão **"Encerrar partida"** em `MatchDetailScreen`, visível só para o organizador
  quando `status` é `open`/`full`, chamando `POST /matches/{id}/close` (D17);
- Adicionar UI de **aprovar solicitação pendente** para o organizador (lista de `pending` com ação
  por item), chamando `POST /matches/{id}/participants/{userId}/approve` (D17).

### 13.6 — Mensagens reais — ✅ concluída (sessão 25)

- ✅ `MessagesContext` → `useMessages` (React Query: `useInfiniteQuery` + `useMutation` contra
  `GET`/`POST /matches/{id}/messages`) — Context removido, hook substitui integralmente;
- ✅ `sendMessage` parou de gerar `createdAt` no cliente — envia só `{ text }` e invalida a
  query, usando o `created_at` devolvido pelo próximo `GET` (resolve D12);
- ✅ `MatchChatScreen` ganhou paginação incremental (`onEndReached` na `FlatList` invertida).
  **Ajuste em relação ao desenho original:** o backend ordena a listagem em ordem crescente e
  não expõe contagem total, então a paginação usa `limit` crescente a partir de `skip=0` (até o
  teto de 100), não `skip` decrescente — ver comentário em `src/hooks/useMessages.ts`;
- ✅ Comportamento de mensagens de sistema já resolvido no backend (D-D, sessão 18) — o front só
  exibe o que a API devolve, sem gerar nada;
- ✅ D21 resolvida para `Message` no mesmo passe (`formatMessageTime`, `src/utils/date.ts`).

### 13.7 — Avaliações reais — ✅ concluída (sessão 26)

- ✅ `RatingsContext` → novo `src/hooks/useRatings.ts` (`useUserRatings`, `useSubmitRating`,
  `useHasRatedMap`) contra `POST /matches/{id}/ratings/{userId}` e `GET /users/{id}/ratings` —
  Context removido, hook substitui integralmente (`RateUserScreen`, `PostMatchRatingScreen`);
- ✅ Adapter (`src/services/adapters/rating.ts`) já achatava `RatingCriteria` em campos soltos ao
  enviar e reagrupava ao ler — não precisou de mudança nesta sessão (D-B já estava aplicada);
- ✅ `RatingStars`/`TrustBadges`/`MyProfileScreen`/`PublicProfileScreen` tratam `averageRating`
  nulo (usuário sem avaliações) — resolve **D20**: o adapter (`toPublicUser`) não mascara mais
  `average_rating: null` como `0`, o tipo `PublicUser.averageRating` virou `number | null`, e
  `RatingStars` mostra "Sem avaliações" nesse caso em vez de "0.0".

### 13.8 — Denúncias reais — ✅ concluída (sessão 27)

- ✅ `ReportsContext` removido; novo `src/hooks/useReports.ts` (`useReports`, `useCreateReport`,
  `useUpdateReportAction`) contra `GET /reports`, `POST /reports` e `PATCH /reports/{id}`;
- ✅ `updateReportAction(reportId, action)`, onde `action` é `"archive" | "warn" | "ban"`, alinhado
  a `PATCH /reports/{id}` (resolve **D14** — único contrato genuinamente quebrado encontrado na
  comparação);
- ✅ `AdminDashboardScreen`/`ReportDetailScreen` atualizados para os três verbos de ação;
- ✅ `ReportUserScreen` envia só `{ reported_user_id, match_id?, reason, description }` via
  `POST /reports` (reporter vem do JWT), com estado de loading (`isSubmitting`) e erro de rede
  tratado na UI;
- `src/mocks/reports.ts` mantido como fixture de testes (mesmo padrão de `messages`/`ratings`).

### 13.9 — Hardening conjunto e fechamento

- Teste manual ponta a ponta (welcome → login → home → partida → chat → avaliação → denúncia)
  contra o backend rodando localmente;
- Apontar `EXPO_PUBLIC_API_URL` para a URL de produção decidida (`../back`, Fase 12);
- Ajustar a redação do TCC conforme a decisão D-A (geolocalização/"Local") antes da defesa;
- Remover `src/mocks/*.ts` **só depois** que todas as telas estiverem consumindo dados reais —
  manter como fallback/seed de testes de componente até lá (os testes Jest continuam usando os
  mocks como fixtures, isso não muda).

---

## 20. Fase 14 — Geolocalização real e notificações push

> Registrada em 2026-07-16 (sessão 29). Plano mestre completo (decisões de arquitetura,
> contrato de API, etapas numeradas) em `.status/backend-contract.md` §6-A — este documento só
> resume as tarefas do lado do front. Contraparte no backend: `../squadup-back/.status/roadmap.md`
> §19 (já pré-desenhada desde 2026-07-08, estava bloqueada até esta Fase 13 do front terminar —
> destravada em 2026-07-16). Escopo confirmado com o usuário: geolocalização com coordenadas
> reais via GPS do dispositivo (não geocoding de texto); notificações push no conjunto essencial
> de eventos (mensagem nova, aprovação de participação, partida encerrada/cancelada).
>
> **Não estava no cronograma original do TCC** (`plano-de-entrega.md` §7) — é escopo novo. Ver
> `plano-de-entrega.md` §9 para o encaixe no cronograma e o plano de contingência.
>
> **Atualização (2026-07-28, sessão 30):** as 4 tarefas do backend (etapas 1–4 do plano mestre)
> estão **concluídas e mergeadas em `dev`** (`squadup-back` PR #50) — contrato de API estável,
> pronto para consumo.
>
> **Atualização (2026-07-28, sessão 31):** primeira fatia do front (item 5 da tabela de
> `queue.md`) implementada — `expo-location` instalado, `useDeviceLocation` criado,
> `CreateMatchScreen` já envia `latitude`/`longitude` reais quando disponíveis, e
> `MatchSummary`/`MatchDetail` ganharam os dois campos. Detalhe completo em `progress.md`
> (sessão 31). Ainda faltam: `distance_km` (não previsto no desenho original — usar direto em vez
> de recalcular no cliente) em `MatchSummary`/`ApiMatchSummary`, o toggle de `FiltersScreen` e a
> exibição de distância no `MatchCard` (item 6), e as notificações push (item 7). A migration da
> Fase 13 ainda não rodou em produção (`squadup-api.up.railway.app`) — `lat`/`lng`/`radius_km` e
> `POST /users/me/push-token` só funcionam contra o backend local até isso ser resolvido.
>
> **Atualização (2026-07-28, sessão 32, branch `feat/match-distance-filter`):** item 6 concluído —
> `distanceKm`/`distance_km` em `MatchSummary`/`ApiMatchSummary`/adapter; toggle "Usar minha
> localização" + chips de raio (5/10/20/50 km) em `FiltersScreen`; `MatchFilters` ganhou
> `nearMe`/`latitude`/`longitude`/`radiusKm`; `MatchesContext` só propaga `lat`/`lng`/`radius_km`
> para `GET /matches` quando `nearMe` está ativo; `MatchCard` exibe a distância pronta do backend.
> Só falta o item 7 (push) e o item 8 (hardening) para fechar a Fase 14.

### Objetivo

Substituir a limitação conhecida "`location` é só texto livre, sem lat/long" (documentada desde
a Fase 13, dívida D-A) por geolocalização real, e adicionar notificações push para os eventos
mais relevantes de cada pilar (social: nova mensagem; logístico: aprovação/encerramento de
partida), sem quebrar nenhum fluxo hoje funcional — as duas features são estritamente aditivas.

### 14.1 — Geolocalização real

- ✅ **Concluído (sessão 31):** Instalar `expo-location` (`npx expo install expo-location`) e
  configurar permissões no `app.json` (`NSLocationWhenInUseUsageDescription` para iOS, permissão
  `ACCESS_COARSE_LOCATION` para Android — precisão "balanced", não "fine", conforme D-Geo-4);
- ✅ **Concluído (sessão 31):** Novo hook `useDeviceLocation` (`src/hooks/`): encapsula pedido de
  permissão + captura de `latitude`/`longitude` com `Location.Accuracy.Balanced`; retorna
  `{ location, permissionDenied, isLoading, requestLocation }` — nunca lança erro para quem chama,
  resolve com `location: null` em caso de negação (D-Geo-3);
- ✅ **Concluído (sessão 31):** `CreateMatchScreen`: ao montar, chama `useDeviceLocation` e envia
  `latitude`/`longitude` junto do payload de `POST /matches` **se disponíveis**; sem eles, o
  payload continua idêntico ao de hoje (campo `location` de texto é sempre obrigatório,
  coordenadas são só um extra);
- ✅ **Concluído (sessão 32):** `FiltersScreen`: novo toggle "Usar minha localização" — ao ativar,
  chama `useDeviceLocation` e passa a expor chips de raio (`radiusKm`, opções 5/10/20/50 km,
  default 20 via `DEFAULT_RADIUS_KM`); `MatchFilters` ganhou `nearMe`/`latitude`/`longitude`/
  `radiusKm`; `MatchesContext` propaga `lat`/`lng`/`radius_km` para `GET /matches`
  (`src/services/api/matches.ts`) só quando `nearMe` está ativo. **Ajuste em relação ao desenho
  original:** sincronizar `latitude`/`longitude` do dispositivo para o filtro local via
  `setState` dentro de `useEffect` foi rejeitado pelo lint (`react-hooks/set-state-in-effect`,
  cascading renders) — as coordenadas finais são computadas só no momento de `handleApply`, lendo
  `location` do hook diretamente (com fallback para o valor já aplicado antes); permissão negada
  não reverte mais o toggle sozinha, só mostra aviso — a busca segue sem coordenadas (mesmo
  princípio de fallback gracioso da D26);
- ✅ **Concluído (sessão 32):** `MatchCard`: exibe a distância pronta do backend (`distance_km`,
  ex.: "3,2 km") quando `match.distanceKm` não é `null` — sem recálculo no cliente, conforme
  desenho original;
- ✅ **Concluído (sessão 31):** Tipos/adapters: `MatchSummary`/`MatchDetail` (`src/types`) e os
  adapters correspondentes (`src/services/adapters/match.ts`) ganham `latitude: number | null` e
  `longitude: number | null`; ✅ **Concluído (sessão 32):** `distanceKm: number | null` adicionado
  aos mesmos tipos/adapter;
- ✅ **Concluído (sessão 31):** Testes de `useDeviceLocation` (permissão concedida/negada/erro) e
  de `CreateMatchScreen` (payload com e sem coordenadas). ✅ **Concluído (sessão 32):** teste de
  `fetchMatches`/`buildQueryString` (parâmetros geográficos entram na query só quando lat+lng
  estão presentes) e de `FiltersScreen` (toggle, raio, aplicar com/sem coordenadas, aviso de
  permissão negada) — 278/278 testes, `tsc`/lint zerados.

### 14.2 — Notificações push reais — ✅ concluída (sessão 33)

- ✅ Instalado `expo-notifications`, `expo-device`, `expo-constants`
  (`npx expo install expo-notifications expo-device expo-constants`);
- ✅ Novo hook `useNotificationRegistration` (`src/hooks/`): solicita permissão, obtém o
  `ExpoPushToken` do dispositivo (via `expo-constants` para o `projectId` do EAS — gerado pelo
  usuário nesta sessão via `eas build:configure`, tarefa 12.8), e registra via novo
  `POST /users/me/push-token` (`src/services/api/users.ts`); chamado uma única vez a cada
  transição de `isAuthenticated` para `true` em `AuthContext` (cobre login, cadastro e
  restauração de sessão no boot com um único efeito, em vez de 3 chamadas duplicadas), nunca
  bloqueando a navegação se a permissão for negada (D-Push-3) — `Device.isDevice` também é
  checado primeiro (simulador/emulador nunca tenta obter token);
- ✅ Listener de notificação tocada (`Notifications.addNotificationResponseReceivedListener`),
  registrado uma vez no root do app (`RootNavigator`, via `navigationRef.ts` +
  `createNavigationContainerRef`): navega para `MatchChatScreen`/`MatchDetailScreen` conforme o
  `data` embutido na notificação. **Contrato confirmado direto no código do backend**
  (`app/services/message_service.py`/`match_service.py`, não precisou de definição nova): `{ type:
  "new_message" | "match_closed" | "participation_approved", matchId: string }` —
  `new_message` → `MatchChat`, os outros dois → `MatchDetail`;
- Nenhuma tela nova — este item é infraestrutura de navegação/registro, não UI visível, exceto
  pela notificação do sistema operacional em si;
- ✅ Testes: `useNotificationRegistration.test.ts` (token obtido e enviado ao backend; permissão
  negada, sem `projectId`, sem `Device.isDevice`, e falha de rede nunca lançam erro),
  `navigation/__tests__/navigationRef.test.ts` (mapeamento `type`→tela via `jest.spyOn` no
  `navigationRef` real, em vez de mockar `createNavigationContainerRef` — mockar a factory
  inteira do `@react-navigation/native` não funcionou de forma confiável no ambiente de teste).

### 14.3 — Hardening e fechamento

> **Em andamento (sessão 34, 2026-07-28/29):** primeira rodada real de testes em dispositivo
> físico via build `preview` do EAS. Cada teste do usuário achou um bug de boot/UX/contrato
> novo — todos corrigidos e documentados como D28–D34 em `queue.md` (crash no boot fora do
> Expo Go, teclado cobrindo campo em telas de formulário, `completeProfile` não sobrevivendo a
> falha parcial, falta de retry em queda de rede, mismatch de validação de senha). 3 builds EAS
> geradas ao longo da sessão; a mais recente (`fa25bd21`, commit `3dcd0dd`) ainda não foi testada
> pelo usuário até o fechamento desta sessão — **item 8 segue em aberto** até um teste de ponta a
> ponta (cadastro → criar partida → chat → geo → push) confirmar que não há mais bugs de
> dispositivo real pendentes.

- Teste manual ponta a ponta em **dispositivo físico via development/preview build** — push
  remoto **não funciona mais no Expo Go desde o SDK 53** (aviso do próprio `expo-notifications`
  confirmado nesta sessão) nem em simulador iOS/`npm run web`; precisa de
  `eas build --profile development` (ou `preview`) instalado num Android real. Mesma limitação
  de sandbox já registrada para 12.3;
  confirmar recebimento de notificação para os 3 eventos de escopo (mensagem, aprovação,
  encerramento) e navegação correta ao tocar;
- Confirmar filtro geográfico em dispositivo real (GPS de simulador pode retornar coordenadas
  fixas/incorretas) — validar que o raio de busca reflete distância real percebida;
- Atualizar a redação do TCC (decisão D-A) de "trabalho futuro" para "implementado" — inclui
  ajustar §4.6.5 "Geolocalização" (agora correta, tempo verbal no passado passa a ser honesto) e,
  se a Trilha D dos assets ainda estiver ativa, capturar um screenshot novo mostrando o filtro por
  proximidade e/ou uma notificação push recebida;
- Rodar `npx tsc --noEmit`, `npm run lint`, `npm run test` — zero erros antes de considerar a
  fase concluída (mesmo gate de qualidade de todas as fases anteriores, CLAUDE.md §5).

### Resultado esperado

Usuário consegue buscar partidas por proximidade real (com fallback gracioso se negar permissão
de localização), e recebe notificações push nos três eventos essenciais definidos — sem
regressão em nenhum fluxo hoje funcional, e com o texto do TCC honesto sobre o que foi de fato
implementado.

### Fora do escopo desta fase

- "Partida nova perto de você" (notificação proativa baseada em geolocalização) — composição de
  duas features novas ao mesmo tempo, candidato a PG2;
- Preferências de notificação por usuário (silenciar tipos específicos) — escopo tudo-ou-nada
  nesta fase;
- Notificações de denúncia/moderação;
- Tracking contínuo de localização em background — só leitura pontual por ação do usuário.

---

## 21. Fase 15 — Polimento visual (sessão 38)

### Objetivo

Dar ao app um visual profissional e consistente para a banca, sem mudar regras de negócio, API,
navegação nem textos de produto (exceto "Criar partida" / "Meu perfil" em caixa de frase,
autorizado pelo usuário). Identidade de `vision.md` §10: jovem, esportiva, social e confiável.

### Entregas

1. Auditoria visual por tela, priorizada por impacto.
2. Tokens: escala de cinza única (slate), tipografia semântica, 3 raios, 2 níveis de elevação,
   cores semânticas com contraste AA — documentados em [`design-tokens.md`](design-tokens.md).
3. Componentes com estados visuais claros (pressionado, desabilitado, carregando, erro, foco) e
   área de toque de 44 px; novos `SlotsBar` e `LoadingState`.
4. Telas prioritárias (Welcome, Login, Cadastro, Home, Detalhes, Criar, Perfil, Chat) e varredura
   das secundárias.
5. Screenshots do TCC regenerados.

### Fora do escopo (registrado para decisão)

Números de marketing da Welcome, visibilidade do painel admin para usuário comum, variante do
botão "Enviar denúncia" — ver `queue.md`, Fase 15.

