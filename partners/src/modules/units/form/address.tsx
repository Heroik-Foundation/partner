import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Input } from "@/modules/ui/input";
import { MapPin, X, Search, RotateCcw } from "lucide-react";
import { Button } from "@/modules/ui/button";
import { useMapStore } from "@/stores/maps";

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface LocationResult {
  address: string;
  lat: number;
  lng: number;
}

interface Props {
  placeholder?: string;
  initialValue?: string;
  required?: boolean;
  callback?: (location: LocationResult) => void;
  disabled?: boolean;
  className?: string;
  showResetButton?: boolean;
}

const libraries: "places"[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "450px",
};

const defaultCenter: LatLngLiteral = {
  lat: 37.7749,
  lng: -122.4194,
};

// Get API key from environment
const API_KEY =
  import.meta.env.VITE_GMAPS_API_KEY || import.meta.env.VITE_APP_MAP_KEY;

const MapLocationPicker = ({
  placeholder = "Click to select location",
  initialValue,
  required = false,
  callback,
  disabled = false,
  className = "",
  showResetButton = true,
}: Props) => {
  // Zustand store
  const {
    selectedLocation,
    markerPosition,
    setLocation,
    clearLocation,
    resetStore,
  } = useMapStore();

  // Modal state
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Map state
  const [zoom, setZoom] = useState(12);
  const [location, setMapCenter] = useState<LatLngLiteral>(defaultCenter);
  const [searchValue, setSearchValue] = useState("");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };

  // Map refs
  const mapRef = React.useRef<google.maps.Map>();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(
    null
  );

  const onMapLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }: LatLngLiteral) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(14);
      setMapCenter({ lat, lng });
    }
  }, []);

  // Initialize with persisted data or initialValue
  useEffect(() => {
    if (initialValue && !selectedLocation?.address) {
      setLocation({
        address: initialValue,
        lat: 0,
        lng: 0,
      });
    }
  }, [initialValue, selectedLocation?.address, setLocation]);

  // Call callback when selectedLocation changes
  useEffect(() => {
    if (selectedLocation?.address && callback) {
      callback(selectedLocation);
    }
  }, [selectedLocation?.address, selectedLocation?.lat, selectedLocation?.lng]);

  // Initialize search autocomplete when modal opens
  useEffect(() => {
    if (
      isMapOpen &&
      isLoaded &&
      searchInputRef.current &&
      !autocompleteRef.current
    ) {
      const autocomplete = new google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          types: ["geocode"],
          fields: ["place_id", "formatted_address", "name", "geometry"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || "";

          const locationResult = { address, lat, lng };
          setLocation(locationResult);
          panTo({ lat, lng });
        }
      });

      autocompleteRef.current = autocomplete;
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isMapOpen, isLoaded, panTo, setLocation]);

  // Initialize map location when modal opens
  useEffect(() => {
    if (!isMapOpen) return;

    if (markerPosition) {
      setMapCenter(markerPosition);
      setZoom(16);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLocation);
          setZoom(12);
        },
        () => {
          setMapCenter(defaultCenter);
          setZoom(12);
        }
      );
    }
  }, [isMapOpen, markerPosition]);

  // Event handlers
  const handleOpenMap = useCallback(() => {
    if (!disabled) {
      setIsMapOpen(true);
    }
  }, [disabled]);

  const handleClearLocation = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      clearLocation();
      // Force re-render by clearing search value
      setSearchValue("");
    },
    [clearLocation]
  );

  const handleResetStore = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      // Call the reset function
      resetStore();

      // Clear local state as well
      setSearchValue("");

      // Small delay to ensure persistence is cleared
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Force refresh if needed
      if (callback) {
        callback({ address: "", lat: 0, lng: 0 });
      }
    },
    [resetStore, callback]
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: clickedLat, lng: clickedLng } },
        (results, status) => {
          let address = `${clickedLat.toFixed(6)}, ${clickedLng.toFixed(6)}`;

          if (status === "OK" && results && results[0]) {
            address = results[0].formatted_address;
          }

          const locationResult = { address, lat: clickedLat, lng: clickedLng };
          setLocation(locationResult);
        }
      );
    },
    [setLocation]
  );

  const handleConfirmLocation = useCallback(() => {
    setIsMapOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsMapOpen(false);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsMapOpen(false);
    }
  }, []);

  // Get display value for input
  const getDisplayValue = useCallback(() => {
    if (!selectedLocation?.address) return "";
    if (
      selectedLocation.address === "undefined" ||
      selectedLocation.address === undefined
    )
      return "";
    return selectedLocation.address;
  }, [selectedLocation?.address]);

  // Render modal content
  const renderModal = () => {
    if (!isMapOpen) return null;

    if (loadError) {
      return createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-center text-red-600">Error loading maps</div>
            <div className="mt-4 flex justify-center">
              <Button variant={"secondary"} onClick={handleCancel}>
                Close
              </Button>
            </div>
          </div>
        </div>,
        document.body
      );
    }

    if (!isLoaded) {
      return createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-center">Loading maps...</div>
          </div>
        </div>,
        document.body
      );
    }

    const displayValue = getDisplayValue();

    return createPortal(
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Select Location</h2>
            <div className="flex items-center gap-2">
              {showResetButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetStore}
                  className="mr-2"
                  title="Reset all locations"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b bg-gray-50">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for a location..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Current selection display */}
          {displayValue && (
            <div className="p-4 bg-blue-50 border-b">
              <p className="text-sm text-blue-600">Selected location:</p>
              <p className="font-medium text-blue-900 truncate">
                {displayValue}
              </p>
            </div>
          )}

          {/* Map Container */}
          <div className="relative" style={{ height: "450px" }}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={zoom}
              onLoad={onMapLoad}
              options={options}
              center={location}
              onClick={handleMapClick}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>

            {/* Instructions overlay */}
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-xs">
              <p className="text-sm text-gray-700">
                Click anywhere on the map to select a location, or use the
                search box above.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full bg-white flex justify-between items-center py-3 px-4 border-t flex-shrink-0">
            <Button onClick={handleCancel} variant={"secondary"}>
              Cancel
            </Button>
            <Button onClick={handleConfirmLocation} disabled={!displayValue}>
              Confirm
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const displayValue = getDisplayValue();

  return (
    <>
      {/* Input Trigger */}
      <div className={`relative ${className}`}>
        <Input
          required={required}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onClick={handleOpenMap}
          readOnly
          className={`cursor-pointer ${displayValue ? "pr-20" : "pr-10"} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${!displayValue ? "text-gray-500" : ""}`}
          autoComplete="off"
        />

        {/* Icon container */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {displayValue && !disabled && (
            <>
              {showResetButton && (
                <button
                  type="button"
                  onClick={handleResetStore}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Reset all locations"
                >
                  <RotateCcw className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                </button>
              )}
              <button
                type="button"
                onClick={handleClearLocation}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Clear location"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </>
          )}
          <MapPin
            className={`w-4 h-4 ${disabled ? "text-gray-300" : "text-gray-500"}`}
          />
        </div>
      </div>

      {/* Modal */}
      {renderModal()}
    </>
  );
};

export default MapLocationPicker;
