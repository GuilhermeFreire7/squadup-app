import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as Location from "expo-location";

import { useDeviceLocation } from "../useDeviceLocation";

jest.mock("expo-location", () => ({
  Accuracy: { Balanced: 3 },
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

describe("useDeviceLocation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("captura latitude/longitude quando a permissão é concedida", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: -22.9, longitude: -43.2 },
    });

    const { result } = renderHook(() => useDeviceLocation());

    await act(async () => {
      await result.current.requestLocation();
    });

    await waitFor(() =>
      expect(result.current.location).toEqual({ latitude: -22.9, longitude: -43.2 })
    );
    expect(result.current.permissionDenied).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(Location.getCurrentPositionAsync).toHaveBeenCalledWith({
      accuracy: Location.Accuracy.Balanced,
    });
  });

  it("resolve com location null e permissionDenied quando o usuário nega a permissão", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const { result } = renderHook(() => useDeviceLocation());

    await act(async () => {
      await result.current.requestLocation();
    });

    expect(result.current.location).toBeNull();
    expect(result.current.permissionDenied).toBe(true);
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it("nunca lança erro — resolve com location null se a captura falhar", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(new Error("GPS off"));

    const { result } = renderHook(() => useDeviceLocation());

    await act(async () => {
      await expect(result.current.requestLocation()).resolves.toBeNull();
    });

    expect(result.current.location).toBeNull();
  });

  it("devolve as coordenadas capturadas, além de guardá-las no estado", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: -22.9, longitude: -43.2 },
    });
    const { result } = renderHook(() => useDeviceLocation());

    let returned: unknown;
    await act(async () => {
      returned = await result.current.requestLocation();
    });

    expect(returned).toEqual({ latitude: -22.9, longitude: -43.2 });
  });
});
