import { useState, useRef, useEffect, MouseEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import useCountrySuggestions, { Suggestion } from "@/hooks/maps/query";
import { Input } from "@/modules/ui/input";

type Props = {
  name?: string;
  callback?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const AutoCompleteInput = ({ name, callback }: Props) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Use the Google Maps API hook with proper typing
  const {
    data: suggestions = [],
    isLoading,
    isError,
  } = useCountrySuggestions(inputValue);

  // Handle suggestions visibility
  useEffect(() => {
    setIsOpen(inputValue.trim() !== "" && suggestions.length > 0);
    setSelectedIndex(-1);
  }, [suggestions, inputValue]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    //@ts-ignore
    document.addEventListener("mousedown", handleOutsideClick);
    //@ts-ignore
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          setInputValue(suggestions[selectedIndex].address);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Select a suggestion
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setInputValue(suggestion.address);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        className="relative"
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        whileTap={{ scale: 0.98 }}
      >
        <Input
          name={name}
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (callback) {
              callback(e);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setIsOpen(true)}
          placeholder="Search for a country..."
        />
        {inputValue && (
          <motion.button
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setInputValue("");
              inputRef.current?.focus();
            }}
            aria-label="Clear input"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
        {isLoading && (
          <motion.div
            className="absolute right-10 top-2"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.ul
            ref={listRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            aria-labelledby="autocomplete-input"
          >
            {suggestions.map((suggestion, index) => {
              const { address } = suggestion;
              // Highlight the matching part of the text
              const matchIndex = address
                .toLowerCase()
                .indexOf(inputValue.toLowerCase());
              const beforeMatch = address.slice(0, matchIndex);
              const matchText = address.slice(
                matchIndex,
                matchIndex + inputValue.length
              );
              const afterMatch = address.slice(matchIndex + inputValue.length);

              return (
                <motion.li
                  key={address}
                  className={`px-4 py-2 cursor-pointer ${selectedIndex === index ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  {beforeMatch}
                  <span className="font-medium text-blue-600">{matchText}</span>
                  {afterMatch}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
      {isError && (
        <div className="mt-1 text-sm text-red-500">
          Failed to load suggestions. Please try again.
        </div>
      )}
    </div>
  );
};
