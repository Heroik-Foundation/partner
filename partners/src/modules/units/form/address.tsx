import { Input } from "@/modules/ui/input";
import { useEffect, useRef, useCallback } from "react";

const GMAPS_SCRIPT_URL = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAPS_API_KEY}&libraries=places`;

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
      }, 100);
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

type Props = {
  callback?: (selectedPlace: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  initialValue?: string;
  required?: boolean;
  countryRestriction?: string | string[];
};

const PlaceAutocomplete = ({
  callback,
  placeholder = "Enter a location",
  required = false,
  countryRestriction = "gb",
  initialValue,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.place_id && callback) {
      callback(place);
    }
  }, [callback]);

  useEffect(() => {
    let isMounted = true;

    const initializeAutocomplete = async () => {
      try {
        await loadGoogleMapsScript();
        if (!isMounted || !inputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
            componentRestrictions: { country: countryRestriction },
          }
        );

        autocompleteRef.current = autocomplete;
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
  }, [countryRestriction, handlePlaceChanged]);

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
      />
    </div>
  );
};

export default PlaceAutocomplete;
