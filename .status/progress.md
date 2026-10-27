# SquadUp — Progresso do Front-end

## Sessão 1 — 2026-05-19

### Fase 1 — Estrutura inicial do projeto (tarefas 1.1 a 1.7 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 1.1 | Inicializar projeto com Expo + TypeScript | `expo@54`, `react-native@0.81.5`, `react@19.1.0` |
| 1.2 | Instalar e configurar NativeWind v4 | `tailwind.config.js`, `babel.config.js`, `metro.config.js`, `global.css` criados |
| 1.3 | Instalar React Navigation v6 (Stack + Bottom Tabs) | `@react-navigation/native`, `native-stack`, `bottom-tabs` + dependências nativas |
| 1.4 | Definir estrutura de pastas | `src/{screens,components,hooks,mocks,types,utils,contexts,navigation}` |
| 1.5 | Definir tokens de design | Paleta primary (verde), secondary (navy), accent (laranja), 4pt grid, escala tipográfica |
| 1.6 | Configurar Jest + React Native Testing Library | `jest-expo@54`, `@testing-library/react-native`, `npm run test` funcionando |
| 1.7 | Configurar ESLint + Prettier | ESLint 9 flat config, regras TS + React Native + Prettier, `npm run lint` zero erros |

### Estado do repositório ao final da sessão

- Branch `feat/project-setup` mergeada em `dev` (merge commit no-ff)
- Próxima branch a criar: `feat/design-system` (componentes base da Fase 1)
- Último arquivo editado: `package.json` (scripts lint/test) e `eslint.config.js`

### Dívidas técnicas identificadas

| Item | Descrição |
|------|-----------|
| Jest versão | `jest@30` instalado mas `jest-expo@54` foi projetado para `jest@29`. Testar se há incompatibilidade ao rodar suítes reais. |
| react-test-renderer | Fixado em `19.1.0` para coincidir com `react@19.1.0`; atualizar junto quando react for atualizado. |
| react-native-screens | Pinado em `~4.16.0` (SDK 54 compatível, requer RN ≥ 0.81). Verificar ao fazer upgrade de Expo. |

---

## Sessão 2 — 2026-05-20

### Fase 1 — Design system e mocks (tarefas 1.8 a 1.19 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 1.8 | Criar componente `Button` | Variantes primary/secondary/ghost, tamanhos sm/md/lg, estados loading/disabled, fullWidth |
| 1.9 | Criar componente `Input` | Label, erro, borda colorida por estado (focus/erro/default) |
| 1.10 | Criar componente `Card` | Container pressable ou estático; prop `padded` |
| 1.11 | Criar componente `Avatar` | Tamanhos xs–xl; fallback de iniciais quando sem foto ou erro de load |
| 1.12 | Criar componente `Badge` | Variantes: sport (com emoji), level, status, custom |
| 1.13 | Criar componente `Header` | Título centralizado; botão voltar; slot rightElement |
| 1.14 | Criar componente `EmptyState` | Ícone emoji + título + descrição + slot action |
| 1.15 | Criar componente `RatingStars` | Estrelas cheias/meia/vazia; valor numérico; tamanhos sm/md/lg |
| 1.16 | Criar dados mockados — Usuários | 6 usuários com todos os campos: foto, bio, nível, nota, esportes |
| 1.17 | Criar dados mockados — Partidas | 11 partidas cobrindo todos os sports, níveis e status |
| 1.18 | Criar dados mockados — Avaliações | 7 avaliações com critérios e comentários |
| 1.19 | Criar tipos TypeScript | `User`, `Match`, `Rating`, `Report`, `Sport`, `MatchStatus`, `Participant`, `RatingCriteria` |

### Correções de infraestrutura

- **D1 — Jest versão:** Downgrade `jest@30 → @29`; `babel-preset-expo` instalado como devDep direto.
- **jest.setup.js:** Removido import de `extend-expect` (não existe em RNTL v13; matchers são automáticos).

### Resultado dos testes

- **42 testes, 8 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 2

- Branch `feat/design-system` mergeada em `dev` (merge commit)
- Fase 1 **100% concluída** (19/19 tarefas)

---

## Sessão 3 — 2026-05-20

### Fase 2 — Fluxo de entrada do usuário (tarefas 2.1 a 2.8 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 2.1 | Criar `AuthNavigator` | Stack nativa: Welcome (sem header) → Login / Register (header transparente) → ProfileSetup |
| 2.2 | Criar `WelcomeScreen` | Tela dividida: topo verde (logo + slogan), fundo branco (botões Entrar / Criar conta) |
| 2.3 | Criar `LoginScreen` | Email + senha com validação inline; login mockado com delay de 600ms |
| 2.4 | Criar `RegisterScreen` | Nome, email, senha, data de nascimento; navega para ProfileSetup após sucesso |
| 2.5 | Criar `ProfileSetupScreen` | Seleção multi-esporte (toggle chips), nível (radio), localização; foto visual com Alert |
| 2.6 | Criar `AuthContext` | `login`, `register`, `completeProfile`, `logout`; `AuthProvider` + `useAuth` hook |
| 2.7 | Navegação condicional | `RootNavigator` com `NavigationContainer`: autenticado → `AppNavigator`; não autenticado → `AuthNavigator` |
| 2.8 | Testes `LoginScreen` | 9 testes: renderização, validação (e-mail inválido, senha curta, campos vazios), chamada de `login`, navegação para Register |

### Arquivos criados

- `src/navigation/types.ts` — `AuthStackParamList`, `AppTabParamList`
- `src/contexts/AuthContext.tsx` — `AuthProvider` + `useAuth`
- `src/navigation/AuthNavigator.tsx`
- `src/navigation/AppNavigator.tsx` — placeholder com HomeScreen
- `src/navigation/RootNavigator.tsx`
- `src/screens/WelcomeScreen.tsx`
- `src/screens/LoginScreen.tsx`
- `src/screens/RegisterScreen.tsx`
- `src/screens/ProfileSetupScreen.tsx`
- `src/screens/HomeScreen.tsx` — placeholder para Fase 4
- `src/screens/__tests__/LoginScreen.test.tsx`
- `App.tsx` atualizado — `SafeAreaProvider` + `AuthProvider` + `RootNavigator`

### Resultado dos testes

- **52 testes, 9 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 3

- Branch `feat/auth-flow` pronta para merge em `dev`
- Fase 2 **100% concluída** (8/8 tarefas)
- Próxima branch: `feat/main-navigator` (Fase 4 — AppNavigator completo, HomeScreen, SearchScreen, FiltersScreen, MatchCard, useMatchFilters)

---

## Sessão 4 — 2026-05-25

### Refinamento visual — Design System (tarefa transversal, fora das fases numeradas)

Esta sessão foi dedicada a um overhaul completo da identidade visual do app, substituindo a paleta verde genérica por um sistema Electric Blue + Dark Slate moderno e profissional.

#### Paleta de cores (novo sistema)

| Token | Valor principal | Uso |
|-------|----------------|-----|
| `primary` | `#2563EB` (Electric Blue) | CTAs, links, elementos ativos, foco |
| `secondary` | `#0F172A–#F8FAFC` (Dark Slate) | Header, tab bar, fundos estruturais |
| `accent` | `#F97316` (Orange) | Badges de energia, destaques (azul+laranja = clássico esportivo) |

Regra 60-30-10: 60% branco/slate claro · 30% dark slate · 10% electric blue.

#### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `tailwind.config.js` | primary → Electric Blue · secondary → Dark Slate · semantic colors atualizados |
| `src/components/Button.tsx` | Novo variant `outline` (borda branca/texto branco para fundos escuros) · `rounded-xl` |
| `src/components/Header.tsx` | Fundo `secondary-900` + texto branco (maior impacto visual) |
| `src/components/RatingStars.tsx` | Estrelas cheias `text-amber-400` · meia `amber-300` · vazias `neutral-300` |
| `src/components/Badge.tsx` | Nível Avançado → `bg-primary-900 text-white` (hierarquia: suave → laranja → azul profundo) |
| `src/navigation/AuthNavigator.tsx` | `headerTintColor` `#16a34a` → `#2563EB` |
| `src/navigation/AppNavigator.tsx` | Tab bar dark (`#0F172A`) · active `#2563EB` · ícone vetorial `home-variant` |
| `src/screens/WelcomeScreen.tsx` | Redesign completo: fundo dark slate · logo vetorial · chips com `MaterialCommunityIcons` · stats row |
| `src/screens/LoginScreen.tsx` | Marca `lightning-bolt` vetorial no topo · `paddingTop: 100` para header transparente |
| `src/screens/RegisterScreen.tsx` | Mesma marca vetorial do Login |
| `src/screens/ProfileSetupScreen.tsx` | Títulos de seção em `secondary-800/900` |

#### Infraestrutura adicionada

| Item | Detalhe |
|------|---------|
| `@expo/vector-icons@^15.1.1` | Instalado — `MaterialCommunityIcons` para soccer, basketball, volleyball, tennis, lightning-bolt, home-variant |
| `__mocks__/expo-vector-icons.js` | Mock Jest criado (expo-font → expo-asset não instalado em dev) |
| `package.json` `moduleNameMapper` | Aponta `@expo/vector-icons` para o mock no ambiente de teste |

#### Bug fix

- `src/components/__tests__/Avatar.test.tsx` — Iniciais esperadas `"CM"` / `"C"` não batiam com os nomes `"Guilherme Freire"` / `"Guilherme"`. Corrigido para `"GF"` / `"G"`.

#### Resultado dos testes

- **52 testes, 9 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 4

- Branch `dev` com todas as mudanças visuais (sem branch separada — overhaul visual não é feature)
- Design system 100% refatorado; todos os componentes e telas de auth usam a nova paleta
- Próxima branch a criar: `feat/home-matches` (Fase 4 completa)

---

## Sessão 5 — 2026-05-25

### Fase 4 — Listagem e busca de partidas (tarefas 4.1 a 4.8 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 4.1 | Expandir `AppNavigator` com 4 Bottom Tabs | `RootStack` wrapping `AppTabs` (Home/Busca/Criar/Perfil) + `FiltersScreen` como modal nativo |
| 4.2 | Criar `HomeScreen` com lista de partidas | `FlatList` + campo de busca inline + botão filtros com badge de contagem ativa |
| 4.3 | Criar componente `MatchCard` | Badges sport/level/status, local + data com ícones vetoriais, barra de vagas, organizador |
| 4.4 | Criar `SearchScreen` | Campo de busca dedicado com autoFocus, contador de resultados, EmptyState contextual |
| 4.5 | Criar `FiltersScreen` (modal) | `presentation: 'modal'` · chips de esporte e nível + toggle de vagas · estado local antes de aplicar |
| 4.6 | Criar hook `useMatchFilters` | `applyFilters` (função pura testável) + `useMatchFilters` (hook que lê `MatchFiltersContext`) |
| 4.7 | Indicador visual de vagas | Barra colorida: verde (disponível) · laranja (≥80% ocupado) · vermelho (lotado) + texto pluralizado |
| 4.8 | Testes `MatchCard` e `useMatchFilters` | 12 testes de renderização + 11 testes de lógica de filtro (puro, sem mock de contexto) |

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/utils/date.ts` | `formatMatchDate("YYYY-MM-DD")` → `"Dom, 25 mai"` |
| `src/contexts/MatchFiltersContext.tsx` | Estado compartilhado de filtros (sport, level, onlyAvailable) · `MatchFiltersProvider` |
| `src/hooks/useMatchFilters.ts` | `applyFilters` puro + hook `useMatchFilters` |
| `src/components/MatchCard.tsx` | Card de partida completo (memo) |
| `src/screens/HomeScreen.tsx` | Substituiu placeholder — FlatList real |
| `src/screens/SearchScreen.tsx` | Tela de busca dedicada |
| `src/screens/FiltersScreen.tsx` | Modal de filtros |
| `src/screens/CreateMatchScreen.tsx` | Placeholder — Fase 6 |
| `src/screens/MyProfileScreen.tsx` | Placeholder — Fase 3 |
| `src/components/__tests__/MatchCard.test.tsx` | 12 testes |
| `src/hooks/__tests__/useMatchFilters.test.ts` | 11 testes |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/navigation/AppNavigator.tsx` | `RootStack` com 4 tabs + modal Filters · ícones extraídos para módulo (S6478) |
| `src/navigation/types.ts` | `AppRootStackParamList` + 4 rotas em `AppTabParamList` |
| `App.tsx` | `MatchFiltersProvider` adicionado dentro de `AuthProvider` |

### Resultado dos testes

- **75 testes, 11 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 5

- Branch `feat/home-matches` pronta para merge em `dev`
- Fase 4 **100% concluída** (8/8 tarefas)
- Próxima branch sugerida: `feat/match-detail` (Fase 5) — `MatchCard.onPress` já está preparado para navegar para `MatchDetailScreen`
- Ponto exato de retomada: `src/screens/HomeScreen.tsx` linha 73 — `renderItem` do `FlatList` recebe `onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}` quando `MatchDetailScreen` for criada em Fase 5

---

## Sessão 6 — 2026-05-26

### Fase 5 — Detalhes da partida (tarefas 5.1 a 5.6 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 5.1 | Criar tela `MatchDetailScreen` | Header dark + ScrollView + info block (local/data/hora) + badges + descrição + organizador |
| 5.2 | Seção de participantes confirmados | Contador "X de Y" + `ParticipantList` abaixo |
| 5.3 | Criar componente `ParticipantList` | Confirmados com avatar, nome, selo verificado, nota e nº de partidas; pendentes com badge laranja |
| 5.4 | Implementar os 5 estados da tela | `isMatchOver` (closed/cancelled) · `confirmed` · `pending` · `isMatchFull` (full + fora) · aberta (padrão) |
| 5.5 | Botão contextual de participação | Bottom bar absoluta; texto e estilo mudam por estado; `handleJoin` / `handleCancel` com Alert de confirmação |
| 5.6 | Escrever testes para estados da tela | 11 testes: 5 estados + join sem aprovação + renderização geral + goBack + matchId inválido |

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/components/ParticipantList.tsx` | Lista confirmados + pendentes com avatar e rating |
| `src/screens/MatchDetailScreen.tsx` | Tela de detalhes com `useRoute` + 5 estados de participação |
| `src/screens/__tests__/MatchDetailScreen.test.tsx` | 11 testes cobrindo todos os estados |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/navigation/types.ts` | `MatchDetail: { matchId: string }` adicionado ao `AppRootStackParamList` |
| `src/navigation/AppNavigator.tsx` | `MatchDetailScreen` registrado no `RootStack` |
| `src/screens/HomeScreen.tsx` | `MatchCard.onPress` → `navigation.navigate("MatchDetail", { matchId: item.id })` |
| `src/screens/SearchScreen.tsx` | Mesmo wiring de `onPress` |
| `src/mocks/matches.ts` | `match-12` adicionado (basquete avançado · full · sem CURRENT_USER) para cobrir estado "lotada" nos testes |

### Resultado dos testes

- **87 testes, 12 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 6

- Branch `feat/match-detail` pronta para merge em `dev`
- Fase 5 **100% concluída** (6/6 tarefas)
- Próxima branch sugerida: `feat/user-profile` (Fase 3)
- Ponto exato de retomada: criar `src/screens/MyProfileScreen.tsx` (substituir placeholder) — tarefa 3.1

---

## Sessão 7 — 2026-05-26

### Fase 3 — Perfil do usuário (tarefas 3.1 a 3.6 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 3.1 | Criar tela `MyProfileScreen` | Hero dark (avatar XL + nome + localização + rating) · stats row · bio · esportes · nível · reviews |
| 3.2 | Criar tela `EditProfileScreen` | Formulário: nome, bio, localização, esportes (chips), nível (radio) · Alert de sucesso + goBack |
| 3.3 | Criar tela `PublicProfileScreen` | Visão de outro usuário via `userId` · hero idêntico ao MyProfile · reviews recebidas · botão Denunciar |
| 3.4 | Criar componente `TrustBadges` | 3 selos: Verificado (primary), partidas (secondary), nota (amber) — memo |
| 3.5 | Criar componente `ReviewCard` | Avatar + nome + data + RatingStars overall + critério destaque + comentário — memo |
| 3.6 | Escrever testes para `PublicProfileScreen` | 13 testes: dados do usuário, verificação, bio, localização, esportes, nível, reviews, ausência de reviews, navegação, userId inválido |

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/components/TrustBadges.tsx` | Selos de confiança reutilizáveis |
| `src/components/ReviewCard.tsx` | Card de avaliação recebida |
| `src/screens/EditProfileScreen.tsx` | Formulário de edição de perfil |
| `src/screens/PublicProfileScreen.tsx` | Perfil público de outro usuário |
| `src/screens/ReportUserScreen.tsx` | Placeholder para Fase 10 (rota registrada) |
| `src/screens/__tests__/PublicProfileScreen.test.tsx` | 13 testes |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/screens/MyProfileScreen.tsx` | Substituiu placeholder — tela completa com todos os dados do usuário logado |
| `src/navigation/types.ts` | `PublicProfile`, `EditProfile`, `ReportUser` adicionados ao `AppRootStackParamList` |
| `src/navigation/AppNavigator.tsx` | 3 novas rotas registradas no `RootStack` |

### Resultado dos testes

- **100 testes, 13 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 7

- Branch `feat/user-profile` pronta para merge em `dev`
- Fase 3 **100% concluída** (6/6 tarefas)
- Próxima branch sugerida: `feat/create-match` (Fase 6)
- Ponto exato de retomada: `src/screens/CreateMatchScreen.tsx` — substituir placeholder (tarefa 6.1)

---

## Sessão 8 — 2026-05-26

