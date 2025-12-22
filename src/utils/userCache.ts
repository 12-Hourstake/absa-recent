// Central user cache utility - single source of truth for user data
const USERS_CACHE_KEY = "USERS_CACHE_V1";

export const loadUsersFromCache = () => {
  try {
    const raw = localStorage.getItem(USERS_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveUsersToCache = (users: any[]) => {
  try {
    localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users to cache:", error);
  }
};