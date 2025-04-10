import { Fragment, useState } from "react";
import { Check, AlertCircle, ChevronLeft } from "lucide-react";
import { Label } from "@/modules/ui/label";

export const SecurityPinInput = () => {
  // Define PIN length as a constant
  const MAX_PIN_LENGTH = 4;

  const [input, setInput] = useState<string>("");
  const [confirmInput, setConfirmInput] = useState<string>("");
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [error, setError] = useState<string | null>(null);

  // Create numpad array with numbers 1-9, then 0
  const numpad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  // Handle number input with max length check
  const handleNumberInput = (number: number) => {
    if (step === "create") {
      setInput((prev) => {
        // Prevent adding more digits if max length is reached
        if (prev.length >= MAX_PIN_LENGTH) {
          return prev;
        }
        const newInput = prev + number;

        // Automatically move to confirm step when first PIN is complete
        if (newInput.length === MAX_PIN_LENGTH) {
          setTimeout(() => {
            setStep("confirm");
          }, 300); // Small delay for better UX
        }

        return newInput;
      });
    } else {
      setConfirmInput((prev) => {
        // Prevent adding more digits if max length is reached
        if (prev.length >= MAX_PIN_LENGTH) {
          return prev;
        }
        return prev + number;
      });
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (step === "create") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setConfirmInput((prev) => prev.slice(0, -1));
      setError(null); // Clear error when user makes changes
    }
  };

  // Handle enter/submit
  const handleSubmit = () => {
    if (step === "create") {
      // Only process if PIN meets length requirement
      if (input.length === MAX_PIN_LENGTH) {
        setStep("confirm");
      }
    } else {
      // Verify confirmation PIN
      if (confirmInput.length === MAX_PIN_LENGTH) {
        if (input === confirmInput) {
          // PINs match - successful confirmation
          console.log("PIN confirmed:", input);
          // Reset everything
          setInput("");
          setConfirmInput("");
          setStep("create");
          setError(null);
        } else {
          // PINs don't match - show error
          setError("PINs don't match. Try again.");
          setConfirmInput("");
        }
      }
    }
  };

  // Reset the form and start over
  const handleReset = () => {
    setInput("");
    setConfirmInput("");
    setStep("create");
    setError(null);
  };

  // Determine current active input and length based on step
  const activeInput = step === "create" ? input : confirmInput;
  const isInputComplete =
    step === "create"
      ? input.length === MAX_PIN_LENGTH
      : confirmInput.length === MAX_PIN_LENGTH;

  return (
    <div className="w-full max-w-md mx-auto space-y-10">
      {/* PIN Display */}
      <div className="text-center space-y-5">
        <Label>
          {step === "create" ? "Enter Security PIN" : "Confirm Security PIN"}
        </Label>

        {error && (
          <div className="flex items-center justify-center text-red-500 gap-2 mb-2">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex justify-center gap-5">
          {Array.from({ length: MAX_PIN_LENGTH }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl bg-primary/10">
              <div
                className="h-4 w-4 rounded-full border-2 border-primary"
                style={{
                  backgroundColor:
                    i < activeInput.length ? "currentColor" : "transparent",
                }}
              />
            </div>
          ))}
        </div>

        {step === "confirm" && (
          <button
            onClick={handleReset}
            className="text-sm text-primary underline mt-2"
          >
            Start over
          </button>
        )}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-5">
        {numpad.map((number, index) => {
          // Special case for the last row (to place 0 in the middle)
          if (index === 9) {
            return (
              <Fragment key={number}>
                {/* Backspace button on the left of 0 */}
                <button
                  className="rounded-full h-16 w-16 mx-auto font-bold p-5 bg-red-100 text-red-600 flex items-center justify-center"
                  onClick={handleBackspace}
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Number 0 in the middle */}
                <button
                  className="rounded-full h-16 w-16 mx-auto font-bold p-5 bg-primary/10 text-primary"
                  key={number}
                  disabled={activeInput.length >= MAX_PIN_LENGTH}
                  onClick={() => handleNumberInput(number)}
                  style={{
                    opacity: activeInput.length >= MAX_PIN_LENGTH ? 0.5 : 1,
                  }}
                >
                  {number}
                </button>

                {/* Enter button on the right of 0 */}
                <button
                  className="rounded-full h-16 w-16 mx-auto font-bold p-5 bg-green-100 text-green-600 flex items-center justify-center"
                  onClick={handleSubmit}
                  disabled={!isInputComplete}
                  style={{ opacity: isInputComplete ? 1 : 0.5 }}
                >
                  <Check size={20} />
                </button>
              </Fragment>
            );
          }

          // Numbers 1-9
          return (
            <button
              className="rounded-full h-16 w-16 mx-auto font-bold p-5 bg-primary/10 text-primary"
              key={number}
              onClick={() => handleNumberInput(number)}
              disabled={activeInput.length >= MAX_PIN_LENGTH}
              style={{
                opacity: activeInput.length >= MAX_PIN_LENGTH ? 0.5 : 1,
              }}
            >
              {number}
            </button>
          );
        })}
      </div>
    </div>
  );
};
