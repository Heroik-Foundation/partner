import { useEffect, useState } from "react";

function getTimeRemaining(targetDate: string) {
  const adjustedTarget = Date.parse(targetDate) - 3600000;
  const total = adjustedTarget - Date.now();

  const seconds = Math.max(Math.floor((total / 1000) % 60), 0);
  const minutes = Math.max(Math.floor((total / 1000 / 60) % 60), 0);
  const hours = Math.max(Math.floor((total / (1000 * 60 * 60)) % 24), 0);
  const days = Math.max(Math.floor(total / (1000 * 60 * 60 * 24)), 0);

  return { total, days, hours, minutes, seconds };
}

export function useCountdown(isoDate: string) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(isoDate));

  useEffect(() => {
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
