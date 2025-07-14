import { Input } from "@/modules/ui/input";
import { useEffect, useRef, useCallback, useMemo } from "react";

const GMAPS_SCRIPT_URL = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAPS_API_KEY}&libraries=places&loading=async`;

let scriptLoadPromise: Promise<typeof google> | null = null;

const loadGoogleMapsScript = (): Promise<typeof google> => {
  if (window.google?.maps?.places) return Promise.resolve(window.google);

  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src^="https://maps.googleapis.com/maps/api/js"]`
    );

    const onLoadCheck = () => {
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(interval);
          resolve(window.google);
        }
      }, 50);
    };

    if (existingScript) {
      onLoadCheck();
      return;
    }

    const script = document.createElement("script");
    script.src = GMAPS_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    const timeoutId = setTimeout(() => {
      scriptLoadPromise = null;
      script.remove();
      reject(new Error("Google Maps script loading timeout"));
    }, 10000);

    script.onload = () => {
      clearTimeout(timeoutId);
      onLoadCheck();
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      scriptLoadPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
};

type PlaceResult = {
  place_id: string;
  formatted_address: string;
  name: string;
  latitude: number;
  longitude: number;
  geometry: google.maps.places.PlaceGeometry;
  place: google.maps.places.PlaceResult;
};

type Props = {
  callback?: (selectedPlace: PlaceResult) => void;
  placeholder?: string;
  initialValue?: string;
  required?: boolean;
  countryRestriction?: string | string[];
};

const PlaceAutocomplete = ({
  callback,
  placeholder = "Enter a location",
  required = false,
  countryRestriction = ["gb", "je", "gg", "im"],
  initialValue,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.place_id && callback) {
      const latitude = place.geometry?.location?.lat() || 0;
      const longitude = place.geometry?.location?.lng() || 0;

      const placeResult: PlaceResult = {
        place_id: place.place_id,
        formatted_address: place.formatted_address || "",
        name: place.name || "",
        latitude,
        longitude,
        geometry: place.geometry!,
        place: place,
      };

      callback(placeResult);
    }
  }, [callback]);

  // Memoize autocomplete options to prevent recreation
  const autocompleteOptions = useMemo(
    () => ({
      types: ["geocode"],
      componentRestrictions: { country: countryRestriction },
      // Performance optimizations
      fields: ["place_id", "formatted_address", "name", "geometry"], // Only fetch needed fields
      strictBounds: false,
    }),
    [countryRestriction]
  );

  useEffect(() => {
    let isMounted = true;

    const initializeAutocomplete = async () => {
      try {
        await loadGoogleMapsScript();
        if (!isMounted || !inputRef.current) return;

        // Enhanced autocomplete with performance options
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          autocompleteOptions
        );

        autocompleteRef.current = autocomplete;

        // Add debouncing by setting bounds (optional performance boost)
        // autocomplete.setBounds(new google.maps.LatLngBounds(
        //   new google.maps.LatLng(-90, -180),
        //   new google.maps.LatLng(90, 180)
        // ));

        autocomplete.addListener("place_changed", handlePlaceChanged);
      } catch (err) {
        console.error("Google Maps initialization error:", err);
      }
    };

    initializeAutocomplete();

    return () => {
      isMounted = false;
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [autocompleteOptions, handlePlaceChanged]);

  useEffect(() => {
    if (initialValue && inputRef.current) {
      inputRef.current.value = initialValue;
    }
  }, [initialValue]);

  return (
    <div className="place-autocomplete">
      <Input
        required={required}
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        // Add performance-oriented input attributes
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
};

export default PlaceAutocomplete;
