import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type Suggestion = { address: string; coordinates: number[] };

const fetchGlobalSuggestions = async (input: string): Promise<Suggestion[]> => {
  if (!input.trim()) return [];

  const apiKey = import.meta.env.VITE_GMAPS_API_KEY;

  try {
    // Step 1: Get place autocomplete predictions (global search)
    const autoRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input,
          types: "(regions)",
          key: apiKey,
          // Removed all region restrictions
          language: "en", // Optional: set preferred language
          components: "country:*", // Search globally
        },
        timeout: 30000,
      }
    );

    const predictions = autoRes.data.predictions || [];
    if (predictions.length === 0) return [];

    // Step 2: Fetch coordinates for each prediction
    const suggestions = await Promise.all(
      predictions.map(async (prediction: any) => {
        try {
          const detailsRes = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
              params: {
                place_id: prediction.place_id,
                fields: "geometry,formatted_address",
                key: apiKey,
              },
              timeout: 30000,
            }
          );

          const { geometry, formatted_address } = detailsRes.data.result;
          return {
            address: formatted_address || prediction.description,
            coordinates: [geometry.location.lat, geometry.location.lng],
          };
        } catch (error) {
          console.error("Error fetching place details:", error);
          return null;
        }
      })
    );

    return suggestions.filter(Boolean) as Suggestion[];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

const useGlobalSuggestions = (input: string) => {
  const [debouncedInput, setDebouncedInput] = useState(input);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [input]);

  return useQuery<Suggestion[], Error>({
    queryKey: ["globalSuggestions", debouncedInput],
    queryFn: () => fetchGlobalSuggestions(debouncedInput),
    enabled: debouncedInput.length > 2,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export default useGlobalSuggestions;
