# Revisão geral do SquadUp — 2026-11-03

> Escopo: front `squadup-front` (`dev` @ `97961c8`) e back `squadup-back` (`origin/dev` @
> `2c690fc`, que é o que roda no Render). Somente análise: nenhum código foi alterado, nenhuma
> requisição foi feita à API de produção. Dívidas já registradas (D1–D34, T1/T7/T8, observações
> das sessões 37–38) não são reportadas como achados novos; quando relevantes, são citadas.
> Caminhos `app/...` são do back; `src/...` são do front.

## Status de implementação

Atualizado em 2026-11-03. PRs de `squadup-back` são indicados como "back #N"; os de
`squadup-app`, como "app #N". O autor revisa e mergeia cada PR.

| Item | Situação | PR | Build EAS |
|---|---|---|---|
| A3 | Mergeado e em produção | back #65 | Não precisa |
| A3 (ajuste de front) | PR aberto: esconde "Cancelar participação" para o organizador | app #22 | Sim |
| A1 | Mergeado e em produção (verificado: `GET /matches/match-1` sem token → 401) | back #66 | Não precisa |
| A4 | Mergeado | back #67 | Não precisa |
| A2 (back) | PR aberto: `order=desc` em `GET /matches/{id}/messages` | back #68 | Não precisa |
| A2 (front) + A6 | PR aberto: chat das mais recentes para as mais antigas + polling de 5 s | app #19 | Sim, **depois** do back #68 em produção |
| A8 | PR aberto: estado de erro, puxar para atualizar, recarga ao voltar ao app | app #20 | Sim |
| A7 (app) | PR aberto: aquecimento do servidor + aviso de "servidor iniciando" | app #21 | Sim |
| A7 (operacional) | Pendente (ação do autor): monitor externo chamando `/health` a cada 10 min | — | — |
| A5 | Pendente (ação do autor): ajustar as datas da demo em produção na semana da defesa | — | — |
| A9 | Pendente: ajustes de texto do `TCC.tex` (seção 5 deste relatório e linhas abaixo) | — | — |

