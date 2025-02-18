export function setSessionToken(token: string) {
  document.cookie = `sessionToken=${token}; path=/; secure; SameSite=Strict`;
}

export function deleteSessionToken() {
  document.cookie =
    "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function getSessionToken() {
  const cookies = document.cookie.split(";");
  let sessionToken = "";

  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name === "sessionToken") {
      sessionToken = value;
    }
  });

  return sessionToken;
}
