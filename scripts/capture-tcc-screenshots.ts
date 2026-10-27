/**
 * Captura screenshots das telas do app para o TCC (Trilha D, plano-de-entrega.md §5.1).
 * Roda contra `npm run web` (react-native-web) via Playwright, login real contra a API
 * (EXPO_PUBLIC_API_URL do .env local). Salva em tcc/assets/app/*.png, viewport 393x852.
 *
 * Uso: npx playwright test scripts/capture-tcc-screenshots.ts --config=scripts/playwright.config.ts
 * Pré-requisito: `npm run web` já rodando em http://localhost:8081 e um backend acessível
 * com o usuário de teste abaixo já cadastrado (ver `.status/queue.md`, sessão 28).
 */
import { expect, test } from "@playwright/test";

const BASE_URL = "http://localhost:8081";
// Sobrescrevível para pré-visualizar mudanças de design sem tocar nos PNGs do TCC.
const OUT_DIR = process.env.TCC_SCREENSHOT_OUT_DIR ?? "tcc/assets/app";

const TEST_EMAIL = process.env.TCC_SCREENSHOT_EMAIL ?? "screenshots.tcc@squadup.dev";
const TEST_PASSWORD = process.env.TCC_SCREENSHOT_PASSWORD;

if (!TEST_PASSWORD) {
  throw new Error(
    "Defina TCC_SCREENSHOT_PASSWORD com a senha do usuário de teste antes de rodar este script."
  );
}

/**
 * O dev client do Metro/Expo web injeta, de forma intermitente (não em todo carregamento —
 * não é o LogBox, que no react-native-web é um stub vazio), um badge flutuante quadrado no
 * canto inferior esquerdo. Não é parte da UI do SquadUp e não aparece na build de produção/EAS
 * — só polui o screenshot do TCC. Heurística: elemento fixed/absolute, colado no canto
 * inferior esquerdo, pequeno e aproximadamente quadrado. Exclui explicitamente a aba "Início"
 * da tab bar real (fica na mesma região, mas é bem mais larga que alta).
 */
async function hideDevOverlay(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    const vh = window.innerHeight;
    document.querySelectorAll("body *").forEach((el) => {
      const cs = window.getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "absolute") return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const isBottomLeft = rect.left < 30 && rect.bottom > vh - 20 && rect.bottom <= vh + 5;
      const ratio = rect.width / rect.height;
      const isSmallSquare = rect.width < 90 && rect.height < 90 && ratio > 0.5 && ratio < 2;
      const isNavTab = el.closest('a[href^="/AppTabs"], [role="tab"], [role="tablist"]');
      if (isBottomLeft && isSmallSquare && !isNavTab) {
        (el as HTMLElement).style.setProperty("display", "none", "important");
      }
    });
  });
}

async function shot(page: import("@playwright/test").Page, name: string) {
  await page.waitForTimeout(400);
  await hideDevOverlay(page);
  await page.screenshot({ path: `${OUT_DIR}/${name}.png` });
}

test.describe.configure({ mode: "serial" });

