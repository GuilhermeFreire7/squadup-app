import * as Location from "expo-location";

import type { DeviceLocation } from "../hooks/useDeviceLocation";

/**
 * Geocodificação pelo serviço nativo do sistema (`expo-location`): no Android, o Geocoder do
 * próprio aparelho. Sem chave de API, sem custo e sem mandar o texto digitado a um serviço
 * contratado, o que mantém o espírito da D-Geo-1 (não depender de API paga). Pode não encontrar um
 * endereço ou demorar: por isso tudo aqui devolve `null` em vez de lançar, e tem tempo-limite.
 */

export const GEOCODING_TIMEOUT_MS = 8_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      }
    );
  });
}

/** "Rua X, 123 - Bairro, Cidade" a partir do endereço que o sistema devolve. */
export function formatAddressLabel(address: Location.LocationGeocodedAddress): string | null {
  const street = address.street ?? address.name ?? null;
  const streetLine = street && address.streetNumber ? `${street}, ${address.streetNumber}` : street;
  const city = address.city ?? address.subregion ?? null;
  const area = [address.district, city].filter(Boolean).join(", ");
  const label = [streetLine, area].filter(Boolean).join(" - ");
  return label || null;
}

/** Endereço legível para as coordenadas (usado pelo botão "Usar minha localização atual"). */
export async function reverseGeocode(
  coords: DeviceLocation,
  timeoutMs = GEOCODING_TIMEOUT_MS
): Promise<string | null> {
  const results = await withTimeout(Location.reverseGeocodeAsync(coords), timeoutMs);
  const first = results?.[0];
  return first ? formatAddressLabel(first) : null;
}

async function geocodeOnce(text: string, timeoutMs: number): Promise<DeviceLocation | null> {
  const results = await withTimeout(Location.geocodeAsync(text), timeoutMs);
  const first = results?.[0];
  return first ? { latitude: first.latitude, longitude: first.longitude } : null;
}

/**
 * Coordenadas do endereço digitado (o local do jogo). Se não achar e o texto não citar o país,
 * tenta de novo com ", Brasil": endereços curtos como "Copacabana, Posto 4" são ambíguos sem isso.
 */
export async function geocodeAddress(
  text: string,
  timeoutMs = GEOCODING_TIMEOUT_MS
): Promise<DeviceLocation | null> {
  const query = text.trim();
  if (!query) return null;
  const found = await geocodeOnce(query, timeoutMs);
  if (found || /brasil|brazil/i.test(query)) return found;
  return geocodeOnce(`${query}, Brasil`, timeoutMs);
}
