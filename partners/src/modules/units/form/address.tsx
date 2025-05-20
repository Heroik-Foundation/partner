import { Input } from "@/modules/ui/input";
import { useEffect, useRef, useState } from "react";

const apiKey: string = import.meta.env.VITE_GMAPS_API_KEY;

const loadGoogleMapsScript = (): Promise<typeof google> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      return resolve(window.google);
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait until google.maps.places is available
      const interval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(interval);
          resolve(window.google);
        }
      }, 50);

      // Timeout fallback after 5s
      setTimeout(() => {
        clearInterval(interval);
        reject(
          new Error("Google Maps script loaded but 'places' is still undefined")
        );
      }, 5000);
    };

    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

type Props = {
  callback?: (selectedPlace: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  required?: boolean;
};

const PlaceAutocomplete = (props: Props) => {
  const { callback, placeholder, required } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete;

    loadGoogleMapsScript()
      .then((google) => {
        if (!inputRef.current) return;

        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["geocode"],
          componentRestrictions: { country: "gb" },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          setSelectedPlace(place);
          console.log("Selected Place:", place);
        });
      })
      .catch((err) => {
        console.error("Failed to load Google Maps script:", err);
      });

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedPlace && callback) {
      callback(selectedPlace);
    }
  }, [selectedPlace]);

  return (
    <div className="place-autocomplete">
      <Input
        required={required || false}
        ref={inputRef}
        type="text"
        placeholder={placeholder || "Enter a location"}
      />
    </div>
  );
};

export default PlaceAutocomplete;
