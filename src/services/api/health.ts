import { API_BASE_URL } from "./client";

/**
 * Acorda a API sem esperar a resposta. No plano free do Render, o serviço hiberna após ~15 min
 * sem uso, e a primeira requisição leva ~40 s. Chamado ao abrir o app: enquanto o usuário lê a
 * tela inicial ou digita o login, o servidor já vai subindo. Falhas são ignoradas, porque é só
 * um aquecimento; a requisição de verdade tem o próprio tratamento de erro.
 */
export function warmUpServer(): void {
  try {
    fetch(`${API_BASE_URL}/health`).catch(() => undefined);
  } catch {
    // `fetch` indisponível ou lançando de forma síncrona: o aquecimento é dispensável.
  }
}
