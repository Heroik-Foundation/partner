import { Input } from "@/modules/ui/input";
import { useEffect, useRef, useState, useCallback } from "react";

const GMAPS_SCRIPT_URL = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAPS_API_KEY}&libraries=places`;

let scriptLoadPromise: any = null;

const loadGoogleMapsScript = (): Promise<typeof google> => {
  // Return existing promise if script is already loading
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  // Return immediately if the API is already loaded
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  // Create new promise for script loading
  scriptLoadPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src^="https://maps.googleapis.com/maps/api/js"]`
    );

    if (existingScript) {
      // Script exists but Google object not ready yet, wait for it
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkInterval);
          resolve(window.google);
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = GMAPS_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };

    const timeoutId = setTimeout(() => {
      scriptLoadPromise = null;
      document.head.removeChild(script);
      reject(new Error("Google Maps script loading timeout"));
    }, 10000);

    script.onload = () => {
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearTimeout(timeoutId);
          clearInterval(checkInterval);
          resolve(window.google);
        }
      }, 100);
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
};

type Props = {
  callback?: (selectedPlace: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  required?: boolean;
  countryRestriction?: string | string[];
};

const PlaceAutocomplete = ({
  callback,
  placeholder = "Enter a location",
  required = false,
  countryRestriction = "gb",
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    setSelectedPlace(place);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAutocomplete = async () => {
      try {
        await loadGoogleMapsScript();

        if (!isMounted || !inputRef.current) return;

        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
            componentRestrictions: {
              country: countryRestriction,
            },
          }
        );

        autocompleteRef.current = autocomplete;

        google.maps.event.addListener(
          autocomplete,
          "place_changed",
          handlePlaceChanged
        );
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
  }, [countryRestriction, handlePlaceChanged]);

  useEffect(() => {
    if (selectedPlace && callback) {
      callback(selectedPlace);
    }
  }, [selectedPlace, callback]);

  return (
    <div className="place-autocomplete">
      <Input
        required={required}
        ref={inputRef}
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
};

export default PlaceAutocomplete;
