// import { Input } from "@/modules/ui/input";
// import { useEffect, useRef, useCallback } from "react";

// const GMAPS_SCRIPT_URL = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAPS_API_KEY}&libraries=places&loading=async&v=beta`;

// let scriptLoadPromise: Promise<typeof google> | null = null;

// const loadGoogleMapsScript = (): Promise<typeof google> => {
//   if (window.google?.maps?.places) return Promise.resolve(window.google);

//   if (scriptLoadPromise) return scriptLoadPromise;

//   scriptLoadPromise = new Promise((resolve, reject) => {
//     const existingScript = document.querySelector<HTMLScriptElement>(
//       `script[src^="https://maps.googleapis.com/maps/api/js"]`
//     );

//     const onLoadCheck = () => {
//       const interval = setInterval(() => {
//         if (window.google?.maps?.places) {
//           clearInterval(interval);
//           resolve(window.google);
//         }
//       }, 100);
//     };

//     if (existingScript) {
//       onLoadCheck();
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = GMAPS_SCRIPT_URL;
//     script.async = true;
//     script.defer = true;

//     const timeoutId = setTimeout(() => {
//       scriptLoadPromise = null;
//       script.remove();
//       reject(new Error("Google Maps script loading timeout"));
//     }, 10000);

//     script.onload = () => {
//       clearTimeout(timeoutId);
//       onLoadCheck();
//     };

//     script.onerror = () => {
//       clearTimeout(timeoutId);
//       scriptLoadPromise = null;
//       reject(new Error("Failed to load Google Maps script"));
//     };

//     document.head.appendChild(script);
//   });

//   return scriptLoadPromise;
// };

// type PlaceResult = {
//   place_id: string;
//   formatted_address: string;
//   name: string;
//   latitude: number;
//   longitude: number;
//   geometry: google.maps.places.PlaceGeometry;
//   place: google.maps.places.PlaceResult;
// };

// type Props = {
//   callback?: (selectedPlace: PlaceResult) => void;
//   onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   initialValue?: string;
//   required?: boolean;
//   countryRestriction?: string | string[];
// };

// const PlaceAutocomplete = ({
//   callback,
//   onChange,
//   placeholder = "Enter a location",
//   required = false,
//   countryRestriction = "gb",
//   initialValue,
// }: Props) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const autocompleteRef = useRef<google.maps.places.Autocomplete | any>(null);
//   const isNewApiRef = useRef<boolean>(false);

//   const handlePlaceChanged = useCallback(() => {
//     const place = autocompleteRef.current?.getPlace();
//     if (place?.place_id && callback) {
//       const latitude = place.geometry?.location?.lat() || 0;
//       const longitude = place.geometry?.location?.lng() || 0;

//       const placeResult: PlaceResult = {
//         place_id: place.place_id,
//         formatted_address: place.formatted_address || "",
//         name: place.name || "",
//         latitude,
//         longitude,
//         geometry: place.geometry!,
//         place: place,
//       };

//       callback(placeResult);
//     }
//   }, [callback]);

//   useEffect(() => {
//     let isMounted = true;

//     const initializeAutocomplete = async () => {
//       try {
//         await loadGoogleMapsScript();
//         if (!isMounted || !inputRef.current) return;

//         // Try to use the new PlaceAutocompleteElement if available
//         try {
//           const { PlaceAutocompleteElement } = (await google.maps.importLibrary(
//             "places"
//           )) as any;

//           // Create the autocomplete element
//           const autocompleteElement = new PlaceAutocompleteElement({
//             types: ["geocode"],
//             componentRestrictions: { country: countryRestriction },
//           });

//           // Connect it to the input
//           if (inputRef.current) {
//             inputRef.current.addEventListener("input", (e) => {
//               autocompleteElement.value = (e.target as HTMLInputElement).value;
//             });
//           }

//           // Listen for place selection
//           autocompleteElement.addEventListener(
//             "gmp-placeselect",
//             (event: any) => {
//               const place = event.detail.place;
//               if (place?.place_id && callback) {
//                 const latitude = place.geometry?.location?.lat() || 0;
//                 const longitude = place.geometry?.location?.lng() || 0;

//                 const placeResult: PlaceResult = {
//                   place_id: place.place_id,
//                   formatted_address: place.formatted_address || "",
//                   name: place.name || "",
//                   latitude,
//                   longitude,
//                   geometry: place.geometry!,
//                   place: place,
//                 };

//                 callback(placeResult);

//                 // Update the input value
//                 if (inputRef.current) {
//                   inputRef.current.value = place.formatted_address || "";
//                 }
//               }
//             }
//           );

//           // Store reference for cleanup
//           autocompleteRef.current = autocompleteElement as any;
//           isNewApiRef.current = true;
//         } catch (newApiError) {
//           console.warn(
//             "PlaceAutocompleteElement not available, falling back to legacy Autocomplete:",
//             newApiError
//           );

//           // Fallback to legacy Autocomplete
//           const autocomplete = new google.maps.places.Autocomplete(
//             inputRef.current,
//             {
//               types: ["geocode"],
//               componentRestrictions: { country: countryRestriction },
//             }
//           );

//           autocompleteRef.current = autocomplete;
//           isNewApiRef.current = false;
//           autocomplete.addListener("place_changed", handlePlaceChanged);
//         }
//       } catch (err) {
//         console.error("Google Maps initialization error:", err);
//       }
//     };

//     initializeAutocomplete();

//     return () => {
//       isMounted = false;
//       if (autocompleteRef.current) {
//         // Clean up based on the type of autocomplete
//         if (isNewApiRef.current) {
//           // New API cleanup - it's a web component, so no special cleanup needed
//           // The event listeners will be cleaned up automatically when the component is removed
//         } else {
//           // Legacy API cleanup
//           google.maps.event.clearInstanceListeners(autocompleteRef.current);
//         }
//         autocompleteRef.current = null;
//       }
//     };
//   }, [countryRestriction, handlePlaceChanged]);

//   useEffect(() => {
//     if (initialValue && inputRef.current) {
//       inputRef.current.value = initialValue;
//     }
//   }, [initialValue]);

//   return (
//     <div className="place-autocomplete">
//       <Input
//         required={required}
//         ref={inputRef}
//         type="text"
//         placeholder={placeholder}
//         onChange={onChange}
//       />
//     </div>
//   );
// };

// export default PlaceAutocomplete;

import { Input } from "@/modules/ui/input";
import { useEffect, useRef, useCallback } from "react";

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
  countryRestriction = "gb",
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

  useEffect(() => {
    let isMounted = true;

    const initializeAutocomplete = async () => {
      try {
        await loadGoogleMapsScript();
        if (!isMounted || !inputRef.current) return;

        // Use the legacy but still supported Autocomplete API
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
