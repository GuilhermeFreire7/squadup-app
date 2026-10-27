# SquadUp — Fila de Tarefas Front-end

> **Plano de entrega final (app + backend + TCC):** ver [`plano-de-entrega.md`](plano-de-entrega.md) (2026-07-08) — cobre deploy do backend, Fase 13 de integração, build/demo do app, estrutura de assets do TCC e os gaps de conteúdo da monografia. Consultar antes de priorizar a próxima tarefa.

## Legenda
- ⚪ A fazer
- 🟡 Em andamento
- 🟢 Concluído
- 🔴 Bloqueado

---

## Fases concluídas (arquivadas em progress.md)

| Fase | Tarefas | Branch mergeada |
|------|---------|-----------------|
| Fase 1 — Estrutura inicial | 19/19 ✅ | `feat/project-setup` + `feat/design-system` → `dev` |
| Fase 2 — Fluxo de entrada | 8/8 ✅ | `feat/auth-flow` → `dev` |
| Refinamento visual | transversal ✅ | direto em `dev` (sessão 4 — 2026-05-25) |
| Fase 4 — Listagem e busca | 8/8 ✅ | `feat/home-matches` → `dev` (sessão 5 — 2026-05-25) |
| Fase 5 — Detalhes da partida | 6/6 ✅ | `feat/match-detail` → `dev` (sessão 6 — 2026-05-26) |
| Fase 3 — Perfil do usuário | 6/6 ✅ | `feat/user-profile` → `dev` (sessão 7 — 2026-05-26) |
| Fase 6 — Criação de partida | 5/5 ✅ | `feat/create-match` (sessão 8 — 2026-05-26) |
| Fase 7 — Participação em partida | 5/5 ✅ | `feat/match-participation` (sessão 9 — 2026-05-26) |
| Fase 8 — Chat da partida | 6/6 ✅ | `feat/match-chat` (sessão 10 — 2026-05-26) |
| Fase 9 — Avaliação pós-partida | 5/5 ✅ | `feat/post-match-rating` (sessão 11 — 2026-05-26) |
| Fase 10 — Denúncia e segurança | 5/5 ✅ | `feat/report-user` (sessão 12 — 2026-05-26) |
| Fase 11 — Moderação | 3/3 ✅ | `feat/moderation` (sessão 13 — 2026-07-02) |
| Fase 13.1–13.3 — Fundação da integração (tipos, cliente HTTP, adapters, storage, React Query) | 6/6 ✅ | `feat/api-contract-types` (sessões 20–21) |
| Fase 13.4 — Auth real | 2/2 ✅ | `feat/api-contract-types` + `feat/auth-real` (sessões 22–23) |
| Fase 13.5 — Matches reais | 4/4 ✅ | `feat/matches-real` (sessão 24 — 2026-07-13) |
| Fase 13.6 — Mensagens reais | 1/1 ✅ | `feat/messages-real` (sessão 25 — 2026-07-13) |
| Fase 13.7 — Avaliações reais | 1/1 ✅ | `feat/ratings-real` (sessão 26 — 2026-07-13) |
| Fase 13.8 — Denúncias reais | 1/1 ✅ | `feat/reports-real` (sessão 27 — 2026-07-14) |
| Fase 13.9 — Hardening e fechamento | 1/1 ✅ | `feat/organizer-actions-and-filters` (sessão 28 — 2026-07-16, ainda não mergeada) |

---

Detalhes tarefa-a-tarefa das fases concluídas (Fases 1–11) foram movidos para [`progress.md`](progress.md), organizados por sessão.

---

## FASE 12 — Revisão e polimento final (6/8 concluídas — detalhes tarefa-a-tarefa em `progress.md`, sessões 15 e 17)

| # | Tarefa | Status | Observação |
|---|--------|--------|------------|
| 12.3 | Testar no Expo Go em iOS e Android | ⚪ | Dispositivo físico ou emulador — requer o usuário, não disponível no sandbox |
| 12.8 | Preparar build de apresentação (`expo build` ou EAS Build) | 🟡 | `eas.json` criado (sessão 28); `eas login` + `eas build:configure` rodados pelo usuário na sessão 33 — `projectId` gerado (`0032bb63-f809-42d2-baba-6d62bc2b61b0`, gravado em `app.json`). Falta só rodar o build de fato (`eas build --platform android --profile preview`) — ação do usuário |

**Trilha D (Assets do TCC) avançada na sessão 28** — ver `plano-de-entrega.md` §5.1 e
`progress.md` (sessão 28) para detalhe completo. Resumo: `scripts/capture-tcc-screenshots.ts`
(Playwright) automatiza a captura de 8 telas em `tcc/assets/app/`. Faltam só as telas que
dependem de `Alert.alert` (D11, sem polyfill no web) e os prints de concorrentes (manual).

Concluídas: 12.1 (consistência visual, sessão 15) · 12.2 (fluxo completo, sessão 17) · 12.4 (acessibilidade, sessão 17) · 12.5 (lint/tsc, sessão 17) · 12.6 (testes, sessão 17) · 12.7 (coerência dos mocks, sessão 17).

---