test("captura telas principais do app", async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.getByText("Conecte-se. Jogue. Repita.")).toBeVisible({ timeout: 20000 });
  await shot(page, "welcome");

  // react-native-web nunca desmonta telas anteriores do stack dentro da mesma sessão SPA
  // (cada navegação forward acumula instâncias no DOM) — por isso o cadastro é capturado
  // direto do Welcome, seguido de um reload completo (page.goto) antes de seguir para o
  // login, em vez de navegar Login → Register → Login de volta na mesma sessão.
  await page.getByRole("button", { name: "Criar conta" }).click();
  await expect(page.getByText("Crie sua conta")).toBeVisible({ timeout: 10000 });
  await shot(page, "cadastro");

  await page.goto(BASE_URL);
  await expect(page.getByText("Conecte-se. Jogue. Repita.")).toBeVisible({ timeout: 20000 });

  await page.getByRole("button", { name: "Já tenho conta" }).click();
  await expect(page.getByText("Bem-vindo de volta")).toBeVisible({ timeout: 10000 });
  await shot(page, "login");

  await page.getByLabel("E-mail").fill(TEST_EMAIL);
  await page.getByLabel("Senha").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Partidas próximas")).toBeVisible({ timeout: 20000 });
  await shot(page, "feed-principal");

  await page.getByRole("button", { name: "Abrir filtros" }).click();
  await expect(page.getByText("Filtros", { exact: true })).toBeVisible();
  await shot(page, "filtros");
  await page.getByRole("button", { name: "Fechar filtros" }).click();

  const firstMatchCard = page.locator('[role="button"]').filter({ hasText: "vagas" }).first();
  await firstMatchCard.click();
  await expect(page.getByText("Detalhes da partida")).toBeVisible({ timeout: 10000 });
  await shot(page, "detalhes-partida");

  // scrollIntoViewIfNeeded só garante visibilidade mínima na borda — a barra de ações fixa
  // no rodapé cobre esse trecho; scrollamos mais um pouco pra deixar a seção de
  // organizador/participantes de fato visível acima dela.
  await page.getByText("Organizador", { exact: true }).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 250);
  await shot(page, "detalhes-partida-2");

  const chatButton = page.getByRole("button", { name: "Chat da partida" });
  if (await chatButton.isVisible().catch(() => false)) {
    await chatButton.click();
    await expect(page.getByPlaceholder(/mensagem/i)).toBeVisible({ timeout: 10000 });
    await shot(page, "chat-partida");
  }

  await page.goto(BASE_URL);
  await expect(page.getByText("Partidas próximas")).toBeVisible({ timeout: 20000 });

  await page.getByRole("tab", { name: "Criar partida" }).click();
  await expect(page.getByText("Criar Partida", { exact: true })).toBeVisible({ timeout: 10000 });
  await shot(page, "criar-partida");

  await page.getByRole("tab", { name: "Perfil" }).click();
  await page.waitForTimeout(800);
  await shot(page, "perfil");

  // Avaliação pós-partida e denúncia: usam a partida já encerrada do seed (match-13,
  // "Pelada de maio — encerrada"), organizada pelo usuário de teste, com participantes
  // ainda não avaliados por ele (Thiago Ferreira / Beatriz Rocha). Cada uma navega a partir
  // de um reload completo (goto) + busca, em vez de goBack() dentro da mesma sessão SPA —
  // goBack() não desmonta as telas anteriores do stack neste alvo (react-native-web),
  // causando o mesmo problema de texto duplicado do trecho de cadastro acima.
  async function openClosedMatch() {
    await page.goto(BASE_URL);
    await expect(page.getByText("Partidas próximas")).toBeVisible({ timeout: 20000 });
    await page.getByPlaceholder("Buscar partidas...").fill("encerrada");
    const closedMatchCard = page
      .locator('[role="button"]')
      .filter({ hasText: "Pelada de maio" })
      .first();
    await expect(closedMatchCard).toBeVisible({ timeout: 10000 });
    await closedMatchCard.click();
    await expect(page.getByText("Detalhes da partida")).toBeVisible({ timeout: 10000 });
  }

  await openClosedMatch();
  await page.getByText("Avaliar participantes", { exact: true }).click();
  await expect(page.getByText(/Avalie os participantes desta partida/)).toBeVisible({
    timeout: 10000,
  });
  await page.getByLabel("Avaliar Thiago Ferreira").click();
  await expect(page.getByText("Avaliar participante", { exact: true })).toBeVisible({
    timeout: 10000,
  });
  await shot(page, "avaliacao");

  await openClosedMatch();
  await page.getByLabel("Ver perfil de Beatriz Rocha").click();
  // PublicProfileScreen tem dois botões com o mesmo aria-label (ícone no header + botão
  // de texto no corpo) — .first() pega o ícone do header, ambos levam ao mesmo lugar.
  const reportButton = page.getByRole("button", { name: "Denunciar usuário" }).first();
  await expect(reportButton).toBeVisible({ timeout: 10000 });
  await reportButton.click();
  await expect(page.getByText("Motivo da denúncia", { exact: false })).toBeVisible({
    timeout: 10000,
  });
  await shot(page, "denunciar");

  // Painel administrativo: exige role "admin" no usuário de teste (promovido manualmente
  // no banco antes de rodar este script — ver .status/plano-de-entrega.md §2, "único caso
  // que exige acesso direto ao banco").
  await page.goto(BASE_URL);
  await expect(page.getByText("Partidas próximas")).toBeVisible({ timeout: 20000 });
  await page.getByRole("tab", { name: "Perfil" }).click();
  await page.waitForTimeout(500);
  const adminButton = page.getByText("Painel administrativo", { exact: true });
  if (await adminButton.isVisible().catch(() => false)) {
    await adminButton.click();
    await expect(page.getByText(/denúncia.*pendente/i)).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(600);
    await shot(page, "moderacao");
  }
});
