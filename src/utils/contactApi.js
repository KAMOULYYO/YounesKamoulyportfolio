const getFormspreeConfig = () => {
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
  return { endpoint };
};

const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return { url, anonKey };
};

export async function sendContactMessage(payload) {
  const { endpoint } = getFormspreeConfig();
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const raw = await res.text();
        return { ok: false, error: raw || 'Form submission failed.' };
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Network error.' };
    }
  }

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return {
      ok: false,
      error:
        'Missing contact config. Set VITE_FORMSPREE_ENDPOINT (recommended) or Supabase keys.',
    };
  }

  try {
    const res = await fetch(`${url}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const raw = await res.text();
      return { ok: false, error: raw || 'Supabase insert failed.' };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error.' };
  }
}
