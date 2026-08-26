const TOKEN_KEY = "ownerToken";
const USER_KEY = "ownerUser";
const EXPIRY_KEY = "ownerSessionExpiry";

const REMEMBER_DAYS = 7;

export function saveAuthSession(token, user, rememberMe) {
  // Clear any previous session first
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRY_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);

  if (rememberMe) {
    const expiry =
      Date.now() +
      REMEMBER_DAYS * 24 * 60 * 60 * 1000;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
    localStorage.setItem(
      EXPIRY_KEY,
      expiry.toString()
    );
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  }
}

export function getStoredAuth() {
  const localToken =
    localStorage.getItem(TOKEN_KEY);

  const localUser =
    localStorage.getItem(USER_KEY);

  const expiry =
    localStorage.getItem(EXPIRY_KEY);

  // Remember Me session
  if (localToken && localUser && expiry) {
    if (Date.now() < Number(expiry)) {
      try {
        return {
          token: localToken,
          user: JSON.parse(localUser),
        };
      } catch {
        clearAuthSession();
        return null;
      }
    }

    // Remember Me session expired
    clearAuthSession();
    return null;
  }

  // Normal browser session
  const sessionToken =
    sessionStorage.getItem(TOKEN_KEY);

  const sessionUser =
    sessionStorage.getItem(USER_KEY);

  if (sessionToken && sessionUser) {
    try {
      return {
        token: sessionToken,
        user: JSON.parse(sessionUser),
      };
    } catch {
      clearAuthSession();
      return null;
    }
  }

  return null;
}

export function getStoredToken() {
  const auth = getStoredAuth();

  return auth?.token || null;
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRY_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}