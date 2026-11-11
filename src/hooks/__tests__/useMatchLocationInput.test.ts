import { act, renderHook } from "@testing-library/react-native";

import { useMatchLocationInput } from "../useMatchLocationInput";

const mockGeocodeAddress = jest.fn();
const mockReverseGeocode = jest.fn();

jest.mock("../../services/geocoding", () => ({
  geocodeAddress: (...args: unknown[]) => mockGeocodeAddress(...args),
  reverseGeocode: (...args: unknown[]) => mockReverseGeocode(...args),
}));

const HERE = { latitude: -22.97, longitude: -43.18 };
const VENUE = { latitude: -22.98, longitude: -43.19 };

function setup(deviceLocation: typeof HERE | null = HERE, requestLocation = jest.fn()) {
  return renderHook(() => useMatchLocationInput({ deviceLocation, requestLocation }));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGeocodeAddress.mockResolvedValue(null);
  mockReverseGeocode.mockResolvedValue(null);
});

describe("useMatchLocationInput — preencher com a localização atual", () => {
  it("preenche o texto com o endereço da posição atual", async () => {
    mockReverseGeocode.mockResolvedValue("Av. Atlântica - Copacabana");
    const { result } = setup();

    await act(async () => result.current.fillFromCurrentLocation());

    expect(mockReverseGeocode).toHaveBeenCalledWith(HERE);
    expect(result.current.text).toBe("Av. Atlântica - Copacabana");
    expect(result.current.fillError).toBe("");
  });

  it("pede a localização quando ainda não tem", async () => {
    mockReverseGeocode.mockResolvedValue("Rua X");
    const requestLocation = jest.fn().mockResolvedValue(HERE);
    const { result } = setup(null, requestLocation);

    await act(async () => result.current.fillFromCurrentLocation());

    expect(requestLocation).toHaveBeenCalledTimes(1);
    expect(result.current.text).toBe("Rua X");
  });

  it("explica o erro quando não há localização", async () => {
    const { result } = setup(null, jest.fn().mockResolvedValue(null));

    await act(async () => result.current.fillFromCurrentLocation());

    expect(result.current.fillError).toMatch(/Não foi possível obter sua localização/);
    expect(result.current.text).toBe("");
  });
});

describe("useMatchLocationInput — coordenadas enviadas", () => {
  it("endereço vindo do botão e não editado: posição atual", async () => {
    mockReverseGeocode.mockResolvedValue("Av. Atlântica - Copacabana");
    const { result } = setup();
    await act(async () => result.current.fillFromCurrentLocation());

    await expect(result.current.resolveCoordinates()).resolves.toEqual({
      coords: HERE,
      source: "current-location",
    });
    expect(mockGeocodeAddress).not.toHaveBeenCalled();
  });

  it("endereço digitado (ou editado depois do botão): coordenadas do endereço", async () => {
    mockReverseGeocode.mockResolvedValue("Av. Atlântica - Copacabana");
    mockGeocodeAddress.mockResolvedValue(VENUE);
    const { result } = setup();
    await act(async () => result.current.fillFromCurrentLocation());
    act(() => result.current.setText("Av. Atlântica, Posto 5"));

    await expect(result.current.resolveCoordinates()).resolves.toEqual({
      coords: VENUE,
      source: "address",
    });
    expect(mockGeocodeAddress).toHaveBeenCalledWith("Av. Atlântica, Posto 5");
  });

  it("endereço não encontrado: posição do aparelho; sem nada: sem coordenadas", async () => {
    const withDevice = setup();
    act(() => withDevice.result.current.setText("Quadra do bairro"));
    await expect(withDevice.result.current.resolveCoordinates()).resolves.toEqual({
      coords: HERE,
      source: "device-fallback",
    });

    const withoutDevice = setup(null);
    act(() => withoutDevice.result.current.setText("Quadra do bairro"));
    await expect(withoutDevice.result.current.resolveCoordinates()).resolves.toEqual({
      coords: null,
      source: "none",
    });
  });
});
