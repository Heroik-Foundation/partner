export function getTokens(): {
  sessionToken: string | null;
} {
  const cookieString = document.cookie;
  const cookies = cookieString.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    sessionToken: cookies["sessionToken"] || null,
  };
}

export function setTokens(
  sessionToken: string,
  expirationDays: number = 1
): void {
  let date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;

  document.cookie = `sessionToken=${sessionToken}; ${expires}; path=/; SameSite=Strict;`;
}

export function deleteTokens(): void {
  const pastDate = new Date(0).toUTCString();
  document.cookie = `sessionToken=; expires=${pastDate}; path=/;`;
}