### Fase 6 — Criação de partida (tarefas 6.1 a 6.5 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 6.1 | Criar tela `CreateMatchScreen` | Formulário completo: chips de esporte, título, local, data (DD/MM/AAAA), horário (HH:MM), vagas, nível (radio), descrição, toggles iniciantes/aprovação |
| 6.2 | Implementar validação do formulário | 6 campos validados com mensagens inline; regex para data e hora; `Number.parseInt`/`Number.isNaN` |
| 6.3 | Implementar feedback de sucesso | `Alert.alert` com título, esporte, data e hora; ação "Ver partidas" navega para aba `Home` |
| 6.4 | Adicionar partida criada ao estado mock local | `MatchesContext` criado com `matches` + `addMatch`; HomeScreen, SearchScreen e MatchDetailScreen migrados do import direto para o contexto |
| 6.5 | Escrever testes para o formulário de criação | 24 testes em 4 grupos: renderização (7), validação (8), submissão válida (4), interações (5) |

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/contexts/MatchesContext.tsx` | Contexto de partidas: `MatchesProvider` + `useMatchesContext` + `addMatch` |
| `src/screens/CreateMatchScreen.tsx` | Substituiu placeholder — formulário completo com `BottomTabNavigationProp` |
| `src/screens/__tests__/CreateMatchScreen.test.tsx` | 24 testes (contexto mockado via `jest.mock`) |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `App.tsx` | `MatchesProvider` adicionado entre `AuthProvider` e `MatchFiltersProvider` |
| `src/screens/HomeScreen.tsx` | `MOCK_MATCHES` → `useMatchesContext().matches` |
| `src/screens/SearchScreen.tsx` | `MOCK_MATCHES` → `useMatchesContext().matches`; correção S7735 (condição negada) |
| `src/screens/MatchDetailScreen.tsx` | `MOCK_MATCHES` → `useMatchesContext().matches` (novas partidas ficam acessíveis via deep link) |
| `src/screens/__tests__/MatchDetailScreen.test.tsx` | Renders envolvidos com `<MatchesProvider>` (provider real, usa MOCK_MATCHES) |

### Resultado dos testes

- **124 testes, 14 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅
- `npx tsc --noEmit` zero erros ✅

### Estado ao final da sessão 8

- Branch `feat/create-match` — commit realizado, merge pendente em `dev`
- Fase 6 **100% concluída** (5/5 tarefas)
- Próxima branch: `feat/match-participation` (Fase 7)
- Ponto exato de retomada: `src/screens/MatchDetailScreen.tsx` — `handleJoin` e `handleCancel` hoje só alteram `useState` local; Fase 7 eleva esse estado para `MatchesContext` via hook `useMatchParticipation`

---

## Sessão 9 — 2026-05-26

### Fase 7 — Participação em partida (tarefas 7.1 a 7.5 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 7.1 | Implementar ação "Participar de partida" | `updateParticipation` adicionado ao `MatchesContext`; insere ou atualiza participante na lista |
| 7.2 | Implementar ação "Cancelar participação" | `cancel()` abre Alert de confirmação; define status "cancelled" no contexto |
| 7.3 | Implementar estado "Aguardando aprovação" | `join()` detecta `match.requiresApproval` e aplica "pending" ou "confirmed" |
| 7.4 | Criar hook `useMatchParticipation` | Retorna `{ match, userStatus, join, cancel }`; normaliza "cancelled" para `null` |
| 7.5 | Escrever testes para fluxo de participação | 11 testes: leitura de status (5), join (4), cancel (2) |

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/hooks/useMatchParticipation.ts` | Hook que encapsula toda a lógica de participação |
| `src/hooks/__tests__/useMatchParticipation.test.ts` | 11 testes com mock controlado de `MOCK_MATCHES` |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/contexts/MatchesContext.tsx` | `updateParticipation` adicionado + `applyParticipationUpdate` como função pura externa |
| `src/screens/MatchDetailScreen.tsx` | `useState`/`handleJoin`/`handleCancel` removidos; substituídos por `useMatchParticipation` |

### Resultado dos testes

- **135 testes, 15 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 9

- Branch `feat/match-participation` — pronta para commit e merge em `dev`
- Fase 7 **100% concluída** (5/5 tarefas)
- Próxima branch: `feat/match-chat` (Fase 8)
- Ponto exato de retomada: criar `src/screens/MatchChatScreen.tsx` (tarefa 8.1) e adicionar botão "Chat" em `MatchDetailScreen`

---

## Sessão 10 — 2026-05-26

### Fase 8 — Chat da partida (tarefas 8.1 a 8.6 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 8.1 | Criar tela `MatchChatScreen` | `FlatList` invertida + `KeyboardAvoidingView`; header com título da partida e contagem de confirmados |
| 8.2 | Criar componente `MessageBubble` | 3 variantes: própria (azul, alinhada à direita), outro usuário (branca, esquerda + avatar + nome), sistema (pill cinza centralizada) |
| 8.3 | Criar componente `ChatInput` | `TextInput` multiline + botão send com `MaterialCommunityIcons`; botão desabilitado com texto vazio |
| 8.4 | Simular envio de mensagem no estado local | `MessagesContext` com `sendMessage` (prepend no array); `getMessages(matchId)` para leitura |
| 8.5 | Adicionar mensagens de sistema | Mocks com `type: "system"` para match-1 (7 msgs) e match-3 (8 msgs); visual diferenciado no `MessageBubble` |
| 8.6 | Escrever testes para `MessageBubble` | 9 testes em 3 grupos: mensagem de outro usuário (3), própria (3), sistema (3) |

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/types/index.ts` | `MessageType` + `Message` adicionados |
| `src/mocks/messages.ts` | 15 mensagens mockadas para match-1 e match-3 (newest-first) |
| `src/contexts/MessagesContext.tsx` | `MessagesProvider` + `useMessagesContext` + `sendMessage` |
| `src/components/MessageBubble.tsx` | Componente memo com 3 variantes visuais |
| `src/components/ChatInput.tsx` | Componente memo com TextInput + botão send |
| `src/screens/MatchChatScreen.tsx` | Tela de chat com FlatList invertida |
| `src/components/__tests__/MessageBubble.test.tsx` | 9 testes |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/navigation/types.ts` | `MatchChat: { matchId: string }` adicionado ao `AppRootStackParamList` |
| `src/navigation/AppNavigator.tsx` | `MatchChatScreen` registrado no `RootStack` |
| `src/screens/MatchDetailScreen.tsx` | Botão "Chat da partida" adicionado no estado `confirmed` |
| `App.tsx` | `MessagesProvider` adicionado na árvore de contextos |

### Resultado dos testes

- **144 testes, 16 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 10

- Branch `feat/match-chat` — pronta para commit e merge em `dev`
- Fase 8 **100% concluída** (6/6 tarefas)
- Próxima branch: `feat/post-match-rating` (Fase 9)
- Ponto exato de retomada: criar `src/screens/PostMatchRatingScreen.tsx` (tarefa 9.1) — lista participantes de uma partida passada para avaliação

---

## Sessão 11 — 2026-05-26

### Fase 9 — Avaliação pós-partida (tarefas 9.1 a 9.5 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 9.1 | Criar tela `PostMatchRatingScreen` | FlatList de confirmados excluindo current user; badge "Avaliado" após submit; banner "Todos avaliados!" quando completo |
| 9.2 | Criar tela `RateUserScreen` | Card do usuário + 5 `StarRatingInput` (pontualidade, respeito, comportamento, presença, exp. geral) + `TextInput` comentário (280 chars) + validação inline |
| 9.3 | Criar componente `StarRatingInput` | `Pressable` por estrela; `accessibilityLabel` com singular/plural; tamanhos sm/md/lg via `fontSize` |
| 9.4 | Implementar feedback de avaliação enviada | `Alert.alert` com nome do usuário avaliado; `navigation.goBack()` no callback "OK"; `RatingsContext` persiste estado na sessão |
| 9.5 | Escrever testes para `StarRatingInput` | 7 testes: renderização (label, sem label, 5 botões) + interação (onChange para estrelas 1, 3, 5 e re-seleção) |

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/components/StarRatingInput.tsx` | Input interativo de estrelas — memo, 3 tamanhos |
| `src/contexts/RatingsContext.tsx` | `RatingsProvider` + `useRatingsContext` + `submitRating` + `hasRated` |
| `src/screens/PostMatchRatingScreen.tsx` | Lista de participantes para avaliar |
| `src/screens/RateUserScreen.tsx` | Formulário de avaliação com 5 critérios |
| `src/components/__tests__/StarRatingInput.test.tsx` | 7 testes |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/mocks/matches.ts` | `match-13` adicionado (futebol encerrado, guilherme + 4 participantes) |
| `src/navigation/types.ts` | `PostMatchRating` e `RateUser` adicionados ao `AppRootStackParamList` |
| `src/navigation/AppNavigator.tsx` | `PostMatchRatingScreen` e `RateUserScreen` registrados no `RootStack` |
| `src/screens/MatchDetailScreen.tsx` | Botão "Avaliar participantes" no estado `isMatchOver` quando `match.status === "closed"` e `userStatus === "confirmed"` |
| `App.tsx` | `RatingsProvider` adicionado na árvore de contextos |

### Resultado dos testes

- **151 testes, 17 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 11

- Branch `feat/post-match-rating` — pronta para commit e merge em `dev`
- Fase 9 **100% concluída** (5/5 tarefas)
- Próxima branch: `feat/report-user` (Fase 10)
- Ponto exato de retomada: `src/screens/ReportUserScreen.tsx` — substituir placeholder com formulário completo (tarefa 10.1)

---

## Sessão 12 — 2026-05-26

### Fase 10 — Denúncia e segurança (tarefas 10.1 a 10.5 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 10.1 | Criar tela `ReportUserScreen` | Card do usuário denunciado + 7 chips de motivo (single-select) + partida relacionada (opcional) + descrição 500 chars + aviso sobre denúncias falsas |
| 10.2 | Implementar select de motivos de denúncia | 7 motivos predefinidos como chips: comportamento inadequado, violência, não compareceu, discurso de ódio, spam, informações falsas, outro |
| 10.3 | Implementar feedback de denúncia enviada | `Alert.alert` com nome do usuário + mensagem de 48h; goBack no "OK" |
| 10.4 | Adicionar botão "Denunciar" no `PublicProfileScreen` | Já existia desde sessão 7 — ícone `flag-outline` no header + botão ghost no rodapé |
| 10.5 | Escrever testes para o formulário de denúncia | 14 testes em 6 grupos: renderização, validação, submissão, navegação, partida relacionada, userId inválido |

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/screens/__tests__/ReportUserScreen.test.tsx` | 14 testes cobrindo todos os fluxos |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/screens/ReportUserScreen.tsx` | Substituiu placeholder — formulário completo de denúncia |

### Resultado dos testes

- **165 testes, 18 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅

### Estado ao final da sessão 12

- Branch `feat/report-user` — pronta para commit e merge em `dev`
- Fase 10 **100% concluída** (5/5 tarefas)
- Próxima sessão: decidir entre Fase 11 (moderação admin, opcional) e Fase 12 (revisão e polimento final)

---

## Sessão 13 — 2026-07-02

### Fase 11 — Moderação (tarefas 11.1 a 11.3 concluídas)

| # | Tarefa | Observação |
|---|--------|------------|
| 11.1 | Criar tela `AdminDashboardScreen` | Lista de denúncias ordenada (pendentes primeiro) + contador no topo + `EmptyState`; acessível via botão "Painel administrativo" (ghost) no rodapé de `MyProfileScreen` — rota oculta, sem RBAC real |
| 11.2 | Criar tela `ReportDetailScreen` | Usuário denunciado, denunciante, motivo, descrição, partida relacionada (se houver), data e status atual |
| 11.3 | Implementar ações mockadas (arquivar, advertir, banir) | 3 botões com `Alert` de confirmação antes de aplicar; `ReportsContext.updateReportStatus` atualiza o estado e a tela volta com `goBack()` |

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/contexts/ReportsContext.tsx` | `ReportsProvider` + `useReportsContext` — `reports`, `addReport`, `updateReportStatus` |
| `src/mocks/reports.ts` | `MOCK_REPORTS` — 4 denúncias cobrindo os 4 status (`pending` ×2, `warned`, `archived`) |
| `src/utils/reportLabels.ts` | `REASON_LABELS`, `STATUS_LABELS`, `STATUS_COLORS` — compartilhados entre `AdminDashboardScreen` e `ReportDetailScreen` |
| `src/screens/AdminDashboardScreen.tsx` | Lista de denúncias para moderação |
| `src/screens/ReportDetailScreen.tsx` | Detalhes da denúncia + ações administrativas |
| `src/screens/__tests__/AdminDashboardScreen.test.tsx` | 8 testes: renderização, ordenação, navegação |
| `src/screens/__tests__/ReportDetailScreen.test.tsx` | 10 testes: renderização, ações administrativas, navegação |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/types/index.ts` | `Report` ganhou `status: ReportStatus`; `ReportReason` realinhado aos motivos reais já usados em `ReportUserScreen` (o tipo antigo — `inappropriate_behavior` etc. — nunca era de fato referenciado no código) |
| `src/screens/ReportUserScreen.tsx` | `handleSubmit` agora chama `addReport` (status inicial `"pending"`) além do `Alert` já existente |
| `src/screens/__tests__/ReportUserScreen.test.tsx` | Mock de `useReportsContext` adicionado; +1 teste validando o payload enviado a `addReport` |
| `src/screens/MyProfileScreen.tsx` | Botão "Painel administrativo" (`variant="ghost"`) adicionado após "Editar perfil" |
| `src/navigation/types.ts` | `AdminDashboard: undefined` e `ReportDetail: { reportId: string }` adicionados ao `AppRootStackParamList` |
| `src/navigation/AppNavigator.tsx` | `AdminDashboardScreen` e `ReportDetailScreen` registrados no `RootStack` |
| `App.tsx` | `ReportsProvider` adicionado à árvore de contextos (entre `RatingsProvider` e `MessagesProvider`) |

### Resultado dos testes

- **181 testes, 20 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅ (após `npm run lint:fix` para normalizar CRLF → LF, dívida D4)
- `npx tsc --noEmit` — 1 erro pré-existente e não relacionado em `RateUserScreen.tsx:78` (ver dívida D9); nenhum erro nos arquivos novos/modificados desta sessão

### Estado ao final da sessão 13

- Branch `feat/moderation` — commit realizado (ver histórico do git)
- Fase 11 **100% concluída** (3/3 tarefas) — roadmap também corrigido: Fase 10 estava marcada como "A fazer" por desatualização, já estava concluída desde a sessão 12
- Próxima fase: **Fase 12 — Revisão e polimento final** (12.1 a 12.8, ver `.status/queue.md`)
- Ponto exato de retomada: corrigir a dívida técnica **D9** (`src/screens/RateUserScreen.tsx:78` — `user` possivelmente `undefined` no `tsc`, dentro da mensagem do `Alert.alert` em `handleSubmit`) como primeiro passo da Fase 12, depois seguir para 12.1 (revisão de consistência visual)

---

## Sessão 14 — 2026-07-02

### Dívida técnica D9 corrigida

`src/screens/RateUserScreen.tsx` — adicionado `if (!user) return;` no início de `handleSubmit`. Causa raiz: o narrowing de `if (!match || !user) return` no corpo do componente não se propaga para dentro de closures aninhadas como `handleSubmit` (limitação conhecida do TypeScript com controle de fluxo em funções aninhadas) — é preciso repetir o guard dentro da própria função.

### Resultado dos testes

- **181 testes, 20 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅
- `npx tsc --noEmit` zero erros ✅ (primeira vez zerado desde que a dívida foi identificada)

### Estado ao final da sessão 14

- Merge branch `fix/rate-user-tsc-d9` → `dev`
- Nenhuma branch nova criada para a Fase 12 ainda
- Próxima ação: Fase 12, branch sugerida `feat/final-polish`, começar por 12.1

---

## Sessão 15 — 2026-07-02

### Fase 12 — Revisão e polimento final (tarefa 12.1 concluída, branch `feat/final-polish`)

| # | Tarefa | Observação |
|---|--------|------------|
| 12.1 | Revisar consistência visual entre todas as telas | Auditoria (agente Explore, leitura integral de 18 telas + 15 componentes) encontrou 25 inconsistências em 5 categorias: cores fora do design system, espaçamento fora da escala, tipografia inconsistente, border-radius divergente, estrutura duplicada entre telas. Todas as 25 corrigidas nesta sessão. |

### Auditoria — achados e correções

**Cores**
- `amber-*` (paleta padrão do Tailwind, vazando por engano) substituído pelo token `warning` (`#F59E0B`) em estrelas de avaliação, badges de destaque, status "pendente" e avisos — arquivos: `RatingStars.tsx`, `StarRatingInput.tsx`, `TrustBadges.tsx`, `ReviewCard.tsx`, `reportLabels.ts`, `ReportUserScreen.tsx`.
- `primary-600` (reservado ao estado `active:`/pressed em `Button.tsx`) estava sendo usado como cor de repouso em `ChatInput.tsx`, `MessageBubble.tsx` e `PostMatchRatingScreen.tsx` — corrigido para `primary-500`.
- `placeholderTextColor` padronizado para `#9CA3AF` (neutral-400, o mesmo tom já usado em `Input.tsx`) em `ChatInput.tsx`, `RateUserScreen.tsx`, `ReportUserScreen.tsx`.

**Estrutura**
- `src/components/Header.tsx` reescrito — antes era um componente morto (nenhuma tela importava), agora centraliza o cabeçalho das 13 telas que duplicavam manualmente o bloco `bg-secondary-900 pt-14 ...`. Nova API: `title`, `subtitle?`, `onBack?`, `rightElement?`, `variant?: "compact"|"large"`, `children?`. Usa `useSafeAreaInsets` (`react-native-safe-area-context`) em vez do `pt-14` fixo, corrigindo um risco real de quebra visual em aparelhos com notch/status bar de altura diferente.
- Telas migradas para `<Header>`: `HomeScreen`, `SearchScreen`, `CreateMatchScreen` (`variant="large"`), `MyProfileScreen`, `PublicProfileScreen`, `AdminDashboardScreen`, `ReportDetailScreen`, `ReportUserScreen`, `MatchDetailScreen`, `EditProfileScreen`, `PostMatchRatingScreen`, `RateUserScreen`, `MatchChatScreen` (`subtitle` para contagem de participantes).
- `FiltersScreen.tsx` — botão de aplicar filtros agora usa o componente `Button` compartilhado (antes recriava um `Pressable` à mão, perdendo estados padronizados de `active:`).

**Tipografia**
- Rótulos de seção/card padronizados para `text-sm font-semibold text-secondary-900` (removendo variações de tamanho, cor e `uppercase`) em `FiltersScreen.tsx`, `ProfileSetupScreen.tsx` e `ReportDetailScreen.tsx` (que também tinha os textos em CAIXA ALTA manual, normalizados para sentence case).
- `WelcomeScreen.tsx`: `leading-relaxed` (valor não numérico, fora do padrão) trocado por `leading-5` (consistente com o restante do texto `text-sm`).

**Componentes**
- `Input.tsx` ganhou suporte a `multiline` (com `textAlignVertical` e `minHeight` automáticos), eliminando dois blocos de `TextInput` com estilo inline duplicado byte a byte em `RateUserScreen.tsx` e `ReportUserScreen.tsx`.
- `Card.tsx`: `rounded-xl` → `rounded-2xl` — o componente era o outlier (30+ lugares no app já usavam `rounded-2xl` manualmente para o mesmo tipo de card branco).

**Design tokens**
- `tailwind.config.js`: escala `spacing` formalizada com as chaves `0.5, 1.5, 2.5, 9, 11` — valores que já eram usados em várias telas via fallback do Tailwind (não documentados no design system customizado).

**Não corrigido (limitação técnica registrada como dívida D10)**
- NativeWind v4 instalado não suporta `contentContainerClassName`; os `contentContainerStyle={{ padding, gap }}` em pixels em várias telas permanecem como `style` inline em vez de classes Tailwind.

### Testes ajustados

Toda tela que renderiza `<Header>` chama `useSafeAreaInsets()`, que lança erro fora de um `<SafeAreaProvider>`. Adicionado `jest.mock("react-native-safe-area-context", () => ({ useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }) }))` em: `Header.test.tsx`, `PublicProfileScreen.test.tsx`, `AdminDashboardScreen.test.tsx`, `ReportDetailScreen.test.tsx`, `ReportUserScreen.test.tsx`, `MatchDetailScreen.test.tsx`, `CreateMatchScreen.test.tsx`.

### Resultado dos testes

- **181 testes, 20 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅ (após `npm run lint:fix` para CRLF → LF, dívida D4)
- `npx tsc --noEmit` zero erros ✅

### Estado ao final da sessão 15

- Branch `feat/final-polish` criada a partir de `dev` — commit pendente (ver checkpoint em `.status/queue.md`)
- Fase 12: 1/8 concluída (12.1)
- Próxima ação: tarefa 12.2 — testar o fluxo completo (happy path: Welcome → Login → Home → MatchDetail → Chat → Avaliação) rodando o app via `npm start` (Expo Go ou emulador)

---

## Sessão 16 — 2026-07-02

### Redesign visual premium (transversal — branch `feat/final-polish`)

Overhaul completo da interface para padrão B2C de mercado, mantendo a identidade Electric Blue + Dark Slate e 100% da funcionalidade/navegação. Zero mudanças de regra de negócio.

#### Fundação — `src/theme/index.ts` (novo)

Fonte única de verdade para estilos fora do NativeWind:
- `colors` — espelho tipado do `tailwind.config.js`; substituiu ~40 hex codes hardcoded em props `color` de ícones espalhados por 20+ arquivos.
- `shadows` — sistema de elevação com 4 presets (`card`, `raised`, `floating`, `cta`) combinando sombra iOS + `elevation` Android; aplicado via `style`.
- `SPORT_META` — identidade por esporte: ícone vetorial + cor de categoria + bg tint (futebol esmeralda, vôlei violeta, basquete laranja, tênis lima, futsal teal, outro slate). Fim dos emojis como iconografia.
- `LEVEL_META` — labels centralizados de nível (eliminou 6 cópias de `levelLabel`/`LEVEL_LABELS`).

#### Componentes novos

| Componente | Papel |
|-----------|-------|
| `SectionCard` | Card branco com título/subtítulo/rightElement — substituiu ~20 blocos `bg-white rounded-2xl p-4` duplicados |
| `Chip` | Pill selecionável única (ícone, sublabel, tone primary/danger, roles radio/checkbox) — substituiu 5 implementações duplicadas |
| `SportTile` | Tile quadrado com ícone + cor do esporte — âncora visual de MatchCard e MatchDetail |
| `StatsRow` | Linha de métricas em cards — desduplicou stats dos 2 perfis |
| `Skeleton` + `MatchCardSkeleton` | Loading pulsante (Animated loop) — usado na Home |

