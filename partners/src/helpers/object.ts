export function objectHasNullOrUndefined<T extends Record<string, unknown>>(
  obj: T
): boolean {
  if (obj == null || typeof obj !== "object") {
    throw new Error("Input must be a non-null object");
  }

  return Object.values(obj).some(
    (value) => value === null || value === undefined || value === ""
  );
}
