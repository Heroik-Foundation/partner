import { parseAsInteger, useQueryState } from "nuqs";

export function useMultistep<T>(steps: T[]) {
  const [currentIndex, setCurrentIndex] = useQueryState(
    "step",
    parseAsInteger.withDefault(0)
  );

  function next() {
    setCurrentIndex((i) => (i < steps.length - 1 ? i + 1 : i));
  }

  function previous() {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  }

  function skip(toIndex: number) {
    if (toIndex >= 0 && toIndex < steps.length) {
      setCurrentIndex(toIndex);
    }
  }

  return {
    currentStep: steps[currentIndex],
    currentIndex,
    steps,
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === steps.length - 1,
    next,
    previous,
    skip,
    setCurrentIndex,
  };
}
