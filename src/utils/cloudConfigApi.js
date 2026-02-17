const getCloudConfig = () => {
  const dbUrl = import.meta.env.VITE_FIREBASE_DB_URL;
  const configKey = import.meta.env.VITE_SITE_CONFIG_KEY || 'default';
  return { dbUrl, configKey };
};

const buildEndpoint = (dbUrl, configKey) => {
  const clean = String(dbUrl || '').replace(/\/+$/, '');
  return `${clean}/site-configs/${encodeURIComponent(configKey)}.json`;
};

export const isCloudConfigEnabled = () => {
  const { dbUrl } = getCloudConfig();
  return Boolean(dbUrl);
};

export async function getCloudSiteConfig() {
  const { dbUrl, configKey } = getCloudConfig();
  if (!dbUrl) return { ok: false, error: 'Cloud config disabled.' };

  try {
    const res = await fetch(buildEndpoint(dbUrl, configKey), {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const raw = await res.text();
      return { ok: false, error: raw || 'Failed to fetch cloud config.' };
    }

    const data = await res.json();
    if (!data || typeof data !== 'object') return { ok: false, error: 'No cloud config found.' };
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error.' };
  }
}

export async function saveCloudSiteConfig(config) {
  const { dbUrl, configKey } = getCloudConfig();
  if (!dbUrl) return { ok: false, error: 'Cloud config disabled.' };

  try {
    const res = await fetch(buildEndpoint(dbUrl, configKey), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const raw = await res.text();
      return { ok: false, error: raw || 'Failed to save cloud config.' };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error.' };
  }
}
