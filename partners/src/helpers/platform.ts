type Platform = "iOS" | "Android" | "macOS" | "Windows" | "Linux" | "Unknown";

export const getPlatform = (): Platform => {
  // Use navigator.userAgent if available (client-side)
  if (typeof navigator === "undefined" || !navigator.userAgent) {
    return "Unknown";
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // iOS detection (iPhone, iPad, iPod)
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "iOS";
  }

  // Android detection
  if (/android/.test(userAgent)) {
    return "Android";
  }

  // macOS detection
  if (/macintosh|mac os x/.test(userAgent)) {
    return "macOS";
  }

  // Windows detection
  if (/windows/.test(userAgent)) {
    return "Windows";
  }

  // Linux detection
  if (/linux/.test(userAgent)) {
    return "Linux";
  }

  return "Unknown";
};
