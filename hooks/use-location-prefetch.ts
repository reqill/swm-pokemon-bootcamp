import * as Location from 'expo-location';
import { useCallback, useEffect, useRef } from 'react';

type UseLocationPrefetchOptions = {
  enabled: boolean;
  accuracy?: Location.Accuracy;
};

type UseLocationPrefetchResult = {
  getLocation: () => Location.LocationObject | null;
  refreshLocation: () => Promise<void>;
  isLocationAvailable: boolean;
};

export function useLocationPrefetch({
  enabled,
  accuracy = Location.Accuracy.Balanced,
}: UseLocationPrefetchOptions): UseLocationPrefetchResult {
  const cachedLocation = useRef<Location.LocationObject | null>(null);
  const isFetching = useRef(false);
  const hasPermission = useRef(false);

  const fetchLocation = useCallback(async () => {
    if (isFetching.current) return;

    isFetching.current = true;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      hasPermission.current = status === 'granted';

      if (hasPermission.current) {
        const location = await Location.getCurrentPositionAsync({ accuracy });
        cachedLocation.current = location;
      }
    } catch (error) {
      console.warn('Failed to pre-fetch location:', error);
    } finally {
      isFetching.current = false;
    }
  }, [accuracy]);

  useEffect(() => {
    if (enabled) {
      fetchLocation();
    }
  }, [enabled, fetchLocation]);

  const getLocation = useCallback(() => cachedLocation.current, []);

  const refreshLocation = useCallback(async () => {
    await fetchLocation();
  }, [fetchLocation]);

  return {
    getLocation,
    refreshLocation,
    isLocationAvailable: cachedLocation.current !== null,
  };
}
