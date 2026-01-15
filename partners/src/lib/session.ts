interface Session {
  sessionToken: string;
  name: string;
  email: string;
  photoUrl?: string;
}

const SESSIONS_COOKIE = "user_sessions";
const ACTIVE_INDEX_COOKIE = "active_session_idx";
const SESSION_EXPIRY_DAYS = 30;

function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";").reduce(
    (acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k) acc[k] = v || "";
      return acc;
    },
    {} as Record<string, string>
  );
  return cookies[name] ?? null;
}

function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict; Secure;`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; Secure;`;
}

export function getAllSessions(): Session[] {
  const raw = getCookie(SESSIONS_COOKIE);
  if (!raw) return [];
  try {
    return JSON.parse(decodeURIComponent(raw)) as Session[];
  } catch {
    return [];
  }
}

export function getActiveSession(): Session | null {
  const sessions = getAllSessions();
  const idxRaw = getCookie(ACTIVE_INDEX_COOKIE);
  const idx = idxRaw ? parseInt(idxRaw, 10) : 0;
  return sessions.length > 0 && idx >= 0 && idx < sessions.length
    ? sessions[idx]
    : (sessions[0] ?? null);
}

export function addSession(session: Session, switchTo: boolean = false): void {
  let sessions = getAllSessions();
  const currentActive = getActiveSession();

  sessions = sessions.filter((s) => s.email !== session.email);
  sessions.push(session);

  setCookie(
    SESSIONS_COOKIE,
    encodeURIComponent(JSON.stringify(sessions)),
    SESSION_EXPIRY_DAYS
  );

  if (switchTo || !currentActive) {
    const newIndex = sessions.findIndex((s) => s.email === session.email);
    setCookie(ACTIVE_INDEX_COOKIE, newIndex.toString(), SESSION_EXPIRY_DAYS);
    updateActiveTokenCookie(session.sessionToken);
  }
}

export function setActiveSession(email: string): boolean {
  const sessions = getAllSessions();
  const index = sessions.findIndex((s) => s.email === email);
  if (index === -1) return false;
  setCookie(ACTIVE_INDEX_COOKIE, index.toString(), SESSION_EXPIRY_DAYS);
  updateActiveTokenCookie(sessions[index].sessionToken);
  return true;
}

export function removeSession(email: string): void {
  let sessions = getAllSessions();
  const removedIndex = sessions.findIndex((s) => s.email === email);
  sessions = sessions.filter((s) => s.email !== email);
  setCookie(
    SESSIONS_COOKIE,
    encodeURIComponent(JSON.stringify(sessions)),
    SESSION_EXPIRY_DAYS
  );
  const currentIdxRaw = getCookie(ACTIVE_INDEX_COOKIE);
  const currentIdx = currentIdxRaw ? parseInt(currentIdxRaw, 10) : 0;
  if (removedIndex === currentIdx || currentIdx >= sessions.length) {
    setCookie(ACTIVE_INDEX_COOKIE, "0", SESSION_EXPIRY_DAYS);
    updateActiveTokenCookie(
      sessions.length > 0 ? sessions[0].sessionToken : ""
    );
  } else if (removedIndex < currentIdx) {
    setCookie(
      ACTIVE_INDEX_COOKIE,
      (currentIdx - 1).toString(),
      SESSION_EXPIRY_DAYS
    );
  }
}

export function clearAllSessions(): void {
  deleteCookie(SESSIONS_COOKIE);
  deleteCookie(ACTIVE_INDEX_COOKIE);
  deleteCookie("sessionToken");
}

function updateActiveTokenCookie(token: string): void {
  if (token) {
    setCookie("sessionToken", token, SESSION_EXPIRY_DAYS);
  } else {
    deleteCookie("sessionToken");
  }
}