#### Componentes elevados

- `Button` — alturas fixas (h-10/12/14), `rounded-2xl`, prop `icon`, variant `danger`, glow azul no CTA primário, scale 0.98 no press, ghost agora `bg-secondary-100`.
- `Card` — sombra real (`shadows.card`), prop `raised`, microinteração de press.
- `Badge` — sport variant usa ícone vetorial + cores de categoria via `SPORT_META` (sem emoji).
- `Avatar` — fallback sólido `primary-500` com iniciais brancas em bold, prop `ring` (anel branco para heros), `xl` 96px.
- `EmptyState` — ícone `MaterialCommunityIcons` em círculo suave (prop `icon` agora é nome MCI, não emoji).
- `RatingStars` / `StarRatingInput` — estrelas vetoriais (`star`/`star-half-full`/`star-outline`) em vez de texto "★"; input com scale no press.
- `Header` — botão voltar em pill `bg-white/10`, large variant com `text-3xl` + subtitle.
- `Input` — borda 1.5px, prop `leftIcon` com cor reativa a focus/erro, erro com ícone.
- `ChatInput`/`MessageBubble` — send button maior com scale, bolhas `rounded-3xl` com cauda `rounded-b*-md`, sombra em bolhas de terceiros.
- `ReviewCard` — usa `Card` + chip de destaque com ícone de troféu.

#### Telas redesenhadas (todas as 18)

- **Home** — hero header com saudação personalizada + avatar com anel, busca h-12, quick-filters horizontais por esporte (integrados ao `MatchFiltersContext`), section title com contagem, skeleton screen de 700ms no primeiro load.
- **MatchCard** — layout novo: SportTile + eyebrow colorido (`FUTEBOL · INTERMEDIÁRIO`) + título, meta com ícones, barra de vagas, footer com organizador + tags pill.
- **MatchDetail** — hero com SportTile 56 + eyebrow, `InfoRow` com ícones em tiles azuis, SectionCards, bottom bar com `useSafeAreaInsets` + sombra floating, botões com ícones.
- **Welcome** — glow decorativo, tiles de esporte com cores de categoria, CTA invertido (Criar conta = primário).
- **Login/Register/ProfileSetup** — inputs com ícones, câmera badge no avatar, footer link no Register, `StatusBar dark` local (global agora `light`).
- **Perfis (My/Public)** — hero com avatar ring + `rounded-b-3xl`, StatsRow sobreposta (-mt-4), SectionCards, botões com ícones.
- **CreateMatch** — chips de esporte com ícones coloridos, toggles com descrição, header com subtitle.
- **Filters** — Chips, checkbox `rounded-lg` com `check-bold`, footer com sombra floating.
- **Chat/PostMatchRating/RateUser/ReportUser/Admin** — SectionCards, EmptyStates vetoriais, bottom bars com safe area, denúncia com tone danger, "Banir usuário" com variant `danger`.
- **Tab bar** — altura fixa removida (safe area correta em iPhones com home indicator), ícones filled/outline por foco, `borderTopWidth: 0`.

#### Tokens ajustados (`tailwind.config.js`)

- `borderRadius`: `2xl` 24→20px (mais moderno), `3xl` 28px adicionado.
- `letterSpacing`: valores em px (RN não suporta `em`) — `tracking-tight`/`wide` agora funcionam.

#### Testes atualizados

- `Badge.test` — emoji prefix → ícone vetorial (`getByTestId("icon-soccer")`).
- `EmptyState.test` — emojis → testIDs de ícones MCI.
- `PublicProfileScreen.test` — `"🏐 Vôlei"` → `"Vôlei"`.

### Resultado dos testes

- **181 testes, 20 suítes, 0 falhas** — `npm run test` ✅
- `npm run lint` zero erros ✅ (após `npm run lint:fix`, dívida D4)
- `npx tsc --noEmit` zero erros ✅

### Estado ao final da sessão 16

- Branch `feat/final-polish` — redesign completo, commit pendente
- Fase 12 permanece 1/8 (redesign foi trabalho transversal, não tarefa numerada)

---

## Sessão 17 — 2026-07-02

### Fase 12.2 — Testar fluxo completo (happy path)

Sem emulador/dispositivo físico disponível no ambiente (sandbox Windows headless), o fluxo foi validado via `npm run web` (Metro bundler para web, porta 8081) dirigido por Playwright (Chromium headless), navegando pela UI real como um usuário faria — sem mocks de teste, sem `jest`.

Rota percorrida: Welcome → Login (mock) → Home → MatchDetail (partida já confirmada) → Chat (envio de mensagem) → Home (busca) → MatchDetail (partida encerrada) → PostMatchRating → RateUser (envio de avaliação).

| Tela | Resultado |
|------|-----------|
| Welcome | OK — hero, tiles de esporte, stats, CTAs renderizam conforme redesign da sessão 16 |
| Login | OK — validação de e-mail/senha, mock aceita qualquer credencial válida |
| Home | OK — skeleton inicial, busca, quick-filters por esporte, cards com barra de vagas |
| MatchDetail (confirmado) | OK — estado "Você está confirmado", botão Chat da partida |
| MatchChat | OK — histórico mockado, envio de mensagem via botão enviar |
| MatchDetail (encerrada) | OK — botão "Avaliar participantes" visível só quando `status: closed` + usuário confirmado |
| PostMatchRating → RateUser | OK — 5 critérios com estrelas, submissão grava a avaliação (`hasRated` passa a `true`, badge "Avaliado" aparece na lista) |

Nenhum erro de console/página JS em nenhuma etapa.

#### Achados (não bloqueantes para esta tarefa, registrados para tarefas futuras)

- **`Alert.alert` não produz diálogo em `react-native-web`** (sem polyfill instalado): em `RateUserScreen`, `ReportUserScreen`, `ReportDetailScreen` e no cancelamento de participação em `MatchDetailScreen`, o `Alert.alert(...)` é chamado mas não renderiza nada no browser — a ação de dados ocorre normalmente (confirmado: `submitRating` grava e o badge "Avaliado" reflete o estado), mas o callback de `onPress` do botão "OK" (que faz `navigation.goBack()`) nunca dispara, deixando o usuário "preso" na tela sem feedback visual. Em Expo Go / iOS / Android nativo isso funciona normalmente — é uma limitação conhecida do `react-native-web` sem polyfill, não uma regressão desta sessão. Relevante para 12.3 (testar em Expo Go) confirmar que funciona nativamente, e para decidir se vale a pena um polyfill de `Alert` caso a apresentação use `npm run web` em vez de dispositivo/emulador.
- **Timestamp de mensagem enviada no chat usa hora real (`new Date().toLocaleTimeString()`)** em `MessagesContext.sendMessage`, enquanto o histórico mockado usa horários fictícios fixos (ex.: 09:10–09:42) — mensagem nova pode aparecer com horário "menor" que mensagens anteriores da conversa, quebrando a ordem cronológica visual. Cosmético, relevante para 12.7 (revisar dados mockados para coerência narrativa).

### Fase 12.5 e 12.6 — Lint e testes automatizados

`npm run lint` e `npx tsc --noEmit` zero erros. `npm run test`: 181/181 testes, 20 suítes, 0 falhas. Nenhuma mudança de código necessária — suíte já estava saudável desde a sessão 16.

### Fase 12.4 — Acessibilidade básica

Auditoria feita por subagente dedicado (leitura de todos os `src/components/*.tsx` e `src/screens/*.tsx`, cálculo de contraste WCAG por luminância relativa para as combinações de cor mais usadas). Cobertura de `accessibilityLabel` já era boa (herdada do redesign da sessão 16); dois problemas concretos corrigidos:

- **`Card.tsx`** — `Pressable` do card inteiro não tinha `accessibilityLabel` próprio; leitor de tela concatenava todos os `Text` internos em ordem confusa. Adicionada prop opcional `accessibilityLabel` ao componente; `MatchCard.tsx` agora monta `` `${título}, ${esporte}, ${data} às ${horário}, ${local}` ``.
- **Contraste insuficiente** (abaixo de 4.5:1 para texto/3:1 para ícones informativos): `text-neutral-400` (~2.54:1 sobre branco) trocado por `text-neutral-500` (~4.83:1) em 15 arquivos (20 ocorrências) — `HomeScreen`, `SearchScreen`, `MatchDetailScreen`, `MatchChatScreen`, `CreateMatchScreen`, `PostMatchRatingScreen`, `RateUserScreen`, `PublicProfileScreen`, `ReportUserScreen`, `Button`, `ParticipantList`, `MessageBubble`, `Chip`, `SectionCard`, `ReviewCard`. `colors.neutral[400]` (ícone/placeholder) trocado por `colors.neutral[500]` em `Input.tsx` e `ChatInput.tsx`. Placeholder/ícone de busca em fundo escuro (`colors.secondary[500]` a ~3.07:1) trocado por `colors.secondary[400]` (mesmo tom já usado no ícone de lupa) em `HomeScreen.tsx` e `SearchScreen.tsx`.
- **Não corrigido (nice-to-have, não bloqueante):** ícone `check-decagram` (selo de verificado) sem texto alternativo para leitor de tela em 6 arquivos (`ParticipantList`, `MatchDetailScreen`, `PublicProfileScreen`, `MyProfileScreen`, `RateUserScreen`, `PostMatchRatingScreen`) — ícone informativo, mas sozinho sem `accessibilityLabel`/texto "Verificado" próximo.

Verificado visualmente após a mudança (`npm run web` + Playwright): busca, cards e perfil renderizam normalmente, sem regressão visual perceptível — o tom de cinza fica muito próximo do anterior.

### Fase 12.7 — Coerência dos dados mockados

Auditoria por subagente dedicado (leitura de `src/mocks/{users,matches,messages,ratings,reports}.ts`). Achados bloqueantes corrigidos:

- **`matches.ts`, `match-3`** — tinha `allowBeginners: false` mas Juliana Costa (nível `beginner`) estava confirmada como participante, sem explicação. Corrigido para `allowBeginners: true` (a partida já tem `requiresApproval: true`, então o cenário coerente é o organizador aceitar uma exceção via aprovação manual).
- **`ratings.ts` (todas as 7 avaliações) e `reports.ts` (`report-4`)** — referenciavam partidas ainda `status: "open"`/`"full"` com `createdAt` **anterior** à data da partida (avaliações/denúncia registradas antes do jogo acontecer) — e, ao mesmo tempo, `match-13` (a única partida `status: "closed"` do mock, cuja descrição pede explicitamente "Avalie os participantes!") não tinha nenhuma avaliação ou denúncia associada. Corrigido reapontando todas para `match-13` — seus participantes confirmados (guilherme, thiago, rafael, beatriz, ana) batem exatamente com quem já aparecia nas avaliações — com `createdAt` recalculado para depois da partida (`2026-05-10`/`2026-05-11`, a partida terminou por volta de 11h).
- **`matches.ts`, `match-11`** — local "Clube Caiçaras" (um clube real em São Paulo) destoava dos demais locais do mock, todos no Rio de Janeiro. Trocado por "Clube Fluminense — Quadra 4, Laranjeiras".
- **Não corrigido (cosmético, já documentado na 12.2):** timestamp de mensagem nova no chat usa hora real (`new Date()`) misturado com histórico mockado de horários fixos; nenhuma partida usa o status `pending_approval` apesar de existir no tipo; `matchesPlayed` dos usuários é bem maior que o volume de partidas do mock (esperado em dataset pequeno de protótipo).

`MOCK_RATINGS` é consumido apenas por `PublicProfileScreen`/`MyProfileScreen` (lista de avaliações recebidas no perfil) — é um dataset estático independente do `RatingsContext.submittedRatings` (que começa vazio a cada sessão e alimenta o fluxo interativo de "Avaliar participantes"), então repontar o campo `match` não afeta o fluxo de avaliação pós-partida testado na 12.2. Confirmado visualmente: perfil de Beatriz Rocha mostra a avaliação de Ana Lima com data "11 de mai. de 2026", um dia após a partida.

### Validação final

`npm run lint` zero erros · `npx tsc --noEmit` zero erros · `npm run test` 181/181 passando (sem alteração de testes) · verificação visual via `npm run web` + Playwright sem erros de console.

### Estado ao final da sessão 17

- Branch `feat/final-polish`, working tree com alterações em `.status/*`, `src/components/{Card,MatchCard,Input,ChatInput}.tsx`, `src/screens/{HomeScreen,SearchScreen,AdminDashboardScreen,CreateMatchScreen,MatchChatScreen,MatchDetailScreen,ParticipantList,PostMatchRatingScreen,RateUserScreen,PublicProfileScreen,ReportUserScreen,MessageBubble,Chip,SectionCard,ReviewCard,Button}.tsx` (troca de tom de cinza) e `src/mocks/{matches,ratings,reports}.ts`
- Fase 12: 12.1, 12.2, 12.4, 12.5, 12.6, 12.7 concluídas (6/8). Restam 12.3 (Expo Go iOS/Android — requer dispositivo/emulador do usuário) e 12.8 (build de apresentação)
- Nenhum bug pendente — parada é limpa, entre tarefas

## Sessão 18/19 — 2026-07-08 (documentação, sem código)

Sessões só de documentação, sem alterar `src/`: leitura do backend real (`../back`) e criação de
`.status/backend-contract.md` (comparação completa de contrato front×backend, decisões D-A a D-D)
na sessão 18; na sessão 19, transformação do plano mestre em fila executável (Fase 13, 16 tarefas,
13.1–13.9) em `.status/roadmap.md` §19 e `.status/queue.md`. Depois, ainda em 2026-07-08, o
backend concluiu sua Etapa 1 (D-B/D-C/D-D aplicadas, deploy em produção no Railway) — sincronizado
em `.status/backend-contract.md`, `.status/plano-de-entrega.md` (novo, plano de entrega final das
5 trilhas) e URL de produção documentada (`https://squadup-api.up.railway.app`).

## Sessão 20 — 2026-07-08

### Fase 13.1 — Tipos alinhados ao contrato real

Branch `feat/api-contract-types`. Objetivo: dividir `types.User`/`types.Match` conforme o
contrato real do backend (`.status/backend-contract.md` §2.1/§2.2/§6, decisões D-B/D-C), expondo
em tempo de compilação todo lugar que assumia o shape antigo — esse era o objetivo declarado da
tarefa, não um efeito colateral indesejado.

**`src/types/index.ts` reescrito:**
- `User` → `PublicUser` (mesmos campos) + `MyProfile extends PublicUser { email, role }`
  (`UserRole = "user" | "admin"`), espelhando `PublicProfileRead`/`MyProfileRead` do backend.
- `Match` → `MatchSummary` (`organizerId`, `confirmedCount`, `availableSlots` — campos calculados
  no servidor, sem organizador/participantes expandidos) + `MatchDetail extends MatchSummary`
  (`organizer: PublicUser`, `participants: Participant[]`), espelhando `MatchRead`/`MatchDetailRead`.
- Novo `MatchRef` (`id, title, sport, date`) — `Rating.match`/`Report.match` passam a usar esse
  tipo leve em vez do `Match` completo, espelhando o `MatchRef` que o backend ganhou (decisão D-C,
  já aplicada lá em 2026-07-08).

**Decisão de escopo (registrada como dívida técnica D19 em `queue.md`):** os mocks já vêm com
`organizer`/`participants` completos (é tudo mockado, não há round-trip de rede), então
`MatchesContext`, `useMatchFilters` e `MatchCard` foram tipados sobre `MatchDetail` — não
`MatchSummary` — para não regredir a busca por nome do organizador na `HomeScreen`/`SearchScreen`.
Isso é consistente com o objetivo desta tarefa (só tipos, sem mudar comportamento), mas quando a
13.5 trocar `MatchesContext` por `GET /matches` real, a listagem vai parar de trazer o objeto
`organizer` — a busca por nome do organizador vai precisar ser removida ou resolvida de outra
forma nesse momento.

**Arquivos ajustados para os novos tipos** (guiado por `npx tsc --noEmit`, que caiu de ~34 erros
para 0 em 3 rodadas):
- `src/mocks/users.ts` — `MOCK_USERS: PublicUser[]`; `CURRENT_USER: MyProfile` (spread + `email`/`role`).
- `src/mocks/matches.ts` — seeds sem os 3 campos calculados + `toMatchDetail()` que deriva
  `organizerId`/`confirmedCount`/`availableSlots` a partir de `organizer`/`participants` (mesma
  fórmula que o backend usa no servidor, para não haver dois lugares divergentes calculando isso).
- `src/contexts/MatchesContext.tsx` — estado interno `MatchDetail[]`; `updateParticipation` agora
  recalcula `confirmedCount`/`availableSlots` (`withRecalculatedSlots`) sempre que a lista de
  participantes muda, em vez de deixar esses campos desatualizados.
- `src/contexts/AuthContext.tsx` — `user: MyProfile`; **efeito colateral positivo:** `register()`
  antes descartava o e-mail digitado (`_email`); agora guarda em `pendingEmail` e usa em
  `completeProfile`, então o e-mail do cadastro passa a aparecer de fato no perfil criado.
- `src/hooks/useMatchFilters.ts` — `getConfirmedCount`/`getAvailableSlots` removidos (eram
  recomputados a cada render); `applyFilters`/`useMatchFilters` leem `match.confirmedCount`/
  `match.availableSlots` direto, alinhado com "usar os campos calculados pelo servidor" (§2.2 do
  contrato).
- `src/hooks/useMatchParticipation.ts` — `Match`/`User` → `MatchDetail`/`PublicUser`.
- `src/components/MatchCard.tsx` — prop `match: MatchDetail`; usa `match.confirmedCount` em vez de
  chamar `getConfirmedCount` (import removido).
- `src/screens/CreateMatchScreen.tsx` — `newMatch: MatchDetail` monta os 3 campos calculados
  manualmente (organizador único, 1 confirmado no ato da criação).
- Testes: `src/components/__tests__/MatchCard.test.tsx` e
  `src/hooks/__tests__/useMatchFilters.test.ts` — mocks locais ajustados ao novo shape; o teste
  "Sem vagas" passou a setar `confirmedCount`/`availableSlots` direto em vez de inflar o array de
  `participants` (que não é mais o que o componente lê).

**Não precisaram de mudança** (tsc já resolvia certo por tipagem estrutural ou inferência via
hooks/contexts): `src/mocks/reports.ts`, `src/mocks/ratings.ts`, `src/mocks/messages.ts`,
`ReportsContext`, `RatingsContext`, `MessagesContext`, `MatchFiltersContext`, e todas as
`screens`/`components` que só recebem esses tipos por inferência (`PublicProfileScreen`,
`MyProfileScreen`, `MatchDetailScreen`, `ParticipantList`, `ReviewCard`, etc.).

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (após `eslint --fix` nos 11 arquivos
tocados, só CRLF→LF/formatação — dívida D4, pré-existente) · `npm run test` 181/181 passando (sem
regressão) · `npx expo export --platform web` gerou o bundle web sem erros (733 módulos).

### Estado ao final da sessão 20

- Branch `feat/api-contract-types`, criada a partir de `dev` (que já tinha o commit da URL de
  produção do backend). Ainda **não commitada** — código pronto e validado, falta só o commit.
- Fila da Fase 13 (`queue.md`): itens 1 e 2 (13.1) concluídos 🟢. Restam 14 itens (13.2–13.9).
- Próxima tarefa: item 3 da fila — `src/services/api/client.ts` (13.2, cliente HTTP tipado).
- Nenhum bug pendente — parada é limpa, entre tarefas. Ver "Checkpointer" no fechamento desta
  sessão (mensagem final) para o ponto exato de retomada.

---

## Sessão 21 — 2026-07-08

### Fase 13.2 — Camada de infraestrutura de API (itens 3–5 da fila)

Branch `feat/api-contract-types` (mesma da sessão 20, ainda não mergeada). Objetivo: construir a
infraestrutura de rede que todos os Contexts reais (13.4–13.8) vão consumir, sem tocar em nenhum
Context ainda — só a base.

