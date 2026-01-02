export const getSafeCoordinate = (
  coordinates: any[] | null | undefined,
  index: number,
  defaultValue: number = 0
): number => {
  if (!Array.isArray(coordinates) || coordinates.length <= index) {
    return defaultValue;
  }
  const coord = coordinates[index];
  return typeof coord === "number" ? coord : defaultValue;
};
