import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface LocationResult {
  address: string;
  lat: number;
  lng: number;
}

interface MapState {
  selectedLocation: LocationResult | null;
  markerPosition: LatLngLiteral | null;

  setLocation: (location: LocationResult) => void;
  setMarkerPosition: (position: LatLngLiteral | null) => void;
  clearLocation: () => void;
  resetStore: () => void;
}

const initialState = {
  selectedLocation: null,
  markerPosition: null,
};

export const useMapStore = create<MapState>()(
  persist(
    (set, _) => ({
      ...initialState,

      setLocation: (location: LocationResult) =>
        set({
          selectedLocation: location,
          markerPosition: { lat: location.lat, lng: location.lng },
        }),

      setMarkerPosition: (position: LatLngLiteral | null) =>
        set({ markerPosition: position }),

      clearLocation: () =>
        set({
          selectedLocation: null,
          markerPosition: null,
        }),

      resetStore: () =>
        set({
          selectedLocation: null,
          markerPosition: null,
        }),
    }),
    {
      name: "map-location-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        markerPosition: state.markerPosition,
      }),
    }
  )
);

export const resetMapStore = () => {
  localStorage.removeItem("map-location-storage");
  useMapStore.setState(initialState);
};
