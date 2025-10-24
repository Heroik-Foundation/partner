import { Fragment, useState, useEffect } from "react";
import { Check, AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import { Label } from "@/modules/ui/label";
import { useUpdateSecurityPinMutation } from "../../hooks/mutation";

export const SecurityPinInput = ({
  pinSet,
}: {
  pinSet: boolean | undefined;
}) => {
  const MAX_PIN_LENGTH = 4;
  type StepType =
    | "loading"
    | "create"
    | "confirm"
    | "enterOld"
    | "enterNew"
    | "confirmNew";

  const [input, setInput] = useState<string>("");
  const [confirmInput, setConfirmInput] = useState<string>("");
  const [oldPin, setOldPin] = useState<string>("");
  const { mutate, isPending } = useUpdateSecurityPinMutation();
  const [step, setStep] = useState<StepType>(
    pinSet === undefined ? "loading" : pinSet ? "enterOld" : "create"
  );
  const [error, setError] = useState<string | null>(null);

  const numpad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  useEffect(() => {
    if (pinSet !== undefined) {
      setStep(pinSet ? "enterOld" : "create");
      setInput("");
      setConfirmInput("");
      setOldPin("");
      setError(null);
    }
  }, [pinSet]);

  const handleNumberInput = (number: number) => {
    if (pinSet === undefined) return;
    if (pinSet) {
      if (step === "enterOld") {
        setOldPin((prev) => {
          if (prev.length >= MAX_PIN_LENGTH) return prev;

          const newInput = prev + number;

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

          if (newInput.length === MAX_PIN_LENGTH) {
            setTimeout(() => {
              setStep("confirmNew");
            }, 300);
          }

          return newInput;
        });
      } else if (step === "confirmNew") {
        setConfirmInput((prev) => {
          if (prev.length >= MAX_PIN_LENGTH) return prev;
          return prev + number;
        });
      }
    } else {
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
      } else if (step === "confirm") {
        setConfirmInput((prev) => {
          if (prev.length >= MAX_PIN_LENGTH) return prev;
          return prev + number;
        });
      }
    }
  };

  const handleBackspace = () => {
    if (pinSet === undefined) return;
    if (pinSet) {
      if (step === "enterOld") {
        setOldPin((prev) => prev.slice(0, -1));
      } else if (step === "enterNew") {
        setInput((prev) => prev.slice(0, -1));
      } else if (step === "confirmNew") {
        setConfirmInput((prev) => prev.slice(0, -1));
        setError(null);
      }
    } else {
      if (step === "create") {
        setInput((prev) => prev.slice(0, -1));
      } else if (step === "confirm") {
        setConfirmInput((prev) => prev.slice(0, -1));
        setError(null);
      }
    }
  };

  const handleSubmit = () => {
    if (pinSet === undefined) return;
    if (pinSet) {
      if (step === "enterOld") {
        if (oldPin.length === MAX_PIN_LENGTH) {
          setStep("enterNew");
        }
      } else if (step === "enterNew") {
        if (input.length === MAX_PIN_LENGTH) {
          setStep("confirmNew");
        }
      } else if (step === "confirmNew") {
        if (confirmInput.length === MAX_PIN_LENGTH) {
          if (input === confirmInput) {
            mutate({ newPin: confirmInput, oldPin });
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
      } else if (step === "confirm") {
        if (confirmInput.length === MAX_PIN_LENGTH) {
          if (input === confirmInput) {
            mutate({ newPin: confirmInput });
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
    if (pinSet === undefined) return;
    setOldPin("");
    setInput("");
    setConfirmInput("");
    setStep(pinSet ? "enterOld" : "create");
    setError(null);
  };

  const getActiveInput = () => {
    if (pinSet === undefined) return "";
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
    if (pinSet === undefined) return "Loading...";
    if (pinSet) {
      if (step === "enterOld") return "Enter Old PIN";
      if (step === "enterNew") return "Enter New PIN";
      return "Confirm New PIN";
    } else {
      return step === "create" ? "Enter Security PIN" : "Confirm Security PIN";
    }
  };

  if (pinSet === undefined) {
    return (
      <div className="w-full max-w-md mx-auto space-y-10">
        <div className="text-center space-y-5">
          <Label>Loading...</Label>
          <div className="flex justify-center gap-5">
            {Array.from({ length: MAX_PIN_LENGTH }).map((_, i) => (
              <div key={i} className="p-5 rounded-xl bg-primary/10">
                <div className="h-4 w-4 rounded-full border-2 border-primary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
                  disabled={pinSet === undefined}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  className="rounded-full h-16 w-16 mx-auto font-bold p-5 bg-primary/10 text-primary"
                  key={number}
                  disabled={
                    activeInput.length >= MAX_PIN_LENGTH || pinSet === undefined
                  }
                  onClick={() => handleNumberInput(number)}
                  style={{
                    opacity:
                      activeInput.length >= MAX_PIN_LENGTH ||
                      pinSet === undefined
                        ? 0.5
                        : 1,
                  }}
                >
                  {number}
                </button>

                <button
                  className="rounded-full h-16 w-16 mx-auto font-bold p-5 bg-green-100 text-green-600 flex items-center justify-center"
                  onClick={handleSubmit}
                  disabled={
                    !isInputComplete || isPending || pinSet === undefined
                  }
                  style={{
                    opacity:
                      isInputComplete && !isPending && pinSet !== undefined
                        ? 1
                        : 0.5,
                  }}
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
              disabled={
                activeInput.length >= MAX_PIN_LENGTH || pinSet === undefined
              }
              style={{
                opacity:
                  activeInput.length >= MAX_PIN_LENGTH || pinSet === undefined
                    ? 0.5
                    : 1,
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
