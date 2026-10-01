const accessTokenKey = "fitverse_access_token";
const rememberMeKey = "fitverse_remember_me";

let accessToken: string | null = null;

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

export const tokenStore = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    if (!canUseBrowserStorage()) {
      return null;
    }

    return window.localStorage.getItem(accessTokenKey) ?? window.sessionStorage.getItem(accessTokenKey);
  },

  setAccessToken(token: string, rememberMe: boolean) {
    accessToken = token;

    if (!canUseBrowserStorage()) {
      return;
    }

    const targetStorage = rememberMe ? window.localStorage : window.sessionStorage;
    const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;

    targetStorage.setItem(accessTokenKey, token);
    otherStorage.removeItem(accessTokenKey);
    window.localStorage.setItem(rememberMeKey, String(rememberMe));
  },

  clearAccessToken() {
    accessToken = null;

    if (!canUseBrowserStorage()) {
      return;
    }

    window.localStorage.removeItem(accessTokenKey);
    window.sessionStorage.removeItem(accessTokenKey);
    window.localStorage.removeItem(rememberMeKey);
  },

  shouldRemember() {
    if (!canUseBrowserStorage()) {
      return false;
    }

    return window.localStorage.getItem(rememberMeKey) === "true";
  }
};
