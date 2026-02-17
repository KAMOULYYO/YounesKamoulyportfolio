const ANALYTICS_KEY = 'yk_site_analytics_v1';

const getDefault = () => ({
  cvClicks: 0,
  projectClicks: 0,
  contactSubmits: 0,
});

export function readAnalytics() {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return { ...getDefault(), ...(parsed || {}) };
  } catch {
    return getDefault();
  }
}

export function trackAnalyticsEvent(event) {
  const current = readAnalytics();
  if (event === 'cv_click') current.cvClicks += 1;
  if (event === 'project_click') current.projectClicks += 1;
  if (event === 'contact_submit') current.contactSubmits += 1;
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(current));
  return current;
}

export function resetAnalytics() {
  const next = getDefault();
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(next));
  return next;
}