## FASE 14 — Geolocalização real e notificações push (7/8 — backend concluído em 2026-07-28)

> Plano mestre completo (arquitetura, contrato de API, decisões D-Geo-*/D-Push-*) em
> `.status/backend-contract.md` §6-A. Detalhe tarefa-a-tarefa do front em `roadmap.md` §20.
> Contraparte no backend: `../squadup-back/.status/roadmap.md` §19 — **tarefas 1–4 concluídas e
> mergeadas em `dev` via PR #50 (2026-07-28)**, contrato de API estável e pronto para consumo.
> Escopo: geolocalização com coordenadas reais via GPS (`expo-location`); push via Expo Push API
> nos 3 eventos essenciais (mensagem nova, participação aprovada, partida encerrada/cancelada).
> **Não estava no cronograma original do TCC** — ver `plano-de-entrega.md` §9 para o encaixe e o
> plano de contingência de prazo.
>
> **Migration em produção:** aplicada com sucesso em `https://squadup-api.up.railway.app`
> (confirmado sessão 30, `../squadup-back/.status/queue.md`) — `lat`/`lng`/`radius_km` e
> `POST /users/me/push-token` já funcionam contra produção, não só localmente.

| # | Tarefa | Sub-fase | Repositório | Status |
|---|--------|----------|---|--------|
| 1 | Migration `latitude`/`longitude` em `Match`; schemas atualizados | 14 (backend) | Backend | 🟢 |
| 2 | `GET /matches` ganha `lat`/`lng`/`radius_km`; Haversine; ordenação por distância; testes | 14 (backend) | Backend | 🟢 |
| 3 | Tabela `push_tokens`; `POST /users/me/push-token`; revogação em logout | 14 (backend) | Backend | 🟢 |
| 4 | `notification_service.py` (Expo Push API) + disparo nos 3 eventos via `BackgroundTasks` | 14 (backend) | Backend | 🟢 |
| 5 | `useDeviceLocation` + `CreateMatchScreen` envia coordenadas + tipos/adapters | 14.1 | Front | 🟢 |
| 6 | `FiltersScreen` (toggle + raio) + `useMatchFilters`/`MatchesContext` propagam geo + distância no `MatchCard` | 14.1 | Front | 🟢 |
| 7 | `useNotificationRegistration` (permissão + token + registro) + listener de navegação | 14.2 | Front | 🟢 |
| 8 | Hardening ponta a ponta em dispositivo físico + ajuste do texto do TCC (D-A) | 14.3 | Ambos | ⚪ |

**Desvios do backend em relação ao contrato original de `backend-contract.md` §6-A** — relevantes
para o front implementar 5–7 corretamente:
- `MatchRead`/`MatchDetailRead` ganharam um campo novo não previsto: `distance_km: number | null`,
  presente só quando a busca (`GET /matches`) informou `lat`/`lng` — usar esse valor pronto no
  `MatchCard` em vez de recalcular a distância no cliente (tarefa 6).
- `POST /auth/logout` (logout de um único dispositivo) **não** revoga o push token registrado
  nesse dispositivo — só `POST /auth/logout-all` revoga todos. Não depende de nada novo do
  front, é só uma limitação a ter em mente (o dispositivo pode continuar recebendo push depois
  de um logout simples, até o token expirar do lado da Expo).

**Dependência crítica:** a tarefa 8 (e a validação real de push) só é possível em dispositivo
físico — mesma limitação de sandbox já registrada para 12.3. Tarefas 1–4 (backend) podem ser
feitas em paralelo entre si; 5–6 (geo) e 7 (push) são trilhas independentes do lado do front,
cada uma só depende do respectivo contrato de backend estar mergeado.

---

## Dívidas técnicas

