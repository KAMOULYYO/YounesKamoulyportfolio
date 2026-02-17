import { STORAGE_KEYS } from './storage';

export const isAdminSessionActive = () => localStorage.getItem(STORAGE_KEYS.adminSession) === '1';

export const loginAdmin = (username, password) => {
  const expectedUser = import.meta.env.VITE_ADMIN_USER || 'admin';
  const expectedPass = import.meta.env.VITE_ADMIN_PASS || 'admin';

  if (username === expectedUser && password === expectedPass) {
    localStorage.setItem(STORAGE_KEYS.adminSession, '1');
    return { ok: true };
  }

  return { ok: false, error: 'Invalid admin credentials.' };
};

export const logoutAdmin = () => {
  localStorage.removeItem(STORAGE_KEYS.adminSession);
};
