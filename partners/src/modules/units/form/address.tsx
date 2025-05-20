import { Input } from "@/modules/ui/input";
import { useEffect, useRef, useState, useCallback } from "react";

const GMAPS_SCRIPT_URL = `https://maps.googleapis.com/maps/api/js?key=${
  import.meta.env.VITE_GMAPS_API_KEY
}&libraries=places`;

const loadGoogleMapsScript = (): Promise<typeof google> => {
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GMAPS_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps script"));

    const cleanup = () => {
      clearTimeout(timeoutId);
      document.head.removeChild(script);
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Google Maps script loading timeout"));
    }, 5000);

    script.onload = () => {
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          cleanup();
          clearInterval(checkInterval);
          resolve(window.google);
        }
      }, 50);
    };

    document.head.appendChild(script);
  });
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
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  const handlePlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    setSelectedPlace(place);
  }, []);

  useEffect(() => {
    let mounted = true;
    let autocomplete: google.maps.places.Autocomplete | undefined;

    const initializeAutocomplete = async () => {
      try {
        await loadGoogleMapsScript();
        if (!mounted || !inputRef.current) return;

        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["geocode"],
          componentRestrictions: { country: countryRestriction },
        });

        autocomplete.addListener("place_changed", handlePlaceChanged);
        autocompleteRef.current = autocomplete;
      } catch (err) {
        console.error("Google Maps initialization error:", err);
      }
    };

    initializeAutocomplete();

    return () => {
      mounted = false;
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
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
