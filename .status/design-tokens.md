# SquadUp — Design tokens

Fonte da verdade: `tailwind.config.js` (classes) e `src/theme/index.ts` (valores em JS para
props `color`, sombras e navegação). Definidos na Fase 15 (sessão 38, branch
`feat/visual-polish`). Fonte: a do sistema (sem `expo-font`, sem build EAS nova).

## Cores

| Papel | Token | Uso |
|---|---|---|
| Ação / interativo | `primary-500` (#2563EB), pressionado `primary-600` | Botões, links, foco, seleção |
| Ativo sobre escuro | `primary-400` | Tab bar ativa |
| Texto sobre azul claro | `primary-700` sobre `primary-50/100` | Selo "Verificado", badge de nível |
| Destaque pontual | `accent-*` (laranja) | Só badges e energia; texto `accent-700` sobre `accent-50/100`. Nunca em botão nem com texto branco |
| Estado | `success` / `warning` / `error` | Fundo `-50`, ícone e barra `DEFAULT`, texto `-700` |
| Esporte | `sport-<esporte>` / `sport-<esporte>-bg` | Texto e fundo de categoria; ícone usa `SPORT_META[s].color` |

**Cinza: só `secondary` (slate).** A escala `neutral` foi removida.

| Tom | Uso |
|---|---|
| 900 | Texto principal, barras escuras (header, tab bar) |
| 700 | Rótulos de formulário, corpo de texto em card |
| 600 | Texto de apoio |
| 500 | Legenda e metadados (mais claro permitido sobre fundo claro) |
| 400 | Só sobre fundo escuro ou ícone decorativo |
| 200 | Borda (inputs, chips, cards em `/70`) |
| 100 | Divisória, fundo de pílula neutra |
| 50 | Fundo de tela |

Contraste (WCAG AA, 4,5:1) verificado para cada combinação usada; as mais justas são
`secondary-500` sobre `secondary-50` (4,55) e `accent-700` sobre `accent-50` (4,88).

## Tipografia

| Token | Tamanho / altura | Peso | Uso |
|---|---|---|---|
| `text-display` | 30 / 36, −0,5 | 700 | Títulos de Welcome, Login, Cadastro |
| `text-title` | 24 / 30, −0,3 | 700 | Título de aba (Header grande), título da partida, nome no perfil, números de estatística |
| `text-heading` | 18 / 24 | 700 | Título do Header compacto, títulos de seção fora de card, EmptyState |
| `text-subheading` | 16 / 22 | 700 | Título de card (`SectionCard`), título no `MatchCard` |
| `text-body` | 16 / 24 | 400 | Conteúdo, campos de formulário |
| `text-body-sm` | 14 / 20 | 400 | Metadados, mensagens de chat, descrições |
| `text-label` | 14 / 20 | 600 | Rótulos de formulário e de grupo, botão `sm`, chips |
| `text-caption` | 12 / 16 | 500 | Horários, contadores, badges |
| `text-overline` | 12 / 16, +0,5 | 700 | Categoria em maiúsculas (esporte · nível, "LOCAL") |

O peso vem no token; `font-*` depois dele sobrescreve. A escala primitiva (`text-xs`…`text-4xl`)
continua disponível para casos pontuais (ex.: iniciais do Avatar).

## Raios

| Token | Valor | Uso |
|---|---|---|
| `rounded-control` | 12 | Botões, inputs, opções segmentadas, blocos de ícone, avisos de estado |
| `rounded-card` | 16 | Cards, painéis, bolhas de chat, fundo do hero do perfil |
| `rounded-full` | — | Chips, badges, avatares, botões só de ícone |

Exceção: checkboxes de 24 px usam `rounded-md` (8), porque 12 num quadrado de 24 parece um radio.

## Espaçamento (base 4)

| Onde | Valor |
|---|---|
| Margem lateral de tela | 20 (`px-5`) |
| Entre cards / seções | 16 (`gap-4`) |
| Padding interno de card | 16 (`p-4`) |
| Título → conteúdo | 12 (`mb-3`) |
| Entre campos de formulário | 16; entre grupos, 24 (`gap-6`) |
| Área de toque mínima | 44 (`h-11` / `min-h-11`, ou `hitSlop` quando o visual é menor) |

## Elevação (`shadows` em `src/theme`)

| Nível | Uso | Valores |
|---|---|---|
| `card` | Cards em repouso | y 2, raio 8, opacidade 0,06, `elevation` 2 |
| `overlay` | Barras fixas, card em destaque (`Card raised`) | y 4, raio 12, opacidade 0,10, `elevation` 8 |

Barras fixas no rodapé também levam `border-t border-secondary-200`, porque no iOS a sombra cai
para baixo e não separaria a barra do conteúdo.

## Estados dos componentes

- **Button:** pressionado escurece um tom e reduz a 98%; desabilitado é neutro
  (`secondary-200` + texto `secondary-500`) em todas as variantes; carregando bloqueia o toque,
  mantém a cor da variante e expõe `accessibilityState.busy`. `danger` é suave (fundo
  `error-50`, texto `error-700`), para não competir com a ação principal.
- **Input:** foco com borda `primary-500`; erro com borda `error`, fundo `error-50` e mensagem
  `error-700` com ícone; desabilitado (`editable={false}`) com fundo `secondary-100`.
- **Chip:** pressionado com fundo `secondary-100`; selecionado preenchido (`primary`) ou
  `error-50` (tom `danger`).
- **Carregamento e vazio:** `LoadingState` e `EmptyState`, com o mesmo enquadramento.
- **Informação nunca só por cor:** a barra de vagas sempre tem texto, e status sempre têm rótulo.
