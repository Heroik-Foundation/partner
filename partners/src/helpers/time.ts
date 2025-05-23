export function formatISODate(isoString: string): {
  date: string;
  time: string;
} {
  const date = new Date(isoString);

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC", // Add this to show UTC time instead of local time
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(
    date
  );
  const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(
    date
  );

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

export function getReadableTime(isoString: string): string {
  const now = new Date();
  const past = new Date(isoString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} mins ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
}

export function timeInMinutes(minutes: number) {
  return minutes * 60 * 1000;
}

export function formatMonth(dateString: string): string {
  const [year, month] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "long" });
}

export function getTimeFromISO(
  isoString: string,
  useUTC: boolean = false
): string {
  const date = new Date(isoString);

  const hours = useUTC ? date.getUTCHours() : date.getHours();
  const minutes = useUTC ? date.getUTCMinutes() : date.getMinutes();

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function isPastDate(dateString: string): boolean {
  const inputDate = new Date(dateString);
  const now = new Date();
  return inputDate < now;
}
