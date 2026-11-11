import { useCallback, useState } from "react";

import { geocodeAddress, reverseGeocode } from "../services/geocoding";
import type { DeviceLocation } from "./useDeviceLocation";

/** De onde vieram as coordenadas enviadas com a partida. */
export type CoordinatesSource = "current-location" | "address" | "device-fallback" | "none";

export interface ResolvedCoordinates {
  coords: DeviceLocation | null;
  source: CoordinatesSource;
}

interface Params {
  deviceLocation: DeviceLocation | null;
  requestLocation: () => Promise<DeviceLocation | null>;
}

export interface UseMatchLocationInputResult {
  text: string;
  setText: (text: string) => void;
  fillFromCurrentLocation: () => Promise<void>;
  isFilling: boolean;
  fillError: string;
  /** Chamado ao criar a partida: escolhe as coordenadas do local do jogo. */
  resolveCoordinates: () => Promise<ResolvedCoordinates>;
}

/**
 * Campo "Local" da criação de partida.
 *
 * As coordenadas precisam ser as do **local do jogo**, não as de onde o organizador está ao criar
 * a partida (antes era sempre a segunda, o que distorcia a busca por proximidade). Ordem:
 * 1. endereço preenchido pelo botão e não editado → a posição atual (o organizador está lá);
 * 2. endereço digitado → as coordenadas desse endereço (geocodificação);
 * 3. endereço não encontrado → a posição do aparelho, como antes (D-Geo-3: nunca bloqueia);
 * 4. sem nada disso → partida sem coordenadas (ainda aparece na busca por texto).
 */
export function useMatchLocationInput({
  deviceLocation,
  requestLocation,
}: Params): UseMatchLocationInputResult {
  const [text, setTextState] = useState("");
  // Coordenadas que geraram o texto atual via botão; zera assim que o usuário edita o texto.
  const [filledFrom, setFilledFrom] = useState<DeviceLocation | null>(null);
  const [isFilling, setIsFilling] = useState(false);
  const [fillError, setFillError] = useState("");

  const setText = useCallback((value: string) => {
    setTextState(value);
    setFilledFrom(null);
    setFillError("");
  }, []);

  const fillFromCurrentLocation = useCallback(async () => {
    setIsFilling(true);
    setFillError("");
    try {
      const coords = deviceLocation ?? (await requestLocation());
      if (!coords) {
        setFillError(
          "Não foi possível obter sua localização. Verifique a permissão ou digite o local."
        );
        return;
      }
      const label = await reverseGeocode(coords);
      if (!label) {
        setFillError("Não encontramos o endereço da sua localização. Digite o local.");
        return;
      }
      setTextState(label);
      setFilledFrom(coords);
    } finally {
      setIsFilling(false);
    }
  }, [deviceLocation, requestLocation]);

  const resolveCoordinates = useCallback(async (): Promise<ResolvedCoordinates> => {
    if (filledFrom) return { coords: filledFrom, source: "current-location" };
    const fromAddress = await geocodeAddress(text);
    if (fromAddress) return { coords: fromAddress, source: "address" };
    if (deviceLocation) return { coords: deviceLocation, source: "device-fallback" };
    return { coords: null, source: "none" };
  }, [filledFrom, text, deviceLocation]);

  return { text, setText, fillFromCurrentLocation, isFilling, fillError, resolveCoordinates };
}
