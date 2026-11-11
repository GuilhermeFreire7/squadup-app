import * as Location from "expo-location";
import { useCallback, useState } from "react";

export interface DeviceLocation {
  latitude: number;
  longitude: number;
}

export interface UseDeviceLocationResult {
  location: DeviceLocation | null;
  permissionDenied: boolean;
  isLoading: boolean;
  /** Pede permissão e captura a posição. Também devolve o resultado, para quem precisa dele na hora
   *  (o estado `location` só reflete o valor novo no próximo render). */
  requestLocation: () => Promise<DeviceLocation | null>;
}

export function useDeviceLocation(): UseDeviceLocationResult {
  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = useCallback(async (): Promise<DeviceLocation | null> => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        setLocation(null);
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setPermissionDenied(false);
      setLocation(coords);
      return coords;
    } catch {
      setLocation(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { location, permissionDenied, isLoading, requestLocation };
}
