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

      resetStore: () => {
        localStorage.removeItem("map-location-storage"); // Changed to localStorage
        set(initialState);
      },
    }),
    {
      name: "map-location-storage",
      storage: createJSONStorage(() => localStorage), // Changed to localStorage
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        markerPosition: state.markerPosition,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Handle migration if needed
        }
        return persistedState as MapState;
      },
    }
  )
);
