import * as Location from "expo-location";

import { formatAddressLabel, geocodeAddress, reverseGeocode } from "../geocoding";

jest.mock("expo-location", () => ({
  reverseGeocodeAsync: jest.fn(),
  geocodeAsync: jest.fn(),
}));

const reverseMock = Location.reverseGeocodeAsync as jest.Mock;
const geocodeMock = Location.geocodeAsync as jest.Mock;

function address(overrides: Partial<Location.LocationGeocodedAddress> = {}) {
  return {
    street: null,
    streetNumber: null,
    name: null,
    district: null,
    city: null,
    subregion: null,
    region: null,
    postalCode: null,
    country: null,
    isoCountryCode: null,
    timezone: null,
    formattedAddress: null,
    ...overrides,
  } as Location.LocationGeocodedAddress;
}

beforeEach(() => jest.clearAllMocks());

describe("formatAddressLabel", () => {
  it("monta rua, número, bairro e cidade", () => {
    expect(
      formatAddressLabel(
        address({
          street: "Av. Atlântica",
          streetNumber: "1702",
          district: "Copacabana",
          city: "Rio de Janeiro",
        })
      )
    ).toBe("Av. Atlântica, 1702 - Copacabana, Rio de Janeiro");
  });

  it("usa o nome do lugar e a sub-região quando faltam rua e cidade", () => {
    expect(
      formatAddressLabel(address({ name: "Aterro do Flamengo", subregion: "Rio de Janeiro" }))
    ).toBe("Aterro do Flamengo - Rio de Janeiro");
  });

  it("devolve null quando não há nada aproveitável", () => {
    expect(formatAddressLabel(address())).toBeNull();
  });
});

describe("reverseGeocode", () => {
  it("devolve o endereço legível do primeiro resultado", async () => {
    reverseMock.mockResolvedValue([address({ street: "Rua X", city: "Niterói" })]);

    await expect(reverseGeocode({ latitude: -22.9, longitude: -43.1 })).resolves.toBe(
      "Rua X - Niterói"
    );
  });

  it("devolve null se o sistema falhar ou não achar nada", async () => {
    reverseMock.mockRejectedValueOnce(new Error("sem geocoder"));
    await expect(reverseGeocode({ latitude: 0, longitude: 0 })).resolves.toBeNull();

    reverseMock.mockResolvedValueOnce([]);
    await expect(reverseGeocode({ latitude: 0, longitude: 0 })).resolves.toBeNull();
  });

  it("devolve null quando passa do tempo-limite", async () => {
    reverseMock.mockReturnValue(new Promise(() => undefined));

    await expect(reverseGeocode({ latitude: 0, longitude: 0 }, 20)).resolves.toBeNull();
  });
});

describe("geocodeAddress", () => {
  it("devolve as coordenadas do primeiro resultado", async () => {
    geocodeMock.mockResolvedValue([{ latitude: -22.98, longitude: -43.19, accuracy: 10 }]);

    await expect(geocodeAddress("  Copacabana, Posto 4  ")).resolves.toEqual({
      latitude: -22.98,
      longitude: -43.19,
    });
    expect(geocodeMock).toHaveBeenCalledWith("Copacabana, Posto 4");
  });

  it("tenta de novo com o país quando a primeira busca não acha", async () => {
    geocodeMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ latitude: -22.98, longitude: -43.19 }]);

    await expect(geocodeAddress("Posto 4")).resolves.toEqual({
      latitude: -22.98,
      longitude: -43.19,
    });
    expect(geocodeMock).toHaveBeenLastCalledWith("Posto 4, Brasil");
  });

  it("não repete a busca se o texto já cita o país, e ignora texto vazio", async () => {
    geocodeMock.mockResolvedValue([]);

    await expect(geocodeAddress("Rua Y, Brasil")).resolves.toBeNull();
    expect(geocodeMock).toHaveBeenCalledTimes(1);

    await expect(geocodeAddress("   ")).resolves.toBeNull();
    expect(geocodeMock).toHaveBeenCalledTimes(1);
  });
});
