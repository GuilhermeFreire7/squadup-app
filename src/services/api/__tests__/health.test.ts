import { API_BASE_URL } from "../client";
import { warmUpServer } from "../health";

describe("warmUpServer", () => {
  it("dispara GET /health sem esperar a resposta", () => {
    globalThis.fetch = jest.fn(() => new Promise<Response>(() => undefined)) as jest.Mock;

    expect(warmUpServer()).toBeUndefined();
    expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/health`);
  });

  it("ignora falha de rede (é só um aquecimento)", async () => {
    globalThis.fetch = jest.fn(async () => {
      throw new TypeError("Network request failed");
    }) as jest.Mock;

    warmUpServer();
    await new Promise<void>((resolve) => setImmediate(() => resolve()));

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