Os PRs de app (#19, #20, #21 e #22) não conflitam entre si e cabem numa única build EAS.

- **A3, dados de produção:** conferidos só por leitura (`GET /matches` e `GET /matches/{id}`). As
  13 partidas são do seed (`match-1`…`match-13`) e todas têm o organizador como participante
  (`match-10`, cancelada, com o organizador `cancelled`). Nenhuma correção de dados foi
  necessária. O script de correção ficou só proposto, não foi executado.
- **A4, conferir em produção:** nos logs do Render, o evento `rate_limit_key` deve mostrar
  `ip_source: "header"`. Se mostrar `"connection"`, o `True-Client-IP` não chega e o limite
  passa a agrupar todos os usuários; a saída imediata é `RATE_LIMIT_ENABLED=false` no Render.
- **Linhas do `TCC.tex` afetadas pelos itens já implementados** (entram no A9):
  - 660 (pós-condição de "Criar partida"): o organizador entra como participante confirmado (A3);
  - 790–793 ("Cancelar participação"): o organizador não pode cancelar (A3); a linha 792 passa a
    ser verdadeira;
  - 695 e 891 (pré-condições de "Visualizar detalhes" e "Visualizar perfil"): usuário autenticado
    (A1);
  - 1252–1254 (§4.5): leituras de perfil exigem autenticação (A1) e login/cadastro têm limite de
    tentativas (A4);
  - 1580 (§7.2): mensagens atualizadas automaticamente a cada poucos segundos (A6);
  - 1352 e 1579 (opcional): aquecimento do servidor e aviso ao usuário (A7);
  - 200, 220, 1330, 1332 e 1568 (contagem de testes): recontar depois dos merges. Hoje: API com
    192 testes contando o back #68; app com 316 em `dev`, mais 7 (#19), 11 (#20) e 8 (#21);
    o #22 não muda a contagem.

## 1. Resumo executivo

O projeto está em bom estado técnico: back com 165 testes passando (98,9% de cobertura), ruff,
black, mypy strict, bandit e pip-audit limpos; front com `tsc` limpo e lint sem erros reais; CI
verde nos dois repositórios. Não encontrei IDOR de escrita: encerrar e aprovar checam o
organizador, avaliar exige participação confirmada, o chat checa acesso e a moderação usa
`get_current_admin`.

Os problemas que importam antes da defesa são poucos e concentrados:

1. **Dois problemas de segurança altos e baratos de corrigir:** perfis, avaliações e
   participantes podem ser lidos **sem autenticação** (nome, idade, bairro, bio e foto de qualquer
   participante, enumeráveis a partir de `GET /matches`), e **não há limite de tentativas** em
   login e cadastro (inclusive para a conta admin real do autor em produção).
2. **Um furo no fluxo do organizador**, escondido pelo seed: quem cria uma partida pelo app não
   vira participante. Por isso não vê o botão "Encerrar partida" nem o botão do chat, e nunca pode
   avaliar nem ser avaliado. Os casos de uso do Cap. 3 (encerrar, chat) ficam inalcançáveis para
   uma partida criada ao vivo na defesa.
3. **O chat não se atualiza sozinho e esconde as mensagens mais novas** quando passa de 30.
   Numa demo com dois aparelhos, a mensagem chega por push, mas o chat aberto mostra o cache
   antigo por até 60 s.
4. **Riscos operacionais da demo:** cold start de cerca de 40 s sem nenhum feedback na tela, e as
   partidas "abertas" do seed em produção (24/11–08/12) estarão todas no passado se a defesa for
   depois de 08/12.

Somando os itens ANTES DA DEFESA: **cerca de 21 h**, mais **uma build EAS** (agrupando os itens
de front). **Nenhum screenshot do TCC muda.** Três dos quatro itens altos são só de backend: o
deploy é automático pelo `dev` no Render, sem build nova.

Na monografia, além de números desatualizados (testes e commits), há afirmações que o código
não sustenta. As principais: "Grupos: Sim" na Tabela 2.1 (`TCC.tex:382`), o "histórico de
partidas disputadas" no perfil (`:1566`) e o cancelamento bloqueado após o encerramento (`:792`).

**Discordância com decisão registrada (não tratada como erro):** os números "10k+ jogadores /
500+ partidas/mês" da `WelcomeScreen` (mantidos na sessão 38). Num trabalho acadêmico, com 13
partidas no banco, a banca pode lê-los como métrica inventada. A troca custa cerca de 15 min,
entra junto na build EAS dos itens de front e não afeta o TCC (`welcome.png` não aparece no
`.tex`). Concordo com D-Geo-4 e com D-TCC-2.

## 2. Achados ANTES DA DEFESA

Ordenados por severidade e depois por esforço. "Build" indica que o item precisa de uma nova
build EAS (todos os de front cabem numa única build).

### A1 — Perfis, avaliações e participantes legíveis sem autenticação

- **Evidência:** `app/routers/users.py:106-120` (`GET /users/{id}` sem `get_current_user`),
  `app/routers/ratings.py:47-60` (`GET /users/{id}/ratings`), `app/routers/matches.py:74-88`
  (`GET /matches/{id}` devolve `participants[].user` completo). `GET /matches`
  (`matches.py:42-71`, também público) expõe `organizer_id` de todas as partidas, o que permite
  enumerar usuários. `PublicProfileRead` inclui `age`, `location`, `bio` e `photo_url`
  (`app/schemas/user.py:22-35`). OWASP API1/API3:2023 e minimização de dados (LGPD).
- **Severidade:** alta · **Esforço:** 2,5 h (back + atualização dos testes que chamam essas rotas
  sem token) · **Risco de regressão:** baixo, porque o app só chama essas três rotas depois do
  login. **Manter `GET /matches` público por ora:** fechá-lo exigiria mudar o `MatchesProvider`
  (`src/contexts/MatchesContext.tsx:21`, que dispara antes do login) e gerar build nova.
- **Impacto no TCC:** §4.5 Segurança e privacidade (`TCC.tex:1248-1254`). Vale acrescentar uma
  frase ("consultas a perfis e participantes exigem autenticação").
- **Classificação:** ANTES DA DEFESA (vulnerabilidade alta). Só back, sem build.

### A2 — Chat esconde as mensagens mais novas quando passa de 30

- **Evidência:** `src/hooks/useMessages.ts:28-39` busca sempre `skip=0, limit=30→100`, enquanto o
  back ordena por ordem crescente (`app/services/message_service.py:87-93`). Com mais de 30
  mensagens, a tela mostra as **30 mais antigas**; as novas só aparecem rolando para cima. Com
  mais de 100, as mais novas nunca aparecem. A limitação está comentada no código, mas não está
  registrada como dívida, e o efeito é perder mensagens recentes.
- **Severidade:** alta (funcional, num fluxo central) · **Esforço:** 2,5 h (parâmetro opcional
  `order=desc` no back, retrocompatível com a build atual; front pagina com `skip` e inverte;
  testes) · **Risco:** baixo.
- **Impacto no TCC:** §7.2 Limitações (`TCC.tex:1580`), ver incoerência I7.
- **Classificação:** ANTES DA DEFESA. Back + front, com build.

### A3 — Organizador não vira participante: sem "Encerrar", sem chat, sem reputação

- **Evidência:** `app/services/match_service.py:132-148`: `create_match` não cria o
  `Participant` do organizador. No front, `src/screens/MatchDetailScreen.tsx:112-131` só mostra
  "Chat da partida" e "Encerrar partida" quando `userStatus === "confirmed"`, então o organizador
  vê "Participar". `app/services/rating_service.py:93-108` exige que os dois lados estejam
  confirmados, o que impede o organizador de avaliar e de ser avaliado. O seed mascara o problema
  porque inclui cada organizador como confirmado (`app/seed.py:146-147`). Na mesma área,
  `leave_match` (`match_service.py:228-246`) não checa status: é possível sair de uma partida já
  **encerrada** (fugindo de avaliação, via API) e o organizador pode sair da própria partida.
- **Severidade:** alta (casos de uso do Cap. 3 inalcançáveis numa partida criada ao vivo)
  · **Esforço:** 3 h. No back: organizador entra como `CONFIRMED` ao criar (ocupa vaga, igual ao
  seed); bloquear `leave` do organizador e `leave` de partida encerrada ou cancelada; ajustar os
  testes que esperam `confirmed_count == 0` após criar (`app/tests/test_matches.py:296` e
  vizinhos). · **Risco:** baixo. A mudança deixa a regra alinhada ao seed e ao texto, e a build
  atual já passa a mostrar os botões porque o organizador vira "confirmed".
- **Impacto no TCC:** nenhum texto a mudar; corrige as incoerências I4 e I5 (§3.4.6, §3.4.8,
  §3.5).
- **Classificação:** ANTES DA DEFESA. Só back, sem build. Partidas criadas em produção por
  usuários reais depois do seed precisam de um ajuste pontual de dados (verificar se existem).

### A4 — Sem rate limiting em login e cadastro

- **Evidência:** nenhuma ocorrência de `slowapi`/limiter em `app/` (grep). `app/routers/auth.py:28-52`.
  Cada login roda bcrypt (CPU) numa instância free de 0,1 CPU: dá para forçar senha por tentativa
  e derrubar o serviço por CPU (OWASP API4:2023). A conta do autor em produção é `admin` (queue,
  sessão 37).
- **Severidade:** alta · **Esforço:** 3,5 h (limitador em memória, de 5 a 10 por minuto por IP,
  em `/auth/login` e `/auth/register`; uvicorn com `--proxy-headers --forwarded-allow-ips` no
  `render.yaml` para ler o IP real atrás do proxy do Render; limitador desligável nos testes)
  · **Risco:** médio. Se o IP do proxy não for tratado, todos os usuários dividem o mesmo
  contador, então é preciso testar com o header `X-Forwarded-For`.
- **Impacto no TCC:** §4.5 (`TCC.tex:1252-1254`), uma frase opcional.
- **Classificação:** ANTES DA DEFESA (vulnerabilidade alta). Só back, sem build.

### A5 — Partidas da demo em produção ficam no passado antes da defesa

- **Evidência:** as partidas abertas do seed de produção vão de 24/11 a 08/12
  (`.status/queue.md:248-251`), e a defesa é até 18/12. A listagem não filtra por data
  (`app/services/match_service.py:100-110`) e o `join_match` aceita partida com data passada
  (`match_service.py:184-194`). A banca veria partidas "abertas" em datas que já passaram.
- **Severidade:** média · **Esforço:** 0,5 h (operacional: rodar de novo o script de ajuste de
  datas da sessão 37 na semana da defesa; sem código) · **Risco:** baixo.
- **Impacto no TCC:** nenhum.
- **Classificação:** ANTES DA DEFESA (operacional). A correção em código (recusar `join` em data
  passada) está em P10.

### A6 — Chat não se atualiza sozinho

- **Evidência:** `src/hooks/useMessages.ts:28` não tem `refetchInterval`. `src/services/queryClient.ts:7`
  define `staleTime: 60_000`, então reabrir o chat em menos de 60 s nem refaz a busca.
  `src/screens/MatchChatScreen.tsx:63-89` não tem pull-to-refresh. O WebSocket do back não é
  usado (limitação já declarada no TCC). Numa demo com dois aparelhos, o push chega, o usuário
  toca nele e o chat mostra o cache antigo.
- **Severidade:** média · **Esforço:** 1,5 h (`refetchInterval` de cerca de 5 s só com a tela em
  foco, `staleTime: 0` para mensagens, `RefreshControl`, teste) · **Risco:** baixo.
- **Impacto no TCC:** §7.2 (`TCC.tex:1580`): trocar "ao abrir ou atualizar" por "atualizadas
  automaticamente a cada poucos segundos".
- **Classificação:** ANTES DA DEFESA. Front, com build.

### A7 — Cold start do Render sem feedback

- **Evidência:** `src/services/api/client.ts:142`: `fetch` sem timeout nem `AbortController`.
  No plano free, a primeira requisição leva cerca de 42 s (queue, sessão 37), e o login fica com o
  spinner parado sem nenhuma explicação.
- **Severidade:** média · **Esforço:** 2,75 h. Em duas partes: (a) operacional, 0,25 h: monitor
  externo gratuito chamando `/health` a cada 10 min, o que evita a hibernação sem código (o plano
  free tem 750 h/mês, suficiente para um serviço); (b) app, 2,5 h: `GET /health` sem esperar
  resposta no boot, para aquecer o servidor, e aviso "O servidor está iniciando, pode levar até 1
  minuto" após cerca de 8 s de carregamento em Login/Cadastro/Home. · **Risco:** baixo.
- **Impacto no TCC:** §5.6 (`TCC.tex:1352`) e §7.2 (`:1579`). Opcional: citar a mitigação.
- **Classificação:** ANTES DA DEFESA. A parte (a) não exige build; a parte (b) exige.

### A8 — Home sem estado de erro e sem pull-to-refresh

- **Evidência:** nenhum `isError` em todo o `src/` (grep). `src/screens/HomeScreen.tsx:156-191`
  mostra "Nenhuma partida encontrada" quando a API falha. `src/contexts/MatchesContext.tsx:39`
  expõe `refetch`, que nenhuma tela usa. O `MatchesProvider` fica sempre montado e não recarrega
  ao voltar do segundo plano (não há `focusManager`/`AppState`), então partidas novas de outros
  usuários não aparecem. O mesmo vale para "Partida não encontrada" em `MatchDetailScreen.tsx:79-86`
  quando há falha de rede.
- **Severidade:** média · **Esforço:** 3 h (componente `ErrorState` com "Tentar de novo", uso em
  Home e Detalhe, `RefreshControl` na Home, `focusManager` com `AppState`, testes)
  · **Risco:** baixo.
- **Impacto no TCC:** nenhum.
- **Classificação:** ANTES DA DEFESA. Front, com build.

### A9 — Ajustes de texto na monografia

- **Evidência:** ver seção 5 (I1–I11).
- **Severidade:** baixa · **Esforço:** 2 h · **Risco:** nenhum.
- **Impacto no TCC:** resumo/abstract, Tab. 2.1, §3.4, §4.5, §5.3, §5.4, §5.6, §7.1, §7.2.
- **Classificação:** ANTES DA DEFESA (é o texto que a banca lê). Incluir também em §7.2 a
  limitação de LGPD (P8).

**Total ANTES DA DEFESA: cerca de 21 h** (2,5 + 2,5 + 3 + 3,5 + 0,5 + 1,5 + 2,75 + 3 + 2), mais
uma build EAS para A2(front), A6, A7(b) e A8. Nenhum screenshot de `tcc/assets/app/` muda.

## 3. Achados PÓS-TCC

| # | Achado | Evidência | Sev. | h | Risco | TCC |
|---|---|---|---|---|---|---|
| P1 | N+1 em todas as leituras: `GET /matches` faz 1+N consultas de contagem; o detalhe faz cerca de 3 por participante (`build_public_profile` calcula média e partidas por usuário); uma página de 100 mensagens faz cerca de 300 consultas (**HIPÓTESE quantitativa**: confirmar contando eventos `before_cursor_execute` num teste) | `app/services/match_service.py:41-48,119-121,51-66`; `app/services/user_service.py:27-32`; `app/services/message_service.py:65-73,95`; `app/services/rating_service.py:51-64,147`; `app/services/report_service.py:39-49,87` | média | 6 | médio | nenhum |
| P2 | `GET /matches` sem paginação e sem filtro de status ou data; Haversine em Python sobre **todas** as linhas que passam nos filtros (inclusive encerradas e passadas), sem a pré-filtragem por bounding box prevista em `squadup-back/.status/roadmap.md` §19.1. Hoje são 13 linhas, sem impacto; cresce O(N) por requisição | `match_service.py:69-86,100-117`; `app/routers/matches.py:42-71` | média | 4 | médio | §4.1 Geolocalização (`:1165`) só se mudar o comportamento |
| P3 | Índices ausentes: `matches(date, status, sport)`; `participants(user_id)` (a PK é `(match_id, user_id)`, então `get_matches_played` varre a tabela) | `app/models/match.py:21-34`; `app/models/participant.py:15-16`; `user_service.py:18-24` | baixa | 1,5 | baixo | nenhum |
| P4 | Corrida em `join`/`approve`: conta e depois insere, sem lock, o que permite exceder `max_participants` com requisições simultâneas. **HIPÓTESE**: confirmar com duas threads contra Postgres; correção com `SELECT ... FOR UPDATE` na partida | `match_service.py:206-222,326-335` | média | 3 | médio | nenhum |
| P5 | Avaliação duplicada possível: sem `UNIQUE(match_id, rater, rated)`, a checagem `existing` é corrida. O front reduz o risco com `loading` no botão (`src/screens/RateUserScreen.tsx:193`) | `app/models/rating.py:12-25`; `rating_service.py:110-125` | baixa | 1,5 | baixo | nenhum |
| P6 | Refresh concorrente pode deslogar: dois 401 simultâneos chamam `/auth/refresh` com o mesmo token; a rotação revoga o primeiro, o segundo falha e o handler limpa a sessão. **HIPÓTESE**: confirmar com teste de dois requests paralelos expirados; correção com promise compartilhada (single-flight) | `src/contexts/AuthContext.tsx:72-86`; `src/services/api/client.ts:150-155`; `app/services/auth_service.py:94-105` | média | 1,5 | baixo | nenhum |
| P7 | Logout não revoga o push token do aparelho: o front nunca envia `device_id`, então o T2 do back fica sem uso, e o aparelho continua recebendo o texto das mensagens do usuário que saiu até o próximo login. O logout também não limpa o cache do React Query (mensagens e denúncias ficam em memória) | `src/services/api/auth.ts:41-42`; `src/hooks/useNotificationRegistration.ts:38`; `AuthContext.tsx:167-180`; `app/routers/auth.py:91-94`. Relacionado à nota da Fase 14 em `queue.md:90-93` | média | 3 | baixo | nenhum |
| P8 | LGPD: não há exclusão de conta nem anonimização (nenhuma rota `DELETE`, contrariando o `CLAUDE.md` §5 do back); não há aviso de privacidade nem consentimento no cadastro; o corpo do push leva o texto da mensagem para um terceiro (Expo); `age` aparece no perfil público | grep sem `@router.delete`; `src/screens/RegisterScreen.tsx`; `message_service.py:116-122`; `app/schemas/user.py:26` | média | 10 | médio | §4.5 e §7.2. **Antes da defesa, só o texto** (dentro de A9) |
| P9 | Sessão/JWT: access token de 24 h, que continua válido após logout/logout-all; sem detecção de reuso de refresh token (revogar a família); `secret_key` com padrão `"change-me-in-.env"` e sem trava quando `environment=production` (o Render gera o valor, então hoje não há exposição) | `app/core/config.py:20-21`; `app/core/security.py:24-28`; `auth_service.py:86-105` | baixa | 2 | baixo | §4.5 (`:1252`) |
| P10 | Validação de entrada frouxa: nenhum `max_length` (título, local, descrição, mensagem, denúncia, comentário, nome, bio); `max_participants` sem teto; partida pode ser criada no passado e `join` aceita data passada | `app/schemas/match.py:12-18`; `app/schemas/message.py:10`; `app/schemas/report.py:15`; `app/schemas/auth.py:7-13`; `app/schemas/rating.py:15`; `match_service.py:184-194` | baixa | 2 | baixo | §3.4.3 (`:677`) |
| P11 | Feedback de erro genérico: participar, cancelar, encerrar e aprovar mostram "Tente novamente" e ignoram o código da API (`MATCH_FULL`, `MATCH_NOT_JOINABLE`...); envio de mensagem sem `onError` (o texto some sem aviso); chat sem estado para 403 | `src/hooks/useMatchParticipation.ts:44-46,59-61,77-79,90-92`; `src/hooks/useMessages.ts:49-54` | média | 2,5 | baixo | nenhum |
| P12 | Não existe tela "Minhas partidas": para chegar a uma partida encerrada e avaliar, o usuário precisa achá-la na lista geral; o perfil mostra só um contador | `src/navigation/AppNavigator.tsx:68-100` (4 abas); `src/screens/MyProfileScreen.tsx:84-86` | média | 6 | baixo | §7.1 (`:1566`), ver I6 |
| P13 | Lacunas de teste em telas críticas (linhas cobertas): Home 4,8%, Chat 0%, PostMatchRating 0%, RateUser 9,4%, ProfileSetup 5,1%, EditProfile 4,3%; total do front 72,9% | relatório do `jest --coverage` (seção 6) | média | 8 | baixo | §5.4 (`:1319`, "tarefa só concluída com testes") |
| P14 | CI/DevEx: o CI do front não roda `tsc` nem tem limite mínimo de cobertura (`.github/workflows/ci.yml:23-30`); **nenhuma branch protegida** em nenhum dos dois repositórios (`gh api .../protection` → 404 em `main` e `dev`; no back isso é o T8, no front é novo); 4 suítes estouram o timeout de 5 s quando a máquina está carregada (observação da Fase 15; `package.json:10` sem `maxWorkers`/`testTimeout`) | idem | média | 1 | baixo | §5.5 (`:1343`) |
| P15 | `npm audit --omit=dev`: 47 alertas (1 crítico `shell-quote`, 15 altos: `ws`, `node-forge`, `undici`, `@xmldom/xmldom`...), aparentemente todos da cadeia de build/CLI (Expo CLI, Metro, dev-middleware). **HIPÓTESE** de que nenhum chega ao APK: confirmar com `npm ls shell-quote ws node-forge`. `expo-doctor`: 3 patches atrasados (`expo` 54.0.36→.37, `expo-constants`, `jest-expo`) | seção 6 | baixa | 1 | médio (pode quebrar a build perto da defesa) | nenhum |
| P16 | Infra: o Render implanta a partir de `dev` (`render.yaml:11`) e `main` está 10+ commits atrás; `create_db_and_tables()` roda no startup de produção e pode criar tabelas por fora do Alembic (foi o que gerou o drift do banco local na sessão 38) | `render.yaml:11`; `app/main.py:22` | baixa | 1 | baixo | §5.6 (`:1350`), ver I8 |
| P17 | WebSocket do chat (não usado pelo app): o JWT vai na query string e provavelmente aparece no access log do uvicorn (**HIPÓTESE**: conferir nos logs do Render); cada conexão segura uma sessão de banco do pool | `app/routers/messages.py:85-127` | baixa | 2 | baixo | nenhum |
| P18 | Duplicação e código morto: `_get_match_or_404` repetido 3× e `_get_user_or_404` 2×; `MatchStatus.PENDING_APPROVAL` nunca é atribuído; `/auth/me` duplica `/users/me`; `apiClient.delete` sem uso; upload de avatar e `device_id` sem consumidor no front | `match_service.py:161`; `message_service.py:17`; `rating_service.py:14,24`; `report_service.py:19`; `app/models/enums.py:22`; `client.ts:173` | baixa | 1,5 | baixo | nenhum |
| P19 | Pedidos de permissão sem explicação prévia: push logo após o cadastro; localização ao abrir "Criar partida" | `AuthContext.tsx:58-62`; `src/screens/CreateMatchScreen.tsx:93` | baixa | 2 | baixo | nenhum |

## 4. Features propostas (diferencial: confiança e conexão entre desconhecidos)

Esforço = front + back + testes + texto do TCC.

| # | Feature | Problema que resolve | Quem não faz | h | Risco | Quando |
|---|---|---|---|---|---|---|
| F1 | **Compartilhar partida com um contato de confiança** (folha de compartilhamento nativa com local, horário, organizador e participantes, no estilo do "compartilhar viagem" do Uber) | Segurança ao encontrar desconhecidos, sem depender de nada novo no back | Nenhum dos 5 analisados | 1,5 + 0 + 1 + 0,5 = **3** | baixo | Cabe antes da defesa |
| F2 | **Reputação por critério** no perfil (médias de pontualidade, respeito, comportamento e presença) | Os 5 critérios já são coletados, mas a média usa só `overall` (`app/services/user_service.py:11-15`) e o `ReviewCard` mostra critérios só por avaliação. Dá à reputação a granularidade que a Tab. 2.1 promete | Hexagon e Peladeiros (reputação "Parcial"), Strava, WhatsApp | 2,5 (calcula a partir de `GET /users/{id}/ratings`, que já é buscado) + 0 + 1 + 1 = **4,5** | baixo | Cabe antes da defesa |
| F3 | **Selo "Novo por aqui"** para usuários com até 2 partidas, na lista de participantes e no perfil, e destaque de "Iniciantes OK" no card | Inclusão de quem não tem grupo (pilar social, `vision.md` §9.3) | Todos | 2 + 0 + 1 + 0,5 = **3,5** | baixo | Cabe antes da defesa |
| F4 | **Partidas em comum** no perfil público ("vocês já jogaram juntos 2×") | Confiança baseada em histórico compartilhado; também resolve o D23 (seletor de partida na denúncia) | Todos (o Meetup mostra só grupos em comum) | 2 + 2 + 1,5 + 0,5 = **6** | baixo | Cabe antes da defesa se sobrar tempo |
| F5 | **Bloquear usuário** (não ver as partidas dele e impedir que ele entre nas suas) | Segurança depois de uma experiência ruim, sem depender da moderação | Todos | 3 + 6 + 3 + 1 = **13** | médio | Trabalhos futuros |
| F6 | **Confirmação de presença pelo organizador** ao encerrar, gerando taxa de comparecimento no perfil | Mede o "no-show", hoje só denunciável | Peladeiros (parcial, só lista) | 4 + 5 + 4 + 1 = **14** | médio | Trabalhos futuros |
| F7 | **Squads recorrentes** ("jogar de novo com este grupo": recriar a partida e convidar os mesmos participantes) | Forma grupos persistentes e torna verdadeiro o "Grupos: Sim" da Tab. 2.1 | Meetup e WhatsApp têm grupos, mas sem reputação | 6 + 8 + 5 + 1 = **20** | médio | Trabalhos futuros |
| F8 | **Reputação do organizador no card da lista** | Sinal de confiança antes de abrir a partida | Hexagon (parcial) | 1,5 + 1,5 (agravaria P1, por isso agregar em SQL) + 1 + 0,5 = **4,5** | médio | Trabalhos futuros |

**Melhor relação diferencial/esforço:** F1 (3 h), F3 (3,5 h) e F2 (4,5 h). As três são só de
front, não exigem migration e podem entrar na mesma build EAS dos itens A.

## 5. Incoerências com a monografia (`tcc/TCC.tex`)

| # | Linha(s) | O texto diz | O código faz | Ação recomendada |
|---|---|---|---|---|
| I1 | 200, 220, 1330, 1568 | 474 testes; 309 no app (42 suítes) | 316 no app (45 suítes) + 165 na API = 481 | Atualizar números (A9) |
| I2 | 1304 | App: 119 commits, 15 PRs | 128 commits, 17 PRs (`origin/dev`); API 130/47 confere | Atualizar na revisão final |
| I3 | 382 (Tab. 2.1) | SquadUp — Grupos: **Sim** | Não há grupos, times nem comunidades persistentes, só partidas com chat próprio | Marcar "Parcial" e justificar (grupos efêmeros por partida), ou implementar F7 |
| I4 | 792 (§3.4.6) | "Caso a partida já tenha sido encerrada, o sistema não permite o cancelamento" | A UI esconde o botão, mas a API aceita `leave` em partida encerrada (`match_service.py:228-246`) | Corrigido por A3 |
| I5 | 822-847, 1035 (§3.4.8, §3.5) | O organizador encerra a partida e aprova pela tela de detalhes | O organizador que não "entrou" na própria partida não vê o botão "Encerrar" nem o do chat (`MatchDetailScreen.tsx:112-131`) | Corrigido por A3 |
| I6 | 1566 (§7.1) | "histórico de partidas disputadas exibido no perfil" | O perfil mostra só um contador, e `matches_played` conta participações confirmadas em qualquer status, inclusive futuras (`user_service.py:18-24`) | Reescrever como "contador de participações" ou implementar P12 |
| I7 | 1580 (§7.2) | Mensagens "exibidas ao abrir ou atualizar a conversa" | Não há como atualizar; o cache de 60 s impede refazer a busca; com mais de 30 mensagens as novas somem | A2 + A6 e reescrever a frase |
| I8 | 1350 (§5.6) | "cada alteração no ramo principal dispara uma nova implantação" | O Render implanta a partir de `dev` (`render.yaml:11`); `main` está atrás | Trocar por "ramo de desenvolvimento" ou promover `main` e apontar o Render para ela |
| I9 | 1254 (§4.5) | "sessões e tokens de acesso expirados ou revogados são removidos periodicamente" | Só os refresh tokens são removidos, e só no startup (`main.py:22-24`, `auth_service.py:143-153`); access tokens não são armazenados e valem 24 h mesmo após logout | Reescrever: "tokens de renovação expirados ou revogados são removidos a cada inicialização da API" |
| I10 | 593 (§3.4.1) | E-mail já cadastrado: "informa o usuário e sugere realizar o login" | O conflito só é detectado no 2º passo (ProfileSetup) e o fluxo tenta login com a senha digitada; com outra senha, aparece "E-mail ou senha inválidos" (`AuthContext.tsx:134-144`) | Reescrever o fluxo alternativo |
| I11 | 677 (§3.4.3) | "Caso o local informado seja inválido ou incompleto, o sistema solicita correção" | Só verifica se o campo está vazio (`CreateMatchScreen.tsx:134-136`) | "Caso o local não seja informado..." |
| — | 1395-1398, 1549 | `TODO(autor)` | Teste ponta a ponta com o APK do Render e cronograma final ainda pendentes (T1) | Pendência do autor, já registrada |

Conferidos e corretos: 18 telas (`:1296`); 26 operações REST (`:1300`; são 27 rotas HTTP, das
quais `/metrics` fica fora do schema); cobertura de 98,9% e 165 testes na API (`:1332`); banco
em memória nos testes (`:1337`); pipelines com Ruff, Black, Mypy, Bandit, CodeQL, pip-audit e
Gitleaks (`:1343`); retry só para falha de conexão (`:1298`); WebSocket já existente na API
(`:1580`).

## 6. Comandos executados e resultados

Nenhuma requisição à API de produção. Nenhuma escrita nos repositórios (o `git fetch` só
atualizou as refs remotas do back).

| Comando | Onde | Resultado |
|---|---|---|
| `git ls-remote` / `git fetch origin` | back | `dev` local (`fe66b08`) estava 4 commits atrás de `origin/dev` (`2c690fc`, PRs #63/#64) |
| `git archive origin/dev` → scratchpad | back | Cópia revisada e testada (working tree intocado) |
| `pytest` (`SECRET_KEY=ci-test-secret-key`) | back | **165 passed**, cobertura **98,87%** (limite de 80%), 217 avisos (deprecação `httpx` do Starlette), 128 s |
| `ruff check .` | back | All checks passed |
| `black --check .` | back | 77 arquivos sem mudança |
| `mypy app` (strict) | back | Success: no issues in 70 source files |
| `bandit -c pyproject.toml -r app --exclude app/tests` (`-ll` e todas as severidades) | back | Nenhum achado |
| `pip-audit -r requirements.txt` | back | No known vulnerabilities found |
| `npx tsc --noEmit` | front | 0 erros |
| `npm run lint` | front | 5519 "erros", **todos `Delete ␍` (CRLF)**, 0 erros reais (já registrado: `core.autocrlf`, sessão 37) |
| `npx jest --maxWorkers=50% --coverage` | front | **312/316**; 4 suítes (`ReportDetail`, `ReportUser`, `MatchDetail`, `PublicProfile`) estouraram o timeout de 5 s no 1º teste, com o pytest rodando em paralelo na mesma máquina (flake já registrado na Fase 15). Cobertura: statements 71,31%, branches 68,11%, functions 60,77%, lines 72,93% |
| `npm audit --omit=dev` | front | 47 vulnerabilidades (2 low, 29 moderate, 15 high, 1 critical), ver P15 |
| `npx expo-doctor` | front | 1 check falhou: `expo` 54.0.36→~54.0.37, `expo-constants` 18.0.13→~18.0.14, `jest-expo` 54.0.17→~54.0.18 |
| `gh api repos/GuilhermeFreire7/{squadup-app,squadup-back}/branches/{main,dev}/protection` | GitHub (leitura) | 404 "Branch not protected" nas 4 combinações |
| `gh run list` | GitHub (leitura) | Últimos runs de CI e Security verdes nos dois repositórios |
| `git rev-list --count`, contagem de PRs, de rotas e de telas | ambos | Usados em I1, I2 e "Conferidos" |
