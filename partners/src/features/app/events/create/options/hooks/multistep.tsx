import { parseAsInteger, useQueryState } from "nuqs";

export function useMultistep<T>(steps: T[]) {
  const [currentIndex, setCurrentIndex] = useQueryState(
    "step",
    parseAsInteger.withDefault(1)
  );

  function next() {
    setCurrentIndex((i) => (i < steps.length ? i + 1 : i));
  }

  function previous() {
    setCurrentIndex((i) => (i > 1 ? i - 1 : i));
  }

  function skip(toIndex: number) {
    if (toIndex >= 1 && toIndex <= steps.length) {
      setCurrentIndex(toIndex);
    }
  }

  return {
    currentStep: steps[currentIndex - 1],
    currentIndex,
    steps,
    isFirstStep: currentIndex === 1,
    isLastStep: currentIndex === steps.length,
    next,
    previous,
    skip,
    setCurrentIndex,
  };
}