**Item 3 — `src/services/api/client.ts`:**
- Wrapper de `fetch` tipado (`apiClient.get/post/patch/delete`), classe `ApiError extends Error`
  que faz parse do formato de erro real do backend (`{ detail: { code, message } }`), com
  fallback `{ code: "UNKNOWN_ERROR" }` se o corpo não seguir o contrato.
- `setAuthToken`/`getAuthToken` — token em memória; a persistência entre sessões é o item 5.
- Base URL lida de `process.env.EXPO_PUBLIC_API_URL` (fallback `http://localhost:8000`); criado
  `.env.example` na raiz (`.env` real já estava no `.gitignore`, nunca existiu no repo, então não
  havia nenhum arquivo documentando as variáveis esperadas até agora).
- 8 testes em `src/services/api/__tests__/client.test.ts` (mock de `globalThis.fetch`).

**Item 4 — `src/services/adapters/`:**
- Decisão de processo: em vez de confiar só no resumo do `backend-contract.md`, os schemas
  Pydantic reais foram lidos direto de `../back/app/schemas/*.py` para garantir paridade exata de
  campo a campo antes de escrever qualquer adapter.
- `types.ts` define as interfaces `Api*` em `snake_case` espelhando os schemas reais
  (`ApiPublicUser`, `ApiMyProfile`, `ApiParticipant`, `ApiMatchSummary`/`ApiMatchDetail`,
  `ApiMatchRef`, `ApiRating`, `ApiReport`, `ApiMessage`).
- Funções puras por entidade: `toPublicUser`/`toMyProfile` (`user.ts`),
  `toMatchSummary`/`toMatchDetail`/`toParticipant`/`toMatchRef` (`match.ts`), `toRating`/
  `toRatingPayload` (`rating.ts`, achata `RatingCriteria` para o `POST`), `toReport` (`report.ts`),
  `toMessage` (`message.ts`).
- **Duas decisões de conversão registradas como dívida técnica (D20/D21 em `queue.md`)** em vez de
  resolvidas de fato, porque a correção completa é escopo de sub-fases futuras:
  - `average_rating: null` (usuário sem avaliações) cai para `0` em `toPublicUser` — o tipo
    `PublicUser.averageRating` continua `number`, então o `null` real do backend fica mascarado
    até a 13.7 tratar isso na UI de verdade (D20).
  - Horário do backend vem com segundos (`"09:00:00"`) e é cortado para `"09:00"` em
    `toMatchSummary`, para casar com o formato dos mocks/telas — comportamento correto e
    definitivo, não é dívida.
  - `Message.createdAt`/`Rating.createdAt`/`Report.createdAt` recebem o ISO completo do servidor
    sem reformatar. `MessageBubble` hoje imprime `message.createdAt` bruto na tela (formato
    `"HH:mm"` do mock atual) — quando a 13.6 plugar mensagens reais, vai aparecer um ISO completo
    ali até alguém adicionar a formatação (D21).
- 17 testes novos em `src/services/adapters/__tests__/` (um arquivo por entidade).

**Item 5 — `expo-secure-store` + `src/services/storage/tokenStorage.ts`:**
- `npx expo install expo-secure-store` (registrou o config plugin em `app.json` automaticamente).
- `tokenStorage.ts` expõe `saveTokens`/`getAccessToken`/`getRefreshToken`/`clearTokens`/
  `restoreAuthToken`; `saveTokens`/`clearTokens`/`restoreAuthToken` já chamam `setAuthToken` do
  `client.ts` por dentro, então a `AuthContext` da 13.4 só vai precisar chamar essas funções nos
  momentos certos (login/refresh/logout/boot) sem repetir lógica de storage.
- **Decisão de plataforma:** `expo-secure-store` é um no-op em `react-native-web` — o binário web
  do pacote (`ExpoSecureStore.web.js`) exporta um objeto vazio, então qualquer chamada nativa
  falharia silenciosamente ou lançaria em runtime no browser. Confirmado lendo o código-fonte do
  pacote antes de decidir. Fallback: `sessionStorage` no web (limpa ao fechar a aba — aceitável
  para a demo acadêmica, registrado como D22 porque significa que o login não sobrevive a um
  fechar-e-abrir de aba no `npm run web`; no nativo via Expo Go/EAS o token vai para o
  keychain/keystore de verdade, sem essa limitação).
- 7 testes: `tokenStorage.test.ts` (branch nativo, mocka `expo-secure-store`) e
  `tokenStorage.web.test.ts` (branch web, muta `Platform.OS` diretamente — não mocka o módulo
  `react-native` inteiro, porque isso derruba o automock do Jest/RN e quebra com
  `TurboModuleRegistry`/`DevMenu not found`; `isWeb()` foi escrito como função, não `const` de
  módulo, justamente para dar para mutar `Platform.OS` em runtime de teste sem reset de módulo).

### Fase 13.3 — React Query (item 6 da fila)

- `npm install @tanstack/react-query` (`^5.101.2`).
- `src/services/queryClient.ts` — uma instância única (`retry: 1`, `staleTime: 60_000`).
- `src/services/queryKeys.ts` — convenção central de chaves (`me`, `matches(filters?)`,
  `match(matchId)`, `messages(matchId)`, `userRatings(userId)`, `reports`) para as sub-fases
  13.4–13.8 usarem sem reinventar o formato cada uma; tipada sobre `MatchFilters` já existente em
  `MatchFiltersContext.tsx`.
- `App.tsx` ganhou `<QueryClientProvider client={queryClient}>` envolvendo toda a árvore, por fora
  de `SafeAreaProvider` e de todos os Contexts mockados (nenhum deles consome React Query ainda —
  isso é só o terreno pronto, a migração real é 13.4+).
- Primeiro teste do componente raiz: `__tests__/App.test.tsx` (smoke — renderiza `<App />` sem
  lançar). Precisou de `jest.mock("../global.css", () => ({}))`, porque o Jest não sabe parsear
  `@tailwind` do CSS importado por efeito colateral em `App.tsx`.
- `src/services/__tests__/queryKeys.test.ts` — 4 testes cobrindo as 6 chaves.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (auto-fix aplicado só nos arquivos
tocados, formatação — dívida D4, pré-existente) · `npm run test` 218/218 passando (era 181 no
início da sessão; +37 testes novos) · `npx expo export --platform web` gerou o bundle sem erros,
confirmado depois da mudança em `App.tsx` (componente raiz da árvore renderizada no `npm run web`).

### Estado ao final da sessão 21

- Branch `feat/api-contract-types`. 3 commits novos nesta sessão:
  `feat(api): adiciona cliente HTTP tipado para a API do backend`,
  `feat(api): adiciona camada de adapters snake_case -> camelCase`,
  `feat(auth): adiciona storage seguro de token com expo-secure-store`,
  `feat(api): instala e configura @tanstack/react-query`.
- Sub-fases 13.2 e 13.3 **inteiramente concluídas** (itens 3–6 da fila). Fase 13 em 6/16.
- Toda a infraestrutura de integração está pronta e testada: tipos (13.1), cliente HTTP, adapters,
  storage seguro de token, React Query. Nenhum Context real ainda consome nada disso — a partir
  daqui a fila entra em território de UI/produto (13.4, auth real).
- Próxima tarefa: item 7 da fila — adicionar campo de **idade** ao fluxo de cadastro (D15, abre a
  13.4). Pergunta em aberto ainda sem resposta do usuário: em qual tela o campo entra —
  `RegisterScreen` (junto de nome/email/senha) ou `ProfileSetupScreen` (junto de esportes/nível/
  localização)? Decidir isso é o primeiro passo da próxima sessão, antes de tocar em qualquer tela.
- Nenhum bug pendente — parada é limpa, entre tarefas. Ver "Checkpointer" no fechamento desta
  sessão (mensagem final) para o ponto exato de retomada.

---

## Sessão 22 — 2026-07-08

### Fase 13.4 — Campo de idade no cadastro (item 7 da fila, D15)

Branch `feat/api-contract-types` (mesma das sessões 20–21). Decisão do usuário no início da
sessão: o campo de idade entra em `RegisterScreen`, não em `ProfileSetupScreen`.

**Achado ao abrir `RegisterScreen.tsx`:** já existia um campo "Data de nascimento" (`DD/MM/AAAA`,
texto livre) — mas era validado (`birthDateError`) e depois **descartado**: nunca era passado para
`register(name, email, password)`.

**Primeira implementação (revisada ainda na mesma sessão):** o campo foi trocado por "Idade"
(numérico, valida inteiro > 0 — mesmo critério `gt=0` do schema do backend). Funcionou, tinha
testes, `tsc`/lint/build todos verdes — mas o usuário corrigiu o approach antes de seguir: **o
usuário deveria informar a data de nascimento, e o app calcula a idade**, com uma regra de negócio
de **18+ obrigatório** (não é só satisfazer o `int > 0` do backend — é uma decisão de segurança do
produto, já que o app conecta pessoas para jogar com desconhecidos).

**Implementação final:**
- `src/utils/date.ts` ganhou duas funções novas: `parseBirthDate(input): Date | null` (aceita só
  `DD/MM/AAAA`, valida que a data existe de fato no calendário — rejeita `31/02`, `29/02` em ano
  não bissexto etc. — via reconstrução com `Date` e comparação de dia/mês/ano) e
  `calculateAge(birthDate, referenceDate = new Date()): number` (idade em anos completos,
  considerando se o aniversário já ocorreu no ano de referência).
- `RegisterScreen.tsx` voltou a usar "Data de nascimento" (mesmo campo/placeholder/ícone de antes),
  mas agora de verdade: `handleRegister` faz `parseBirthDate` → se inválida, erro de formato; se
  válida, `calculateAge` → se `< MINIMUM_AGE` (18), erro "Você precisa ter pelo menos 18 anos para
  se cadastrar"; só então chama `register(name, email, password, age)` com a idade **computada**,
  nunca digitada.
- `AuthContext.tsx`: `register()` ganhou o 4º parâmetro `age: number`; novo estado `pendingAge`
  (default `0`), consumido por `completeProfile` no lugar do `age: 25` hardcoded, resetado em
  `completeProfile`/`logout` junto com `pendingName`/`pendingEmail`. Essa parte não mudou entre a
  primeira tentativa e a versão final — só a origem do número (`age`) mudou, de input direto para
  cálculo derivado.
- **Cobertura de teste** (nem `RegisterScreen`, `AuthContext` nem `date.ts` tinham teste antes
  desta sessão): `src/utils/__tests__/date.test.ts` (10 testes — `parseBirthDate` com formatos
  válidos/inválidos/datas inexistentes/ano bissexto; `calculateAge` com referência antes/depois/no
  dia do aniversário, e com o default `new Date()`); `src/screens/__tests__/RegisterScreen.test.tsx`
  (6 testes — campo de data, erro de vazio/formato inválido/menor de 18, `register` chamado com a
  idade calculada, navegação); `src/contexts/__tests__/AuthContext.test.tsx` (3 testes via
  `renderHook` — `register` guarda estado pendente sem autenticar, `completeProfile` usa a idade do
  `register` em vez de hardcodar 25 — nomeada explicitamente "regressão D15" no teste — e `logout`
  limpa tudo).
- D15 marcada como resolvida em `queue.md`.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (auto-fix nos arquivos tocados,
formatação — D4) · `npm run test` 238/238 passando (era 218 no início da sessão; +20 testes novos) ·
`npx expo export --platform web` gerou o bundle sem erros.

### Estado ao final da sessão 22

- Branch `feat/api-contract-types`. Mudanças desta sessão ainda **não commitadas** — código
  pronto e validado, falta só o commit (próximo passo antes de seguir para o item 8).
- Item 7 da fila concluído. Fase 13 em 7/16. Próxima tarefa: item 8 — reescrever `AuthContext` por
  dentro para chamar `POST /auth/register` → `POST /auth/login` em sequência, salvar tokens no
  storage seguro (13.2), interceptor de refresh em 401, tela de boot via `GET /auth/me`. É o
  grosso da 13.4 e a primeira vez que um Context real vai consumir `client.ts`/`tokenStorage.ts`.
- Nenhum bug pendente — parada é limpa, entre tarefas. Ver "Checkpointer" no fechamento desta
  sessão (mensagem final) para o ponto exato de retomada.

---

## Sessão 23 — 2026-07-10

### Fase 13.4 — `AuthContext` real (item 8 da fila, conclui a 13.4)

