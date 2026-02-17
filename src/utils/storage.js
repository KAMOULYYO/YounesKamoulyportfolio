export const STORAGE_KEYS = {
  adminSession: 'yk_admin_session',
  siteConfig: 'yk_site_config_v1',
  siteSavedConfig: 'yk_site_saved_config_v1',
  siteHistory: 'yk_site_history_v1',
};

export const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