| # | Item | Prioridade | Descrição |
|---|------|-----------|-----------|
| D1 | jest versão | ~~Média~~ **Resolvida** | Downgrade para `jest@29` + instalação direta de `babel-preset-expo`. 52 testes passando. |
| D2 | react-test-renderer | Baixa | Fixado em `19.1.0`; atualizar junto com `react` quando necessário. |
| D3 | react-native-screens | Baixa | Pinado em `~4.16.0` (SDK 54); verificar ao fazer upgrade de Expo SDK. |
| D4 | Line endings CRLF | ~~Baixa~~ **Resolvida (sessão 35)** | `.editorconfig` adicionado (`end_of_line = lf`) — detalhe em `progress.md`, sessão 35. |
| D5 | HomeScreen placeholder | ~~Média~~ **Resolvida** | Substituído na Fase 4 (sessão 5). |
| D6 | AppNavigator incompleto | ~~Média~~ **Resolvida** | 4 abas com ícones vetoriais criadas na Fase 4 (sessão 5). |
| D7 | expo-asset não instalado | Baixa | `@expo/vector-icons` depende de `expo-asset` em runtime, mas no Jest é mockado via `moduleNameMapper`. Se adicionar novos pacotes Expo que também dependam de `expo-asset`, instalar: `npx expo install expo-asset`. |
| D8 | Participação em partida local apenas | ~~Média~~ **Resolvida** | `MatchDetailScreen.handleJoin`/`handleCancel` alteravam só `useState` interno. Resolvida na Fase 7 (`useMatchParticipation`, chamando `POST /matches/{id}/join`/`leave` de verdade) — nunca marcada aqui como concluída. Confirmada de novo na sessão 34 (D28), que já encontrou `MatchDetailScreen` usando o hook real. |
| D9 | `RateUserScreen.tsx:78` — `user` possivelmente `undefined` (tsc) | ~~Baixa~~ **Resolvida** | Causa: narrowing de `if (!match \|\| !user) return` no corpo do componente não se propaga para dentro do closure `handleSubmit` (limitação conhecida do TS com controle de fluxo em funções aninhadas). Corrigido repetindo o guard `if (!user) return;` no início de `handleSubmit`. `npx tsc --noEmit` limpo, lint zerado, 181/181 testes passando (sessão 14). |
| D10 | NativeWind v4 não suporta `contentContainerClassName` | Baixa | Vários `ScrollView`/`FlatList` usam `contentContainerStyle={{ padding, gap, ... }}` em pixels em vez de classes Tailwind, porque a versão instalada do NativeWind (`^4.2.4`) não expõe essa prop (verificado em `node_modules/nativewind` na sessão 15). Reavaliar ao atualizar o NativeWind — se a prop passar a existir, migrar esses blocos para `className`. |
| D11 | `Alert.alert` não renderiza em `react-native-web` | Baixa | Sem polyfill instalado, `Alert.alert(...)` em `RateUserScreen`, `ReportUserScreen`, `ReportDetailScreen` e no cancelamento de `MatchDetailScreen` não produz diálogo no browser — a ação de dados ocorre normalmente, mas o callback do botão "OK" (que costuma fazer `navigation.goBack()`) nunca dispara, deixando o usuário sem feedback visual. Funciona normalmente em Expo Go/iOS/Android nativo (a confirmar na 12.3). Só relevante se a apresentação acadêmica usar `npm run web` em vez de dispositivo/emulador — nesse caso, avaliar um polyfill de `Alert` (ex.: `react-native-web` community package) antes da entrega. Descoberto na sessão 17. |
| D12 | Timestamp de mensagem do chat usa hora real | ~~Baixa~~ **Resolvida** | Sessão 25 (Fase 13.6): `useMessages.sendMessage` não gera mais `createdAt` no cliente — envia só `{ text }` via `POST /matches/{id}/messages` e invalida a query, deixando o próximo `GET` trazer o `created_at` real gerado pelo servidor. |
| D13 | Selo de verificado sem texto alternativo para leitor de tela | ~~Baixa~~ **Resolvida (sessão 35)** | `accessibilityLabel="Verificado"` adicionado ao ícone nos 6 arquivos citados — detalhe em `progress.md`, sessão 35. |
| D14 | `ReportsContext.updateReportStatus` manda status-alvo, backend espera ação | ~~Média~~ **Resolvida** | Sessão 27 (Fase 13.8): `ReportsContext` removido; `useUpdateReportAction` (`src/hooks/useReports.ts`) chama `PATCH /reports/{id}` com `{ action: "archive"\|"warn"\|"ban" }`. `AdminDashboardScreen`/`ReportDetailScreen` migrados. |
| D15 | Cadastro de usuário não coleta `age`, campo obrigatório no backend | ~~Média~~ **Resolvida** | Sessão 22: o campo "Data de nascimento" de `RegisterScreen` (existia na UI, mas era validado e depois **descartado** — nunca chegava a `register()`) passou a ser usado de verdade: `src/utils/date.ts` ganhou `parseBirthDate`/`calculateAge`, e `RegisterScreen` calcula a idade a partir da data informada e **exige 18+** (`MINIMUM_AGE`) — decisão de produto do usuário (não só satisfazer o schema do backend, é regra de segurança do app: partidas com desconhecidos). `register()` ganhou o 4º parâmetro `age: number` (computado, não digitado); `AuthContext` guarda em `pendingAge` e `completeProfile` usa esse valor em vez do `age: 25` hardcoded. 17 testes novos (`RegisterScreen.test.tsx`, `AuthContext.test.tsx`, `utils/__tests__/date.test.ts`). Ver `.status/backend-contract.md` §2.7. |
| D16 | `types.Match` único vs `MatchRead`/`MatchDetailRead` separados no backend | ~~Média~~ **Resolvida** | Descrevia o problema antes do split — resolvido junto com D19 (sessão 24): tipos divididos em `MatchSummary`/`MatchDetail`, `MatchDetailScreen` busca `MatchDetail` sob demanda via `useMatchDetail`. Nunca marcada aqui como concluída na época. |
| D17 | Faltam ações de organizador: encerrar partida e aprovar participante pendente | ~~Baixa~~ **Resolvida** | `MatchDetailScreen`/`ParticipantList`/`useMatchParticipation` já implementam "Encerrar partida" (`POST /matches/{id}/close`, botão visível só para o organizador quando a partida não está encerrada) e "Aprovar" participante pendente (`POST /matches/{id}/participants/{userId}/approve`, ação por item na lista de `pending`). Confirmado no código na sessão 28 — já estava implementado, só não estava marcado como concluído nesta fila. |
| D18 | Filtros de partida não cobrem `date`/`location`, que o backend já suporta | ~~Baixa~~ **Resolvida** | `FiltersScreen`/`MatchFiltersContext` já coletam `date` (`DD/MM/AAAA` → ISO) e `location` (texto livre); `MatchesContext` envia ambos como query params para `GET /matches` via `fetchMatches`. Confirmado no código na sessão 28 — já estava implementado, só não estava marcado como concluído nesta fila. |
| D19 | `MatchesContext`/`useMatchFilters`/`MatchCard` tipados sobre `MatchDetail`, não `MatchSummary` | ~~Média~~ **Resolvida** | Resolvida na sessão 24 (Fase 13.5): `MatchesContext`/`MatchFiltersContext`/`useMatchFilters`/`MatchCard`/`HomeScreen`/`SearchScreen` migrados para `MatchSummary` real (`GET /matches`); a busca por nome do organizador foi removida de `useMatchFilters.applyFilters` (opção escolhida, em vez de pedir um campo `organizer_name` novo ao backend). `MatchDetailScreen` (que precisa de `organizer`/`participants` completos) passou a buscar `MatchDetail` sob demanda via `GET /matches/{id}` através do novo hook `useMatchDetail`. |
| D20 | `toPublicUser` (`src/services/adapters/user.ts`) transforma `average_rating: null` em `0` | ~~Média~~ **Resolvida** | Sessão 26 (Fase 13.7): `PublicUser.averageRating` virou `number \| null`; `toPublicUser` não mascara mais o `null` com `0`; `RatingStars` mostra "Sem avaliações" (em vez de "0.0") quando `rating` é `null`; `TrustBadges` omite o badge de nota nesse caso; `MyProfileScreen`/`PublicProfileScreen` mostram "—" no `StatsRow` para usuário sem avaliações. |
| D21 | `Message.createdAt`/`Rating.createdAt`/`Report.createdAt` (adapters) recebem o ISO completo do backend sem reformatar | ~~Baixa~~ **Parcialmente resolvida** | Sessão 25 (Fase 13.6): `MessageBubble.tsx` agora formata `message.createdAt` via `formatMessageTime` (novo, `src/utils/date.ts`) — o gap do chat está fechado. `Rating`/`Report` seguem sem mudança (já tratados na tela via `formatDate`/`formatReportDate`, fora do escopo desta sessão). |
| D22 | `tokenStorage` usa `sessionStorage` no web, que não sobrevive a fechar a aba | Baixa | `expo-secure-store` é um no-op em `react-native-web` (`ExpoSecureStore.web.js` exporta objeto vazio) — sem alternativa nativa de "storage seguro" real no browser. `src/services/storage/tokenStorage.ts` cai para `sessionStorage` nesse caso, o que é aceitável para a demo acadêmica (`npm run web`) mas significa que o usuário é deslogado ao fechar/reabrir a aba (diferente do nativo, onde o keychain/keystore persiste entre sessões do app). Sem ação necessária a menos que a apresentação dependa de sessão persistente no browser — se depender, considerar `localStorage` (persiste mais, mas é menos seguro ainda) como troca consciente. Descoberto na sessão 21 (item 5, 13.2). |
| D23 | `ReportUserScreen` perdeu o picker de "partida relacionada" ao migrar a listagem para `MatchSummary` | Baixa | A Fase 13.5 (sessão 24) trocou `MatchesContext` para consumir `GET /matches` real, que devolve `MatchSummary` (sem `participants`). `ReportUserScreen` usava `matches.filter(m => m.participants.some(...))` para achar partidas em comum com o usuário denunciado — não há endpoint no backend para "partidas em comum com o usuário X", então esse filtro virou um array vazio hardcoded (`userMatches: MatchRef[] = []`) até a Fase 13.8 (`ReportsContext` real) resolver isso de verdade — possivelmente precisando de um novo endpoint no backend. Efeito visual: a seção "Partida relacionada" nunca aparece mais em `ReportUserScreen`, mesmo quando o usuário e o denunciado jogaram juntos. Descoberto na sessão 24. |
| D24 | Regra "avaliador precisa ter participado da partida" não documentada em nenhuma tela | ~~Baixa~~ **Resolvida (sessão 35)** | `useSubmitRating` repassa o `ApiError`; `RateUserScreen` mostra mensagem específica para `NOT_MATCH_PARTICIPANT` — detalhe em `progress.md`, sessão 35. |
| D25 | Usuários/partidas de teste ficaram no banco SQLite local do backend | Baixa | A sessão 28 criou usuários (`teste.e2e.*@squadup.dev`, `screenshots.tcc@squadup.dev`) e partidas de teste ao validar a Fase 13.9 e capturar screenshots, todos no `squadup-back/squadup.db` local (fora deste repositório). Não afeta produção (Railway usa Postgres separado). Quem rodar o backend local de novo verá esses registros extras em `GET /matches`; limpar o banco local (`rm squadup.db` + rodar migrations/seed de novo) se isso incomodar a demo. |
| D26 | `CreateMatchScreen` não dá feedback visual quando a localização não pôde ser capturada | ~~Baixa~~ **Resolvida (sessão 35)** | Aviso discreto exibido quando a checagem termina sem coordenadas, sem bloquear a criação (D-Geo-3) — detalhe em `progress.md`, sessão 35. |
| D27 | `eas build:configure` reescreve `android.permissions` em `app.json`, ignorando o valor já configurado | Baixa | Ao rodar `eas build:configure` na sessão 33 para gerar o `projectId` (tarefa 12.8/item 7), o CLI adicionou `android.permission.ACCESS_COARSE_LOCATION` (duplicado) e **`android.permission.ACCESS_FINE_LOCATION`** às permissões — essa última contraria diretamente a decisão D-Geo-4 (só precisão "balanced", nunca "fine"). Corrigido manualmente na mesma sessão (revertido para `["ACCESS_COARSE_LOCATION"]`). Se `eas build:configure`/`eas build` forem rodados de novo no futuro (ex.: ao adicionar a plataforma iOS), **conferir o diff de `app.json` antes de commitar** — o CLI pode reintroduzir a permissão indevida silenciosamente. |
| D28 | `HomeScreen`/`MatchChatScreen`/`MatchDetailScreen`/`MyProfileScreen`/`EditProfileScreen`/`PublicProfileScreen`/`ReportUserScreen` usavam `CURRENT_USER`/`MOCK_USERS`/`MOCK_RATINGS` (mocks) em vez do usuário real logado — **Resolvida (sessão 34)** | ~~Alta~~ **Resolvida** | Ficou pra trás quando a Fase 13 trocou os mocks pela API real — só `RateUserScreen`/`PostMatchRatingScreen` tinham sido migrados. Efeito prático descoberto ao usuário perguntar "cadastro novo, vai ficar funcional?": "Meu Perfil" sempre mostrava o perfil mockado (nunca o real); "Editar perfil" não persistia nada (só um `Alert` de sucesso fake); como organizador real, os botões "Encerrar partida"/"Aprovar participante" nunca apareciam (checagem de `isOrganizer` comparava com o ID do mock); status de participação do usuário real ficava errado; mensagens próprias no chat apareciam com o estilo de "mensagem de outra pessoa"; **`PublicProfileScreen`/`ReportUserScreen` mostravam "Usuário não encontrado" para qualquer participante real** (procuravam por `id` em `MOCK_USERS`, que só tem os 6 IDs fake — nunca bate com um UUID gerado pelo backend). Corrigido: `HomeScreen`/`MatchChatScreen`/`MatchDetailScreen`/`EditProfileScreen` passaram a usar `useAuth().user`; `MyProfileScreen` passou a usar `useAuth().user` + `useUserRatings` (real); novo hook `usePublicProfile` (`GET /users/{id}`, novo `fetchPublicProfile` em `api/users.ts`) substitui `MOCK_USERS.find` em `PublicProfileScreen`/`ReportUserScreen`; `useMatchParticipation` passou a aceitar `currentUser: PublicUser \| null`; novo método `updateProfile` em `AuthContext` faz `EditProfileScreen` salvar de verdade via `PATCH /users/me` (payload expandido em `api/users.ts` para incluir `name`/`bio`/`location`/`favorite_sports`, antes só `level`/`photo_url`). 3 suítes de teste reescritas (`MatchDetailScreen`, `PublicProfileScreen`, `ReportUserScreen`) para mockar `useAuth`/API real em vez dos mocks síncronos. |
| D29 | `expo-font` (peer dependency de `@expo/vector-icons`) nunca foi instalado — app crashava instantaneamente ao abrir fora do Expo Go | ~~Alta~~ **Resolvida (sessão 34)** | Descoberto no log da própria build EAS (fase `RUN_EXPO_DOCTOR`, nível `error`): "Missing peer dependency: expo-font ... Your app may crash outside of Expo Go without this dependency" — confirmado pelo usuário instalando o APK de teste e o app fechando sozinho na abertura. `@expo/vector-icons` é usado em quase toda tela (headers, abas, botões), então o crash acontecia antes de qualquer UI renderizar. `expo doctor` também apontava duas versões conflitantes de `expo-font` no `node_modules` (transitiva vs direta) e mais dois desalinhamentos de versão (`expo` 54.0.34→54.0.36, `babel-preset-expo`/`@types/jest` fora da faixa esperada pelo SDK 54). Corrigido com `npx expo install expo-font` + `npx expo install --fix`; `npx expo-doctor` confirma **18/18 checks passando** (estava 15/18). Mesma família do D7 (que já registrava a dependência-irmã `expo-asset` como um risco não instalado) — nenhuma ação adicional necessária para `expo-asset`, que segue mockado só no Jest. **Exige gerar uma build EAS nova** — o APK já instalado no dispositivo de teste (sessão 34) foi compilado antes desta correção e precisa ser substituído. |
| D30 | Campos `DD/MM/AAAA` sem inserção automática de "/" e telas de formulário sem `KeyboardAvoidingView` (teclado cobria o campo em foco) | ~~Alta~~ **Parcialmente resolvida (sessão 34), completada por D31** | Achado pelo usuário testando o cadastro no APK real: o teclado numérico do Android não tem tecla "/", e nenhuma tela inseria as barras automaticamente enquanto o usuário digitava — impossível preencher `RegisterScreen`/`CreateMatchScreen`/`FiltersScreen` (todas usam o mesmo padrão `DD/MM/AAAA`). Além disso, nenhuma tela de formulário (exceto `MatchChatScreen`) usava `KeyboardAvoidingView`. Corrigido nesta primeira passada: nova função `formatDateInput` (`src/utils/date.ts`) insere as barras automaticamente a partir dos dígitos digitados (usada em `RegisterScreen`, `CreateMatchScreen`, `FiltersScreen`); `KeyboardAvoidingView` adicionado em `LoginScreen`, `RegisterScreen`, `ProfileSetupScreen`, `CreateMatchScreen`, `EditProfileScreen`, `ReportUserScreen`, `RateUserScreen` e `FiltersScreen`. **A máscara de data funcionou, mas o `behavior="height"` usado no Android continuou sem resolver o teclado cobrindo o campo** — causa raiz e correção completa em D31. 5 testes novos para `formatDateInput` (`date.test.ts`). |
| D31 | `KeyboardAvoidingView` com `behavior="height"` no Android não resolvia o teclado cobrindo o campo, mesmo depois do D30; cadastro também ficava irrecuperável após uma falha parcial em `completeProfile` | ~~Alta~~ **Resolvida (sessão 34)** | Dois problemas relatados juntos pelo usuário na mesma rodada de teste: **(1)** o D30 não resolveu o teclado — causa raiz pesquisada (não seria seguro adivinhar de novo, cada build EAS leva de 15min a 2h30): `edgeToEdgeEnabled: true` (já ativo no projeto) muda como o Android lida com o teclado a partir do SDK 54/RN 0.81, e a recomendação oficial da própria Expo é usar `behavior={undefined}` no Android (deixar o SO redimensionar a janela via `windowSoftInputMode`), não `"height"` — ver [docs.expo.dev/guides/keyboard-handling](https://docs.expo.dev/guides/keyboard-handling/). Corrigido: `behavior={Platform.OS === "ios" ? "padding" : undefined}` nas 9 telas (as 8 do D30 + `MatchChatScreen`, que já tinha o mesmo `"height"` problemático antes desta sessão); `app.json` ganhou `android.softwareKeyboardLayoutMode: "resize"` para garantir o redimensionamento automático da janela. **(2)** `completeProfile` (`AuthContext.tsx`) não sobrevivia a uma falha parcial: se `POST /auth/register` desse certo mas o passo seguinte (`POST /auth/login` ou `PATCH /users/me`) falhasse (ex.: instabilidade de rede real, exatamente o que aconteceu no teste), a conta já tinha sido criada no backend, mas o usuário via um erro genérico e, ao tentar de novo com os mesmos dados, `POST /auth/register` falhava com `EMAIL_ALREADY_REGISTERED` — sem forma de prosseguir sem trocar de e-mail. Corrigido: `completeProfile` agora captura especificamente `EMAIL_ALREADY_REGISTERED` e segue para o login em vez de propagar o erro (login com credenciais erradas — e-mail de outra conta — continua falhando normalmente, com o erro real do login). Também: `ProfileSetupScreen` agora mostra a mensagem crua do erro quando não é um `ApiError` (antes escondia atrás de um texto genérico, dificultando diagnosticar a causa real da primeira falha). 2 testes novos em `AuthContext.test.tsx` cobrindo os dois cenários (retry bem-sucedido e e-mail de outra conta). **Exige gerar uma build EAS nova** (mesma exigência do D29/D30 — os três foram corrigidos na mesma sessão, uma única build cobre tudo). |
| D32 | `apiClient` não tinha nenhuma tolerância a falha de rede — uma queda momentânea de conectividade (ex.: mobile data instável) derrubava qualquer chamada de uma vez, sem tentar de novo | ~~Média~~ **Resolvida (sessão 34)** | Mesmo depois do D31, o cadastro voltou a falhar em teste real com "Network request failed" — confirmado pelos logs reais do Railway (`GET /health`, `POST /auth/register/login`, tudo respondendo normalmente por perto do horário do teste) que **não era bug determinístico**: o backend e o fluxo funcionam (o log mostra dois cadastros completos com sucesso), foi uma queda pontual de rede do dispositivo. O usuário apontou, corretamente, que o app deveria absorver isso sozinho em vez de exigir que o usuário perceba o erro e tente de novo manualmente. Corrigido: `fetchWithNetworkRetry` (novo, dentro de `src/services/api/client.ts`) tenta de novo até 2 vezes (600ms de espera entre tentativas) **só quando o próprio `fetch()` lança antes de qualquer resposta chegar** (`TypeError`, sem internet/DNS/conexão recusada) — nunca em cima de uma resposta HTTP já recebida (4xx/5xx são erros de negócio reais; repeti-los às cegas arriscaria efeito colateral duplicado, ex. duas denúncias iguais). Nova função exportada `isNetworkError(err)` também usada em `ProfileSetupScreen` para mostrar "Sem conexão com o servidor..." em vez do texto cru do erro nativo quando as 3 tentativas se esgotam. Benefício sistêmico: como o retry vive dentro de `apiClient`, toda chamada da API (não só cadastro) passa a tolerar blips de rede automaticamente, sem mudança em cada tela. 6 testes novos (`client.test.ts`): retry com sucesso na 2ª tentativa, esgotar as tentativas e propagar o erro original, e confirmar que respostas HTTP de erro nunca são repetidas. **Exige gerar uma build EAS nova.** |
| D33 | Mismatch de contrato: senha exige mínimo 8 caracteres no backend (`RegisterRequest.password`), front só validava 6; erros de validação automática do FastAPI (`422`, `detail` em lista) caíam no fallback genérico e escondiam a causa real | ~~Alta~~ **Resolvida (sessão 34)** | O usuário testou com um e-mail novo (evitando o caso de conflito do D31) e o cadastro falhou do mesmo jeito — pediu pra validar o fluxo e o contrato com o backend em vez de assumir rede de novo. Comparando `RegisterScreen`/`services/api/auth.ts` contra `app/schemas/auth.py` (`RegisterRequest`) linha a linha: `password: str = Field(..., min_length=8)` no backend vs `password.length < 6` no front — uma senha de 6–7 caracteres passa na validação do app e é rejeitada pelo backend com `422`. Como o FastAPI usa um formato de erro diferente do nosso (`detail` vem como lista de `{loc, msg, type}`, não `{code, message}`), esse `422` caía direto no fallback `UNKNOWN_ERROR`/"Erro inesperado ao comunicar com o servidor." — escondendo a causa real tanto do usuário quanto de quem for depurar. Corrigido: `RegisterScreen` agora exige 8+ caracteres (mensagem e placeholder atualizados); `parseErrorPayload` (`client.ts`) ganhou `fromValidationErrors`, que reconhece o formato de lista do FastAPI e monta uma mensagem legível (`"password: String should have at least 8 characters"`) em vez do genérico. Restante do contrato (`name`/`age`/`location`/`favorite_sports`/enums) conferido e sem mismatch — `Sport`/`ExperienceLevel` batem exatamente entre front e back. `LoginScreen` mantido em 6 (login não tem `min_length` no backend, não é contrato quebrado). 1 teste novo em `client.test.ts` para o parser de validação. **Exige gerar uma build EAS nova.** |
| D34 | `validateEmail` (`RegisterScreen`/`LoginScreen`) é bem mais permissiva que o `EmailStr` do backend | ~~Baixa~~ **Resolvida (sessão 35)** | Extraída para `src/utils/validation.ts`, regex agora exige domínio+TLD — detalhe em `progress.md`, sessão 35. |

---

## Paridade de contrato com o backend (`../back`)

Comparação completa de models/schemas/routers do backend real (FastAPI + SQLModel, já com
auth JWT, matches, mensagens, ratings e reports persistidos) contra os tipos/mocks do front
está documentada em **`.status/backend-contract.md`** (sessão 18, 2026-07-08). Resumo:
enums têm paridade total dos dois lados; maior risco é `Match` único no front vs duas shapes
no backend (D16); único contrato genuinamente quebrado é a ação de moderação de denúncia
(D14). Consultar esse documento antes de iniciar qualquer integração real com a API.

---

## Fila de integração — Fase 13 (`.status/roadmap.md` §19, sessão 19 — 2026-07-08)

> Plano mestre completo, decisões de arquitetura (D-A a D-D) e por que cada item existe estão
> em `.status/backend-contract.md` §6. **Fase 13 inteiramente concluída (16/16) na sessão 28** —
> detalhe tarefa-a-tarefa de todas as sub-fases (13.1–13.9) arquivado em
> [`progress.md`](progress.md), sessões 20–28.

| # | Tarefa | Sub-fase | Status |
|---|--------|----------|--------|
| 14 | `RatingsContext` → React Query; adapter de achatamento de critérios; UI trata `averageRating` nulo | 13.7 | 🟢 |
| 15 | `ReportsContext.updateReportStatus` migrado para ação (`archive`/`warn`/`ban`) em vez de status-alvo (D14) | 13.8 | 🟢 |
| 16 | Teste ponta a ponta (via API real, sessão 28); apontar `.env` para URL de produção; ajustar texto do TCC (decisão D-A) | 13.9 | 🟢 |

---

## Bloqueadores e observações

> Histórico detalhado por sessão (o "porquê" de cada decisão, trechos de código, achados de
> auditoria) vive em [`progress.md`](progress.md) — esta seção só guarda a observação mais
> recente, para servir de ponto de retomada rápido no início da próxima sessão.

- **Checkpointer — Sessão 37 (2026-10-26, branch `chore/render-api-url`):** o trial do Railway
  expirou (2026-09) e `squadup-api.up.railway.app` passou a responder `404 Application not
  found` — **a build `fa25bd21` não funciona mais**. Backend migrado para **Render (API, free) +
  Neon (Postgres, free)** (`squadup-back` PRs #63 e #64 — o #64 fixa `sqlmodel<0.0.43`, cuja
  versão nova rejeitava datetime naive e quebraria a produção). Nova URL de produção:
  **`https://squadup-api-yu40.onrender.com`** (`/health` 200, migrations aplicadas no Neon, banco
  vazio). `eas.json` (`preview`/`production`), `.env` e `.env.example` reapontados.
  - **Plano free do Render hiberna após ~15 min**: a primeira requisição levou ~42 s. O
    `apiClient` não tem timeout, então o app só demora (não dá erro) — antes da demo/gravação,
    abrir `/health` no navegador ~2 min antes.
  - **Ambiente local:** `node_modules` estava desatualizado (faltava `expo-location`, 5 suítes não
    rodavam) — resolvido com `npm install`. `npm run lint` acusa ~7,7 mil erros **só de CRLF**
    (`core.autocrlf=true` converte o working tree; o repositório está em LF) — zero erros reais.
    309/309 testes, `tsc` limpo.
  - **Seed em produção (D-Deploy-1 resolvida):** banco do Neon populado com `app.seed` + ajustes
    para a demo, via script avulso (não versionado): partidas abertas movidas para 24/11–08/12,
    partida encerrada (`match-13`) e histórico (mensagens/avaliações/denúncias) para out/2026,
    coordenadas aproximadas por bairro em todas as partidas (filtro de proximidade), personagens
    fictícios com senha aleatória (a `changeme123` do seed é pública no repositório). `user-1`
    (Guilherme Freire) virou a conta do autor (`guitenan@hotmail.com`), com `role=admin`.
    Validado pela API pública: login, 13 partidas, filtro por raio, `GET /reports` 200.
  - **Próxima tarefa:** gerar build EAS nova (`eas build --platform android --profile preview`) —
    exige `eas login` nesta máquina — e retomar o teste ponta a ponta (T1/item 8 da Fase 14).
- **Checkpointer — Sessão 35 (2026-07-30, branch `chore/tech-debt-cleanup`, aguardando
  revisão/merge em `dev`):** limpeza de dívidas técnicas de baixa prioridade, a pedido do usuário
  ("quero tratar as dívidas técnicas uma a uma"). Resolvidas: **D4** (`.editorconfig`), **D13**
  (`accessibilityLabel` no selo de verificado), **D26** (aviso de localização em
  `CreateMatchScreen`), **D34** (`validateEmail` alinhada ao `EmailStr`), **D24** (mensagem clara
  para `NOT_MATCH_PARTICIPANT` ao avaliar). Detalhe arquivo-por-arquivo em
  [`progress.md`](progress.md), sessão 35. Não mexidas por não serem acionáveis por código agora:
  D2, D3, D7, D10, D11, D22, D23, D25, D27. **Nenhum requisito ou dívida nova surgiu.** 309/309
  testes, `tsc`/lint zerados, `npx expo export --platform web` ok.
  - **Estado do repositório:** branch `chore/tech-debt-cleanup` (a partir de `dev`, que estava no
    commit `2693487`), commit `941f001` (código + testes) + commit de fechamento desta sessão
    (docs `.status/`). Não mergeada nem enviada ao remoto — aguardando decisão do usuário.
  - **Fase 14 inalterada, segue 7/8** — esta sessão não tocou no item 8 (hardening). A build EAS
    mais recente, `fa25bd21` (commit `3dcd0dd`, já em `dev`, finalizada 2026-07-29 20:02 UTC),
    **segue não testada pelo usuário** e **não inclui** as correções desta sessão (JS puro, sem
    dependência nativa nova — só apareceriam numa build gerada depois do merge desta branch). APK:
    https://expo.dev/artifacts/eas/a3RYDwbUazx-A6C9VQQvn39-lgGsUzSPg8Mk1hxEkuY.apk
  - **Próxima tarefa concreta:** (1) revisar/mergear `chore/tech-debt-cleanup` em `dev`; (2)
    retomar o teste de ponta a ponta da build `fa25bd21` — cadastro → criar partida → chat →
    filtro de proximidade → push, numa passada só, não isoladamente — para saber se o item 8 da
    Fase 14 pode fechar. Nenhum bug de código pendente; só falta a confirmação do usuário no
    dispositivo real. Migration do backend já em produção (Railway) — pode testar local ou contra
    `https://squadup-api.up.railway.app` (a build atual usa produção, perfil `preview`).

---

## Progresso geral

**Total de tarefas:** 86 (70 do protótipo + 16 da fila de integração, Fase 13)
**Concluídas:** 85 (69 do protótipo + refinamento visual transversal + 16/16 da Fase 13 — sessões 20–28)
**Em andamento:** 1 (Fase 12: 12.8 — `projectId` gerado, 3 builds EAS via `--profile preview` geradas e instaladas em dispositivo real na sessão 34; falta só decidir se uma delas é a "final" pra apresentação ou se ainda vai mudar mais)
**A fazer:** 1 (Fase 12: 12.3 — dispositivo físico já em uso desde a sessão 34 pra testar a Fase 14, mas o teste formal "Expo Go em iOS e Android" ainda não foi feito à parte — Expo Go não serve mais para validar push, sessão 33)
