import { Fragment, useState } from "react";
import { Check, AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import { Label } from "@/modules/ui/label";
import { useUpdateSecurityPinMutation } from "../../hooks/mutation";

export const SecurityPinInput = ({ pinSet }: { pinSet: boolean }) => {
  // Define PIN length as a constant
  const MAX_PIN_LENGTH = 4;

  // Define all possible steps
  type StepType = "create" | "confirm" | "enterOld" | "enterNew" | "confirmNew";

  const [input, setInput] = useState<string>("");
  const [confirmInput, setConfirmInput] = useState<string>("");
  const [oldPin, setOldPin] = useState<string>("");
  const { mutate, isPending } = useUpdateSecurityPinMutation({
    newPin: confirmInput,
    ...(pinSet === true && { oldPin }),
  });

  const [step, setStep] = useState<StepType>(pinSet ? "enterOld" : "create");
  const [error, setError] = useState<string | null>(null);

  const numpad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  const handleNumberInput = (number: number) => {
    if (pinSet) {
      // Handle input for existing PIN workflow
      if (step === "enterOld") {
        setOldPin((prev) => {
          if (prev.length >= MAX_PIN_LENGTH) return prev;

          const newInput = prev + number;

          // Automatically move to next step when old PIN is complete
          if (newInput.length === MAX_PIN_LENGTH) {
            setTimeout(() => {
              setStep("enterNew");
            }, 300);
          }

          return newInput;
        });
      } else if (step === "enterNew") {
        setInput((prev) => {
          if (prev.length >= MAX_PIN_LENGTH) return prev;

          const newInput = prev + number;

          // Automatically move to confirm step when new PIN is complete
          if (newInput.length === MAX_PIN_LENGTH) {
            setTimeout(() => {
              setStep("confirmNew");
            }, 300);
          }

          return newInput;
        });
      } else {
        // confirmNew step
        setConfirmInput((prev) => {
          if (prev.length >= MAX_PIN_LENGTH) return prev;
          return prev + number;
        });
      }
    } else {
      // Original behavior for new PIN workflow
      if (step === "create") {
        setInput((prev) => {
          if (prev.length >= MAX_PIN_LENGTH) return prev;

          const newInput = prev + number;

          if (newInput.length === MAX_PIN_LENGTH) {
            setTimeout(() => {
              setStep("confirm");
            }, 300);
          }

          return newInput;
        });
      } else {
        setConfirmInput((prev) => {
          if (prev.length >= MAX_PIN_LENGTH) return prev;
          return prev + number;
        });
      }
    }
  };

  const handleBackspace = () => {
    if (pinSet) {
      if (step === "enterOld") {
        setOldPin((prev) => prev.slice(0, -1));
      } else if (step === "enterNew") {
        setInput((prev) => prev.slice(0, -1));
      } else {
        setConfirmInput((prev) => prev.slice(0, -1));
        setError(null);
      }
    } else {
      if (step === "create") {
        setInput((prev) => prev.slice(0, -1));
      } else {
        setConfirmInput((prev) => prev.slice(0, -1));
        setError(null);
      }
    }
  };

  const handleSubmit = () => {
    if (pinSet) {
      if (step === "enterOld") {
        if (oldPin.length === MAX_PIN_LENGTH) {
          setStep("enterNew");
        }
      } else if (step === "enterNew") {
        if (input.length === MAX_PIN_LENGTH) {
          mutate();
          setStep("confirmNew");
        }
      } else {
        if (confirmInput.length === MAX_PIN_LENGTH) {
          if (input === confirmInput) {
            mutate();
            setOldPin("");
            setInput("");
            setConfirmInput("");
            setStep("enterOld");
            setError(null);
          } else {
            setError("PINs don't match. Try again.");
            setConfirmInput("");
          }
        }
      }
    } else {
      if (step === "create") {
        if (input.length === MAX_PIN_LENGTH) {
          setStep("confirm");
        }
      } else {
        if (confirmInput.length === MAX_PIN_LENGTH) {
          if (input === confirmInput) {
            console.log("PIN confirmed:", input);
            setInput("");
            setConfirmInput("");
            setStep("create");
            setError(null);
          } else {
            setError("PINs don't match. Try again.");
            setConfirmInput("");
          }
        }
      }
    }
  };

  const handleReset = () => {
    setOldPin("");
    setInput("");
    setConfirmInput("");
    setStep(pinSet ? "enterOld" : "create");
    setError(null);
  };

  const getActiveInput = () => {
    if (pinSet) {
      if (step === "enterOld") return oldPin;
      if (step === "enterNew") return input;
      return confirmInput;
    } else {
      return step === "create" ? input : confirmInput;
    }
  };

  const activeInput = getActiveInput();
  const isInputComplete = activeInput.length === MAX_PIN_LENGTH;

  const getStepLabel = () => {
    if (pinSet) {
      if (step === "enterOld") return "Enter Old PIN";
      if (step === "enterNew") return "Enter New PIN";
      return "Confirm New PIN";
    } else {
      return step === "create" ? "Enter Security PIN" : "Confirm Security PIN";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-10">
      <div className="text-center space-y-5">
        <Label>{getStepLabel()}</Label>

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

        {((pinSet && (step === "enterNew" || step === "confirmNew")) ||
          (!pinSet && step === "confirm")) && (
          <button
            onClick={handleReset}
            className="text-sm text-primary underline mt-2"
          >
            Start over
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {numpad.map((number, index) => {
          if (index === 9) {
            return (
              <Fragment key={number}>
                <button
                  className="rounded-full h-16 w-16 mx-auto font-bold p-5 bg-red-100 text-red-600 flex items-center justify-center"
                  onClick={handleBackspace}
                >
                  <ChevronLeft size={20} />
                </button>

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

                <button
                  className="rounded-full h-16 w-16 mx-auto font-bold p-5 bg-green-100 text-green-600 flex items-center justify-center"
                  onClick={handleSubmit}
                  disabled={!isInputComplete || isPending}
                  style={{ opacity: isInputComplete ? 1 : 0.5 }}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Check size={20} />
                  )}
                </button>
              </Fragment>
            );
          }

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