Branch `feat/auth-real`, criada a partir de `dev` (que já tinha o merge de `feat/api-contract-types`
das sessões 20–22 via PR #3). Objetivo: reescrever `AuthContext` por dentro para consumir a API real
do backend, mantendo a assinatura pública (`login`, `register`, `completeProfile`, `logout`) para não
alterar as telas de novo — só ganharam tratamento de loading/erro assíncrono, que antes não existia
(o mock nunca falhava).

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/services/api/auth.ts` | `registerRequest`, `loginRequest`, `refreshRequest`, `logoutRequest` — wrappers finos sobre `apiClient` para os 4 endpoints de `/auth/*` usados nesta sub-fase |
| `src/services/api/users.ts` | `fetchMyProfile` (`GET /users/me`), `updateMyProfile` (`PATCH /users/me`) |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/services/api/client.ts` | Interceptor de refresh em 401: `setUnauthorizedHandler(fn)` — setter registrado pelo `AuthContext` no boot; um 401 fora de `/auth/{login,register,refresh,logout}` tenta `fn()` e repete a chamada original uma vez se um novo token voltar |
| `src/contexts/AuthContext.tsx` | Reescrito por dentro — ver decisões abaixo. Novo campo `isBooting` na interface pública |
| `src/navigation/RootNavigator.tsx` | `BootScreen` (spinner em `bg-secondary-900`) renderizado enquanto `isBooting`, antes de decidir entre `AuthNavigator`/`AppNavigator` |
| `src/screens/LoginScreen.tsx` | `handleLogin` assíncrono; `ApiError` capturado e exibido no campo de senha |
| `src/screens/ProfileSetupScreen.tsx` | `submitProfile` assíncrono (usado por "Concluir configuração" e "Pular por agora"); `ApiError`/erro genérico exibido acima do botão; prop `loading` nos dois botões |
| `src/contexts/__tests__/AuthContext.test.tsx` | Reescrito — 10 testes (era 3), mockando `fetch`/`expo-secure-store` (não os módulos de serviço), mesmo padrão de `client.test.ts`/`tokenStorage.test.ts` |

`src/screens/RegisterScreen.tsx` **não precisou mudar** — já passava `password` como 3º argumento
para `register()`; só o `AuthContext` por trás passou a de fato guardá-lo.

### Decisões não óbvias

- **Boot usa `GET /users/me`, não `GET /auth/me`** (diverge do texto original do roadmap/
  `backend-contract.md`): `/auth/me` devolve `UserRead`, que **não tem** `average_rating`/
  `matches_played` — só `/users/me` devolve o `MyProfileRead` completo, que bate 1:1 com o tipo
  `MyProfile` do front. Usar `/auth/me` exigiria mascarar esses dois campos com `0` só para o boot
  fechar o tipo, empurrando um perfil incompleto pro resto do app. `/users/me` já faz a checagem de
  token via `get_current_user` internamente, então cobre o mesmo caso de uso de "boot check" com um
  dado melhor — mesma decisão de fundo que já gerou a D20 na sessão 21 (não mascarar dado real com
  placeholder quando dá para evitar).
- **`POST /auth/register` só é disparado dentro de `completeProfile`, não em `register()`** — o
  backend exige `location` no payload (`RegisterRequest.location`, `min_length=1`), e `location` só
  é coletado na tela seguinte (`ProfileSetupScreen`). `register()` continua 100% síncrono e local
  (guarda nome/e-mail/senha/idade como pending, como já fazia); a sequência real de rede —
  `POST /auth/register` → `POST /auth/login` → `PATCH /users/me` — só acontece dentro de
  `completeProfile`, quando todos os campos obrigatórios finalmente existem juntos.
- **`level` não existe no `RegisterRequest` do backend** (`app/schemas/auth.py` — só
  `name/email/password/age/location/bio/favorite_sports`; o model `User` sempre nasce com
  `level: BEGINNER` por default). `completeProfile` faz um `PATCH /users/me` logo após o login para
  gravar o nível escolhido em `ProfileSetupScreen` — e a resposta desse PATCH já é o `MyProfileRead`
  completo, evitando um `GET /users/me` extra só para essa autenticação.
- **Interceptor de refresh sem import circular:** `client.ts` não importa `tokenStorage.ts` (que por
  sua vez importa `setAuthToken` de `client.ts`). Em vez disso, `client.ts` expõe
  `setUnauthorizedHandler(fn)`, e é o `AuthContext` (que já conhece os dois módulos) quem registra a
  função de refresh no boot — o cliente HTTP só delega a decisão de "tentar renovar", nunca conhece
  storage de token diretamente.
- **Bug encontrado e corrigido na própria sessão:** `/auth/logout` não estava na lista de paths sem
  retry (`AUTH_PATHS_WITHOUT_RETRY`). Um 401 em `POST /auth/logout` — cenário plausível, já que
  logout manda o refresh token e ele pode já estar expirado/revogado — disparava uma tentativa extra
  e inútil de `POST /auth/refresh` com esse mesmo refresh token inválido antes de desistir. Corrigido
  adicionando `/auth/logout` ao set. Confirmado com teste dedicado (`toHaveBeenCalledTimes(1)`) que
  falha sem a correção (2 chamadas) e passa com ela.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (auto-fix nos arquivos tocados,
formatação CRLF→LF — dívida D4, pré-existente) · `npm run test` 245/245 passando (era 238 no início
da sessão; +7 testes líquidos: 10 novos em `AuthContext.test.tsx` substituindo os 3 antigos).

### Estado ao final da sessão 23

- Branch `feat/auth-real`, criada a partir de `dev`. Commit pendente (ver seção de commit desta
  mesma sessão de fechamento).
- Item 8 da fila concluído — **Fase 13.4 (Auth real) inteiramente concluída** (itens 7 e 8). Fase 13
  em 8/16.
- Próxima tarefa: item 9 da fila — `MatchesContext`/`MatchFiltersContext` → React Query contra
  `GET /matches`; adicionar filtros de **data** e **localização** (D18). Atenção: a listagem hoje é
  tipada como `MatchDetail` (decisão D19, sessão 20) mas `GET /matches` real devolve `MatchSummary`
  (sem `organizer`/`participants` expandidos) — a busca por nome do organizador em
  `HomeScreen`/`useMatchFilters.applyFilters` vai quebrar em runtime se não for resolvida primeiro
  (remover a busca por organizador da lista, ou pedir ao backend um campo `organizer_name` leve).
- Nenhum bug pendente — parada é limpa, entre tarefas. Ver "Checkpointer" no fechamento desta sessão
  (mensagem final) para o ponto exato de retomada.

---

## Sessão 24 — 2026-07-13

### Fase 13.5 — Matches reais (itens 9–12 da fila, conclui a 13.5)

Branch `feat/matches-real`, criada a partir de `dev`. Os itens 9–12 foram implementados juntos,
numa única sessão — a D19 (registrada na sessão 20) já previa que separá-los era inviável: assim
que `MatchesContext` passasse a devolver `MatchSummary` real (sem `organizer`/`participants`),
toda tela que lia esses campos a partir da listagem quebraria em runtime sem erro de tipo. Item 9
sozinho não tinha como ficar "meio pronto" sem deixar o app num estado inconsistente.

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/services/api/matches.ts` | `fetchMatches(filters)` (`GET /matches` com query string `sport/level/date/location/has_open_slots`), `fetchMatchDetail(id)` (`GET /matches/{id}`), `createMatch(payload)` (`POST /matches`), `joinMatch`/`leaveMatch`/`closeMatch`/`approveParticipant` (ações de partida) |
| `src/hooks/useMatchDetail.ts` | Hook compartilhado — `useQuery` contra `queryKeys.match(matchId)` retornando `MatchDetail` via `toMatchDetail(await fetchMatchDetail(matchId))`. Extraído de `useMatchParticipation` para ser reaproveitado por telas que só precisam ler o detalhe (sem participar) |
| `src/test-utils/queryClientWrapper.tsx` | `createTestQueryClient()`/`createQueryWrapper()` — primeiro helper de teste para React Query do projeto (`retry: false, staleTime: 0`), usado pelos testes novos de `useMatchParticipation` e `MatchDetailScreen` |

### Arquivos modificados (produção)

| Arquivo | Mudança |
|---------|---------|
| `src/contexts/MatchFiltersContext.tsx` | `MatchFilters` ganhou `date: string \| null` e `location: string \| null` (D18); `activeFilterCount` conta os dois novos campos |
| `src/contexts/MatchesContext.tsx` | Reescrito: `useQuery` contra `queryKeys.matches(filters)` chamando `fetchMatches` + `toMatchSummary`; lê `filters` via `useMatchFiltersContext()` internamente (deixou de receber prop) — exige que `MatchFiltersProvider` envolva `MatchesProvider`. `addMatch`/`updateParticipation` (client-side) removidos; expõe `matches: MatchSummary[]`, `isLoading`, `refetch`. Novo export `useInvalidateMatches()` (invalida `["matches"]` no `QueryClient`) |
| `App.tsx` | Reordenado: `MatchFiltersProvider` agora envolve `MatchesProvider` (antes era o contrário) |
| `src/hooks/useMatchFilters.ts` | `applyFilters` migrado para `MatchSummary`; busca por texto não checa mais `match.organizer.name` (D19) — só título e local |
| `src/hooks/useMatchParticipation.ts` | Reescrito sobre `useMatchDetail` + ações reais: `join`→`POST /matches/{id}/join`, `cancel`→`POST /matches/{id}/leave`, novo `close`→`POST /matches/{id}/close`, novo `approve(userId)`→`POST /matches/{id}/participants/{userId}/approve`. Todas invalidam `queryKeys.match(matchId)` e `["matches"]` após sucesso; falhas mostram `Alert.alert` |
| `src/components/MatchCard.tsx` | Prop `match` migrada para `MatchSummary`; footer de organizador (avatar + nome) removido — `MatchSummary` não tem esse campo |
| `src/components/ParticipantList.tsx` | Nova prop opcional `onApprove?: (userId: string) => void` — quando presente, cada participante `pending` ganha um botão "Aprovar" (some o `opacity-60`) |
| `src/screens/HomeScreen.tsx` | Removido o timer fake de loading (`setTimeout` de 700ms); `isLoading` agora vem de verdade do `useMatchesContext()` (React Query) |
| `src/screens/FiltersScreen.tsx` | Novos campos "Data" (`DD/MM/AAAA` com validação, convertido para ISO) e "Localização" (texto livre) |
| `src/screens/MatchDetailScreen.tsx` | `isLoading` tratado com tela própria; novo botão "Encerrar partida" (só quando `isOrganizer && !isMatchOver`); `ParticipantList` recebe `onApprove` só quando `isOrganizer` |
| `src/screens/CreateMatchScreen.tsx` | `handleSubmit` assíncrono chamando `createMatch()` de verdade (antes só montava um `MatchDetail` local e chamava `addMatch`); `useInvalidateMatches()` no sucesso; `isSubmitting`/`loading`/`disabled` no botão; `Alert` de erro em caso de falha de rede |
| `src/screens/MatchChatScreen.tsx`, `PostMatchRatingScreen.tsx`, `RateUserScreen.tsx` | Migradas de `useMatchesContext().matches.find(...)` (que devolvia `MatchDetail` do mock) para `useMatchDetail(matchId)` — essas telas leem `match.participants`, que só existe no detalhe, não na listagem |
| `src/screens/ReportUserScreen.tsx` | `userMatches` (picker de "partida relacionada") virou array vazio hardcoded — não há endpoint de "partidas em comum com userId" no backend (**D23**, nova). Também corrigido de passagem: `Date.now()`/`new Date()` chamados 2x dentro de `handleSubmit` viraram uma variável `now` única (lint novo `react-hooks/purity`, pré-existente, não introduzido nesta sessão — ver "Achado tangencial" abaixo) |

### Decisões não óbvias

- **`MatchFiltersProvider` agora precisa envolver `MatchesProvider`** (`App.tsx`): `MatchesContext`
  lê os filtros via `useMatchFiltersContext()` internamente em vez de receber como prop — mesmo
  padrão que `HomeScreen`/`SearchScreen` já usavam (dois hooks separados), só que agora dentro do
  próprio Context. Inverter a ordem dos providers foi mais simples que continuar passando `filters`
  como prop explícita.
- **D19 resolvida removendo a busca por organizador, não pedindo campo novo ao backend** — das duas
  opções que a D19 deixava em aberto (remover a busca vs. backend expor `organizer_name` leve),
  esta sessão escolheu a primeira: menos escopo, e o nome do organizador nunca foi um filtro
  citado no `vision.md` (só esporte/local/horário/nível).
  não foi solicitado ao usuário, mas justificável porque manter uma segunda chamada de API só para
  popular um campo de busca secundário adicionaria uma dependência de rede desnecessária ao filtro
  client-side.
- **`useMatchDetail` extraído como hook próprio**, não deixado só dentro de `useMatchParticipation`
  — quatro telas (`MatchChatScreen`, `PostMatchRatingScreen`, `RateUserScreen`,
  `MatchDetailScreen` via `useMatchParticipation`) precisavam do mesmo `GET /matches/{id}` mas só
  uma delas (`MatchDetailScreen`) precisa das ações de participação. Extrair evitou 4 cópias do
  mesmo `useQuery`.
- **D23 (nova):** `ReportUserScreen` perdeu a lista de "partidas em comum com o usuário denunciado"
  porque essa informação só existia porque o mock global trazia todos os participantes de toda
  partida em memória — não existe endpoint real equivalente. Registrada como dívida em vez de
  resolvida nesta sessão porque resolver de verdade provavelmente exige um endpoint novo no
  backend (fora do escopo do front) — decisão para a Fase 13.8, quando `ReportsContext` for
  migrado.

### Achado tangencial (não relacionado à Fase 13.5)

Rodar `npm install` nesta sessão (TypeScript não estava instalado localmente ainda) trouxe uma
versão mais nova de `eslint-plugin-react-hooks` que passou a aplicar a regra `react-hooks/purity`
("Cannot call impure function during render"). Ela acusou `Date.now()`/`new Date()` chamados duas
vezes dentro de `ReportUserScreen.handleSubmit` — código **pré-existente**, de antes desta sessão,
não causado por nenhuma mudança da Fase 13.5. Corrigido trivialmente (uma variável `now` capturada
uma vez) para manter `npm run lint` zerado, mas vale registrar que a causa é o upgrade de
dependência, não a integração de matches.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (após corrigir o achado tangencial acima
e rodar `lint:fix` para CRLF→LF, dívida D4 pré-existente) · `npm run test` 239/239 passando (era
245 no início da sessão; saldo líquido negativo de 6 porque os testes de organizador em
`MatchCard.test.tsx`/`ReportUserScreen.test.tsx` — que dependiam de campos que não existem mais em
`MatchSummary` — foram removidos, não substituídos 1:1).

### Estado ao final da sessão 24

- Branch `feat/matches-real`, criada a partir de `dev`. Commit pendente (ver seção de commit desta
  mesma sessão de fechamento).
- Itens 9–12 da fila concluídos — **Fase 13.5 (Matches reais) inteiramente concluída**. Fase 13 em
  12/16.
- Nova dívida técnica: **D23** (`ReportUserScreen` sem picker de partida relacionada — falta
  endpoint no backend). D19 marcada como resolvida.
- Próxima tarefa: item 13 da fila — `MessagesContext` → React Query contra
  `GET/POST /matches/{id}/messages` (resolve D12 — timestamp de mensagem gerado no cliente),
  com paginação em `MatchChatScreen` (`skip`/`limit`, máx. 100 por página, backend já suporta).
- Nenhum bug pendente — parada é limpa, entre tarefas. Ver "Checkpointer" no fechamento desta sessão
  (mensagem final) para o ponto exato de retomada.

---

## Sessão 25 — 2026-07-13

### Fase 13.6 — Mensagens reais (item 13 da fila, conclui a 13.6)

Branch `feat/messages-real`, criada a partir de `dev`. Alinhamento prévio confirmado contra
`plano-de-entrega.md` (Trilha B, item 2) antes de iniciar — sem conflito, dentro do cronograma
aprovado ("Ago 2 – Set 2: mensagens/avaliações/denúncias").

Descoberta que mudou o desenho original da tarefa: o backend (`app/services/message_service.py`)
ordena `GET /matches/{id}/messages` em ordem **crescente** (`order_by(Message.created_at)`, mais
antiga primeiro) e não expõe contagem total de mensagens. Isso inviabiliza paginação reversa
clássica por `skip` decrescente (não dá para calcular o offset da "última página" sem saber o
total). Resolvido com `useInfiniteQuery` buscando sempre do início (`skip=0`) com um `limit`
crescente a cada "carregar mais" (30 → 60 → 90 → teto de 100 do backend) — troca eficiência de
rede por corretude, aceitável dado o volume esperado de mensagens por partida num protótipo
acadêmico.

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/services/api/messages.ts` | `fetchMessages(matchId, {skip, limit})` (`GET /matches/{id}/messages`), `postMessage(matchId, text)` (`POST /matches/{id}/messages`, envia só `{ text }` — timestamp gerado pelo servidor) |
| `src/hooks/useMessages.ts` | Substitui `MessagesContext` por completo. `useInfiniteQuery` contra `queryKeys.messages(matchId)` (limit crescente, ver acima) + `useMutation` para `sendMessage` (invalida a query no sucesso). Resultado já inverte a ordem para a `FlatList` invertida (`messages[0]` = mais recente) |
| `src/hooks/__tests__/useMessages.test.ts` | Cobre inversão de ordem, rota `GET`/`POST` corretas, payload só com `text`, e no-op ao enviar texto vazio/espaços |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/screens/MatchChatScreen.tsx` | Troca `useMessagesContext()` por `useMessages(matchId)`; `FlatList` ganha `onEndReached`/`onEndReachedThreshold` (dispara `loadMore` ao rolar para o topo visual = histórico mais antigo, correto numa lista invertida) e `ListFooterComponent` com `ActivityIndicator` durante `isFetchingMore` |
| `src/utils/date.ts` | Novo `formatMessageTime(isoString)` — formata o `created_at` ISO do backend em `HH:mm` para exibição |
| `src/components/MessageBubble.tsx` | Passa a formatar `message.createdAt` (agora ISO completo, não mais `"HH:mm"` fixo do mock) via `formatMessageTime` — resolve **D21** |
| `src/components/__tests__/MessageBubble.test.tsx`, `src/utils/__tests__/date.test.ts` | Fixtures migradas de `"HH:mm"` fixo para ISO real; assert de horário passa a comparar contra `formatMessageTime(...)` em vez de string literal |
| `App.tsx` | `MessagesProvider` removido da árvore de providers (Context deletado) |

### Arquivos removidos

- `src/contexts/MessagesContext.tsx` — funcionalidade migrada integralmente para `useMessages`.
  `src/mocks/messages.ts` **mantido** (ainda não é o momento de remover mocks — `RatingsContext`/
  `ReportsContext` seguem mockados; a remoção de mocks é tarefa da 13.9, só depois que os 3
  Contexts restantes migrarem).

### Decisões não óbvias

- **Paginação por limit crescente, não por skip decrescente** — única forma correta de paginar
  "carregar mensagens mais antigas" sem um endpoint de contagem total. Documentado em comentário
  no próprio `useMessages.ts` para não parecer um bug na próxima leitura do código.
- **D12 resolvida por completo**: `sendMessage` não gera mais `createdAt` no cliente — o hook só
  envia `{ text }` e invalida a query, deixando o próximo fetch trazer o `created_at` real do
  servidor (em vez de otimisticamente inserir a mensagem local, que exigiria reconciliar o ID
  temporário depois — trade-off aceito: um pequeno delay perceptível entre enviar e ver a
  mensagem aparecer, contra simplicidade e corretude do timestamp).
- **D21 resolvida junto** (não estava no escopo original da 13.6, mas era o mesmo arquivo/mesmo
  motivo): `MessageBubble` já precisava lidar com ISO real por causa da migração, então formatar
  ali mesmo evitou deixar a dívida para depois.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (após `lint:fix` para CRLF→LF, D4
pré-existente — nenhuma mudança de conteúdo real nos arquivos só normalizados, confirmado via
`git diff --ignore-space-at-eol`) · `npm run test` 245/245 passando (234 pré-existentes + 11
novos em `useMessages.test.ts`, líquido: suite cresceu, nada quebrou) · `npx expo export` (ver
seção de build desta sessão de fechamento).

### Estado ao final da sessão 25

- Branch `feat/messages-real`, criada a partir de `dev`. Commit feito nesta sessão de fechamento
  (ver histórico do git para o hash exato).
- Item 13 da fila concluído — **Fase 13.6 (Mensagens reais) inteiramente concluída**. Fase 13 em
  13/16.
- Dívidas D12 e D21 resolvidas. Nenhuma dívida nova identificada nesta sessão.
- Próxima tarefa: item 14 da fila — `RatingsContext` → React Query contra
  `POST /matches/{id}/ratings/{userId}` e `GET /users/{id}/ratings` (Fase 13.7), com adapter de
  achatamento de `RatingCriteria` e tratamento de `averageRating` nulo (D20).
- Nenhum bug pendente — parada é limpa, entre tarefas.

---

## Sessão 26 — 2026-07-13

### Fase 13.7 — Avaliações reais (item 14 da fila, conclui a 13.7)

Branch `feat/ratings-real`, criada a partir de `dev`. O adapter `toRating`/`toRatingPayload`
(`src/services/adapters/rating.ts`) já vinha achatando `RatingCriteria` corretamente desde uma
sessão anterior — não precisou de mudança nesta sessão, só ganhou o service/hook que faltava para
ser de fato usado contra a API real.

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/services/api/ratings.ts` | `fetchUserRatings(userId)` (`GET /users/{id}/ratings`), `postRating(matchId, ratedUserId, payload)` (`POST /matches/{id}/ratings/{userId}`) |
| `src/hooks/useRatings.ts` | `useUserRatings(userId)` — query + `hasRated(matchId, ratedUserId)` derivado das ratings já buscadas; `useSubmitRating()` — mutation com callbacks `onSuccess`/`onError` por chamada, invalida `queryKeys.userRatings` no sucesso; `useHasRatedMap(matchId, userIds[])` — usa `useQueries` para checar "já avaliado" de vários participantes de uma vez sem violar as regras de hooks (substitui o padrão anterior de "um hook por linha de lista") |
| `src/hooks/__tests__/useRatings.test.tsx` | Cobre leitura, `hasRated`, envio com sucesso/erro e o mapa de `useHasRatedMap`. Mock de `fetch` por rota (não por ordem de chamada) — necessário porque o boot do `AuthProvider` (`GET /users/me`) dispara concorrentemente com as queries do hook sob teste, e não há garantia de qual delas chega primeiro no mock global |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/types/index.ts` | `PublicUser.averageRating` passa de `number` para `number \| null` — resolve **D20** |
| `src/services/adapters/user.ts` | `toPublicUser` para de mascarar `average_rating: null` como `0`; propaga o `null` real |
| `src/components/RatingStars.tsx` | Aceita `rating: number \| null`; quando `null`, mostra todas as estrelas vazias e o texto "Sem avaliações" (em vez do valor numérico) |
| `src/components/TrustBadges.tsx` | `averageRating: number \| null`; o badge de nota some quando `null` em vez de mostrar "0.0" |
| `src/screens/MyProfileScreen.tsx`, `src/screens/PublicProfileScreen.tsx` | `user.averageRating.toFixed(1)` → `user.averageRating?.toFixed(1) ?? "—"` no `StatsRow` |
| `src/screens/RateUserScreen.tsx` | Troca `useRatingsContext().submitRating` por `useSubmitRating()`; `handleSubmit` passa callbacks `onSuccess` (mostra o `Alert` de sucesso) / `onError` (mostra erro inline); botão de envio usa `loading={isSubmitting}` |
| `src/screens/PostMatchRatingScreen.tsx` | Troca `useRatingsContext().hasRated`/`CURRENT_USER` por `useAuth().user` + `useHasRatedMap(matchId, ratedUserIds)`; o "já avaliado" por participante e o banner "todos avaliados" agora vêm do mapa único, sem um hook por linha da `FlatList` |
| `App.tsx` | `RatingsProvider` removido da árvore de providers |
| `src/services/adapters/__tests__/user.test.ts`, `src/components/__tests__/RatingStars.test.tsx` | Novos casos cobrindo `average_rating: null` → `averageRating: null` (adapter) e a renderização "Sem avaliações" (componente) |

### Arquivos removidos

- `src/contexts/RatingsContext.tsx` — funcionalidade migrada integralmente para `useRatings.ts`.
  `src/mocks/ratings.ts` **mantido** (usado por `MyProfileScreen`/`PublicProfileScreen`, que ainda
  exibem `MOCK_RATINGS`/`MOCK_USERS` — essas duas telas não fazem parte do escopo da Fase 13.7,
  que troca só o fluxo de **enviar/checar** avaliação, não a listagem de perfil; migrar essas
  telas para dados reais de usuário fica para quando `MatchesContext`/`AuthContext` também
  expuserem perfis públicos via React Query de forma mais ampla — não há tarefa na fila para
  isso ainda, vale registrar como possível gap se a Fase 12 revisitar essas telas).

### Decisões não óbvias

- **`useHasRatedMap` via `useQueries`, não um `useUserRatings` por linha de `FlatList`** — a
  implementação original migrada ingenuamente chamava o hook de leitura dentro do componente de
  cada participante, o que teria funcionado na prática (cada linha é seu próprio componente,
  então não viola regras de hooks), mas exigiria um `useEffect` extra por linha só para levantar
  o resultado até o pai (para o banner "todos avaliados"). `useQueries` resolve isso num único
  lugar, sem gambiarra de callback.
- **Callbacks passados por chamada de `submitRating`, não fixos no hook** — diferente de
  `useMessages` (fire-and-forget puro), `RateUserScreen` precisa mostrar um `Alert` de sucesso e
  reagir a erro. Em vez de mudar a assinatura pública do hook para sempre exigir isso, os
  callbacks são opcionais e passados por chamada — mantém `useSubmitRating()` simples de usar
  onde erro não importa (não houve caso assim aqui, mas é o padrão mais flexível).
- **Escopo da 13.7 não inclui `MyProfileScreen`/`PublicProfileScreen`** — essas telas continuam
  lendo `MOCK_RATINGS`/`MOCK_USERS` porque exibir a lista de avaliações **recebidas** no perfil é
  uma funcionalidade diferente de **enviar**/verificar uma avaliação específica numa partida (o
  escopo real de `RatingsContext`). Migrar essas telas exigiria decidir de onde vem `PublicUser`
  real fora do fluxo de partida — fora do que a fila (`.status/queue.md`, item 14) pedia.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (após `lint:fix` para CRLF→LF, D4
pré-existente) · `npm run test` 252/252 passando (245 pré-existentes + 7 novos: 5 em
`useRatings.test.tsx`, 2 em `RatingStars.test.tsx`) · `npx expo export` (ver seção de build desta
sessão de fechamento).

### Estado ao final da sessão 26

- Branch `feat/ratings-real`, criada a partir de `dev`. Commit feito nesta sessão de fechamento
  (ver histórico do git para o hash exato).
- Item 14 da fila concluído — **Fase 13.7 (Avaliações reais) inteiramente concluída**. Fase 13 em
  14/16.
- Dívida D20 resolvida. Nenhuma dívida nova identificada nesta sessão (o gap de
  `MyProfileScreen`/`PublicProfileScreen` ainda usarem mocks foi registrado acima como observação,
  não como dívida numerada, porque nunca esteve no escopo da Fase 13 para essas duas telas
  especificamente).
- Próxima tarefa: item 15 da fila — `ReportsContext.updateReportStatus` migrado de status-alvo
  para ação (`archive`/`warn`/`ban`), alinhado a `PATCH /reports/{id}` (Fase 13.8, resolve D14 —
  único contrato genuinamente quebrado identificado na comparação com o backend).
- Nenhum bug pendente — parada é limpa, entre tarefas.

---

## Sessão 27 — 2026-07-14

### Fase 13.8 — Denúncias reais (item 15 da fila, conclui a 13.8)

Branch `feat/reports-real`, criada a partir de `dev` (após o merge do PR #7 de `feat/ratings-real`).
Resolve **D14**, o único contrato genuinamente quebrado identificado na comparação com o backend
(`.status/backend-contract.md` §2.6): o front mandava um `ReportStatus` direto para
`updateReportStatus`, mas `PATCH /reports/{id}` real espera `{ action: "archive"|"warn"|"ban" }`.

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/services/api/reports.ts` | `fetchReports()` (`GET /reports`), `createReport(payload)` (`POST /reports`), `updateReportAction(reportId, action)` (`PATCH /reports/{id}`) — `ReportAction = "archive" \| "warn" \| "ban"` |
| `src/hooks/useReports.ts` | `useReports()` — query simples de todas as denúncias; `useCreateReport()` — mutation com callbacks `onSuccess`/`onError` por chamada, invalida `queryKeys.reports()` no sucesso; `useUpdateReportAction()` — mesma forma, para a ação de moderação |
| `src/hooks/__tests__/useReports.test.tsx` | Cobre leitura, criação (sucesso/erro) e atualização de ação, seguindo o mesmo padrão de mock de `fetch` por rota usado em `useRatings.test.tsx` |

### Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `src/services/adapters/report.ts` | Ganhou `ReportCreatePayload` (`reported_user_id`, `match_id?`, `reason`, `description`) — `toReport` não mudou, o adapter de leitura já estava correto desde a comparação de contrato da sessão 18 |
| `src/screens/AdminDashboardScreen.tsx` | Troca `useReportsContext().reports` por `useReports().reports` |
| `src/screens/ReportDetailScreen.tsx` | `ACTIONS` migrado de `{ status, label, message }` para `{ action, label, message }`; `handleAction` chama `updateReportAction(reportId, action, { onSuccess: () => navigation.goBack() })` em vez de mutar estado local e navegar incondicionalmente |
| `src/screens/ReportUserScreen.tsx` | Troca `useReportsContext().addReport` por `useCreateReport().submitReport`; monta só o payload de criação esperado pelo backend (reporter vem do JWT, não é mais montado no cliente); botão de envio ganha `loading={isSubmitting}`; erro de rede exibido inline (mesmo padrão de `RateUserScreen`) |
| `App.tsx` | `ReportsProvider` removido da árvore de providers |
| `src/screens/__tests__/AdminDashboardScreen.test.tsx`, `ReportDetailScreen.test.tsx`, `ReportUserScreen.test.tsx` | Reescritos para mockar `fetch` (via `createQueryWrapper`) em vez de `jest.mock("../../contexts/ReportsContext")` |

### Arquivos removidos

- `src/contexts/ReportsContext.tsx` — funcionalidade migrada integralmente para `useReports.ts`.
  `src/mocks/reports.ts` **mantido** como fixture de teste, mesmo padrão de `messages`/`ratings`
  (só será removido na 13.9, quando não houver mais nenhum Context mockado no projeto).

### Decisões não óbvias

- **D23 (picker de "partida relacionada" em `ReportUserScreen`) segue em aberto** — a Fase 13.5
  já havia zerado esse array (`userMatches: MatchRef[] = []`) por falta de um endpoint
  "partidas em comum com o usuário X" no backend. A Fase 13.8 não resolve isso: migrar
  `ReportsContext` para a API real não cria esse endpoint, então o comportamento observável
  (seção "Partida relacionada" nunca aparece) continua igual. D23 permanece como dívida aberta,
  não como algo que "seria automaticamente resolvido" pela sub-fase — só um novo endpoint no
  backend resolve de fato.
- **Botão de ação usa `Button.loading`, não um estado de disabled manual** — mesmo padrão já
  estabelecido em `RateUserScreen` (Fase 13.7): callbacks opcionais por chamada de mutation em vez
  de mudar a assinatura pública do hook, mantendo `useCreateReport()`/`useUpdateReportAction()`
  simples de usar em qualquer tela futura que precise do mesmo fluxo.
- **CRLF→LF (D4) tocou ~13 arquivos fora do escopo desta sessão** — rodar `npm run lint:fix`
  também normalizou arquivos de sessões anteriores (`RatingStars.tsx`, `user.ts`, `types/index.ts`
  etc.) que ainda tinham CRLF puro. Confirmado via `git diff --ignore-space-at-eol` que não havia
  mudança de conteúdo real — esses arquivos foram deixados de fora do commit da Fase 13.8 (ficam
  como diff pendente no working tree, ver Checkpoint da sessão) para não misturar uma limpeza de
  line-ending genérica com uma mudança de feature específica.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (após `lint:fix` para CRLF→LF, D4
pré-existente — nenhuma mudança de conteúdo real nos arquivos só normalizados, confirmado via
`git diff --ignore-space-at-eol`) · `npm run test` 256/256 passando (252 pré-existentes + 4 novos
em `useReports.test.tsx`) · `npx expo export` (ver seção de build desta sessão de fechamento).

### Estado ao final da sessão 27

- Branch `feat/reports-real`, criada a partir de `dev`. Commit `ef67176` — escopo da Fase 13.8
  apenas (o diff de CRLF→LF em arquivos de sessões anteriores foi deixado fora do commit,
  intencionalmente, ver decisão acima).
- Item 15 da fila concluído — **Fase 13.8 (Denúncias reais) inteiramente concluída**. Fase 13 em
  15/16.
- Dívida D14 resolvida. Nenhuma dívida nova identificada nesta sessão (D23 permanece em aberto,
  sem mudança de status — ver decisão acima).
- Próxima tarefa: item 16 da fila — teste manual ponta a ponta contra o backend local, depois
  contra a URL de produção do Railway; apontar `EXPO_PUBLIC_API_URL` para
  `https://squadup-api.up.railway.app`; ajustar o texto do TCC conforme a decisão D-A (Fase 13.9,
  última tarefa da Fase 13 — ver `.status/backend-contract.md` §6 para o detalhe completo).
- Nenhum bug pendente — parada é limpa, entre tarefas. Ver Checkpoint no fim do `queue.md`/mensagem
  de fechamento desta sessão para o estado exato do working tree (diff de CRLF pendente, não
  commitado).

---

## Sessão 28 — 2026-07-16

### Auditoria de D17/D18 — já implementadas, sem código novo

Antes de iniciar qualquer trabalho, uma auditoria do código confirmou que **D17** (ações de
organizador: encerrar partida e aprovar participante pendente) e **D18** (filtros de `date`/
`location`) já estavam implementadas — `MatchDetailScreen`/`ParticipantList`/
`useMatchParticipation` já tinham os botões e chamadas reais (`POST /matches/{id}/close`,
`POST /matches/{id}/participants/{userId}/approve`); `FiltersScreen`/`MatchFiltersContext`/
`MatchesContext` já coletavam e enviavam `date`/`location` para `GET /matches`. Nenhuma dessas
sub-fases precisou de mudança de código — só a fila (`queue.md`) estava desatualizada, sem marcar
os itens como concluídos. Um artefato transitório do editor (texto solto antes do primeiro
`import` de `HomeScreen.tsx`, que quebrava `tsc --noEmit`) foi corrigido, mas não chegou a ser
commitado — o `HEAD` do repositório já estava correto (o problema existia só no buffer do IDE
aberto naquele momento).

### Item 16 (Fase 13.9) — teste ponta a ponta via API real

Sem acesso a dispositivo/browser interativo no ambiente desta sessão, o teste manual foi feito
via chamadas diretas à API REST contra o backend local (`squadup-back`, branch `dev`, subido
localmente com `uvicorn`). Fluxo completo validado, contrato por contrato:

- Registro (idade obrigatória, D15) → login (JWT) → `GET /users/me` (boot de sessão).
- `GET /matches` — `MatchSummary` (`organizer_id`/`confirmed_count`/`available_slots`) bate 1:1
  com o adapter do front.
- `GET /matches/{id}` — `MatchDetail` com `organizer`/`participants` expandidos.
- `POST /matches/{id}/join` — testado com e sem `requires_approval`.
- `POST /matches/{id}/participants/{userId}/approve` (D17) — `confirmed_count` 0→1 confirmado.
- `POST /matches/{id}/close` (D17) — `status` → `closed` confirmado.
- Mensagem de sistema automática ao criar partida (D-D) — `"Partida criada. Bem-vindos!"`
  confirmada no histórico do chat sem nenhuma geração no cliente.
- `POST`/`GET /matches/{id}/messages` — chat funcionando.
- `POST /matches/{id}/ratings/{userId}` — **regra de negócio descoberta**: tanto quem avalia
  quanto quem é avaliado precisam ter participado da partida como `confirmed` — o organizador
  **não** é participante automático da própria partida, precisa dar `join` como qualquer outro
  usuário para poder avaliar ou ser avaliado depois. Não é um bug, é como o backend já modela a
  regra; só não estava documentado no front.
- `GET /users/{id}/ratings` — contrato `MatchRef` embutido (D-C) confirmado.
- `POST /reports` — criação com `reason`/`description`/`match_id` opcional.
- `PATCH /reports/{id}` — RBAC confirmado (`403 ADMIN_ONLY` para usuário comum), validando D14
  do lado da autorização.

`npm run web` também validado de pé (bundle Metro servindo HTML/título "SquadUp" corretos) contra
o backend local e, na sequência, com `.env` local reapontado para
`https://squadup-api.up.railway.app` (produção, `GET /health` 200 confirmado).

**Não testado nesta sessão:** navegação real pela UI via cliques/formulários/Alerts — mesma
limitação da tarefa 12.3 (falta dispositivo/browser interativo no ambiente). Coberto
parcialmente mais tarde na sessão pelas capturas de tela via Playwright (ver abaixo), que
validam a navegação real da UI para as 8 telas cobertas, incluindo login/senha reais.

### Fase 12.8 — EAS Build (parcial) + Trilha D — screenshots do TCC

**`eas.json` criado** (não existia antes): perfis `development` (client de dev, APK interno),
`preview` (APK interno, `EXPO_PUBLIC_API_URL` já apontando para produção) e `production`
(`autoIncrement`, mesma URL de produção). Falta `npx eas login` (credenciais do usuário) +
`eas build:configure` (gera `projectId` em `app.json`) + rodar o build de fato — ação do
usuário, não executável neste ambiente.

**Trilha D (`plano-de-entrega.md` §5.1):** instalado `@playwright/test` como dev dependency
(`npm install -D @playwright/test` + `npx playwright install chromium`). Criado
`scripts/capture-tcc-screenshots.ts` + `scripts/playwright.config.ts` (viewport 393×852,
simulando um celular). O script faz login real (usuário de teste `screenshots.tcc@squadup.dev`
cadastrado no backend local) e navega a UI de verdade via `npm run web`, capturando 8 telas em
`tcc/assets/app/`: `welcome`, `login`, `feed-principal`, `filtros`, `detalhes-partida`,
`chat-partida`, `criar-partida`, `perfil`. A senha do usuário de teste é passada via variável de
ambiente (`TCC_SCREENSHOT_PASSWORD`), não hardcoded no script (corrigido após aviso do linter do
editor, `typescript:S2068`). Rodado duas vezes na sessão (uma vez para gerar, outra para validar
reprodutibilidade) — resultado idêntico nas duas execuções.

Ficam de fora do script (fora do escopo automatizável, ver `plano-de-entrega.md` §5.1/§5.2):
screenshots de `cadastro`, `avaliacao`, `denunciar`, `moderacao` — fluxos que dependem de
`Alert.alert`, que não renderiza em `react-native-web` (D11) — e os screenshots de apps
concorrentes (ação manual do usuário, não é possível navegar apps de terceiros).

`.gitignore` ganhou `test-results/`/`playwright-report/` (artefatos do Playwright).

### Decisões não óbvias

- **Item 16 marcado 🟢 mesmo sem navegação manual pela UI** — a parte que depende de
  código/infraestrutura (contrato ponta a ponta validado via API real, `.env` apontado para
  produção) está encerrada; a navegação manual real fica coberta pela mesma tarefa 12.3
  (dispositivo do usuário), evitando duplicar a mesma pendência em dois lugares da fila.
- **Regra "avaliador também precisa ter participado"** não estava documentada em nenhum lugar do
  front antes desta sessão — só foi descoberta testando o fluxo de ratings via API real. Vale
  para qualquer tela futura que assuma que o organizador pode avaliar sem ter entrado na própria
  partida.
- **Usuários de teste de sessão (`teste.e2e.*@squadup.dev`, `screenshots.tcc@squadup.dev`) e as
  partidas extras criadas por eles ficaram no banco SQLite local** (`squadup-back/squadup.db`,
  fora deste repositório) — não afeta produção (Railway usa Postgres separado), mas quem rodar o
  backend local de novo vai ver esses registros de teste no `GET /matches`.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros · `npm run test` 256/256 passando ·
`npx expo export` (ver seção de build desta sessão de fechamento, mensagem de encerramento).

### Estado ao final da sessão 28

- Branch `feat/organizer-actions-and-filters`, criada a partir de `dev`. Dois commits:
  `0ffd84a` (docs: D17/D18 + teste E2E via API) e `1e45317` (feat: eas.json + screenshots do TCC).
- Fase 13 **16/16 — inteiramente concluída** (item 16/13.9 fechado nesta sessão, ver decisão
  acima). Fase 12 em 6/8, com 12.8 avançada para 🟡 (falta só a parte que exige login/credenciais
  do usuário).
- Nenhuma dívida técnica nova identificada; D17 e D18 marcadas "Resolvida" (já estavam
  implementadas, sem mudança de código).
- Branch **não mergeada em `dev`** ainda — sem PR aberto, aguardando revisão do usuário.
- Próxima tarefa: usuário decidir entre (a) revisar/mergear a branch atual, (b) rodar
  `npx eas login` + `eas build:configure` + o build de fato (12.8), (c) testar em Expo Go/
  dispositivo físico (12.3), ou (d) avançar a Trilha E (texto do TCC — casos de uso extras,
  correção da decisão D-A sobre geolocalização/"Local").
- Nenhum bug pendente — parada é limpa, entre tarefas.

---

## Sessão 31 — 2026-07-28

### Fase 14.1 — Geolocalização real (item 5 da tabela de `queue.md`)

Primeiro código da Fase 14 do lado do front (sessões 29/30 tinham sido só planejamento e
sincronização de documentação — backend, PR #50). Escopo desta sessão: só o item 5
(`useDeviceLocation` + `CreateMatchScreen` envia coordenadas + tipos/adapters), não os itens 6
(`FiltersScreen`/`MatchCard`) e 7 (push).

| Arquivo | Mudança |
|---|---|
| `package.json`/`package-lock.json` | `npx expo install expo-location` |
| `app.json` | `ios.infoPlist.NSLocationWhenInUseUsageDescription`; `android.permissions: ["ACCESS_COARSE_LOCATION"]`; plugin `expo-location` com a mensagem de uso (D-Geo-4: só "balanced", sem `ACCESS_FINE_LOCATION`) |
| `src/hooks/useDeviceLocation.ts` (novo) | Pede permissão via `requestForegroundPermissionsAsync`; captura `latitude`/`longitude` com `Location.Accuracy.Balanced`; retorna `{ location, permissionDenied, isLoading, requestLocation }`; nunca lança — resolve `location: null` em negação ou erro (D-Geo-3) |
| `src/screens/CreateMatchScreen.tsx` | `useEffect` chama `requestLocation()` ao montar; `handleSubmit` inclui `latitude`/`longitude` no payload via spread condicional só quando `deviceLocation` não é `null` |
| `src/services/api/matches.ts` | `CreateMatchPayload` ganha `latitude?`/`longitude?` (opcionais — coordenadas nunca bloqueiam a criação) |
| `src/types/index.ts` | `MatchSummary` ganha `latitude: number \| null` e `longitude: number \| null` (herdados por `MatchDetail`) |
| `src/services/adapters/types.ts` | `ApiMatchSummary` ganha `latitude?`/`longitude?: number \| null` (opcionais no lado da API — aditivo, não quebra respostas antigas) |
| `src/services/adapters/match.ts` | `toMatchSummary` mapeia com fallback `?? null` |
| `src/mocks/matches.ts` | `MatchSeed` ganha `latitude?`/`longitude?` com default `null` em `toMatchDetail` — evitou editar as 13 fixtures uma a uma |

### Decisões não óbvias

- **`useDeviceLocation` não é chamado automaticamente pelo próprio hook** — é a tela consumidora
  (`CreateMatchScreen`) que decide chamar `requestLocation()` num `useEffect` de montagem. Isso
  mantém o hook reutilizável para o padrão diferente que `FiltersScreen` vai precisar no item 6
  (disparado por um toggle, não por montagem).
- **`MatchSeed` (mocks) ganhou `latitude`/`longitude` opcionais com default `null` em vez de exigir
  o campo em todas as 13 partidas mockadas** — mesma técnica já usada para `organizerId`/
  `confirmedCount`/`availableSlots` nesse arquivo; evita um diff de 26 linhas só de boilerplate.
- **`ApiMatchSummary.latitude`/`longitude` são opcionais (`?:`), não só nuláveis** — ao contrário
  de `MatchSummary` (sempre presentes no tipo do front). Motivo: o backend em produção
  (`squadup-api.up.railway.app`) ainda não rodou a migration desta fase (ver nota em
  `roadmap.md` §20) — uma resposta real de produção pode simplesmente omitir os campos até lá, e
  o adapter (`api.latitude ?? null`) já cobre esse caso sem precisar de mudança futura.

### Dívidas técnicas identificadas

| # | Item | Prioridade | Descrição |
|---|------|-----------|-----------|
| D26 | `CreateMatchScreen` não dá feedback visual quando a localização não pôde ser capturada | Baixa | Comportamento correto por desenho (D-Geo-3 — geolocalização é estritamente aditiva, criar partida nunca deve travar por causa disso), mas se o usuário nega a permissão ou o GPS falha, a partida é criada normalmente sem nenhum aviso de que as coordenadas não foram enviadas. Nice-to-have: um texto discreto (ex.: "Localização não disponível — partida será criada sem coordenadas") quando `permissionDenied` for `true`. Não bloqueante para a Fase 14. |

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros · `npm run test` **263/263** passando
(9 testes novos: `useDeviceLocation.test.ts`, 3 casos de geolocalização em
`CreateMatchScreen.test.tsx`, 2 casos de latitude/longitude em `match.test.ts` — o restante do
delta são os ajustes de fixtures existentes que passaram a exigir os campos novos).

### Estado ao final da sessão 31

- Trabalho feito direto sobre `dev` local, depois movido para a branch `feat/device-location`
  antes do commit de fechamento (ver mensagem de encerramento desta sessão para o hash).
- Fase 14: 5/8 (backend 1–4 + este item 5). Itens 6 (`FiltersScreen`/`MatchCard`/`distanceKm`) e
  7 (push) seguem em 0%.
- Uma dívida técnica nova, D26 (baixa prioridade, não bloqueante).
- Próxima tarefa concreta: item 6 — `FiltersScreen` ganha toggle "Usar minha localização" + raio
  de busca; `useMatchFilters`/`MatchesContext` propagam `lat`/`lng`/`radius_km`; `MatchCard`
  exibe a distância a partir do campo `distance_km` que o backend já devolve pronto — isso exige
  primeiro adicionar `distanceKm: number | null` a `MatchSummary`/`ApiMatchSummary` (ainda não
  feito, só `latitude`/`longitude` entraram nesta sessão).
- Nenhum bug pendente — parada é limpa, entre tarefas.

---

## Sessão 32 — 2026-07-28

### Fase 14.1 — Filtro de proximidade (item 6 da tabela de `queue.md`)

Branch `feat/match-distance-filter`, criada a partir de `dev` (que já tinha o item 5 mergeado via
PR #10). Escopo: fechar o item 6 — `distanceKm` nos tipos, toggle + raio em `FiltersScreen`,
propagação condicional em `MatchesContext`, distância exibida no `MatchCard`.

| Arquivo | Mudança |
|---|---|
| `src/types/index.ts` | `MatchSummary` ganha `distanceKm: number \| null` (herdado por `MatchDetail`) |
| `src/services/adapters/types.ts` | `ApiMatchSummary` ganha `distance_km?: number \| null` |
| `src/services/adapters/match.ts` | `toMatchSummary` mapeia `distanceKm: api.distance_km ?? null` |
| `src/services/api/matches.ts` | `MatchesQueryFilters` ganha `latitude`/`longitude`/`radiusKm`; `buildQueryString` só adiciona `lat`/`lng`/`radius_km` quando `latitude` **e** `longitude` estão presentes (`radius_km` só se também informado) |
| `src/contexts/MatchFiltersContext.tsx` | `MatchFilters` ganha `nearMe: boolean`, `latitude`/`longitude: number \| null`, `radiusKm: number` (novo `DEFAULT_RADIUS_KM = 20`, exportado); `activeFilterCount` conta `nearMe` |
| `src/contexts/MatchesContext.tsx` | `fetchMatches` só recebe `latitude`/`longitude`/`radiusKm` reais quando `filters.nearMe` é `true` (senão `null`) |
| `src/screens/FiltersScreen.tsx` | Toggle "Usar minha localização" (`useDeviceLocation`) + chips de raio (5/10/20/50 km); `handleClear` reseta os campos novos |
| `src/components/MatchCard.tsx` | `formatDistance()` local + texto de distância anexado à linha de local (`" · 3,2 km"`) quando `distanceKm` não é `null` |
| `src/mocks/matches.ts` | `MatchSeed`/`toMatchDetail` ganham `distanceKm: null` (sempre, mocks nunca têm distância real) |

### Decisões não óbvias

- **Chips de raio em vez de slider** — o roadmap original sugeria um "input/slider de raio";
  optei por 4 chips discretos (5/10/20/50 km, reaproveitando o componente `Chip` já existente)
  em vez de instalar `@react-native-community/slider` (dependência nova só para isso) ou simular
  um slider com `PanResponder`. Trade-off consciente: menos granularidade, zero dependência nova,
  mesmo padrão visual já usado para esporte/nível na mesma tela.
- **Sincronização de localização não usa `useEffect`** — a primeira versão copiava
  `location.latitude`/`longitude` do hook para o estado local via `setState` dentro de um
  `useEffect` (`[location]`), e o mesmo padrão fazia o `useEffect` de `[permissionDenied]`
  reverter `nearMe` para `false` automaticamente. O lint (`react-hooks/set-state-in-effect`,
  regra nova/mais estrita do projeto) rejeitou os dois como "cascading renders". Refeito sem
  nenhum `useEffect`: as coordenadas finais só são computadas dentro de `handleApply`, lendo
  `location` do hook diretamente (`location?.latitude ?? local.latitude` — prefere a leitura
  fresca do GPS, cai para a coordenada já aplicada antes se o hook ainda não resolveu). Efeito
  colateral **desejável**: permissão negada não reverte mais o toggle sozinha, só mostra um
  aviso (`local.nearMe && permissionDenied`) — a busca aplica sem coordenadas, mesmo princípio de
  fallback gracioso da D26 (D-Geo-3: geolocalização nunca trava um fluxo).
- **`distanceKm` sempre `null` nos mocks** (`src/mocks/matches.ts`) — é um valor 100% derivado do
  backend (Haversine contra a posição do usuário na query), não faz sentido fabricar um valor
  fixo nos dados de teste/fixture.

### Dívidas técnicas identificadas

Nenhuma nova. D26 (já existente, sessão 31) segue válida e sem mudança — é especificamente sobre
`CreateMatchScreen`, não sobre `FiltersScreen` (que já trata o caso de permissão negada nesta
sessão).

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (incluindo a correção do
`react-hooks/set-state-in-effect` acima) · `npm run test` **278/278** passando (39 suítes; 15
testes novos: `src/services/api/__tests__/matches.test.ts` — 4 casos de `buildQueryString`;
`src/screens/__tests__/FiltersScreen.test.tsx` — 8 casos de toggle/raio/aplicar/permissão negada;
2 casos novos em `MatchCard.test.tsx`; 1 caso novo em `adapters/match.test.ts`; o restante do
delta são fixtures existentes — `useMatchFilters.test.ts`, `queryKeys.test.ts` — ajustadas aos
campos novos de `MatchFilters`).

### Estado ao final da sessão 32

- Branch `feat/match-distance-filter`, criada a partir de `dev` (que já continha o item 5,
  mergeado via PR #10). Commit de fechamento desta sessão: ver mensagem de encerramento.
- Fase 14: 6/8 (backend 1–4 + itens 5–6 do front). Resta o item 7 (push) e o item 8 (hardening
  conjunto em dispositivo físico).
- Nenhuma dívida técnica nova.
- Próxima tarefa concreta: item 7 — `useNotificationRegistration` (`src/hooks/`, novo): instalar
  `expo-notifications`/`expo-device`/`expo-constants`, pedir permissão, obter o `ExpoPushToken`
  (via `projectId` do EAS — depende de 12.8 já ter rodado `eas build:configure`, ainda pendente
  de ação do usuário), registrar via novo `POST /users/me/push-token` (`src/services/api/users.ts`)
  uma única vez após login/restauração de sessão bem-sucedidos (`AuthContext`); listener de
  notificação tocada (`Notifications.addNotificationResponseReceivedListener`) no root do app,
  navegando para `MatchChatScreen`/`MatchDetailScreen` conforme o `data` da notificação.
- Nenhum bug pendente — parada é limpa, entre tarefas.

---

## Sessão 33 — 2026-07-28

### Fase 12.8 + Fase 14.2 — EAS project configurado + notificações push reais (item 7 da tabela de `queue.md`)

Sessão iniciada com o usuário rodando `eas login`/`eas whoami`/`eas build:configure` no próprio
terminal (não executável neste ambiente — precisa das credenciais reais da conta Expo). Resultado:
projeto `@guilhermefreire7/squadup` criado no EAS, `projectId` `0032bb63-f809-42d2-baba-6d62bc2b61b0`
gravado em `app.json` (`expo.extra.eas.projectId`) — destrava a tarefa 12.8 (só falta rodar o build
de fato) e o item 7 desta fase (`ExpoPushToken` depende desse `projectId`).

Branch `feat/push-notifications`, criada a partir de `feat/match-distance-filter` (que já tinha o
item 6 committed, ainda não mergeado em `dev`).

| Arquivo | Mudança |
|---|---|
| `package.json`/`package-lock.json` | `npx expo install expo-notifications expo-device expo-constants` |
| `app.json` | `extra.eas.projectId` novo; plugin `expo-notifications` adicionado a `plugins`; **revertido** um efeito colateral do `eas build:configure` que duplicou `ACCESS_COARSE_LOCATION` e adicionou `ACCESS_FINE_LOCATION` às permissões Android (contraria D-Geo-4 — ver D27) |
| `src/services/api/users.ts` | `registerPushToken(token)` → `POST /users/me/push-token` com `{ token }` |
| `src/hooks/useNotificationRegistration.ts` (novo) | `registerForPushNotifications()`: `Device.isDevice` → permissão (`getPermissionsAsync`/`requestPermissionsAsync`) → `projectId` de `expo-constants` → `getExpoPushTokenAsync` → `registerPushToken`; nunca lança (D-Push-3); também registra `Notifications.setNotificationHandler` no module load (sem isso, notificação em primeiro plano não mostra banner no iOS) |
| `src/contexts/AuthContext.tsx` | `useEffect` em `[isAuthenticated]` chama `registerForPushNotifications()` uma vez quando vira `true` — cobre login, cadastro (`completeProfile`) e boot restaurado num único ponto, em vez de 3 chamadas duplicadas nos call sites |
| `src/navigation/navigationRef.ts` (novo) | `navigationRef` (`createNavigationContainerRef`) + `navigateFromPushNotification(data)`: `new_message`→`MatchChat`, `match_closed`/`participation_approved`→`MatchDetail` |
| `src/navigation/RootNavigator.tsx` | `NavigationContainer` ganha `ref={navigationRef}`; novo hook interno `usePushNotificationNavigation` registra `Notifications.addNotificationResponseReceivedListener` uma vez no mount, valida o formato de `data` antes de navegar |

### Decisões não óbvias

- **Contrato de `data` da notificação não precisou ser "definido junto com o backend" (como o
  roadmap previa) — já existia, pronto, no código do backend.** Lido diretamente em
  `squadup-back/app/services/message_service.py`/`match_service.py` (sibling directory, acessível
  neste ambiente): `{"type": "new_message" | "match_closed" | "participation_approved", "matchId":
  match.id}`. Evitou qualquer suposição — o mapeamento tela-por-tipo em `navigationRef.ts` reflete
  exatamente os 3 `background_tasks.add_task(send_push, ...)` do backend.
- **Registro de push consolidado num único `useEffect` em `AuthContext`** em vez de chamar
  `registerForPushNotifications()` separadamente em `login`, `completeProfile` e no boot —
  os três já convergem para `setIsAuthenticated(true)`, então um efeito assistindo essa transição
  cobre os três casos sem duplicar a chamada nem arriscar esquecer um call site novo no futuro.
- **`react-hooks/set-state-in-effect` não se aplica aqui** (diferente do desvio da sessão 32): o
  `useEffect` em `AuthContext` chama uma função assíncrona que fala com um sistema externo
  (rede/permissão do SO), não faz `setState` local síncrono — é exatamente o padrão que a regra
  do lint permite (efeito colateral externo), então não precisou de nenhum contorno.
- **`app.json` do `eas build:configure` teve que ser corrigido manualmente** (ver D27, `queue.md`)
  — o CLI reescreveu `android.permissions` de forma agressiva, adicionando
  `ACCESS_FINE_LOCATION`, que o projeto tinha deliberadamente evitado (D-Geo-4, sessão 31: só
  precisão "balanced"). Revertido para `["ACCESS_COARSE_LOCATION"]` antes de commitar.
- **Teste de `navigateFromPushNotification` usa `jest.spyOn(navigationRef, ...)` no objeto real**,
  não mockando `@react-navigation/native` inteiro — a primeira tentativa (mockar
  `createNavigationContainerRef` via `jest.mock` com closure sobre variáveis `mock*`) falhou com
  `TypeError: navigationRef.isReady is not a function` sem uma causa raiz óbvia; espionar o
  objeto real exportado por `navigationRef.ts` (que é só um objeto plano com métodos) é mais
  simples e não depende de acertar a forma exata do mock do módulo inteiro.
- **`expo-device`/`Device.isDevice` não pôde ser mutado em runtime via `(Device as any).isDevice =
  false`** dentro de um teste — a interop do Babel para `import * as Device` parece copiar a
  propriedade por valor em vez de manter uma referência viva ao objeto mockado. Resolvido com um
  getter no factory do `jest.mock` (`get isDevice() { return mockIsDevice; }`), reavaliado a cada
  acesso — mesmo princípio do padrão já usado em `CreateMatchScreen.test.tsx` para
  `useDeviceLocation`, só que para uma propriedade em vez de uma função.
- **Push remoto não funciona mais no Expo Go desde o SDK 53** — confirmado por um aviso do
  próprio `expo-notifications` nos logs de teste (`console.warn`, não erro): "Android Push
  notifications ... removed from Expo Go with the release of SDK 53. Use a development build
  instead." A tarefa 14.3 (hardening) precisa de um development/preview build via EAS, não só de
  Expo Go — atualizado no `roadmap.md` §20.

### Dívidas técnicas identificadas

| # | Item | Prioridade | Descrição |
|---|------|-----------|-----------|
| D27 | `eas build:configure` reescreve `android.permissions` em `app.json` | Baixa | Ver detalhe completo em `queue.md`. Resumo: adicionou `ACCESS_FINE_LOCATION` (contraria D-Geo-4), corrigido nesta sessão; conferir o diff de `app.json` se `eas build:configure`/`eas build` rodarem de novo no futuro. |

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros · `npm run test` **289/289** passando
(41 suítes; 12 testes novos: `useNotificationRegistration.test.ts` — 7 casos [permissão concedida/
pedida/negada, não-device, sem projectId, `getExpoPushTokenAsync` falha, `registerPushToken`
falha]; `navigationRef.test.ts` — 4 casos [não pronta, e os 3 mapeamentos de tipo]; o restante do
delta é o smoke test de `App.test.tsx`/`AuthContext.test.tsx`, que já passavam e continuam
passando com os novos imports carregados) · `npx expo export --platform web` gera o bundle sem
erros (951 módulos, até então 807 — cresceu com as 3 dependências novas).

### Estado ao final da sessão 33

- Branch `feat/push-notifications`, criada a partir de `feat/match-distance-filter` (commit local
  `3c3573f`, item 6, ainda não mergeado em `dev`). Commit desta sessão: `460fd35`.
- Fase 14: **7/8** (backend 1–4 + front itens 5–6–7). Falta só o item 8 (hardening ponta a ponta
  em dispositivo físico) — única tarefa restante de toda a Fase 14.
- Fase 12.8 avançou: `projectId` do EAS gerado (ação do usuário) — falta só rodar
  `eas build --platform android --profile preview` de fato.
- Uma dívida técnica nova, D27 (baixa prioridade, já com o código corrigido — o registro é só
  para lembrar de conferir `app.json` se `eas`/`eas build:configure` rodarem de novo).
- Nenhum bug pendente — parada é limpa, entre tarefas. **Nenhuma das duas branches locais
  (`feat/match-distance-filter`, `feat/push-notifications`) foi mergeada em `dev` ainda** — ambas
  aguardando revisão/merge do usuário, na ordem em que foram criadas.

---

## Sessão 34 — 2026-07-28

### D28 — `CURRENT_USER`/`MOCK_USERS`/`MOCK_RATINGS` em 7 telas (bug de alta gravidade, achado e corrigido)

Sessão iniciada com o usuário rodando `eas login`/`eas build:configure`/`eas build` (branches
`feat/match-distance-filter` e `feat/push-notifications` já mergeadas em `dev` via GitHub —
PRs #11/#12 — nesta sessão, pelo usuário). Ao responder "vai rodar tudo, cadastrar conta nova e
ficar funcional?", uma auditoria rápida de `grep CURRENT_USER src/screens` revelou que 7 telas
ainda liam um usuário/avaliações **mockados** em vez do usuário real autenticado — resquício da
Fase 13 (só `RateUserScreen`/`PostMatchRatingScreen` tinham sido migrados na época).

**Efeito prático antes da correção:** "Meu Perfil" sempre mostrava o mock; "Editar perfil" não
salvava nada de verdade; organizador real nunca via "Encerrar partida"/"Aprovar participante";
status de participação errado; mensagens próprias apareciam como "de outra pessoa" no chat; e o
mais grave — **`PublicProfileScreen`/`ReportUserScreen` mostravam "Usuário não encontrado" para
qualquer participante real** (procuravam por `MOCK_USERS.find(id)`, que só tem 6 IDs fixos,
nunca um UUID real do backend). Isso quebrava silenciosamente "ver perfil de participante" e,
por consequência, "denunciar usuário" (só alcançável a partir do perfil público).

| Arquivo | Mudança |
|---|---|
| `src/services/api/users.ts` | Novo `fetchPublicProfile(userId)` → `GET /users/{userId}`; `UpdateMyProfilePayload` expandida (`name`/`bio`/`location`/`favorite_sports` além de `level`/`photo_url` — o backend (`UserUpdate` schema) sempre aceitou todos, só o tipo do front estava incompleto) |
| `src/hooks/usePublicProfile.ts` (novo) | `useQuery` + `toPublicUser`, mesmo padrão de `useMatchDetail` |
| `src/hooks/useMatchParticipation.ts` | `currentUser` agora aceita `PublicUser \| null` (antes exigia não-nulo) — `userStatus` vira `null` com segurança quando `user` ainda não carregou |
| `src/contexts/AuthContext.tsx` | Novo método `updateProfile(data)`: chama `updateMyProfile` e atualiza o `user` local via `setUser(toMyProfile(...))` |
| `src/screens/HomeScreen.tsx` | Saudação/avatar: `CURRENT_USER` → `useAuth().user` |
| `src/screens/MatchChatScreen.tsx` | `isOwn` (estilo da bolha): `CURRENT_USER.id` → `user?.id` |
| `src/screens/MatchDetailScreen.tsx` | `isOrganizer` e `useMatchParticipation`: `CURRENT_USER` → `useAuth().user` |
| `src/screens/MyProfileScreen.tsx` | `CURRENT_USER` + `MOCK_RATINGS.filter` → `useAuth().user` + `useUserRatings(user.id)` |
| `src/screens/PublicProfileScreen.tsx` | `MOCK_USERS.find`/`MOCK_RATINGS.filter` → `usePublicProfile(userId)` + `useUserRatings(userId)`, com estado de carregamento novo |
| `src/screens/ReportUserScreen.tsx` | `MOCK_USERS.find` → `usePublicProfile(userId)`, com estado de carregamento novo |
| `src/screens/EditProfileScreen.tsx` | Componente dividido em `EditProfileForm` (recebe `user` não-nulo) + `EditProfileScreen` (busca `useAuth().user`, `return null` se ainda não logado); `handleSave` virou `async`, chama `updateProfile(...)` de verdade em vez de só mostrar um `Alert` fake; botão ganhou estado `loading` |

### Decisões não óbvias

- **`useMatchParticipation` aceita `null` em vez de exigir um "usuário vazio" fake** — a
  alternativa (criar um `PublicUser` dummy só para satisfazer o tipo enquanto `useAuth().user`
  ainda não resolveu) foi descartada por ser um hack; o hook já sabia lidar com "sem match"
  (`match` nulo), então estender o mesmo padrão para "sem usuário" foi a solução mais limpa —
  `userStatus` fica `null` e as ações (`join`/`cancel`/`close`/`approve`) continuam funcionando
  normalmente assim que `user` resolve (o que, na prática, é sempre antes do primeiro render útil,
  já que a tela só monta dentro do `AppNavigator`, autenticado).
- **`EditProfileScreen` dividida em dois componentes** — `useState(user.name)` (e os outros campos)
  precisa de um `user` garantidamente não-nulo no momento em que os hooks de estado são
  inicializados; um `if (!user) return null` no meio do componente, antes desses `useState`,
  violaria a regra de hooks (número de hooks variável entre renders). Separar em
  `EditProfileScreen` (guarda + busca o usuário) → `EditProfileForm` (recebe `user` tipado como
  não-nulo via prop) evita isso sem gambiarra de valores default.
- **Teste de `usePublicProfile`/`useUserRatings` não foi criado como arquivo dedicado** — os dois
  hooks são wrappers finos de `useQuery` já testados indiretamente pelas telas que os consomem
  (`PublicProfileScreen.test.tsx`, `ReportUserScreen.test.tsx`, `useRatings.test.tsx` já cobre
  `useUserRatings`); mesma lógica de granularidade de teste já aplicada a `useMatchDetail` (sem
  teste dedicado, coberto via `MatchDetailScreen.test.tsx`) nas sessões anteriores.
- **Fixtures de `ApiPublicUser`/`ApiRating` reconstruídas manualmente nos testes** (em vez de
  importar `MOCK_USERS`/`MOCK_RATINGS`) — os testes agora simulam a API real (`snake_case`,
  `GET /users/{id}`), então usar os mocks do front (`camelCase`, dados de UI) misturaria as duas
  camadas; os valores foram copiados de `src/mocks/users.ts`/`ratings.ts` só para manter as
  mesmas asserções de texto (nomes, bios, comentários) que os testes originais já verificavam.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros · `npm run test` **289/289** passando
(3 suítes reescritas — `MatchDetailScreen.test.tsx` ganhou um mock de `useAuth`;
`PublicProfileScreen.test.tsx` e `ReportUserScreen.test.tsx` migraram de leitura síncrona de
mocks para `createQueryWrapper` + fetch mockado por URL, já que os dados agora vêm de
`useQuery`) · `npx expo export --platform web` gera o bundle sem erros.

### Estado ao final da sessão 34

- Nova branch `fix/real-user-profile-data`, criada a partir de `feat/push-notifications` (que já
  tinha sido mergeada em `dev` via PR #12 nesta sessão, então equivale a partir de `dev`).
- Fase 14 segue em 7/8 — este bug não fazia parte do escopo da Fase 14, foi achado ao validar se
  o app "fica funcional com conta nova" antes da apresentação.
- Uma dívida técnica nova, D28, já **resolvida** no mesmo commit desta sessão.
- ~~Próxima tarefa: nenhuma de código — resta revisar/mergear `fix/real-user-profile-data`~~ —
  mergeada pelo usuário via PR #13 ainda na mesma sessão (ver continuação abaixo).

### Continuação — hardening real em dispositivo físico (item 8 da Fase 14, sessão 34)

A sessão continuou com o usuário instalando builds sucessivas do APK (`eas build --platform
android --profile preview`) num Android real — a primeira validação de ponta a ponta em
dispositivo físico de todo o projeto. Cada rodada de teste encontrou um bug novo, corrigido e
seguido de uma nova build (fila do EAS variou de ~15min a ~2h30 por rodada — **nunca alterar
código e pedir pro usuário testar sem antes rodar `tsc`/`lint`/`test`/`expo export` localmente**,
o custo de uma rodada errada é alto). Ordem cronológica:

**1. App abria e fechava sozinho (crash instantâneo) — D29.** Causa encontrada sem
adivinhação: no próprio log da build EAS (fase `RUN_EXPO_DOCTOR`), `expo-font` (peer dependency
de `@expo/vector-icons`, usado em quase toda tela) nunca tinha sido instalado como dependência
direta — só existia de forma transitiva, em duas versões conflitantes. `npx expo install
expo-font` + `npx expo install --fix` (também realinhou `expo`/`babel-preset-expo`/`@types/jest`
às versões esperadas pelo SDK 54) — `npx expo-doctor` foi de 15/18 para **18/18 checks**.

**2. Teclado cobria os campos de senha/data; teclado numérico não tinha "/" — D30, corrigida
de fato só em D31.** Primeira passada (D30): `formatDateInput` (`src/utils/date.ts`) insere as
barras automaticamente; `KeyboardAvoidingView` adicionado em 8 telas com `behavior="height"` no
Android. **Não resolveu** — usuário testou de novo e o teclado continuou cobrindo o campo.
Segunda passada (D31), desta vez pesquisando a causa raiz antes de tentar de novo (via
`WebSearch`/`WebFetch`, não adivinhação): `edgeToEdgeEnabled: true` (já ativo no projeto) muda
como o Android lida com teclado a partir do SDK 54/RN 0.81, e a recomendação oficial da Expo é
`behavior={undefined}` no Android, não `"height"` (docs.expo.dev/guides/keyboard-handling).
Corrigido nas 9 telas (as 8 do D30 + `MatchChatScreen`, que já tinha o mesmo problema antes desta
sessão); `app.json` ganhou `android.softwareKeyboardLayoutMode: "resize"`.

**3. Cadastro ficava irrecuperável após falha parcial — D31 (junto com o item acima).**
`completeProfile` não sobrevivia a uma falha entre `POST /auth/register` (sucesso) e o passo
seguinte (login/PATCH) falhando por instabilidade real de rede — a conta já existia no backend,
mas o usuário via um erro genérico e a nova tentativa batia em `EMAIL_ALREADY_REGISTERED` sem
conseguir prosseguir. Corrigido: captura esse código específico e segue para o login em vez de
propagar o erro.

**4. "Network Request Failed" no cadastro — D32.** Antes de mudar qualquer código, os logs reais
do Railway foram checados (a pedido, `GET /health`/`POST /auth/register`/`/login` respondendo
normalmente perto do horário do teste) — confirmou que **não era bug determinístico**, era queda
pontual de rede do dispositivo. O usuário apontou corretamente que o app deveria absorver isso
sozinho: `fetchWithNetworkRetry` (novo, `client.ts`) tenta de novo até 2x (600ms de espera) só
quando o `fetch()` falha antes de qualquer resposta chegar — nunca em cima de uma resposta HTTP
já recebida. Benefício sistêmico: vale para toda chamada da API, não só cadastro.

**5. Mesma falha com e-mail novo — D33.** O usuário suspeitou (corretamente, em espírito) que o
problema fosse o payload/contrato, não rede, e pediu pra validar o fluxo contra o backend.
Comparando `RegisterScreen`/`services/api/auth.ts` linha a linha contra `app/schemas/auth.py`
(`RegisterRequest`): **a senha exige mínimo 8 caracteres no backend, o front só validava 6** —
uma senha de 6–7 caracteres passava no app e era rejeitada com `422` pelo backend. Como o FastAPI
usa um formato de erro diferente do nosso (`detail` em lista de `{loc, msg, type}`, não
`{code, message}`), esse `422` caía no fallback genérico `UNKNOWN_ERROR` — escondendo a causa
real. Corrigido: `RegisterScreen` exige 8+ agora; `parseErrorPayload` ganhou
`fromValidationErrors`, que reconhece o formato de lista do FastAPI e monta uma mensagem legível
(ex.: `"password: String should have at least 8 characters"`). Resto do contrato de registro
(`name`/`age`/`location`/`favorite_sports`/enums `Sport`/`ExperienceLevel`) conferido sem
mismatch.

**6. Auditoria de dívidas técnicas a pedido do usuário.** Antes de decidir sobre mais uma build,
o usuário pediu pra avaliar se valia a pena resolver as dívidas técnicas abertas primeiro.
Reauditadas `D1`–`D33`: todas as abertas são **Baixa** prioridade (nenhuma é candidata a bug
bloqueante) — duas entradas (`D8`, `D16`) estavam marcadas "Média" mas já tinham sido resolvidas
há sessões, só nunca marcadas como tal; corrigido o texto. Recomendação dada: o risco real não
está na lista de dívidas conhecidas, está nos trechos do app ainda não testados de verdade num
dispositivo (criar partida, chat, geo, push) — resolver dívidas de baixa prioridade não reduz
esse risco.

### Builds EAS geradas nesta sessão (ordem cronológica)

| # | Commit | Resultado no dispositivo |
|---|--------|---------------------------|
| 1 | `068d440` (antes do D29) | App abria e fechava sozinho — crash de boot (D29) |
| 2 | `3558689` (D29) | Não testado isoladamente — próxima rodada já incluía D30 |
| 3 | `fd3b98d` (D29+D30) | Data digitável, mas teclado ainda cobria os campos |
| 4 | `9630991` (D29+D30+D31) | Cadastro com "Network Request Failed" (D32) |
| 5 | `3dcd0dd` (D29+D30+D31+D32+D33) | Build finalizada ao fim desta sessão — **ainda não testada no dispositivo** |

### Validação (cada correção, sessão 34 completa)

Todas as 5 correções (D29–D33) passaram por `npx tsc --noEmit` zero erros, `npm run lint` zero
erros, `npm run test` (foi de 289 → **302 testes**, todos passando) e `npx expo export
--platform web` sem erros antes de cada build ser disparada — nenhuma rodada pulou o gate de
qualidade do CLAUDE.md §5 mesmo sob pressão de tempo.

### Estado ao final da sessão 34 (fechamento)

- Branch `dev`, working tree limpo, todos os commits desta sessão já em `dev` (sem PR — commitado
  direto, dado o caráter de hotfix urgente e sequencial dessas correções).
- **Build EAS mais recente (`fa25bd21`, commit `3dcd0dd`) finalizada, aguardando teste do usuário
  no dispositivo físico** — ainda não confirmado se o cadastro completa de ponta a ponta.
- Fase 14 seguirá em 7/8 até o item 8 (hardening) ser confirmado como concluído — o que exige o
  usuário completar um teste real de: cadastro → criar partida → chat → filtro de proximidade →
  push, tudo numa passada, com a build `fa25bd21`.
- Um item novo para acompanhar (não é dívida técnica de código, é observação de processo): cada
  bug encontrado em dispositivo físico custou uma rodada de build (15min–2h30 de fila) — vale
  reservar tempo de sobra antes da apresentação para absorver mais 1–2 rodadas, caso os fluxos
  ainda não testados (criar partida, chat, geo, push) revelem algo novo.
- Nenhum bug pendente do lado do código — tudo que foi encontrado foi corrigido e validado. A
  única pendência é a confirmação do usuário testando a build mais recente.

---

## Sessão 35 — 2026-07-30

### Limpeza de dívidas técnicas de baixa prioridade

A pedido do usuário ("quero tratar as dívidas técnicas uma a uma"), enquanto o item 8 da Fase 14
segue aguardando teste do usuário na build `fa25bd21`. Das dívidas abertas em `queue.md`
(D2, D3, D7, D10, D11, D22, D23, D25, D27, D24, D26, D34, mais D4/D13 que já existiam desde as
sessões 1/17), só as acionáveis por código nesta sessão — sem depender de upgrade de dependência,
endpoint novo no backend ou decisão de escopo da demo — foram resolvidas: **D4, D13, D24, D26,
D34**. As demais (D2, D3, D7, D10, D11, D22, D23, D25, D27) permanecem em aberto por desenho —
são notas de observação, não bugs pendentes.

| Dívida | Correção |
|---|---|
| **D4** — CRLF vs LF | Novo `.editorconfig` na raiz (`end_of_line = lf`, `insert_final_newline`, `trim_trailing_whitespace`, `indent_size = 2`, exceção para `*.md`) — solução definitiva que a entrada original já apontava, substitui o hábito manual de `npm run lint:fix` ao fim de cada sessão. |
| **D13** — selo de verificado sem `accessibilityLabel` | `accessibilityLabel="Verificado"` adicionado ao ícone `check-decagram` nos 6 arquivos citados na dívida original: `ParticipantList.tsx`, `MatchDetailScreen.tsx`, `PublicProfileScreen.tsx`, `MyProfileScreen.tsx`, `RateUserScreen.tsx`, `PostMatchRatingScreen.tsx`. `TrustBadges.tsx` (usa o mesmo ícone) não precisou de mudança — já tem o texto "Verificado" visível ao lado, então já era acessível. |
| **D26** — `CreateMatchScreen` sem feedback quando a localização falha | Novo estado `locationChecked` em `CreateMatchScreen`, setado quando a promise de `requestLocation()` (chamada no mount) resolve — evita o texto piscar antes da primeira tentativa. `showLocationWarning = locationChecked && !isLocationLoading && !deviceLocation` controla um aviso discreto ("Localização não disponível — partida será criada sem coordenadas") logo abaixo do campo Local. Não bloqueia a criação da partida, mantendo o princípio de D-Geo-3 (geolocalização estritamente aditiva). |
| **D34** — `validateEmail` mais permissiva que o `EmailStr` do backend | Função duplicada em `RegisterScreen.tsx`/`LoginScreen.tsx` (`email.length > 0 && email.includes("@")`) extraída para `src/utils/validation.ts`, com regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` que exige domínio com TLD — mesma classe de exigência do `EmailStr` (Pydantic) do backend. Casos como `"a@b"`, antes aceitos pelo front e só rejeitados pelo backend com `422`, agora são barrados já na validação local. |
| **D24** — erro `NOT_MATCH_PARTICIPANT` sem mensagem clara | `useSubmitRating` (`src/hooks/useRatings.ts`) parou de descartar o `error` do `onError` do `useMutation` — agora repassa (`onError: (error) => callbacks?.onError?.(error)`) para quem chama. `RateUserScreen.handleSubmit` passou a checar `error instanceof ApiError && error.code === "NOT_MATCH_PARTICIPANT"` e mostrar uma mensagem específica ("Você e este participante precisam ter entrado na partida...") em vez do fallback genérico "Não foi possível enviar a avaliação". `PostMatchRatingScreen` não precisou de mudança — só lista participantes e navega para `RateUserScreen`, não envia avaliação diretamente. |

### Decisões não óbvias

- **Não tocamos nas dívidas informativas** (D2, D3, D7, D10, D11, D22, D23, D25, D27) — todas
  descrevem um estado esperado que só muda com um evento externo (upgrade do NativeWind, upgrade
  do React, endpoint novo no backend, decisão consciente de trade-off para a demo). "Resolver" seria
  só apagar a entrada sem mudar comportamento nenhum, o que apagaria contexto útil para quando esse
  evento externo acontecer.
- **`showLocationWarning` usa um estado dedicado (`locationChecked`) em vez de inferir "terminou"
  só de `!isLoading`** — no primeiro render, antes do `useEffect` disparar `requestLocation()`,
  `isLoading` já começa `false` (estado inicial do hook), o que faria o aviso piscar por um frame
  antes da checagem real começar. Um `Promise.finally` dedicado evita esse falso positivo.
- **Teste de `CreateMatchScreen` precisou de ajuste**: o mock de `useDeviceLocation` no arquivo de
  teste declarava `requestLocation: jest.fn()` sem `mockResolvedValue`, o que quebrou ao introduzir
  `.finally()` na chamada real (`Cannot read properties of undefined (reading 'finally')`) — o mock
  nunca precisou respeitar o contrato `Promise<void>` do hook real até agora. Corrigido no
  `beforeEach` do teste (`mockRequestLocation.mockResolvedValue(undefined)`), alinhando o mock ao
  hook de verdade em vez de mudar a implementação da tela para acomodar um mock incompleto.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros (1 ajuste automático via
`npm run lint:fix` em `CreateMatchScreen.tsx`, quebra de linha de destructuring) · `npm run test`
foi de **302 → 309 testes**, todos passando (7 novos: 4 em `src/utils/__tests__/validation.test.ts`,
1 em `useRatings.test.tsx` confirmando o passthrough do `code` do `ApiError`, 2 em
`CreateMatchScreen.test.tsx` cobrindo o aviso de localização visível/ausente) · `npx expo export
--platform web` gera o bundle sem erros.

### Estado do repositório ao final da sessão 35

- Nova branch `chore/tech-debt-cleanup`, criada a partir de `dev` (que estava com working tree
  limpo, no commit `2693487` — fechamento da sessão 34).
- Commit `941f001`: as 5 correções de código + testes (16 arquivos).
- Um segundo commit fecha esta sessão com a sincronização de `.status/` (este arquivo,
  `queue.md`, `roadmap.md`, `README.md`) — ver hash no commit `docs: fecha sessão 35` em
  `git log`.
- Branch **não mergeada nem enviada ao remoto** — aguardando revisão/decisão do usuário.
- Nenhum requisito novo ou dívida técnica nova surgiu durante o trabalho desta sessão.
- Fase 14 inalterada (segue 7/8) — esta sessão não tocou no item 8 (hardening em dispositivo).
  A build EAS `fa25bd21` (commit `3dcd0dd`, já em `dev`) **não inclui** as correções desta sessão
  (são mudanças de UI/validação em JS, sem dependência nativa nova — não obrigam build EAS nova
  por si só, mas os ajustes só aparecerão num dispositivo depois que esta branch for mergeada e
  uma build nova for gerada).
- **Próxima tarefa concreta:** (1) revisar e decidir sobre o merge de `chore/tech-debt-cleanup`
  em `dev`; (2) retomar o teste de ponta a ponta da build `fa25bd21` (cadastro → criar partida →
  chat → filtro de proximidade → push) para finalmente fechar o item 8 da Fase 14 — continua sendo
  o único bloqueador real do projeto, sem nenhum bug de código pendente do lado do front.

---

## Sessão 38 — 2026-10-26

### Fase 15 — Polimento visual

A pedido do usuário, para a apresentação à banca (dezembro): visual mais profissional e
consistente, sem mudar comportamento. Fluxo em 4 fases, com parada após a auditoria para
aprovação dos tokens. Decisões do usuário: manter a fonte do sistema (sem `expo-font` nem build
EAS nova); títulos "Criar partida"/"Meu perfil" em caixa de frase; abas raiz com o mesmo `Header`
grande; prints "antes" guardados fora do repositório.

| Commit | Fase | Conteúdo |
|---|---|---|
| `6373615` | Tokens | `neutral` removido (87 usos migrados para `secondary`); semânticas viram escalas (`-50` / `DEFAULT` / `-700`); `error` passa a #DC2626; cores `sport-*` no Tailwind; tipografia semântica; raios `control`/`card`; sombras reduzidas a `card`/`overlay` (sai o brilho azul `cta`) |
| `e4e1aa5` | Componentes | Button (estados, `danger` suave, `busy`), Input (erro/desabilitado), Header (`large` com `rightElement`), Badge, Chip, TrustBadges, MatchCard, novos `SlotsBar`/`LoadingState`, `RatingStars onDark`; `capture-tcc-screenshots` aceita `TCC_SCREENSHOT_OUT_DIR` |
| `9374316` | Telas | Detalhe com rodapé em coluna, perfis, auth, Home/Busca, Chat, varredura das secundárias, navegadores sem hex |
| `6b4d374` | Entrega | 13 PNGs de `tcc/assets/app/` regenerados, `design-tokens.md`, `queue.md` |

### Bugs corrigidos que não eram só estilo

- **Cor de texto na `View`:** `Badge` (níveis e status) e as pílulas de status de denúncia
  (`STATUS_COLORS` em `utils/reportLabels.ts`) aplicavam `text-*` no container. Em React Native a
  cor não herda para o `Text`, então "Lotada", "Intermediário", "Pendente" etc. saíam em preto.
  `STATUS_COLORS` virou `{ bg, text }`.
- **Rodapé vazio no `MatchCard`:** divisor e espaço de tags eram desenhados mesmo sem tags.
- **Conteúdo coberto no `MatchDetailScreen`:** o rodapé de ações era `absolute` e o scroll
  reservava `paddingBottom: 160`, menor que o rodapé real com 4 itens (~290 px). Agora o rodapé é
  irmão do `ScrollView` numa coluna flex — a rolagem termina onde ele começa, para qualquer
  combinação de botões.

### Decisões não óbvias

- **Peso no token de `fontSize`:** Tailwind 3.4 aceita `fontWeight`/`letterSpacing` na tupla, e o
  NativeWind aplica (verificado no estilo computado via Playwright). `subheading` começou em 600 e
  subiu para 700: semibold a 16 px ficava mais fraco que o bold a 14 px anterior.
- **Carregando ≠ desabilitado no `Button`:** `loading` bloqueia o toque mas mantém a cor da
  variante (`looksDisabled = disabled && !loading`); só `disabled` fica neutro.
- **`danger` suave:** o único uso era "Encerrar partida", que competia com "Chat da partida" em
  vermelho sólido. Efeito colateral: "Enviar denúncia" também ficou suave — levado ao usuário.
- **Ícones de esporte mantêm o tom vivo**, só o texto usa os tons 700: no Welcome os ícones ficam
  sobre fundo escuro, onde o tom escuro sumiria.
- **Teste do `CreateMatchScreen`:** com o título igual ao botão ("Criar partida"), `getByText`
  achava dois elementos. O teste passou a usar `getByRole("button", { name })` — mudança de busca,
  não de expectativa.
- **Costura de 1 px entre `Header` e hero do perfil:** artefato de pixel fracionário entre duas
  Views da mesma cor; resolvido com `-mt-px` no `ScrollView` das telas de perfil, sem mexer no
  `Header` compartilhado.

### Ambiente

- `squadup-back/squadup.db` estava 3 migrations atrás (sem `matches.latitude` → `GET /matches`
  500). Aplicada `0bb63757da75` (coordenadas) e `alembic stamp head`, porque `push_tokens` já
  existia (criada por `create_all`). Backup fora do repositório.
- Screenshots: usuário de teste promovido a `ADMIN` só durante a captura da moderação e revertido.
- `expo start` com `CI=1` desliga o watcher do Metro — o bundle fica congelado no estado do
  início. Rodar sem `CI=1` ao iterar em visual.

### Validação

`npx tsc --noEmit` zero erros · `npm run lint` zero erros reais (só `␍` do `core.autocrlf`) ·
`npm run test` 314/314 (44 suítes). Na primeira rodada da sessão, antes de qualquer mudança,
5 suítes de tela falharam e passaram isoladas e na rodada seguinte — instabilidade de cache frio
no Windows, não regressão. Revisão visual das 13 telas via Playwright antes do commit final.

### Estado do repositório ao final da sessão 38

Branch `feat/visual-polish` (a partir de `dev` em `1332e9a`), 4 commits + este fechamento de
status. Não mergeada nem enviada ao remoto — aguardando revisão do usuário.

