const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const getToken = () => localStorage.getItem('sb_token');
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'So‘rov bajarilmadi');
  return data as T;
}
