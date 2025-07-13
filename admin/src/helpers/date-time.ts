export function formatReadableDate(inputDate: Date) {
  const date = new Date(inputDate);
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate.replace(/(\d+)(th|st|nd|rd)/, (_, day, suffix) => {
    const dayWithSuffix = `${day}${suffix}`;
    return dayWithSuffix;
  });
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function timeInMinutes(minutes: number) {
  return minutes * 60 * 1000;
}
