// src/lib/auth.js
// Shared auth helper — stores tokens in localStorage, exposes login/register/logout

const BASE_URL = 'https://facedhonoapi.xanxus-086.workers.dev';

/** @returns {{ accessToken: string, refreshToken: string, user: any } | null} */
export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('faced_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {{ accessToken: string, refreshToken: string, expiresIn: number, user: any }} session */
function saveSession(session) {
  localStorage.setItem('faced_session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('faced_session');
}

export function getAccessToken() {
  return getSession()?.accessToken ?? null;
}

/**
 * POST /auth/login
 * @param {{ email: string, password: string }} creds
 * @returns {Promise<{ success: boolean, message: string, data?: any }>}
 */
export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return { success: false, message: data.message || `Error ${res.status}` };
  }

  saveSession({
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
    expiresIn: data.data.expiresIn,
    user: data.data.user
  });

  return { success: true, message: data.message, data: data.data };
}

/**
 * POST /auth/register
 * @param {{ email: string, username: string, password: string, confirmPassword: string }} payload
 * @returns {Promise<{ success: boolean, message: string, data?: any }>}
 */
export async function register({ email, username, password, confirmPassword }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password, confirmPassword })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return { success: false, message: data.message || `Error ${res.status}` };
  }

  saveSession({
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
    expiresIn: data.data.expiresIn,
    user: data.data.user
  });

  return { success: true, message: data.message, data: data.data };
}

/**
 * POST /auth/logout — sends refreshToken, then clears local session
 * @returns {Promise<void>}
 */
export async function logout() {
  const session = getSession();
  if (session?.refreshToken) {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ refreshToken: session.refreshToken })
      });
    } catch {
      // best-effort
    }
  }
  clearSession();
}

/**
 * POST /auth/refresh — refreshes the access token
 * @returns {Promise<boolean>} true if refreshed successfully
 */
export async function refreshToken() {
  const session = getSession();
  if (!session?.refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken })
    });

    const data = await res.json();
    if (!res.ok || !data.success) return false;

    saveSession({
      ...session,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      expiresIn: data.data.expiresIn
    });

    return true;
  } catch {
    return false;
  }
}