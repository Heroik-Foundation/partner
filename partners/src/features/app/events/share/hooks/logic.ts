import { useEffect, useState } from "react";

function getTimeRemaining(targetDate: string) {
  // Handle invalid date strings
  const parsedDate = Date.parse(targetDate);
  if (isNaN(parsedDate)) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const total = parsedDate - Date.now();

  // If the target date has passed, return all zeros
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  // Ensure no NaN values - fallback to 0 if any calculation results in NaN
  return {
    total: isNaN(total) ? 0 : total,
    days: isNaN(days) ? 0 : days,
    hours: isNaN(hours) ? 0 : hours,
    minutes: isNaN(minutes) ? 0 : minutes,
    seconds: isNaN(seconds) ? 0 : seconds,
  };
}

export function useCountdown(isoDate: string) {
  // Handle empty or invalid input
  const safeIsoDate = isoDate || new Date().toISOString();

  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(safeIsoDate));

  useEffect(() => {
    // Clear any existing interval and return early if invalid date
    if (!isoDate || isNaN(Date.parse(isoDate))) {
      setTimeLeft({ total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(isoDate);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isoDate]);

  return {
    days: timeLeft.days,
    hours: timeLeft.hours,
    minutes: timeLeft.minutes,
    seconds: timeLeft.seconds,
  };
}
