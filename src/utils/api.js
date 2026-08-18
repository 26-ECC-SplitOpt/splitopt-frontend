import { getAccessToken, clearSession } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// 백엔드 CORS가 프론트 도메인을 허용해서 프록시 없이 절대경로로 직접 호출한다.
export function toApiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch(url, options = {}) {
  const token = getAccessToken();
  const headers = { ...options.headers };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(toApiUrl(url), { ...options, headers });

  // 토큰이 있었는데 401이면 만료된 걸로 보고 로그인 화면으로 보낸다.
  if (token && response.status === 401 && window.location.pathname !== '/') {
    clearSession();
    window.location.href = '/';
  }

  return response;
}
